import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "oxinion-weather",
  version: "1.0.0",
});

server.registerTool(
  "get-weather",
  {
    description: "Get the current weather for a given location",
    inputSchema: z.object({
      city: z.string().describe("The name of the city to get the weather for"),
    }),
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: "text",
          text: `The current weather in ${city} is sunny with a temperature of 25°C.`,
        },
      ],
    };
  },
);
