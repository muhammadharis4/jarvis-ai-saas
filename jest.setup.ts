import "@testing-library/jest-dom";

// Routes call getOpenAI() / getReplicate(), which reads env before using the mocked SDKs.
if (!process.env.OPENAI_API_KEY) {
  process.env.OPENAI_API_KEY = "sk-test-placeholder";
}
if (!process.env.REPLICATE_API_KEY) {
  process.env.REPLICATE_API_KEY = "r8-test-placeholder";
}
