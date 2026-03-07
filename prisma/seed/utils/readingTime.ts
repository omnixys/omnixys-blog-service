export function calculateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 220);
  return { words, minutes };
}
