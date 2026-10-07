import os from "os";
import { headers } from "next/headers";

/**
 * Resolves the base URL for the app:
 * 1. If NEXT_PUBLIC_APP_URL is explicitly set to a custom public domain, use it.
 * 2. In SSR, inspect the request 'host' header. If host is localhost/127.0.0.1,
 *    substitute with the machine's local LAN IP (e.g. 172.20.10.2) so links & QR codes
 *    sent to a phone on the same Wi-Fi will open immediately.
 * 3. Fallback to origin or LAN IP:3000.
 */
export async function getInvitationBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }

  // Get local Wi-Fi / LAN IP
  const lanIp = getLanIpAddress();

  try {
    const headerList = await headers();
    const host = headerList.get("host");
    const proto = headerList.get("x-forwarded-proto") || "http";

    if (host) {
      if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
        const port = host.split(":")[1] || "3000";
        return `${proto}://${lanIp}:${port}`;
      }
      return `${proto}://${host}`;
    }
  } catch {
    // ignore outside request context
  }

  return `http://${lanIp}:3000`;
}

export function getLanIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
