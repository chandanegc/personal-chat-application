import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getChatCollection } from "./db.js";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function chatAgent(userId, userMessage) {
  const collection = await getChatCollection();

  const historyDocs = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  // reverse to get chronological order for langchain
  const messages = historyDocs.reverse().map((doc) =>
    doc.role === "user"
      ? new HumanMessage(doc.content)
      : new AIMessage(doc.content)
  );

  messages.push(new HumanMessage(userMessage));

  const response = await llm.invoke(messages);

  await collection.insertMany([
    {
      userId,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    },
    {
      userId,
      role: "assistant",
      content: response.content,
      createdAt: new Date(),
    },
  ]);

  return response.content;
}
