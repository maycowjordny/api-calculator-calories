export function formatMenus(text: string): string[] {
  let menus = text
    .split(/\*\*Card[aá]pio \d+:\*\*/)
    .map((menu) => menu.trim())
    .filter((menu) => menu.length > 0);

  return menus.slice(1);
}
