export function safeParseJSON(raw) {
  if (!raw || typeof raw !== 'string') {
    return {
      error: 'Empty LLM response'
    };
  }

  try {
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    return {
      error: 'LLM response is not valid JSON',
      raw
    };
  }
}
