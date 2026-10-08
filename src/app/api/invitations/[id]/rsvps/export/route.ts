import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const invitation = await prisma.invitation.findFirst({
      where: { id, ownerId: session.userId },
      include: {
        rsvps: {
          include: { event: true },
          orderBy: { respondedAt: "desc" },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Generate CSV lines
    const headers = [
      "Guest Name",
      "Status",
      "Attending Count",
      "Event",
      "Meal Preference",
      "Email",
      "Phone",
      "Message",
      "Responded Date",
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (!val) return '""';
      let clean = String(val);
      // Neutralize formula injection / DDE vulnerability in Excel and Google Sheets
      if (/^[=+\-@\t\r]/.test(clean)) {
        clean = `'${clean}`;
      }
      clean = clean.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = invitation.rsvps.map((r) => [
      escapeCsv(r.guestName),
      escapeCsv(r.status),
      escapeCsv(String(r.guestCount)),
      escapeCsv(r.event ? r.event.name : "All Events"),
      escapeCsv(r.mealPreference || "None specified"),
      escapeCsv(r.guestEmail || ""),
      escapeCsv(r.guestPhone || ""),
      escapeCsv(r.message || ""),
      escapeCsv(r.respondedAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${invitation.slug}-rsvps.csv"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
