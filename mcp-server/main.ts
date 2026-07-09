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
    description: "Get current stock information",
    inputSchema: z.object({
      symbol: z.string(),
    }),
  },
  async ({ symbol }) => {
    const price = Math.random() * 490 + 10;
    const change = Math.random() * 10 - 5;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            symbol: symbol.toUpperCase(),
            price: Number(price.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(((change / price) * 100).toFixed(2)),
            currency: "USD",
          }),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
server.connect(transport);
