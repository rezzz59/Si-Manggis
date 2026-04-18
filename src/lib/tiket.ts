function randomSixDigits(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateTiket(): string {
  const year = new Date().getFullYear();
  return `SM-${year}-${randomSixDigits()}`;
}
