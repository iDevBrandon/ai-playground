import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "oxinion-finance",
  version: "1.0.0",
});

server.registerTool(
  "get-stock-info",
  {
    description: "Get the current stock information for a given symbol",
    inputSchema: z.object({
      symbol: z.string().describe("The stock symbol to get information for"),
    }),
  },
  async ({ symbol }) => {
    return {
      content: [
        {
          type: "text",
          text: `The current price for ${symbol} is $150.00 .`,
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
server.connect(transport);
