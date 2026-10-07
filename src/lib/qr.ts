import QRCode from "qrcode";

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 480,
    margin: 2,
    color: {
      dark: "#1c1917", // warm stone dark
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#1c1917",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}
