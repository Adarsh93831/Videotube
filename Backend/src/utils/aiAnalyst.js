// src/utils/aiAnalyst.js
import { ChatGoogleGenerativeAI } from "langchain/chat_models/google";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { MongoClient } from "mongodb";
import { DynamicTool } from "langchain/tools";
import { BufferMemory } from "langchain/memory";
import dotenv from "dotenv";
dotenv.config();

// 1. MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.DB_NAME || "videotube");

// 2. Few-shot examples + schema-aware system prompt
const systemPrompt = `
You are an AI Analyst for a YouTube-like video-sharing platform.
You answer admin queries by translating natural language into MongoDB aggregation queries.

Schema:
-------

1. users
- _id: ObjectId
- username: String
- email: String
- fullName: String
- role: "user" | "admin"
- watchHistory: [ObjectId of videos]
- createdAt: Date
- updatedAt: Date

2. videos
- _id: ObjectId
- title: String
- description: String
- owner: ObjectId (reference to users)
- views: Number
- isPublished: Boolean
- createdAt: Date
- updatedAt: Date

3. comments
- _id: ObjectId
- content: String
- video: ObjectId (ref to videos)
- owner: ObjectId (ref to users)
- createdAt: Date

4. likes
- _id: ObjectId
- video: ObjectId
- comment: ObjectId
- likedBy: ObjectId (ref to users)
- createdAt: Date

5. playlists
- _id: ObjectId
- name: String
- description: String
- owner: ObjectId (ref to users)
- videos: [ObjectId of videos]

6. subscriptions
- _id: ObjectId
- subscriber: ObjectId (ref to users)
- channel: ObjectId (ref to users)
- createdAt: Date

Examples:
---------

Q: How many users registered in the last 30 days?
A: Use users collection, match createdAt to last 30 days, count documents.

Q: Who uploaded the most videos this month?
A: Use videos collection, match createdAt, group by owner, count and sort descending.

Q: What are the most liked videos this week?
A: Use likes collection (where video != null), match date range, group by video, count, sort.

Q: Which users have the most subscribers?
A: Use subscriptions collection, group by channel, count, sort.

Q: How many comments were made on a given video ID?
A: Use comments collection, match by video ID, count.

IMPORTANT:
- Use mongo_query_tool only.
- Only return meaningful analytics — ignore private fields (like passwords).
- Do not hallucinate collection names.
`;

// 3. MongoDB Aggregation Tool
const mongoTool = new DynamicTool({
  name: "mongo_query_tool",
  description: "Use this tool to run MongoDB aggregations for analytics on users, videos, comments, likes, etc.",
  func: async (input) => {
    try {
      const parsed = JSON.parse(input);
      const result = await db.collection(parsed.collection).aggregate(parsed.query).toArray();
      return JSON.stringify(result);
    } catch (err) {
      return `MongoDB Query Error: ${err.message}`;
    }
  },
  schema: {
    type: "object",
    properties: {
      collection: { type: "string" },
      query: { type: "array" }
    },
    required: ["collection", "query"]
  }
});

// 4. Gemini Chat Model
const chatModel = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});

// 5. Enable Memory for the Agent
const memory = new BufferMemory(); // Stores recent messages in session

// 6. Initialize the Agent with Tools + Prompt + Memory
const executor = await initializeAgentExecutorWithOptions(
  [mongoTool],
  chatModel,
  {
    agentType: "openai-functions", // Gemini-compatible
    verbose: true,
    memory,
    agentArgs: {
      systemMessage: systemPrompt
    }
  }
);

// 7. Export the query function
export const askAIAnalyst = async (question) => {
  const result = await executor.call({ input: question });
  return result.output;
};
