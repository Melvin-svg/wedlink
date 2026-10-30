import React from "react";
import { ThemeProps } from "./types";
import { ElegantMinimalTheme } from "./ElegantMinimalTheme";
import { KeralaTraditionalTheme } from "./KeralaTraditionalTheme";
import { RoyalRajasthaniTheme } from "./RoyalRajasthaniTheme";
import { MughalNikahTheme } from "./MughalNikahTheme";
import { TamilMuhurthamTheme } from "./TamilMuhurthamTheme";
import { PunjabiCelebrationTheme } from "./PunjabiCelebrationTheme";
import { ChristianMatrimonyTheme } from "./ChristianMatrimonyTheme";

interface ThemeRendererProps extends ThemeProps {
  themeKey?: string;
}

export function ThemeRenderer({ themeKey, invitation, previewMode }: ThemeRendererProps) {
  const activeKey = themeKey || invitation.themeKey || "elegant-minimal";

  switch (activeKey) {
    case "christian-matrimony":
      return <ChristianMatrimonyTheme invitation={invitation} previewMode={previewMode} />;
    case "kerala-traditional":
      return <KeralaTraditionalTheme invitation={invitation} previewMode={previewMode} />;
    case "royal-rajasthani":
      return <RoyalRajasthaniTheme invitation={invitation} previewMode={previewMode} />;
    case "mughal-nikah":
      return <MughalNikahTheme invitation={invitation} previewMode={previewMode} />;
    case "tamil-muhurtham":
      return <TamilMuhurthamTheme invitation={invitation} previewMode={previewMode} />;
    case "punjabi-celebration":
      return <PunjabiCelebrationTheme invitation={invitation} previewMode={previewMode} />;
    default:
      return <ElegantMinimalTheme invitation={invitation} previewMode={previewMode} />;
  }
}
