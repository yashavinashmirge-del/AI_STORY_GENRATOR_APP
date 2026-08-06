require('dotenv').config();
const {generateText, Output} = require('ai');
const {createOpenRouter} = require('@openrouter/ai-sdk-provider');
console.log('KEY', !!process.env.OPENROUTER_API_KEY);
(async () => {
  try {
    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
    const result = await generateText({
      model: openrouter('google/gemini-2.5-flash'),
      output: Output.text(),
      system: 'You are a creative storyteller.',
      prompt: 'Write a short story about a dragon and a wizard.',
      temperature: 0.7,
      maxOutputTokens: 500,
    });
    console.log('RESULT', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('ERR', err && err.name, err && err.message);
    console.error(err);
  }
})();
