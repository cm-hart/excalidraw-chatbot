import { AIChatAgent } from "@cloudflare/ai-chat";
import { SYSTEM_PROMPT } from "./system-prompt";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "./tools";

interface Env extends Cloudflare.Env {
  OPENAI_API_KEY: string;
}



export class DesignAgent extends AIChatAgent<Env> {
  async onChatMessage() {
    const openai = createOpenAI({ apiKey: this.env.OPENAI_API_KEY });

    const result = streamText({
      model: openai("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(this.messages),
      tools,
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  }
}
