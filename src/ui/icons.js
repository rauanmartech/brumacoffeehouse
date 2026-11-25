const drawings = {
  menu: '<path d="M3 6h18M3 12h13M3 18h18"/>',
  bag: '<path d="M5 8h14l1.2 13H3.8L5 8Z"/><path d="M8.5 9V6a3.5 3.5 0 017 0v3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.6"/><path d="m16 16 4.6 4.6"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  bean: '<ellipse cx="12" cy="12" rx="6.4" ry="10" transform="rotate(42 12 12)"/><path d="M18.5 5.2c.2 4.6-5 4.1-6.4 6.9-1.4 3-5.4 3.5-6.6 6.6"/>',
  cup: '<path d="M3 9h13v5a6.5 6.5 0 01-13 0V9Zm13 1h2a3 3 0 010 6h-2M2 22h17M6 5l1-2m4 3 1-3"/>',
  sandwich:
    '<path d="m2.5 13 9-9a1 1 0 011.4 0l9 9H2.5Zm.5 3 3 1.4L9 16l3 1.4 3-1.4 3 1.4 3-1.4M3 20h18"/>',
  cake: '<path d="m3 12 12-7 6 7v8H3v-8Zm0 0h18M3 16c3-3 5 2 8 0s6 2 10 0"/><circle cx="15" cy="4.5" r="1.5"/>',
  drink: '<path d="M6 8h12l-1.5 13h-9L6 8ZM5 8h14M13 8l2-6h4M7 12h10"/>',
  croissant:
    '<path d="m8 8 4-3 4 3-2 7h-4L8 8ZM8 8 5 9l-2 5 5 2 2-1m6-7 3 1 2 5-5 2-2-1M3 14l-1 4 2 2 4-4m13-2 1 4-2 2-4-4"/>',
  eggs: '<path d="M4 14c-2-3 0-6 3-7 2-1 2-4 6-4 5 0 4 4 6 6s4 4 2 8-5 3-9 3c-4 0-7 1-9-2-1-2 0-3 1-4Z"/><circle cx="12" cy="12" r="3.4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  left: '<path d="m14.5 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  star: '<path fill="currentColor" stroke="none" d="m12 2.6 2.9 6 6.6.9-4.8 4.7 1.2 6.6-5.9-3.1-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9Z"/>',
  home: '<path d="m2 11 10-8 10 8M5 10v11h5v-6h4v6h5V10"/>',
  book: '<path d="M12 6c-3-2-6-2-10-2v15c4 0 7 0 10 2 3-2 6-2 10-2V4c-4 0-7 0-10 2Zm0 0v15"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1114 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  chat: '<path d="M21 11a9 9 0 01-13 8l-5 2 1.6-5A9 9 0 1121 11Z"/>',
  camera:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 10v7m4-7v7"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
}
export function icon(name, size = 22) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${drawings[name]}</svg>`
}
