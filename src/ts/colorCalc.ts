//hex转rgb数组
export function hexToRgb(str: string): [number, number, number] {
  str = str.replace("#", "").trim();
  const red = parseInt(str.slice(0, 2), 16);
  const green = parseInt(str.slice(2, 4), 16);
  const blue = parseInt(str.slice(4, 6), 16);
  return [red, green, blue];
}

//rgb数组转hex
export function rgbToHex(rgb: [number, number, number]) {
  const red = rgb[0].toString(16).padStart(2, "0");
  const green = rgb[1].toString(16).padStart(2, "0");
  const blue = rgb[2].toString(16).padStart(2, "0");
  return `#${red}${green}${blue}`;
}

//rgb数组转hsl数组
export function rgbToHsl(
  rgb: [number, number, number],
): [number, number, number] {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

//颜色减淡 level: 0~1
export function getLightenColor(color: string, level: number) {
  const rgb = hexToRgb(color);
  const lightenRgb = rgb.map((value) => {
    return ~~((255 - value) * level + value);
  }) as [number, number, number];
  return rgbToHex(lightenRgb);
}

//颜色加深 level: 0~1
export function getDarkenColor(color: string, level: number) {
  const rgb = hexToRgb(color);
  const lightenRgb = rgb.map((value) => {
    return ~~(value * level);
  }) as [number, number, number];
  return rgbToHex(lightenRgb);
}
