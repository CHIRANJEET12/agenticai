// import { OpenAI } from 'openai/client.js';
import Groq from "groq-sdk";
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
import { Content } from "openai/resources/skills/content.js";
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

Strictly follow the json format as in example.

stages-->

{"type": "plan", "plan": "I need to find out the weather of Delhi"}

{"type": "action", "function": "getWeather" "input": "Delhi"}

{"type": "observation", "observation": "The weather of Delhi is 12C"}

{"type": "output", "output": "The weather of Delhi is 12C"}

Do not output explanations.
Do not wrap everything inside a single JSON object.
Output each stage separately exactly as shown above.


Example:

User: What is the weather of Delhi?

stages-->

{"type": "plan", "plan": "I need to find out the weather of Delhi"}

{"type": "action", "function": "getWeather" "input": "Delhi"}

{"type": "observation", "observation": "The weather of Delhi is 12C"}

{"type": "output", "output": "The weather of Delhi is 12C"}
`;


const tool = {
  "getWeather": getWeather
};



const message = [{ role: "system", content: SYSTEM_PROMPT }];

const conversation_history = [];

while (true) {
  const query = readlineSync.question(">> ");
  const q = { type: "user", user: query };
  message.push({ role: "user", content: JSON.stringify(q) });
  conversation_history.push({role: "converse_assistant", content: JSON.stringify(q)});

  while (true) {
    const chat = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: message,
      response_format: { type: "json_object" },
    })

    const result = chat.choices[0].message.content;
    message.push({ role: 'assistant', content: result });

    const call = JSON.parse(result);

    console.log("------------------------------------------------")

    console.log("MODEL:", call);

    console.log("------------------------------------------------")

    if (call.type === "output") {
      console.log(`${call.output}`)
      console.log(conversation_history);
      break;
    } else if (call.type === "action") {
      console.log("TOOL CALLED:", call.function, call.input);
      console.log("------------------action--------------------")


      const fn = tool[call.function];
      const observation = fn(call.input);

      console.log("TOOL RESULT:", observation);

      console.log("------------------action--------------------")
      const obs = { "type": "observation", "observation": observation };
      message.push({ role: "assistant", content: JSON.stringify(obs) });
      
    }
  }
}































// HOW AGENTIC WORKFLOW WORKS --->

// const user = "What is the weather in Chennai";


// const response = await client.chat.completions.create({
//   model: "llama-3.3-70b-versatile",
//   messages: [
//     {
//       role: "system",
//       content: SYSTEM_PROMPT
//     },
//     {
//       role: "user",
//       content: user
//     },
//     {
//       role: "assistant",
//       content: '{type: "plan", plan: "I need to find out the weather of Chennai"}'
//     },
//     {
//       role: "user",
//       content: "Continue to the next stage."
//     },
//     {
//       role: "assistant",
//       content: '{"type": "action", "function": "getWeather", "input": "Chennai"}'
//     },
//     {
//       role: "user",
//       content: "Continue to the next stage."
//     },
//     {
//       role: "assistant",
//       content: '{type: "observation", output: "The weather of Chennai is 30C"}'
//     },
//     {
//       role: "user",
//       content: "Continue to the next stage."
//     }
//   ]
// });

// console.log(response.choices[0].message.content);
