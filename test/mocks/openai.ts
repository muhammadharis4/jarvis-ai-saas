import { jest } from "@jest/globals";

export const mockChatCompletionsCreate = jest.fn();
export const mockImagesGenerate = jest.fn();

export default class OpenAIMock {
  apiKey = process.env.OPENAI_API_KEY ?? "sk-test-mock";

  chat = {
    completions: {
      create: mockChatCompletionsCreate,
    },
  };

  images = {
    generate: mockImagesGenerate,
  };
}
