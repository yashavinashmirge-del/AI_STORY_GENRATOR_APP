require('dotenv').config();
const {generateText, Output} = require('ai');
const {createOpenRouter} = require('@openrouter/ai-sdk-provider');
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const z = require('zod');
const storySchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.object({ paragraph: z.string(), promptToImage: z.string() })).min(1)
});
(async () => {
  try {
    const result = await generateText({
      model: openrouter('google/gemini-2.5-flash'),
      output: Output.object({ schema: storySchema }),
      system: 'You are a creative storyteller. Generate a story with at least one paragraph.',
      prompt: 'Write a story about a short adventure.',
      temperature: 0.7,
      maxOutputTokens: 500,
    });
    console.log('STEP COUNT', result.steps.length);
    console.log('STEP', JSON.stringify(result.steps[0], null, 2));
    console.log('OUTPUT GETTER AVAILABLE', Object.getOwnPropertyDescriptor(result, 'output'));
  } catch (err) {
    console.error('ERR NAME', err && err.name);
    console.error('ERR MESSAGE', err && err.message);
    console.error('ERR FULL', err && err.stack);
  }
})();
