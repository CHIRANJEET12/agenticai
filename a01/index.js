// import { OpenAI } from 'openai/client.js';
import Groq from "groq-sdk";
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
dotenv.config();

//weather calling agentic system
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

function getWeather(city = '') {
  if (city.toLowerCase() === "delhi") return "10°C";
  if (city.toLowerCase() === "mumbai") return "28°C";
  if (city.toLowerCase() === "kolkata") return "25°C";
  if (city.toLowerCase() === "chennai") return "30°C";
  if (city.toLowerCase() === "bengaluru") return "22°C";
  if (city.toLowerCase() === "hyderabad") return "24°C";
  if (city.toLowerCase() === "pune") return "23°C";
  if (city.toLowerCase() === "jaipur") return "18°C";
  if (city.toLowerCase() === "lucknow") return "16°C";
  if (city.toLowerCase() === "bhubaneswar") return "27°C";

  return "Weather data not available";
}

const SYSTEM_PROMPT = `
You are an AI agent.

Generate ONLY the next stage.

If no stage has been generated yet, output only a plan.

stages-->

{type: "plan", plan: "I need to find out the weather of Delhi"}

{type: "action", action: "finding the weather of Delhi"}

{type: "observation", output: "The weather of Delhi is 12C"}

{type: "output", final_answer: "The weather of Delhi is 12C"}

Do not output explanations.
Do not wrap everything inside a single JSON object.
Output each stage separately exactly as shown above.

Example:

User: What is the weather of Delhi?

stages-->

{type: "plan", plan: "I need to find out the weather of Delhi"}

{type: "action", action: "finding the weather of Delhi"}

{type: "observation", output: "The weather of Delhi is 12C"}

{type: "output", final_answer: "The weather of Delhi is 12C"}
`;

const user = "What is the weather in Chennai";

try {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: user
      },
      {
        role: "assistant",
        content: '{type: "plan", plan: "I need to find out the weather of Chennai"}'
      },
      {
        role: "user",
        content: "Continue to the next stage."
      },
      {
        role: "assistant",
        content: '{type: "action", action: "finding the weather of Chennai"}'
      },
      {
        role: "user",
        content: "Continue to the next stage."
      },
      {
        role: "assistant",
        content: '{type: "observation", output: "The weather of Chennai is 30C"}'
      },
      {
        role: "user",
        content: "Continue to the next stage."
      }
    ]
  });

  console.log(response.choices[0].message.content);
} catch (err) {
  if (err.status === 429 && err.code === "insufficient_quota") {
    console.error("OpenAI quota exceeded. Check billing, credits, or usage limits.");
  } else {
    console.error(err);
  }
}