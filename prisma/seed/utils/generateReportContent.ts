export function generateParagraph(topic: string, index: number): string {
  return `
${topic} continues to shape the modern digital economy. 
Organizations across industries increasingly rely on advanced systems, 
distributed computing and intelligent automation.

Section ${index} explores how ${topic} integrates with current technology stacks,
influencing infrastructure, governance models and long-term strategic planning.

Experts highlight that the adoption curve of ${topic} is accelerating as
global competition increases and innovation cycles shorten.
`;
}

export function generateLongArticle(topic: string, paragraphs = 200) {
  let text = `# ${topic} Research Report\n\n`;

  for (let i = 1; i <= paragraphs; i++) {
    text += generateParagraph(topic, i) + '\n\n';
  }

  return text;
}
