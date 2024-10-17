export function formatDiets(text: string) {
  let menus = text.split(/\*\*Card[aá]pio \d+:\*\*/).toString();

  return menus;
}
