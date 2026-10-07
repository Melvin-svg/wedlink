import React from "react";
import { ThemeProps } from "./types";
import { ElegantMinimalTheme } from "./ElegantMinimalTheme";
import { KeralaTraditionalTheme } from "./KeralaTraditionalTheme";

interface ThemeRendererProps extends ThemeProps {
  themeKey?: string;
}

export function ThemeRenderer({ themeKey, invitation, previewMode }: ThemeRendererProps) {
  const activeKey = themeKey || invitation.themeKey || "elegant-minimal";

  if (activeKey === "kerala-traditional") {
    return <KeralaTraditionalTheme invitation={invitation} previewMode={previewMode} />;
  }

  return <ElegantMinimalTheme invitation={invitation} previewMode={previewMode} />;
}
