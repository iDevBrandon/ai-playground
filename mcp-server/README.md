# MCP practice

How to run

```bash
npx @modelcontextprotocol/inspector npx -y tsx main.ts
```

## Testing your server with Claude for Desktop

run the following command in your terminal:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Then add the following to the file:

```json
"oxinion-finance-test": {
      "command": "node",
      "args": [
        "/Users/brandonha/Documents/github/ai-playground/mcp-server/dist/main.js"
      ]
    }
```

Then restart Claude for Desktop and you should be able to test your server.
