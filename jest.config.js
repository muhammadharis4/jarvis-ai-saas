const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: {
    "^@clerk/nextjs$": "<rootDir>/test/mocks/clerk-nextjs.ts",
    "^openai$": "<rootDir>/test/mocks/openai.ts",
    "^replicate$": "<rootDir>/test/mocks/replicate.ts",
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
