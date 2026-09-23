/**
 * BLINK BOX STUDIO logomark geometry, traced from the master logo.
 * Two tube arches (red, purple) standing on a coral bar, with three dots
 * where the legs meet the bar. Coordinates live in LOGO_VIEWBOX.
 */
export const LOGO_VIEWBOX = "114 38 280 162";

export const LOGO_COLORS = {
  red: "#EA5C6C",
  purple: "#B77AC0",
  overlap: "#B73D62",
  coral: "#F67A60",
  dotRed: "#BA1F25",
  dotPurple: "#A9519F",
  dotBlue: "#415FA8",
};

export const LOGO_BAR = { x1: 137.5, x2: 373, y: 178, width: 36 };

export const LOGO_ARCHES = {
  red: { d: "M137.5 178V150A52.75 52.75 0 0 1 243 150V178", width: 37, color: LOGO_COLORS.red },
  purple: { d: "M243 178V125A65 65 0 0 1 373 125V178", width: 35, color: LOGO_COLORS.purple },
};

export const LOGO_DOTS = [
  { cx: 137.5, cy: 178, r: 18.5, fill: LOGO_COLORS.dotRed },
  { cx: 243, cy: 178, r: 18.5, fill: LOGO_COLORS.dotPurple },
  { cx: 373, cy: 178, r: 18, fill: LOGO_COLORS.dotBlue },
];
