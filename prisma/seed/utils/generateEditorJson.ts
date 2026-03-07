export function markdownToEditorJson(markdown: string) {
  const paragraphs = markdown.split('\n\n');

  return {
    type: 'doc',
    content: paragraphs.map((p) => ({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: p,
        },
      ],
    })),
  };
}
