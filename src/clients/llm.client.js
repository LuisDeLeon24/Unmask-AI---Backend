import axios from 'axios';

const LLM_API_URL = 'https://aistudio.baidu.com/llm/lmapi/v3/chat/completions';

export async function chatWithLLM({
  messages,
  model = 'ernie-3.5-8k',
  temperature = 0.2,
  maxTokens = 1024
}) {
  console.log('LLM client called');

  if (!Array.isArray(messages) || messages.length === 0) {
    console.error('messages inválidos:', messages);
    throw new Error('messages must be a non-empty array');
  }
  
  console.log(messages)
  console.log('messages count:', messages.length);
  console.log('model:', model);
  console.log('temperature:', temperature);
  console.log('maxTokens:', maxTokens);

  console.log(
    'first message role:',
    messages[0]?.role
  );

  console.log(
    'first message length:',
    messages[0]?.content?.length
  );

  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens
  };

  const headers = {
    Authorization: `token ${process.env.TOKEN}`,
    'Content-Type': 'application/json'
  };

  console.log('Sending request to LLM API');
  console.log('LLM_API_URL:', LLM_API_URL);
  console.log('TOKEN exists:', !!process.env.TOKEN);

  try {
    const response = await axios.post(LLM_API_URL, payload, { headers });

    console.log('LLM response status:', response.status);
    console.log('LLM response', response.data);

    if (!response.data) {
      console.error('LLM response has no data');
    } else {
      console.log(
        'LLM response keys:',
        Object.keys(response.data)
      );
    }

    if (!response.data?.choices?.[0]?.message) {
      console.error('LLM response missing choices[0].message');
      console.log('Full LLM response:', response.data);
      throw new Error('LLM API respondió sin mensaje válido');
    }

    console.log(
      'LLM finish reason:',
      response.data.choices[0]?.finish_reason
    );

    console.log(
      'LLM output length:',
      response.data.choices[0].message.content?.length
    );

    return response.data.choices[0].message;

  } catch (error) {
    console.error('LLM REQUEST FAILED');

    if (error.response) {
      console.error('LLM status:', error.response.status);
      console.error('LLM response data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }

    throw error;
  }
}
