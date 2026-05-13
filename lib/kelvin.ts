/**
 * Convert color temperature (Kelvin) to RGB.
 * Tanner Helland's approximation. Accurate enough for atmospheric lighting.
 * Valid input: roughly 1000K – 40000K.
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = Math.max(1000, Math.min(40000, kelvin)) / 100;
  let r: number, g: number, b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }

  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b))),
  ];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Lighten an RGB by mixing with white. amount 0..1 */
export function lighten([r, g, b]: [number, number, number], amount: number): [number, number, number] {
  return [
    Math.round(r + (255 - r) * amount),
    Math.round(g + (255 - g) * amount),
    Math.round(b + (255 - b) * amount),
  ];
}

/** Kelvin presets matching real-world fixtures */
export const KELVIN_PRESETS = [
  { k: 1900, label: "Candle" },
  { k: 2400, label: "Tungsten" },
  { k: 2700, label: "Warm" },
  { k: 3000, label: "Soft" },
  { k: 4000, label: "Neutral" },
  { k: 5000, label: "Daylight" },
  { k: 6500, label: "Cool" },
] as const;
