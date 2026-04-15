# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [README_EN.md](file://README_EN.md)
- [main.py](file://main.py)
- [pyproject.toml](file://pyproject.toml)
- [requirements.txt](file://requirements.txt)
- [Dockerfile](file://Dockerfile)
- [source/CLI/main.py](file://source/CLI/main.py)
- [source/TUI/app.py](file://source/TUI/app.py)
- [source/module/settings.py](file://source/module/settings.py)
- [source/application/app.py](file://source/application/app.py)
- [example.py](file://example.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Methods](#installation-methods)
4. [Initial Setup and Configuration](#initial-setup-and-configuration)
5. [Quick Start Examples](#quick-start-examples)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Conclusion](#conclusion)

## Introduction
XHS-Downloader is a tool for extracting links, collecting metadata, and downloading media from RedNote (XiaoHongShu). It supports multiple interfaces:
- GUI (Textual-based TUI)
- CLI (Command Line)
- API server
- MCP server
- Docker deployment

It offers flexible configuration via a settings.json file and optional Cookie support for enhanced access to higher-quality content.

## System Requirements
- Python 3.12 or newer
- Platform-specific clipboard dependencies:
  - Windows: no extra steps
  - macOS: uses system pbcopy/pbpaste
  - Linux: uses xclip or xsel; install if missing
- Docker (optional) for containerized deployment

These requirements are reflected in the project’s configuration and documentation.

**Section sources**
- [pyproject.toml:10](file://pyproject.toml#L10)
- [README.md:351-357](file://README.md#L351-L357)

## Installation Methods

### Method 1: Program Execution (Recommended for Quick Start)
- Download the latest release package for your platform from the Releases or Actions page.
- On macOS, if the executable is blocked by Gatekeeper, remove quarantine attributes once using the terminal command described in the documentation.
- Launch the application by double-clicking the main executable inside the unzipped folder.

Notes:
- The default download path and settings.json location differ when using packaged executables versus source code runs.
- Updates can be performed by copying the Volume folder or replacing files directly.

**Section sources**
- [README.md:80-89](file://README.md#L80-L89)
- [README.md:84](file://README.md#L84)

### Method 2: Source Code Running
Choose one of two approaches:

- Using pip and requirements.txt:
  - Create and activate a virtual environment (optional).
  - Install dependencies from requirements.txt.
  - Run the application with the main entry point.

- Using uv (recommended):
  - Sync dependencies with uv.
  - Run the application directly with uv.

Both methods start the application via the main entry point.

**Section sources**
- [README.md:89-104](file://README.md#L89-L104)
- [requirements.txt:1-29](file://requirements.txt#L1-L29)
- [pyproject.toml:30-32](file://pyproject.toml#L30-L32)

### Method 3: Docker Deployment
- Pull or build the image from the official registry or Dockerfile.
- Create a container mapping port 5556 and mounting a volume for persistent settings and downloads.
- Choose a mode:
  - TUI mode: run the container interactively.
  - API mode: pass the api argument to start the API server.
  - MCP mode: pass the mcp argument to start the MCP server.

Important Docker limitations:
- Command-line invocation mode is not supported.
- Clipboard reading and monitoring are not available; manual paste still works.

**Section sources**
- [README.md:104-127](file://README.md#L104-L127)
- [Dockerfile:1-48](file://Dockerfile#L1-L48)

### Method 4: Executable File Usage
- Use the packaged executable for your platform.
- On macOS, remove quarantine attributes once before first run if prompted by the system.
- Launch the executable directly.

**Section sources**
- [README.md:81-86](file://README.md#L81-L86)

## Initial Setup and Configuration

### Create and Edit settings.json
- On first launch, the settings.json file is generated under the Volume directory.
- You can edit it directly or adjust settings through the GUI.
- If editing manually, ensure valid JSON syntax and restart the application for changes to take effect.

Key configuration areas:
- Output paths and naming
- Download preferences (images, videos, live photos)
- Proxy and network timeouts
- Language selection
- Whether to record data and download history
- Author archive and file naming format

**Section sources**
- [README.md:357-503](file://README.md#L357-L503)
- [source/module/settings.py:10-124](file://source/module/settings.py#L10-L124)

### Configure Cookie (Optional but Recommended)
- Cookies enable access to higher-resolution content and bypass certain restrictions.
- Obtain cookies by inspecting network requests in your browser and copying the Cookie header value.
- Paste the cookie into the settings.json or pass it via CLI/API parameters.

**Section sources**
- [README.md:78-79](file://README.md#L78-L79)
- [README.md:512-527](file://README.md#L512-L527)

### Platform-Specific Clipboard Notes
- Windows: no additional modules required.
- macOS: uses pbcopy/pbpaste.
- Linux: uses xclip or xsel; install if missing.

**Section sources**
- [README.md:351-357](file://README.md#L351-L357)

## Quick Start Examples

### GUI (TUI) Quick Start
- Launch the application using the Program Execution or Source Code Running method.
- The TUI interface allows you to:
  - Paste links directly
  - Switch languages
  - Adjust settings
  - View records and manage downloads

**Section sources**
- [source/TUI/app.py:18-126](file://source/TUI/app.py#L18-L126)

### CLI Quick Start
- Use the CLI to:
  - Pass a single link or multiple links (enclosed in quotes when not specifying an index).
  - Specify image indices for text/image notes.
  - Override settings via CLI flags.
  - Update settings.json after execution.

Common CLI flags (non-exhaustive):
- Work path, folder name, name format
- User-Agent, Cookie, Proxy
- Timeout, chunk size, retries
- Download toggles (images, videos, live photos)
- Folder mode, author archive, write modification time
- Language selection
- Settings file path and update flag

**Section sources**
- [source/CLI/main.py:39-378](file://source/CLI/main.py#L39-L378)
- [README.md:127-131](file://README.md#L127-L131)

### API Quick Start
- Start the API server via the main entry point with the API mode argument.
- Access interactive docs at the server address shown in the documentation.
- Send a POST request to the detail endpoint with a JSON payload containing the URL and optional parameters.

Example payload fields:
- url (required)
- download (optional)
- index (optional)
- cookie (optional)
- proxy (optional)
- skip (optional)

**Section sources**
- [README.md:140-215](file://README.md#L140-L215)
- [main.py:17-28](file://main.py#L17-L28)

### MCP Quick Start
- Start the MCP server via the main entry point with the MCP mode argument.
- Configure your client to connect to the MCP URL provided in the documentation.
- Use MCP to:
  - Retrieve note information
  - Download note files (optionally specifying image indices for text/image notes)

**Section sources**
- [README.md:216-236](file://README.md#L216-L236)
- [main.py:30-42](file://main.py#L30-L42)

### Example: Programmatic Usage
- Use the provided example script to call the downloader programmatically.
- Configure parameters such as work path, folder name, naming format, proxies, timeouts, and download preferences.
- Optionally pass a URL from the clipboard or a predefined link.

**Section sources**
- [example.py:9-113](file://example.py#L9-L113)

## Troubleshooting Guide

### Common Issues and Fixes
- macOS executable blocked on first run:
  - Remove quarantine attributes once using the terminal command described in the documentation.
- Docker limitations:
  - Clipboard reading and monitoring are not available; manual paste still works.
  - Command-line invocation mode is not supported.
- Clipboard not working on Linux:
  - Install xclip or xsel depending on your distribution.
- Cookie-related quality issues:
  - Ensure the Cookie value is copied correctly from the browser and placed in settings.json or passed via CLI/API.
- Network timeouts or rate limiting:
  - Increase timeout and retry values in settings.json.
  - Use a proxy if necessary.
- Language or display issues:
  - Switch language in settings.json or via CLI/API parameters.

**Section sources**
- [README.md:84](file://README.md#L84)
- [README.md:126](file://README.md#L126)
- [README.md:351-357](file://README.md#L351-L357)
- [README.md:512-527](file://README.md#L512-L527)
- [README.md:237-244](file://README.md#L237-L244)

## Conclusion
You now have multiple paths to get started with XHS-Downloader:
- Use the packaged executable for a quick GUI experience.
- Run from source with pip or uv for customization.
- Deploy via Docker for server-like environments.
- Or use CLI/API/MCP for automation and integration.

Configure settings.json and optionally set a Cookie to unlock higher-quality downloads. If you encounter issues, consult the troubleshooting section or review the platform-specific notes.