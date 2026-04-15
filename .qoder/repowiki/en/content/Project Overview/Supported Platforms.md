# Supported Platforms

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [Dockerfile](file://Dockerfile)
- [requirements.txt](file://requirements.txt)
- [pyproject.toml](file://pyproject.toml)
- [main.py](file://main.py)
- [source/__init__.py](file://source/__init__.py)
- [source/module/settings.py](file://source/module/settings.py)
- [source/module/static.py](file://source/module/static.py)
- [source/CLI/main.py](file://source/CLI/main.py)
- [source/TUI/app.py](file://source/TUI/app.py)
- [source/TUI/index.py](file://source/TUI/index.py)
- [source/TUI/monitor.py](file://source/TUI/monitor.py)
- [source/expansion/browser.py](file://source/expansion/browser.py)
- [source/expansion/file_folder.py](file://source/expansion/file_folder.py)
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
10. [Appendices](#appendices)

## Introduction
This document describes the supported platforms and deployment/runtime environments for XHS-Downloader. It consolidates system requirements, installation methods (source, Docker, and executable distributions), platform-specific considerations (Windows, macOS, Linux), and operational modes (TUI, API, MCP). It also covers clipboard handling, file system and path differences, and Docker containerization with volume mounting and port configuration.

## Project Structure
XHS-Downloader supports multiple runtime modes and deployment targets:
- Executable distribution for Windows, macOS, and Linux
- Source installation via Python 3.12+ with uv or pip
- Docker containerization with persistent Volume mounting and port exposure

```mermaid
graph TB
subgraph "Host"
W["Windows"]
M["macOS"]
L["Linux"]
D["Docker Host"]
end
subgraph "Runtime Modes"
TUI["TUI"]
API["API"]
MCP["MCP"]
CLI["CLI"]
end
subgraph "Container"
IMG["Docker Image"]
VOL["/app/Volume"]
PORT["5556/tcp"]
end
W --> TUI
M --> TUI
L --> TUI
D --> IMG
IMG --> VOL
IMG --> PORT
TUI --> VOL
API --> PORT
MCP --> PORT
CLI --> TUI
```

**Diagram sources**
- [Dockerfile:1-48](file://Dockerfile#L1-L48)
- [main.py:17-42](file://main.py#L17-L42)
- [README.md:104-126](file://README.md#L104-L126)

**Section sources**
- [README.md:70-126](file://README.md#L70-L126)
- [Dockerfile:1-48](file://Dockerfile#L1-L48)
- [pyproject.toml:10](file://pyproject.toml#L10)

## Core Components
- Python 3.12+ is the primary requirement for source installations.
- Executable distribution is available for Windows, macOS, and Linux.
- Docker images support TUI, API, and MCP modes with a shared Volume for persistence.
- Clipboard functionality is handled via pyperclip with platform-specific backends.
- File system handling adjusts encoding and paths per operating system.

**Section sources**
- [pyproject.toml:10](file://pyproject.toml#L10)
- [requirements.txt:19](file://requirements.txt#L19)
- [README.md:80-126](file://README.md#L80-L126)
- [Dockerfile:40-47](file://Dockerfile#L40-L47)
- [source/module/settings.py:39](file://source/module/settings.py#L39)
- [source/module/static.py:7](file://source/module/static.py#L7)

## Architecture Overview
The application exposes three operational modes controlled by the entrypoint. Docker runs the same entrypoint with optional mode arguments.

```mermaid
sequenceDiagram
participant User as "User"
participant Entrypoint as "main.py"
participant TUI as "XHSDownloader"
participant API as "FastAPI/Uvicorn"
participant MCP as "FastMCP"
User->>Entrypoint : "python main.py" (no args)
Entrypoint->>TUI : "run TUI"
TUI-->>User : "Interactive UI"
User->>Entrypoint : "python main.py api"
Entrypoint->>API : "start server on 0.0.0.0 : 5556"
API-->>User : "OpenAPI docs at /docs"
User->>Entrypoint : "python main.py mcp"
Entrypoint->>MCP : "start MCP server on 0.0.0.0 : 5556"
MCP-->>User : "MCP endpoint at /mcp/"
```

**Diagram sources**
- [main.py:45-60](file://main.py#L45-L60)
- [main.py:17-42](file://main.py#L17-L42)

**Section sources**
- [main.py:17-42](file://main.py#L17-L42)
- [README.md:140-236](file://README.md#L140-L236)

## Detailed Component Analysis

### System Requirements and Python Version
- Requires Python >= 3.12 for source installations.
- The project metadata enforces Python 3.12+.
- Docker images use Python 3.12 base images.

Practical implications:
- Ensure Python 3.12+ is installed before running from source.
- Docker users can rely on the official image’s Python version.

**Section sources**
- [pyproject.toml:10](file://pyproject.toml#L10)
- [Dockerfile:3](file://Dockerfile#L3)

### Installation Methods

#### Source Installation (Python 3.12+)
- Using uv (recommended): synchronize environment and run directly.
- Using pip: create a virtual environment, install dependencies, then run the main entrypoint.

Key steps:
- Create and activate a virtual environment (optional).
- Install dependencies using uv sync or pip with requirements.txt.
- Run the application entrypoint for TUI, CLI, API, or MCP modes.

Notes:
- uv index mirrors are configured for faster installs.
- CLI mode supports parameter overrides and settings updates.

**Section sources**
- [README.md:89-103](file://README.md#L89-L103)
- [pyproject.toml:30-32](file://pyproject.toml#L30-L32)
- [requirements.txt:1-29](file://requirements.txt#L1-L29)
- [source/CLI/main.py:354-370](file://source/CLI/main.py#L354-L370)

#### Executable Distribution
- Prebuilt executables are available for Windows, macOS, and Linux.
- On macOS, the executable may require removing quarantine attributes before first run.
- Updates can be performed by copying internal Volume data or replacing files.

Operational notes:
- Default storage paths differ when using the executable versus source mode.
- Docker mode does not support command-line invocation or clipboard monitoring.

**Section sources**
- [README.md:80-89](file://README.md#L80-L89)
- [README.md:84](file://README.md#L84)
- [README.md:126](file://README.md#L126)

#### Docker Deployment
- Build or pull the image; expose port 5556; mount a Volume at /app/Volume.
- Run containers in TUI mode by default; pass mode arguments to run API or MCP servers.
- Persistent data and settings are stored under the mounted Volume.

```mermaid
flowchart TD
Start(["Start Docker"]) --> Pull["Pull or Build Image"]
Pull --> Run["docker run with -p 5556:5556 and -v Volume:/app/Volume"]
Run --> Mode{"Mode?"}
Mode --> |TUI| TUI["Default CMD python main.py"]
Mode --> |API| API["CMD python main.py api"]
Mode --> |MCP| MCP["CMD python main.py mcp"]
TUI --> Vol["/app/Volume persists settings/data"]
API --> Vol
MCP --> Vol
Vol --> End(["Stop/Restart Container"])
```

**Diagram sources**
- [Dockerfile:40-47](file://Dockerfile#L40-L47)
- [README.md:104-126](file://README.md#L104-L126)

**Section sources**
- [Dockerfile:1-48](file://Dockerfile#L1-L48)
- [README.md:104-126](file://README.md#L104-L126)

### Platform-Specific Considerations

#### Windows
- Recommended terminal: Windows Terminal (Windows 11 default) for optimal display.
- Clipboard handling via pyperclip requires no extra modules.
- File system encoding defaults to UTF-8-SIG for settings files.
- Executable may require removing quarantine attributes on first run.

```mermaid
flowchart TD
WStart["Windows"] --> Term["Use Windows Terminal"]
WStart --> Clip["pyperclip works out-of-the-box"]
WStart --> FS["UTF-8-SIG for settings.json"]
WStart --> Exec["Remove quarantine on first run if needed"]
```

**Diagram sources**
- [README.md:74-85](file://README.md#L74-L85)
- [source/module/settings.py:39](file://source/module/settings.py#L39)

**Section sources**
- [README.md:74-85](file://README.md#L74-L85)
- [source/module/settings.py:39](file://source/module/settings.py#L39)

#### macOS
- Clipboard relies on pbcopy/pbpaste; these are provided by the OS.
- Executable main is unsigned; remove quarantine attributes on first run.
- Browser cookie support includes Safari on macOS.

**Section sources**
- [README.md:352-356](file://README.md#L352-L356)
- [source/expansion/browser.py:107-113](file://source/expansion/browser.py#L107-L113)

#### Linux
- Clipboard relies on xclip or xsel; install if missing.
- Browser cookie support excludes Opera GX.
- File system encoding defaults to UTF-8 for settings files.

**Section sources**
- [README.md:352-356](file://README.md#L352-L356)
- [source/expansion/browser.py:114-115](file://source/expansion/browser.py#L114-L115)
- [source/module/settings.py:39](file://source/module/settings.py#L39)

### Clipboard Handling and Monitoring
- Clipboard read/write uses pyperclip across platforms.
- TUI supports reading clipboard content into the input field.
- TUI supports continuous clipboard monitoring to process new links.
- Docker mode does not support clipboard monitoring or command-line invocation.

```mermaid
sequenceDiagram
participant User as "User"
participant TUI as "Index Screen"
participant Clip as "pyperclip"
participant App as "XHS Application"
User->>TUI : "Click Read Clipboard"
TUI->>Clip : "paste()"
Clip-->>TUI : "Clipboard text"
TUI->>User : "Populate input field"
User->>TUI : "Enable Monitor"
loop Every interval
TUI->>Clip : "paste()"
Clip-->>TUI : "Latest clipboard"
TUI->>App : "extract(urls, download=true)"
end
```

**Diagram sources**
- [source/TUI/index.py:105-108](file://source/TUI/index.py#L105-L108)
- [source/TUI/monitor.py:42-45](file://source/TUI/monitor.py#L42-L45)
- [README.md:126](file://README.md#L126)

**Section sources**
- [source/TUI/index.py:105-108](file://source/TUI/index.py#L105-L108)
- [source/TUI/monitor.py:42-45](file://source/TUI/monitor.py#L42-L45)
- [README.md:126](file://README.md#L126)

### File System and Path Handling
- Default working root is a Volume directory resolved from the project root.
- Settings file encoding varies by OS (UTF-8-SIG on Windows, UTF-8 elsewhere).
- Path utilities handle file creation, touch/unlink, and cleanup of empty directories.

```mermaid
flowchart TD
Init["Initialize Settings"] --> Detect["Detect OS"]
Detect --> Encode{"Windows?"}
Encode --> |Yes| Sig["Use UTF-8-SIG"]
Encode --> |No| Utf["Use UTF-8"]
Init --> Root["Resolve Volume root path"]
Root --> Create["Create settings.json if absent"]
Create --> Save["Write settings with detected encoding"]
```

**Diagram sources**
- [source/module/settings.py:39](file://source/module/settings.py#L39)
- [source/module/static.py:7](file://source/module/static.py#L7)
- [source/expansion/file_folder.py:5-26](file://source/expansion/file_folder.py#L5-L26)

**Section sources**
- [source/module/settings.py:39](file://source/module/settings.py#L39)
- [source/module/static.py:7](file://source/module/static.py#L7)
- [source/expansion/file_folder.py:5-26](file://source/expansion/file_folder.py#L5-L26)

### Operational Modes and Multi-Mode Operation
- TUI: Interactive terminal interface.
- API: FastAPI server exposing endpoints for extracting and downloading content.
- MCP: Streamable HTTP MCP server for external integrations.

```mermaid
classDiagram
class Entrypoint {
+main() : "Dispatch to TUI/API/MCP"
}
class TUI {
+run() : "Start Textual App"
}
class API {
+run_api_server(host, port, log_level)
}
class MCP {
+run_mcp_server(transport, host, port, log_level)
}
Entrypoint --> TUI : "default"
Entrypoint --> API : "api arg"
Entrypoint --> MCP : "mcp arg"
```

**Diagram sources**
- [main.py:45-60](file://main.py#L45-L60)
- [main.py:17-42](file://main.py#L17-L42)

**Section sources**
- [main.py:45-60](file://main.py#L45-L60)
- [README.md:140-236](file://README.md#L140-L236)

### Environment Variables and Configuration
- Settings are persisted in a JSON file under the Volume directory.
- Encoding is OS-dependent to ensure compatibility with system editors.
- Configuration includes paths, naming, formats, proxies, retries, and language.

Practical tips:
- Edit settings.json directly if the UI becomes unresponsive.
- Use CLI flags to override settings temporarily without modifying the file.

**Section sources**
- [source/module/settings.py:52-92](file://source/module/settings.py#L52-L92)
- [README.md:357-503](file://README.md#L357-L503)
- [source/CLI/main.py:354-370](file://source/CLI/main.py#L354-L370)

### Practical Examples

#### Example: Running API Mode in Docker
- Pull or build the image.
- Run a container with port 5556 published and a named Volume mapped to /app/Volume.
- Pass the API argument to start the server.

```mermaid
flowchart TD
A["docker pull IMAGE"] --> B["docker run -p 5556:5556 -v xhs_vol:/app/Volume IMAGE python main.py api"]
B --> C["Server listens on 0.0.0.0:5556"]
```

**Diagram sources**
- [README.md:104-118](file://README.md#L104-L118)
- [Dockerfile:40-47](file://Dockerfile#L40-L47)

#### Example: Running MCP Mode in Docker
- Similar to API mode, but with the MCP argument.
- Connect external tools via the MCP endpoint.

**Section sources**
- [README.md:114-118](file://README.md#L114-L118)

#### Example: CLI Parameter Override
- Use CLI options to set work path, folder name, image format, and other parameters.
- Optionally update the settings file after execution.

**Section sources**
- [source/CLI/main.py:224-352](file://source/CLI/main.py#L224-L352)

## Dependency Analysis
- Python 3.12+ enforced by project metadata.
- Core libraries include FastAPI, Uvicorn, Textual, httpx, lxml, YAML, emoji, websockets, and pyperclip.
- Docker image builds dependencies in a full Python image and copies them into a slim runtime image.

```mermaid
graph LR
P["pyproject.toml"] --> R["requirements.txt"]
R --> Deps["Runtime Dependencies"]
Deps --> API["FastAPI/Uvicorn"]
Deps --> UI["Textual"]
Deps --> Net["httpx/websockets"]
Deps --> IO["aiofiles/aiosqlite"]
Deps --> Utils["pyperclip/pyyaml/lxml"]
DF["Dockerfile"] --> Img["Final Image"]
Img --> API
Img --> UI
Img --> Net
Img --> IO
Img --> Utils
```

**Diagram sources**
- [pyproject.toml:11-25](file://pyproject.toml#L11-L25)
- [requirements.txt:1-29](file://requirements.txt#L1-29)
- [Dockerfile:3-47](file://Dockerfile#L3-L47)

**Section sources**
- [pyproject.toml:11-25](file://pyproject.toml#L11-L25)
- [requirements.txt:1-29](file://requirements.txt#L1-29)
- [Dockerfile:3-47](file://Dockerfile#L3-L47)

## Performance Considerations
- Built-in request delays mitigate server-side rate limiting risks.
- Download chunk sizes and retry limits are configurable via settings.
- File signature detection helps avoid misclassification during downloads.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Clipboard issues:
  - Windows: No extra modules required.
  - macOS: Ensure pbcopy/pbpaste are available.
  - Linux: Install xclip or xsel if missing; qtpy/PyQt5 may be required on some systems.
- Docker clipboard limitations:
  - Clipboard monitoring and command-line invocation are not supported in Docker mode.
- macOS executable quarantine:
  - Remove quarantine attributes on first run if prompted by the system.
- Settings encoding:
  - On Windows, settings are written with UTF-8-SIG; ensure your editor supports this encoding.

**Section sources**
- [README.md:352-356](file://README.md#L352-L356)
- [README.md:84](file://README.md#L84)
- [README.md:126](file://README.md#L126)
- [source/module/settings.py:39](file://source/module/settings.py#L39)

## Conclusion
XHS-Downloader supports broad deployment scenarios across Windows, macOS, Linux, and Docker. Python 3.12+ is the primary requirement for source installations, while prebuilt executables simplify usage on all platforms. Docker enables containerized deployments with persistent storage and multi-mode operation (TUI, API, MCP). Platform-specific considerations—clipboard backends, file system encoding, and terminal recommendations—are integrated into the application to ensure consistent behavior across environments.

## Appendices

### Appendix A: Supported Platforms and Modes
- Windows: TUI, API, MCP, Executable, CLI
- macOS: TUI, API, MCP, Executable, CLI, Browser cookie (Safari)
- Linux: TUI, API, MCP, Executable, CLI, Browser cookie (excluding Opera GX)

**Section sources**
- [source/expansion/browser.py:107-115](file://source/expansion/browser.py#L107-L115)
- [README.md:104-126](file://README.md#L104-L126)