import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import { z } from "zod";

const paragraphSchema = z.object({
  paragraph: z
    .string()
    .describe("A single paragraph of the story (3-5 sentences)"),
  promptToImage: z
    .string()
    .describe(
      "A detailed visual description for generating an image that matches this paragraph",
    ),
});

const storySchema = z.object({
  title: z.string().describe("The title of the story"),
  paragraphs: z
    .array(paragraphSchema)
    .min(10)
    .describe(
      "Array of at least 10 paragraphs ,each with story text and image prompt",
    ),
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const SYSTEM_PROMPT = `You are a creative storyteller. Generate a detailed, engaging story with at least 10 paragraphs. 
      
      For each paragraph:
      1. Write 3-5 compelling sentences that advance the story
      2. Create a detailed visual prompt for AI image generation (be specific about scene, characters, mood, colors, style)
      
      Make sure the story has a clear beginning, middle, and end. Each paragraph should flow naturally to the next.`;

async function tryGenerate(modelId: string, prompt: string) {
  const result = await generateText({
    model: openrouter(modelId),
    output: Output.object({
      schema: storySchema,
    }),
    system: SYSTEM_PROMPT,
    prompt: `Write a creative story based on: ${prompt}. The story must have at least 10 detailed paragraphs with corresponding image prompts for each paragraph.`,
    temperature: 0.7,
    maxOutputTokens: 8000,
  });

  return result;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json(
        {
          error: "Prompt is required",
        },
        { status: 400 },
      );
    }

    // Try the free model first. Free models get rate-limited under load,
    // so fall back to the paid model if it fails for any reason.
    const FREE_MODEL = "google/gemma-4-31b-it:free";
    const FALLBACK_MODEL = "google/gemini-2.5-flash";

    let result;
    let usedModel = FREE_MODEL;

    try {
      result = await tryGenerate(FREE_MODEL, prompt);
    } catch (freeModelError) {
      console.log(
        "Free model failed, falling back to paid model:",
        (freeModelError as Error)?.message,
      );
      usedModel = FALLBACK_MODEL;
      result = await tryGenerate(FALLBACK_MODEL, prompt);
    }

    const { output, finishReason, usage } = result;

    if (!output) {
      // Model stopped before producing valid structured output.
      // finishReason "length" almost always means it ran out of tokens
      // mid-JSON before satisfying the 10-paragraph minimum.
      console.log(
        `Generation failed on ${usedModel}. finishReason:`,
        finishReason,
        "usage:",
        usage,
      );

      // If the free model produced no output (but didn't throw), retry once
      // with the paid fallback before giving up entirely.
      if (usedModel === FREE_MODEL) {
        try {
          const fallbackResult = await tryGenerate(FALLBACK_MODEL, prompt);
          if (fallbackResult.output) {
            return Response.json(fallbackResult.output);
          }
        } catch (fallbackError) {
          console.log(
            "Fallback model also failed:",
            (fallbackError as Error)?.message,
          );
        }
      }

      return Response.json(
        {
          error:
            finishReason === "length"
              ? "The story was cut off before it finished (ran out of tokens). Try a shorter/simpler prompt, or reduce the minimum paragraph count."
              : `No output generated (finishReason: ${finishReason}).`,
        },
        { status: 500 },
      );
    }

    return Response.json(output);
  } catch (error) {
    console.log("Story generation error:", error);
    return Response.json(
      {
        error: (error as Error)?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }
}
