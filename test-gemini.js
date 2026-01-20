const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env" });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // There isn't a direct listModels method on genAI client in some versions,
    // but usually it's exposed differently or we can test a model.
    // Actually, newer SDKs don't easily expose listModels without a slightly different pattern.
    // Let's standard check via a simple generation attempt with a fallback list.

    // BUT, since we want to know what works, let's try the suspected ones.
    const models = ["gemini-2.0-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of models) {
      console.log(`Testing model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log(
          `SUCCESS: ${modelName} works! Response: ${response.text()}`,
        );
        return; // We found one that works
      } catch (e) {
        console.error(`FAILED: ${modelName} - ${e.message}`);
      }
    }
  } catch (error) {
    console.error("Global Error", error);
  }
}

listModels();
