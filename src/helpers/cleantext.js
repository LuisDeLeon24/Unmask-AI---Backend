export function CleanText(ocrResult) {
  const pages = ocrResult?.ocrResults || [];

  return pages
    .map(page =>
      page?.prunedResult?.rec_texts?.join(' ')
    )
    .filter(Boolean)
    .join('\n\n');
}
