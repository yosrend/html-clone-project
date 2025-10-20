# MCP Servers Configuration

## Cara Menambahkan MCP Servers

### Untuk Factory AI
Edit file: `~/.factory/config.json`

### Untuk Claude Desktop
Edit file: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Konfigurasi MCP Servers

Tambahkan konfigurasi berikut ke file config Anda:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    },
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "exa-mcp-server",
        "--tools=get_code_context_exa,web_search_exa"
      ]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    },
    "ref": {
      "command": "npx",
      "args": ["-y", "ref-tools-mcp"]
    },
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "sequential-thinking-mcp"]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase-community/supabase-mcp"]
    }
  }
}
```

## Deskripsi MCP Servers

### 1. Chrome DevTools MCP
- **URL**: https://goo.gle/4pDE6Tk
- **Fungsi**: Integrasi dengan Chrome DevTools untuk debugging dan inspeksi

### 2. EXA MCP
- **URL**: https://docs.exa.ai/reference/exa-mcp
- **Fungsi**: Web search dan code context tools
- **Tools**: `get_code_context_exa`, `web_search_exa`

### 3. Context7 MCP
- **URL**: https://github.com/upstash/context7
- **Fungsi**: Context management dengan Upstash

### 4. Playwright MCP
- **URL**: https://playwright.dev/agents
- **Fungsi**: Browser automation dan testing

### 5. Ref MCP
- **URL**: https://ref.tools
- **Fungsi**: Reference tools untuk development

### 6. Shadcn MCP
- **URL**: https://ui.shadcn.com/docs/mcp
- **Fungsi**: Shadcn UI components integration

### 7. Sequential Thinking MCP
- **URL**: https://github.com/modelcontextprotocol/agents
- **Fungsi**: Sequential reasoning dan thinking tools

### 8. Supabase MCP
- **URL**: https://supabase.com/docs/guides/getting-started
- **Fungsi**: Supabase database dan services integration

## Instalasi

Setelah menambahkan konfigurasi:

1. Restart aplikasi (Factory AI atau Claude Desktop)
2. MCP servers akan otomatis di-install saat pertama kali digunakan
3. Verify dengan melihat available tools di aplikasi

## Troubleshooting

Jika MCP server tidak berfungsi:

1. Pastikan Node.js dan npx terinstall:
   ```bash
   node --version
   npx --version
   ```

2. Clear npx cache:
   ```bash
   npx clear-npx-cache
   ```

3. Check logs di aplikasi untuk error messages

4. Restart aplikasi setelah mengubah config
