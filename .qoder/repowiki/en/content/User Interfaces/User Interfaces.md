# User Interfaces

<cite>
**Referenced Files in This Document**
- [main.py](file://main.py)
- [CLI/main.py](file://source/CLI/main.py)
- [TUI/app.py](file://source/TUI/app.py)
- [TUI/index.py](file://source/TUI/index.py)
- [TUI/setting.py](file://source/TUI/setting.py)
- [TUI/monitor.py](file://source/TUI/monitor.py)
- [application/app.py](file://source/application/app.py)
- [module/settings.py](file://source/module/settings.py)
- [module/script.py](file://source/module/script.py)
- [expansion/browser.py](file://source/expansion/browser.py)
- [XHS-Downloader.js](file://static/XHS-Downloader.js)
- [README.md](file://README.md)
- [README_EN.md](file://README_EN.md)
- [example.py](file://example.py)
- [extension/README.md](file://extension/README.md)
- [extension/QUICKSTART.md](file://extension/QUICKSTART.md)
- [extension/IMPLEMENTATION_SUMMARY.md](file://extension/IMPLEMENTATION_SUMMARY.md)
- [extension/TESTING.md](file://extension/TESTING.md)
- [extension/manifest.json](file://extension/manifest.json)
- [extension/popup.html](file://extension/popup.html)
- [extension/popup.js](file://extension/popup.js)
- [extension/content.js](file://extension/content.js)
- [extension/background.js](file://extension/background.js)
- [static/SCRIPT_README.md](file://static/SCRIPT_README.md)
</cite>

## Update Summary
**Changes Made**
- Updated browser integration section to reflect the new Chrome/Edge extension replacing the Tampermonkey userscript
- Added comprehensive documentation for the new popup-based browser extension interface
- Updated installation procedures from Tampermonkey userscript to Chrome/Edge extension loading process
- Documented the new popup UI with status indicators, settings panels, and progress tracking
- Added detailed technical specifications for the extension architecture
- Updated comparative analysis to reflect the new extension capabilities

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the four user interfaces of XHS-Downloader and how they share the same core XHS class functionality. It covers:
- Desktop GUI (Textual)
- Command-line interface (Click)
- API server (FastAPI)
- MCP integration (FastMCP)
- **Updated** Browser extension integration (Chrome/Edge popup-based interface)

The browser extension provides a modern popup-based interface that replaces the previous Tampermonkey userscript, offering improved user experience with status indicators, settings panels, and progress tracking.

## Project Structure
XHS-Downloader exposes a unified core in the application module, with four distinct entry points:
- Desktop GUI: Textual screens and actions
- CLI: Click-based command-line interface
- API server: FastAPI routes
- MCP server: FastMCP tools
- **Updated** Browser extension: Chrome/Edge extension with popup UI, content script, and background service worker

```mermaid
graph TB
subgraph "Entry Points"
M["main.py<br/>Dispatches to GUI/CLI/API/MCP"]
CLI["CLI/main.py<br/>Click CLI"]
TUI["TUI/app.py<br/>Textual App"]
API["application/app.py<br/>FastAPI server"]
MCP["application/app.py<br/>FastMCP server"]
EXT["extension/manifest.json<br/>Chrome/Edge Extension"]
END
subgraph "Core"
XHS["application/app.py<br/>XHS class"]
END
subgraph "Integration"
SCRIPT["static/XHS-Downloader.js<br/>Tampermonkey userscript (Legacy)"]
END
EXT --> POPUP["popup.html<br/>Popup UI"]
EXT --> CONTENT["content.js<br/>Content script"]
EXT --> BACKGROUND["background.js<br/>Service worker"]
CONTENT --> XHS
BACKGROUND --> XHS
SCRIPT --> XHS
```

**Diagram sources**
- [main.py:45-60](file://main.py#L45-L60)
- [CLI/main.py:354-371](file://source/CLI/main.py#L354-L371)
- [TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [application/app.py:685-917](file://source/application/app.py#L685-L917)
- [extension/manifest.json:1-39](file://extension/manifest.json#L1-L39)
- [extension/popup.html:1-194](file://extension/popup.html#L1-L194)
- [extension/content.js:1-241](file://extension/content.js#L1-L241)
- [extension/background.js:1-294](file://extension/background.js#L1-L294)

**Section sources**
- [main.py:45-60](file://main.py#L45-L60)
- [CLI/main.py:354-371](file://source/CLI/main.py#L354-L371)
- [TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [application/app.py:685-917](file://source/application/app.py#L685-L917)
- [extension/manifest.json:1-39](file://extension/manifest.json#L1-L39)

## Core Components
The central XHS class encapsulates all extraction, download, and orchestration logic. It exposes:
- High-level extraction APIs for single or multiple URLs
- CLI-specific extraction helpers
- API route handlers
- MCP tool handlers
- Script server for browser userscript integration
- Clipboard monitoring and queue-driven processing
- Configuration via Settings and Manager

Key responsibilities:
- URL normalization and link extraction
- HTML parsing and data extraction
- Image/video link resolution
- Download orchestration with retry and chunking
- Recording downloads and metadata
- Script server lifecycle and task handling

**Section sources**
- [application/app.py:98-194](file://source/application/app.py#L98-L194)
- [application/app.py:268-357](file://source/application/app.py#L268-L357)
- [application/app.py:685-757](file://source/application/app.py#L685-L757)
- [application/app.py:758-917](file://source/application/app.py#L758-L917)
- [module/script.py:10-47](file://source/module/script.py#L10-L47)

## Architecture Overview
All interfaces share the same XHS core. They differ only in presentation and invocation:
- GUI (Textual): Interactive screens, settings, and monitoring
- CLI: Command-line arguments and parameter merging
- API: HTTP endpoints for extraction and download
- MCP: Tools callable by AI assistants via MCP protocol
- **Updated** Browser extension: Popup UI with real-time status updates, settings management, and progress tracking

```mermaid
sequenceDiagram
participant User as "User"
participant GUI as "Textual App"
participant CLI as "Click CLI"
participant API as "FastAPI"
participant MCP as "FastMCP"
participant Ext as "Chrome/Edge Extension"
participant Popup as "Popup UI"
participant Content as "Content Script"
participant Background as "Background Worker"
participant Core as "XHS Core"
User->>GUI : Launch GUI
GUI->>Core : Initialize with Settings
User->>CLI : Invoke CLI with parameters
CLI->>Core : Initialize with merged parameters
User->>API : POST /xhs/detail
API->>Core : extract(...)
User->>MCP : Call get_detail_data/download_detail
MCP->>Core : deal_detail_mcp(...)
User->>Ext : Click extension icon
Ext->>Popup : Open popup UI
Popup->>Content : Validate page & check data
Content->>Background : Send download request
Background->>Core : Handle download orchestration
Core-->>Background : Process and download
Background-->>Popup : Update progress & status
Popup-->>User : Show completion status
```

**Diagram sources**
- [TUI/app.py:35-126](file://source/TUI/app.py#L35-L126)
- [CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [application/app.py:685-757](file://source/application/app.py#L685-L757)
- [application/app.py:758-917](file://source/application/app.py#L758-L917)
- [extension/popup.js:1-137](file://extension/popup.js#L1-L137)
- [extension/content.js:1-241](file://extension/content.js#L1-L241)
- [extension/background.js:1-294](file://extension/background.js#L1-L294)

## Detailed Component Analysis

### Desktop GUI (Textual)
The GUI is a Textual application with multiple screens:
- Index screen: Enter URLs, paste from clipboard, download, open monitor
- Settings screen: Edit runtime parameters and save to settings.json
- Monitor screen: Clipboard monitoring mode
- About and Record screens

Navigation and actions:
- Global bindings: Quit, Update, Settings, Record, Monitor, About
- Input validation and feedback via RichLog
- Asynchronous work to avoid blocking the UI

```mermaid
classDiagram
class XHSDownloader {
+CSS_PATH
+SETTINGS
+parameter : dict
+APP : XHS
+__initialization()
+on_mount()
+action_settings()
+refresh_screen()
+update_result(args)
+action_update()
+close_database()
}
class Index {
+BINDINGS
+compose()
+on_mount()
+deal_button()
+reset_button()
+paste_button()
+deal()
+action_*()
}
class Setting {
+BINDINGS
+compose()
+__check_cookie()
+on_mount()
+save_settings()
+reset()
+action_*()
}
class Monitor {
+BINDINGS
+compose()
+run_monitor()
+action_close()
+action_quit()
}
XHSDownloader --> Index : "installs"
XHSDownloader --> Setting : "installs"
XHSDownloader --> Monitor : "installs"
Index --> XHS : "calls extract()"
Setting --> XHSDownloader : "updates settings"
Monitor --> XHS : "monitor()"
```

**Diagram sources**
- [TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [TUI/index.py:27-153](file://source/TUI/index.py#L27-L153)
- [TUI/setting.py:13-271](file://source/TUI/setting.py#L13-L271)
- [TUI/monitor.py:18-59](file://source/TUI/monitor.py#L18-L59)

Usage patterns:
- Enter one or more URLs (space-separated)
- Paste from clipboard
- Download selected images by index (for image posts)
- Toggle settings and refresh to reload configuration
- Enable clipboard monitoring to auto-process links

Configuration options:
- Work path, folder name, name format
- User-Agent, Cookie, Proxy
- Timeout, chunk size, max retry
- Record data, folder mode, author archive
- Image/video/live download toggles
- Write mtime, language, script server

**Section sources**
- [TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [TUI/index.py:27-153](file://source/TUI/index.py#L27-L153)
- [TUI/setting.py:13-271](file://source/TUI/setting.py#L13-L271)
- [TUI/monitor.py:18-59](file://source/TUI/monitor.py#L18-L59)
- [module/settings.py:10-124](file://source/module/settings.py#L10-L124)

### Command-Line Interface (Click)
The CLI uses Click decorators to define options and a main function that:
- Switches language
- Prints help tables
- Initializes XHS with merged parameters
- Executes extraction for provided URLs

Parameters specification:
- URL(s), index selection, work path, folder name, name format
- User-Agent, Cookie, Proxy
- Timeout, chunk size, max retry
- Record data, image/video/live download, folder mode, author archive
- Write mtime, language, settings file, update settings flag
- Version and help flags

Usage patterns:
- Single URL extraction with optional index list
- Batch URLs with index selection per URL
- Merge CLI flags with settings.json
- Update settings.json after execution

```mermaid
flowchart TD
Start([CLI invoked]) --> Lang["Switch language if requested"]
Lang --> Help{"Help requested?"}
Help --> |Yes| PrintHelp["Print help table"] --> End
Help --> |No| Init["Initialize XHS with merged parameters"]
Init --> Exec{"URL provided?"}
Exec --> |Yes| Run["Run extraction for URL(s)"]
Exec --> |No| Update["Update settings if requested"] --> End
Run --> Update
Update --> End([Exit])
```

**Diagram sources**
- [CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [CLI/main.py:354-371](file://source/CLI/main.py#L354-L371)

**Section sources**
- [CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [CLI/main.py:224-371](file://source/CLI/main.py#L224-L371)
- [module/settings.py:52-92](file://source/module/settings.py#L52-L92)

### API Server (FastAPI)
The API server exposes:
- GET /: Redirect to repository
- POST /xhs/detail: Extract data and optionally download files

Endpoints and parameters:
- url: Required, single note URL
- download: Optional, whether to download files
- index: Optional, list of image indices for image posts
- cookie: Optional, override cookie
- proxy: Optional, override proxy
- skip: Optional, skip records

Behavior:
- Validates and extracts links
- Delegates to core extraction logic
- Returns structured response with message, parameters, and data

```mermaid
sequenceDiagram
participant Client as "HTTP Client"
participant API as "FastAPI"
participant Core as "XHS Core"
Client->>API : POST /xhs/detail {url, download, index, cookie, proxy, skip}
API->>Core : extract_links(url)
API->>Core : __deal_extract(download, index, skip, cookie, proxy)
Core-->>API : data or empty
API-->>Client : ExtractData(message, params, data)
```

**Diagram sources**
- [application/app.py:706-757](file://source/application/app.py#L706-L757)

**Section sources**
- [application/app.py:685-757](file://source/application/app.py#L685-L757)
- [README_EN.md:143-220](file://README_EN.md#L143-L220)

### MCP Integration (FastMCP)
The MCP server defines two tools:
- get_detail_data: Retrieve note info without downloading
- download_detail: Download files, optionally returning data

Parameters:
- get_detail_data: url (required)
- download_detail: url (required), index (optional), return_data (optional)

Behavior:
- Validates and extracts links
- Optionally downloads and returns data based on flags

```mermaid
sequenceDiagram
participant Assistant as "AI Assistant"
participant MCP as "FastMCP"
participant Core as "XHS Core"
Assistant->>MCP : get_detail_data(url)
MCP->>Core : deal_detail_mcp(download=False)
Core-->>MCP : (msg, data)
MCP-->>Assistant : {message, data}
Assistant->>MCP : download_detail(url, index, return_data)
MCP->>Core : deal_detail_mcp(download=True, index)
Core-->>MCP : (msg, data or None)
MCP-->>Assistant : {message, data}
```

**Diagram sources**
- [application/app.py:796-917](file://source/application/app.py#L796-L917)

**Section sources**
- [application/app.py:758-917](file://source/application/app.py#L758-L917)
- [README_EN.md:225-240](file://README_EN.md#L225-L240)

### Browser Extension Integration (New)
**Updated** The browser extension provides a modern popup-based interface that replaces the previous Tampermonkey userscript, offering improved user experience with status indicators, settings panels, and progress tracking.

#### Extension Architecture
The extension consists of three main components working together:

```mermaid
graph TB
subgraph "Extension Components"
POPUP["popup.html<br/>Popup UI (320px width)"]
POPUP_JS["popup.js<br/>Popup logic & state management"]
CONTENT["content.js<br/>Content script"]
BACKGROUND["background.js<br/>Service worker"]
END
subgraph "Communication"
EXT_API["chrome.* APIs"]
WS["chrome.runtime messaging"]
END
POPUP --> POPUP_JS
POPUP_JS --> WS
CONTENT --> WS
BACKGROUND --> WS
WS --> EXT_API
```

**Diagram sources**
- [extension/popup.html:1-194](file://extension/popup.html#L1-L194)
- [extension/popup.js:1-137](file://extension/popup.js#L1-L137)
- [extension/content.js:1-241](file://extension/content.js#L1-L241)
- [extension/background.js:1-294](file://extension/background.js#L1-L294)

#### Installation and Setup
**Development Mode (Chrome/Edge)**

1. **Open Extension Management Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

2. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Select the `extension` folder from this repository
   - The extension icon should appear in your browser toolbar

4. **Verify Installation**
   - Navigate to any RedNote post page (e.g., `https://www.xiaohongshu.com/explore/...`)
   - Click the extension icon
   - You should see "✓ Ready to download" status

#### Popup Interface Features
The popup UI provides:
- **Real-time status indicators**: Ready, downloading, error, success states
- **Configurable settings panel**: Image format selection (JPEG, PNG, WEBP)
- **Progress tracking**: Download progress percentage updates
- **Responsive design**: Optimized for 320px width
- **Persistent settings**: Saved using `chrome.storage.sync`

#### Download Workflow
1. **User clicks extension icon** → Popup opens with status check
2. **Popup validates current page** → Checks if URL matches RedNote post patterns
3. **User clicks "Download" button** → Sends message to content script
4. **Content script extracts post data** → Collects metadata, images, video
5. **Data sent to background script** → Handles file downloads and ZIP creation
6. **Background script processes downloads** → Fetches media with retry logic
7. **ZIP creation** → Organizes files with metadata.json and post_content.txt
8. **Browser download trigger** → User receives ZIP file in downloads folder

#### Technical Specifications
**Permissions Required:**
- `activeTab`: Access current tab to inject content script
- `downloads`: Trigger file downloads
- `storage`: Save user preferences
- `*://www.xiaohongshu.com/*`: Access RedNote pages

**Supported Pages:**
- `https://www.xiaohongshu.com/explore/[PostID]`
- `https://www.xiaohongshu.com/discovery/item/[PostID]`

**Output Structure:**
```
PostTitle_PostID.zip
├── metadata.json          # Complete post data in JSON format
├── post_content.txt       # Formatted readable text content
├── images/                # All images from the post
│   ├── 01.jpg
│   ├── 02.jpg
│   └── ...
└── video.mp4              # Video file (if post contains video)
```

**Advanced Features:**
- **Retry Logic**: 3 attempts with exponential backoff for failed downloads
- **Rate Limiting**: 300ms delays between image downloads to avoid blocking
- **Format Conversion**: Images converted to selected format (JPEG/PNG/WEBP)
- **Error Handling**: Comprehensive error messages and recovery
- **Privacy**: All processing happens locally, no external data transmission

**Section sources**
- [extension/README.md:1-227](file://extension/README.md#L1-L227)
- [extension/QUICKSTART.md:1-81](file://extension/QUICKSTART.md#L1-L81)
- [extension/IMPLEMENTATION_SUMMARY.md:1-174](file://extension/IMPLEMENTATION_SUMMARY.md#L1-L174)
- [extension/TESTING.md:1-210](file://extension/TESTING.md#L1-L210)
- [extension/manifest.json:1-39](file://extension/manifest.json#L1-L39)
- [extension/popup.html:1-194](file://extension/popup.html#L1-L194)
- [extension/popup.js:1-137](file://extension/popup.js#L1-L137)
- [extension/content.js:1-241](file://extension/content.js#L1-L241)
- [extension/background.js:1-294](file://extension/background.js#L1-L294)

### Legacy Browser User Script Integration (Deprecated)
**Updated** The original Tampermonkey userscript is now deprecated in favor of the new Chrome/Edge extension. However, it's documented for historical reference.

The userscript adds a floating menu to the RedNote website:
- Extracts note links from various pages
- Downloads videos or images (with optional ZIP packaging)
- Can push tasks to a WebSocket server (ScriptServer) running inside the core

Key features:
- Auto-scroll disabled by default (with configurable count)
- Image selection mode for multi-image posts
- Packaging downloads into ZIP when multiple images
- Script server toggle and URL configuration
- Language switching

```mermaid
sequenceDiagram
participant User as "User"
participant Browser as "Browser"
participant Userscript as "Tampermonkey Script"
participant WS as "ScriptServer"
participant Core as "XHS Core"
User->>Browser : Visit note page
Browser->>Userscript : Inject floating menu
User->>Userscript : Click "Push Download Task"
Userscript->>WS : Send JSON {data, index}
WS->>Core : deal_script_tasks(...)
Core-->>WS : Process and download
WS-->>Userscript : Acknowledge
```

**Diagram sources**
- [XHS-Downloader.js:509-561](file://static/XHS-Downloader.js#L509-L561)
- [module/script.py:22-26](file://source/module/script.py#L22-L26)
- [application/app.py:508-537](file://source/application/app.py#L508-L537)

**Section sources**
- [XHS-Downloader.js:305-428](file://static/XHS-Downloader.js#L305-L428)
- [XHS-Downloader.js:509-561](file://static/XHS-Downloader.js#L509-L561)
- [module/script.py:10-47](file://source/module/script.py#L10-L47)
- [application/app.py:942-987](file://source/application/app.py#L942-L987)

## Dependency Analysis
Interfaces depend on the shared XHS core. The core depends on:
- Manager for configuration and resource management
- Recorder modules for download and data persistence
- Html/Image/Video modules for extraction
- Converter for transforming HTML to structured data
- ScriptServer for browser integration

```mermaid
graph LR
GUI["TUI/app.py"] --> Core["application/app.py:XHS"]
CLI["CLI/main.py"] --> Core
API["application/app.py:FastAPI"] --> Core
MCP["application/app.py:FastMCP"] --> Core
Script["module/script.py:ScriptServer"] --> Core
Browser["static/XHS-Downloader.js"] --> Script
Extension["extension/manifest.json"] --> Content["extension/content.js"]
Extension --> Background["extension/background.js"]
Content --> Core
Background --> Core
```

**Diagram sources**
- [TUI/app.py:35-126](file://source/TUI/app.py#L35-L126)
- [CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [application/app.py:685-917](file://source/application/app.py#L685-L917)
- [module/script.py:10-47](file://source/module/script.py#L10-L47)
- [XHS-Downloader.js:305-428](file://static/XHS-Downloader.js#L305-L428)
- [extension/manifest.json:1-39](file://extension/manifest.json#L1-L39)
- [extension/content.js:1-241](file://extension/content.js#L1-L241)
- [extension/background.js:1-294](file://extension/background.js#L1-L294)

**Section sources**
- [application/app.py:98-194](file://source/application/app.py#L98-L194)
- [module/script.py:10-47](file://source/module/script.py#L10-L47)

## Performance Considerations
- Chunk size and retry settings affect throughput and reliability
- Folder mode and author archive increase filesystem overhead
- Script server introduces minimal overhead; ensure host/port availability
- Clipboard monitoring runs concurrently; consider rate of incoming links
- API and MCP servers are event-driven; tune logging level for production
- **Updated** Browser extension downloads are handled by background service worker to avoid CORS issues and provide better performance
- **Updated** Extension includes retry logic with exponential backoff and rate limiting to prevent being blocked by RedNote servers

## Troubleshooting Guide
Common issues and resolutions:
- Clipboard access: Ensure platform-specific clipboard utilities are installed (e.g., xclip/xsel on Linux)
- Script server connectivity: Verify script_server is enabled and WebSocket URL matches
- API/MCP server binding: Confirm host/port availability and firewall rules
- Cookie and UA: Set appropriate values for higher-quality video downloads
- Settings persistence: If GUI settings do not apply, edit settings.json directly
- **Updated** Extension installation: Ensure developer mode is enabled and extension loads successfully from the extension folder
- **Updated** Extension popup validation: Verify you're on a supported RedNote post URL (`/explore/` or `/discovery/item/`)
- **Updated** Extension download failures: Check browser console for CORS errors and ensure proper permissions are granted
- **Updated** Extension settings persistence: Settings are saved using `chrome.storage.sync` and persist across browser sessions

**Section sources**
- [README.md:351-360](file://README.md#L351-L360)
- [README_EN.md:355-361](file://README_EN.md#L355-L361)
- [module/settings.py:83-92](file://source/module/settings.py#L83-L92)
- [extension/README.md:114-136](file://extension/README.md#L114-L136)

## Conclusion
XHS-Downloader's four interfaces provide flexible ways to extract and download RedNote content:
- GUI for interactive workflows
- CLI for automation and scripting
- API for integrations and external tools
- MCP for AI assistant workflows
- **Updated** Browser extension for seamless web-to-desktop integration with modern popup interface

The new browser extension offers significant improvements over the legacy Tampermonkey userscript, providing a professional popup UI with real-time status updates, configurable settings, and organized ZIP output containing all post content including metadata, text, images, and videos.

## Appendices

### Comparative Analysis: Interface Strengths and Limitations
- Desktop GUI
  - Strengths: Intuitive, visual feedback, easy settings management, clipboard monitoring
  - Limitations: Requires desktop environment, less suited for headless automation
- Command-Line Interface
  - Strengths: Script-friendly, batch processing, parameterized workflows
  - Limitations: No visual feedback, requires familiarity with parameters
- API Server
  - Strengths: Integrates with external systems, standardized JSON interface
  - Limitations: Requires server hosting, network exposure considerations
- MCP Integration
  - Strengths: Natural language workflows, AI assistant compatibility
  - Limitations: Requires MCP client support, network configuration
- **Updated** Browser Extension
  - Strengths: Professional popup UI, real-time status updates, settings persistence, organized ZIP output, no server required
  - Limitations: Browser-dependent, requires extension installation, limited to supported RedNote URLs
- **Updated** Legacy Browser User Script
  - Strengths: Floating menu integration, WebSocket server communication
  - Limitations: Outdated architecture, requires Tampermonkey, limited UI capabilities

### Practical Examples: Common Workflows
- GUI workflow
  - Open GUI, paste note URL, click Download, optionally select image indices, review logs
- CLI workflow
  - Run CLI with --url and optional --index, optionally merge with --settings and --update_settings
- API workflow
  - POST to /xhs/detail with url and optional download/index/cookie/proxy/skip
- MCP workflow
  - Call get_detail_data or download_detail with url and optional parameters
- **Updated** Browser extension workflow
  - Navigate to RedNote post, click extension icon, configure settings if needed, click Download, monitor progress in popup, receive ZIP file
- **Updated** Legacy browser user script workflow
  - Enable script server, enable script server in userscript, click Push Download Task on note page

**Section sources**
- [README.md:245-283](file://README.md#L245-L283)
- [README_EN.md:249-287](file://README_EN.md#L249-L287)
- [example.py:9-74](file://example.py#L9-L74)
- [example.py:77-91](file://example.py#L77-L91)
- [extension/README.md:53-72](file://extension/README.md#L53-L72)
- [static/SCRIPT_README.md:36-52](file://static/SCRIPT_README.md#L36-L52)