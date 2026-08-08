// dataviz skillの検証済みデフォルトパレットから先頭4色を使用
// (node scripts/validate_palette.js "#2a78d6,#eb6834,#1baf7a,#eda100" --mode light → ALL CHECKS PASS)
export const CHART_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"] as const;

export const CHART_TEXT = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
};
