// Shopify CDN image transform helpers
export function shopifyImg(url: string | undefined, width: number): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export function shopifySrcSet(url: string | undefined, widths: number[] = [320, 480, 640, 960, 1280]): string {
  if (!url) return "";
  return widths.map((w) => `${shopifyImg(url, w)} ${w}w`).join(", ");
}
