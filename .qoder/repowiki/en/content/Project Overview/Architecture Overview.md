# Architecture Overview

<cite>
**Referenced Files in This Document**
- [main.py](file://main.py)
- [source/__init__.py](file://source/__init__.py)
- [source/application/__init__.py](file://source/application/__init__.py)
- [source/application/app.py](file://source/application/app.py)
- [source/CLI/main.py](file://source/CLI/main.py)
- [source/CLI/__init__.py](file://source/CLI/__init__.py)
- [source/TUI/app.py](file://source/TUI/app.py)
- [source/TUI/index.py](file://source/TUI/index.py)
- [source/module/settings.py](file://source/module/settings.py)
- [source/module/recorder.py](file://source/module/recorder.py)
- [source/module/tools.py](file://source/module/tools.py)
- [source/expansion/browser.py](file://source/expansion/browser.py)
</cite>

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

## Introduction
This document describes the architecture of XHS-Downloader, a multi-interface downloader for Xiaohongshu (Little Red Book) content. The system follows a modular design centered around a single orchestrator class that encapsulates shared core functionality. Interfaces (CLI, TUI, API, MCP) depend on this orchestrator to provide independent user experiences while sharing the same extraction, processing, and download pipeline. The architecture emphasizes separation of concerns aligned with MVC-like patterns: the orchestrator acts as the controller, the module layer provides models and utilities, the expansion layer adds cross-cutting capabilities, and the application layer implements business logic.

## Project Structure
The repository is organized into distinct layers:
- Application layer: Orchestrator and business logic
- Module layer: Configuration, settings, models, recording, tools
- Expansion layer: Browser integration, file conversion, error handling, utilities
- Interface layer: CLI, TUI, API server, MCP server
- Root entry points: main.py and source package exports

```mermaid
graph TB
subgraph "Root"
M["main.py"]
end
subgraph "Interfaces"
CLI["CLI/main.py"]
TUI_APP["TUI/app.py"]
TUI_IDX["TUI/index.py"]
end
subgraph "Application"
XHS["application/app.py"]
end
subgraph "Modules"
SET["module/settings.py"]
REC["module/recorder.py"]
TOOLS["module/tools.py"]
end
subgraph "Expansion"
BR["expansion/browser.py"]
end
M --> CLI
M --> TUI_APP
M --> XHS
CLI --> XHS
TUI_APP --> XHS
TUI_IDX --> XHS
XHS --> SET
XHS --> REC
XHS --> TOOLS
XHS --> BR
```

**Diagram sources**
- [main.py:1-60](file://main.py#L1-L60)
- [source/CLI/main.py:1-378](file://source/CLI/main.py#L1-L378)
- [source/TUI/app.py:1-126](file://source/TUI/app.py#L1-L126)
- [source/TUI/index.py:1-153](file://source/TUI/index.py#L1-L153)
- [source/application/app.py:1-1000](file://source/application/app.py#L1-L1000)
- [source/module/settings.py:1-124](file://source/module/settings.py#L1-L124)
- [source/module/recorder.py:1-192](file://source/module/recorder.py#L1-L192)
- [source/module/tools.py:1-64](file://source/module/tools.py#L1-L64)
- [source/expansion/browser.py:1-120](file://source/expansion/browser.py#L1-L120)

**Section sources**
- [main.py:1-60](file://main.py#L1-L60)
- [source/__init__.py:1-12](file://source/__init__.py#L1-L12)
- [source/application/__init__.py:1-4](file://source/application/__init__.py#L1-L4)

## Core Components
- XHS orchestrator: Central controller managing extraction, processing, download, and output. Implements singleton pattern via a private instance and new method to ensure a single global state.
- Settings: Persistent configuration provider with defaults, compatibility, and migration.
- Recorders: ID, data, and mapping recorders for persistence and caching.
- Tools: Retry decorators, logging abstraction, and wait-time utilities.
- Expansion: Browser cookie integration, file conversion helpers, and cleanup utilities.
- Interfaces: CLI, TUI, API, and MCP servers instantiate XHS with settings and delegate user actions to the orchestrator.

Key design patterns:
- Singleton: Global state management for shared resources and configuration.
- Factory: Interfaces construct XHS instances with runtime parameters.
- Observer: Clipboard monitoring watches system clipboard and triggers processing.
- Strategy: Download strategy selection per content type and preferences.

**Section sources**
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)

## Architecture Overview
The system uses a layered architecture with clear separation of concerns:
- Central orchestrator (XHS) coordinates all operations.
- Module layer supplies configuration, models, persistence, and utilities.
- Expansion layer provides optional integrations and utilities.
- Interface layer exposes multiple entry points that share the same core.

```mermaid
graph TB
subgraph "Interface Layer"
CLI["CLI"]
TUI["TUI"]
API["API Server"]
MCP["MCP Server"]
end
subgraph "Application Layer"
XHS["XHS Orchestrator"]
end
subgraph "Module Layer"
CFG["Settings"]
REC["Recorders"]
UTL["Tools"]
end
subgraph "Expansion Layer"
BRW["Browser Integration"]
CVT["Converter/Cleaner"]
end
CLI --> XHS
TUI --> XHS
API --> XHS
MCP --> XHS
XHS --> CFG
XHS --> REC
XHS --> UTL
XHS --> BRW
XHS --> CVT
```

**Diagram sources**
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)

## Detailed Component Analysis

### XHS Orchestrator (Singleton)
The XHS class is the central orchestrator implementing the singleton pattern. It initializes managers, recorders, converters, and downloaders, and exposes methods for extraction, processing, and download. It also hosts API and MCP endpoints and manages clipboard monitoring.

```mermaid
classDiagram
class XHS {
+VERSION_MAJOR
+VERSION_MINOR
+VERSION_BETA
+LINK
+USER
+SHARE
+SHORT
+ID
+ID_USER
-__INSTANCE
-CLEANER
+__new__(*args, **kwargs)
+__init__(mapping_data, work_path, folder_name, name_format, ...)
+extract(url, download, index, data) list
+extract_cli(url, download, index, data) void
+extract_links(url) list
+extract_id(links) list
+monitor(delay, download, data) void
+stop_monitor() void
+run_api_server(host, port, log_level) void
+run_mcp_server(transport, host, port, log_level) void
+save_data(data) void
+update_author_nickname(container) void
+close() void
}
class Manager {
+root
+folder
+temp
+name_format
+image_format
+video_preference
+download_client
+retry
+print
+archive(...)
+filter_name(...)
}
class DataRecorder {
+add(**kwargs) void
}
class IDRecorder {
+select(id) bool
+add(id) void
}
class MapRecorder {
+select(id) str
+add(id, name) void
}
class Html {
+request_url(url, cookie, proxy) str
}
class Image {
+get_image_link(ns, fmt) tuple
}
class Video {
+deal_video_link(ns, pref) str
}
class Explore {
+run(ns) dict
}
class Converter {
+run(html) dict
}
class Download {
+run(urls, lives, index, nickname, filename, type_, mtime) tuple
}
XHS --> Manager : "owns"
XHS --> DataRecorder : "owns"
XHS --> IDRecorder : "owns"
XHS --> MapRecorder : "owns"
XHS --> Html : "uses"
XHS --> Image : "uses"
XHS --> Video : "uses"
XHS --> Explore : "uses"
XHS --> Converter : "uses"
XHS --> Download : "uses"
```

**Diagram sources**
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)
- [source/application/app.py:268-506](file://source/application/app.py#L268-L506)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)
- [source/application/app.py:603-652](file://source/application/app.py#L603-L652)

**Section sources**
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)
- [source/application/app.py:268-506](file://source/application/app.py#L268-L506)
- [source/application/app.py:603-652](file://source/application/app.py#L603-L652)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)

### Interface Layer: CLI, TUI, API, MCP
- CLI: Parses arguments, constructs XHS with settings, and runs extraction.
- TUI: Textual-based desktop app that composes screens and delegates actions to XHS.
- API: FastAPI server exposing endpoints to fetch data and trigger downloads.
- MCP: FastMCP server exposing tools to get detail data and download files.

```mermaid
sequenceDiagram
participant User as "User"
participant CLI as "CLI.main.py"
participant TUI as "TUI.app.py"
participant API as "FastAPI"
participant MCP as "FastMCP"
participant XHS as "application/app.py"
User->>CLI : Run with parameters
CLI->>XHS : Construct with Settings()
CLI->>XHS : extract_cli(url, index, data)
User->>TUI : Launch TUI
TUI->>XHS : Construct with Settings()
TUI->>XHS : extract(url, download, data)
User->>API : POST /xhs/detail
API->>XHS : extract_links() + __deal_extract()
User->>MCP : get_detail_data / download_detail
MCP->>XHS : extract_links() + __deal_extract() or Download.run()
```

**Diagram sources**
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)
- [source/application/app.py:268-506](file://source/application/app.py#L268-L506)

**Section sources**
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)

### Data Flow Pathways
End-to-end flow from input to output:
1. Input processing: Extract URLs from user input or clipboard.
2. Extraction: Resolve short links, classify content, and parse HTML to structured data.
3. Processing pipeline: Determine download strategy (video vs images), apply naming rules, and decide skip/download.
4. Download execution: Concurrently download assets respecting preferences and existing files.
5. Output generation: Persist records, update caches, and notify results.

```mermaid
flowchart TD
Start(["Start"]) --> Parse["Parse Input<br/>extract_links()"]
Parse --> Resolve["Resolve Short Links<br/>request_url()"]
Resolve --> ParseHTML["Parse HTML<br/>convert.run()"]
ParseHTML --> Extract["Extract Data<br/>explore.run()"]
Extract --> Decide{"Content Type?"}
Decide --> |Video| VidLink["Select Video Link<br/>video.deal_video_link()"]
Decide --> |Images/Album| ImgLink["Select Image Links<br/>image.get_image_link()"]
VidLink --> Name["Apply Naming Rules<br/>__naming_rules()"]
ImgLink --> Name
Name --> Download["Download Assets<br/>Download.run()"]
Download --> Record["Persist Records<br/>DataRecorder.add()"]
Record --> Done(["Done"])
```

**Diagram sources**
- [source/application/app.py:358-384](file://source/application/app.py#L358-L384)
- [source/application/app.py:386-415](file://source/application/app.py#L386-L415)
- [source/application/app.py:417-460](file://source/application/app.py#L417-L460)
- [source/application/app.py:566-601](file://source/application/app.py#L566-L601)
- [source/application/app.py:213-250](file://source/application/app.py#L213-L250)

**Section sources**
- [source/application/app.py:358-384](file://source/application/app.py#L358-L384)
- [source/application/app.py:386-415](file://source/application/app.py#L386-L415)
- [source/application/app.py:417-460](file://source/application/app.py#L417-L460)
- [source/application/app.py:566-601](file://source/application/app.py#L566-L601)
- [source/application/app.py:213-250](file://source/application/app.py#L213-L250)

### Patterns and Implementation Details
- Singleton pattern: Ensures a single global instance of XHS for shared state and resources.
- Factory pattern: Interfaces construct XHS with runtime parameters derived from Settings.
- Observer pattern: Clipboard monitoring continuously checks the system clipboard and queues URLs for processing.
- Strategy pattern: Download strategy varies by content type and user preferences (e.g., video preference, image format).

```mermaid
classDiagram
class Settings {
+default dict
+run() dict
+read() dict
+create() dict
+update(data) void
+compatible(data) dict
+migration_file() void
}
class IDRecorder {
+select(id) bool
+add(id) void
}
class DataRecorder {
+add(**kwargs) void
}
class MapRecorder {
+select(id) str
+add(id, name) void
}
class Tools {
+retry(fn) fn
+logging(log, text, style) void
+sleep_time() void
}
class BrowserCookie {
+run(domains, console) str
+get(browser, domains, console) str
}
Settings <.. XHS : "provides config"
IDRecorder <.. XHS : "used for skip logic"
DataRecorder <.. XHS : "used for output"
MapRecorder <.. XHS : "used for mapping"
Tools <.. XHS : "used for retries/logging"
BrowserCookie <.. XHS : "optional integration"
```

**Diagram sources**
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)

**Section sources**
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)
- [source/application/app.py:98-194](file://source/application/app.py#L98-L194)

## Dependency Analysis
The interfaces depend on the central XHS orchestrator, which depends on modules and expansion components. There is minimal coupling between interfaces; they share the same core through XHS.

```mermaid
graph LR
CLI["CLI/main.py"] --> XHS["application/app.py"]
TUI["TUI/app.py"] --> XHS
API["FastAPI routes"] --> XHS
MCP["FastMCP routes"] --> XHS
XHS --> SET["module/settings.py"]
XHS --> REC["module/recorder.py"]
XHS --> TOOLS["module/tools.py"]
XHS --> EXP["expansion/browser.py"]
```

**Diagram sources**
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)

**Section sources**
- [source/CLI/main.py:39-111](file://source/CLI/main.py#L39-L111)
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)
- [source/application/app.py:685-804](file://source/application/app.py#L685-L804)
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)
- [source/module/recorder.py:13-192](file://source/module/recorder.py#L13-L192)
- [source/module/tools.py:13-64](file://source/module/tools.py#L13-L64)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)

## Performance Considerations
- Concurrency: Downloads use semaphores and gather to limit concurrent workers and improve throughput.
- Retries: Built-in retry decorators reduce transient failure impact.
- Caching: ID and mapping recorders prevent redundant processing and persist metadata.
- Naming and filtering: Cleaner utilities and naming rules optimize filesystem operations and avoid conflicts.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Clipboard monitoring stops unexpectedly: Ensure the event flag is cleared and clipboard content differs from cache.
- Duplicate downloads: Verify skip logic using IDRecorder and download_record setting.
- API/MCP errors: Confirm route handlers and parameter parsing; check logging output.
- Browser cookie integration: Platform support varies; confirm supported browsers and permissions.

**Section sources**
- [source/application/app.py:603-652](file://source/application/app.py#L603-L652)
- [source/module/recorder.py:13-79](file://source/module/recorder.py#L13-L79)
- [source/expansion/browser.py:26-120](file://source/expansion/browser.py#L26-L120)

## Conclusion
XHS-Downloader’s architecture cleanly separates concerns across layers while enabling multiple user interfaces to share a unified core. The singleton orchestrator centralizes state and logic, while modules and expansion components provide reusable utilities. The design supports scalability, maintainability, and extensibility, with clear data flow and observable behavior across all interfaces.