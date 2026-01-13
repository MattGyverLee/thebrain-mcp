# TheBrain MCP Server

An MCP (Model Context Protocol) server that enables AI assistants to interact with TheBrain's knowledge management system. This server provides comprehensive access to TheBrain's API, focusing on natural language interaction with TheBrain's powerful knowledge management capabilities.

## 🔧 What's an MCP Server?

**MCP (Model Context Protocol)** is a standard that lets AI assistants like Claude connect to external tools and services. Think of it as a translator between natural language and software APIs.

### How It Works:
```
You → Claude → MCP Server → TheBrain API → Your Brain
```

1. **You say**: "Create a project with three phases"
2. **Claude understands** what you want to accomplish  
3. **MCP Server translates** this into specific TheBrain API calls
4. **TheBrain API** creates the thoughts and connections
5. **Your Brain** updates with the new structure

The magic is that **you don't need to know any technical details** - just describe what you want in plain English!

## 🚀 What Actually Works

### ✅ **Core Functionality (Working)**
- **Content Management**: Create, update, delete thoughts and notes
- **File Attachments**: Upload images, PDFs, documents to thoughts
- **Web References**: URL attachments with auto-title extraction  
- **Rich Notes**: Full Markdown support with embedded content
- **Relationship Mapping**: Connect thoughts with meaningful relationships
- **Search**: Full-text search across thoughts, notes, and attachments
- **Brain Management**: Switch between multiple brains seamlessly
- **Natural Language Interface**: Describe what you want, Claude handles the details

## ❌ Current Issues & Limitations

### 🚨 **Major Visual Styling Problems**
**The biggest limitation**: Visual properties don't actually apply despite API success responses.

- **❌ Thought colors**: API accepts colors but they don't appear in TheBrain
- **❌ Link colors**: Similar issue - accepted but not applied  
- **❌ Link thickness**: API reports success but thickness doesn't change
- **❌ Visual formatting**: All visual styling features are currently non-functional

### 🐛 **Other Known Issues**
- **Memory constraints**: Very large file attachments (>50MB) can cause timeouts
- **Search limitations**: Complex queries may return incomplete results (TheBrain API limitation)

**Note on file paths**: Both absolute and relative paths are supported. Absolute paths are recommended for clarity in logs and error messages, but relative paths work correctly.

### 📋 **API Dependencies & Constraints**
- **Single-user operations**: No real-time collaboration features
- **No bulk operations**: Can't import/export large datasets efficiently  
- **API connectivity required**: No offline mode available
- **TheBrain API limitations**: Bound by existing API capabilities
- **Authentication required**: Must have valid TheBrain API key

## 🛠 **Current Workarounds**

Until visual styling is fixed, use these alternatives:
- **Emojis for distinction**: 🟢🟡🔴⚪🔵 instead of colors
- **Descriptive names**: "🔴 Urgent Task" instead of colored thoughts
- **Rich markdown notes**: Use formatting within notes for visual organization
- **Hierarchical structure**: Rely on parent/child relationships for organization

## Installation

1. Clone this repository:
```bash
git clone https://github.com/MattGyverLee/thebrain-mcp.git
cd thebrain-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API key:
```bash
THEBRAIN_API_KEY=your_api_key_here
THEBRAIN_DEFAULT_BRAIN_ID=optional_default_brain_id
```

## Configuration

### For Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "thebrain": {
      "command": "node",
      "args": ["/absolute/path/to/thebrain-mcp/index.js"],
      "env": {
        "THEBRAIN_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**⚠️ Important**: Use absolute file paths in the configuration and for file attachments.

## Debugging & Troubleshooting

### Common Issues & Solutions

**Brain ID errors**:
- Use `set_active_brain` to set a default brain context
- Or provide `brainId` parameter with each operation
- Error messages will guide you if brainId is missing

**File upload failures**:
- Use absolute file paths: `/Users/username/Documents/file.pdf`
- Check file permissions and existence
- Keep file sizes reasonable (< 50MB for best performance)

**Debug mode**:
```bash
VERBOSE=true node index.js
```

## Available Tools (25+ Functions)

### Brain Management
- `list_brains` - List all available brains
- `get_brain` - Get brain details
- `set_active_brain` - Set the active brain for operations
- `get_brain_stats` - Get comprehensive brain statistics

### Thought Operations
- `create_thought` - Create thoughts (visual properties don't work)
- `get_thought` - Retrieve thought details
- `update_thought` - Update thought properties
- `delete_thought` - Delete a thought
- `search_thoughts` - Search across the brain
- `get_thought_graph` - Get thought with all connections
- `get_types` - List all thought types
- `get_tags` - List all tags

### Link Operations
- `create_link` - Create links between thoughts (styling doesn't work)
- `update_link` - Modify link properties
- `get_link` - Get link details
- `delete_link` - Remove a link

### Attachment Operations
- `add_file_attachment` - Attach files/images to thoughts ✅
- `add_url_attachment` - Attach web URLs ✅
- `get_attachment` - Get attachment metadata
- `get_attachment_content` - Download attachment content
- `delete_attachment` - Remove attachments
- `list_attachments` - List thought attachments

### Note Operations
- `get_note` - Retrieve notes in markdown/html/text ✅
- `create_or_update_note` - Create or update notes ✅
- `append_to_note` - Append content to existing notes ✅

### Advanced Features
- `get_modifications` - View brain modification history

## Usage Examples (What Actually Works)

### Project Organization
```
You: "Create a project called 'Kitchen Renovation'"
Claude: Creates central project thought

You: "Add phases for planning, demolition, and installation"  
Claude: Creates connected sub-thoughts for each phase

You: "Attach my contractor quotes to the planning phase"
Claude: Uploads files to the planning thought

You: "Add a detailed note about the timeline to the project"
Claude: Creates rich markdown note with your timeline
```

### Research & Knowledge Management
```
You: "Create a research topic about sustainable energy"
Claude: Sets up main research thought

You: "Add sub-topics for solar, wind, and hydro power"
Claude: Creates organized thought hierarchy

You: "Attach relevant papers and web articles"
Claude: Adds file and URL attachments

You: "Search for everything related to efficiency"
Claude: Finds all relevant thoughts and content
```

## 🔮 Roadmap & Future Development

### **Immediate Priorities (v1.2.0)**
- **🚨 Fix visual styling**: Investigate why colors/thickness don't apply in TheBrain UI
- **🛡️ Enhanced error handling**: More detailed error messages and recovery options
- **📊 Performance monitoring**: Add timing metrics for large operations

### **Future Enhancements**
- **Bulk operations** for large-scale organization
- **Enhanced templates** for common workflows
- **Performance optimizations** for complex brains  
- **Offline capabilities** and caching

## Technical Architecture

### What Makes This Server Special
- **Natural language interface**: No technical knowledge required
- **Complete API coverage**: 25+ tools spanning all TheBrain operations
- **Robust error handling**: Graceful failures and clear error messages
- **Modular design**: Clean, maintainable code architecture
- **Production ready**: Proper logging, testing, and documentation

### Current Status
- **Version**: 1.1.0 (June 2025)
- **Core functionality**: ✅ Complete and working
- **Visual properties**: ❌ Major issues (TheBrain API accepts but doesn't apply colors/thickness)
- **Stability**: ✅ Stable with proper error handling

## Contributing

Contributions are welcome! Areas where help is especially needed:

- **Visual styling investigation**: Why don't colors/thickness apply in TheBrain UI?
- **Performance optimization**: Large brain handling and bulk operations
- **Documentation**: More usage examples and tutorials
- **Testing**: Expanded test coverage for edge cases

Please feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **TheBrain API Documentation**: https://api.bra.in
- **Issues & Bug Reports**: https://github.com/MattGyverLee/thebrain-mcp/issues
- **Questions**: Open a GitHub discussion

---

**⚠️ Current Recommendation**: Use this server for **content management and organization** with natural language interaction. Don't rely on visual styling features until they're fixed. The core functionality is solid and very useful for managing TheBrain content through conversation!
