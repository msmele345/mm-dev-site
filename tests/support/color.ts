export type Rgb = [number, number, number];

export function parseColor(value: string | Rgb): Rgb {
  if (Array.isArray(value)) return value;
  const trimmed = value.trim();
  const channels = trimmed.match(/-?[\d.]+/g);
  if (trimmed.startsWith("rgb") && channels) {
    return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
  }
  const hex = trimmed.replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

export function cssColor(hex: string) {
  return `rgb(${parseColor(hex).join(", ")})`;
}

export function relativeLuminance(color: string | Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = parseColor(color);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(foreground: string | Rgb, background: string | Rgb): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [high, low] = a > b ? [a, b] : [b, a];
  return (high + 0.05) / (low + 0.05);
}
