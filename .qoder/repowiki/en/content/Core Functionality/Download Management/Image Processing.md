# Image Processing

<cite>
**Referenced Files in This Document**
- [source/application/image.py](file://source/application/image.py)
- [source/application/download.py](file://source/application/download.py)
- [source/application/request.py](file://source/application/request.py)
- [source/module/static.py](file://source/module/static.py)
- [source/module/settings.py](file://source/module/settings.py)
- [source/module/tools.py](file://source/module/tools.py)
- [source/module/recorder.py](file://source/module/recorder.py)
- [source/module/mapping.py](file://source/module/mapping.py)
- [source/expansion/converter.py](file://source/expansion/converter.py)
- [README.md](file://README.md)
- [static/XHS-Downloader.js](file://static/XHS-Downloader.js)
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
This document explains the image processing and downloading system, focusing on:
- Image download workflow and format conversion support (JPEG, PNG, WebP, AVIF, HEIC)
- Quality settings and batch image processing
- Live photo extraction and progressive download handling
- Image format detection via file signatures and automatic format correction
- Naming conventions, sequential numbering for image sets, and folder organization strategies
- Configuration examples, format preferences, and troubleshooting common issues

## Project Structure
The image pipeline spans several modules:
- Data extraction and conversion: extracts structured data from HTML
- Image URL resolution: transforms tokens into final URLs with optional format conversion
- Download orchestration: prepares paths, checks existence, streams bytes, validates file signatures, and moves to final destination
- Static configuration: defines supported formats, file signatures, and concurrency limits
- Settings and persistence: stores user preferences and download records

```mermaid
graph TB
A["HTML Content<br/>Extractor"] --> B["Data Converter<br/>(YAML cleanup)"]
B --> C["Image Link Resolver<br/>(format selection)"]
C --> D["Download Orchestrator<br/>(batch, resume, rename)"]
D --> E["File Signature Validator<br/>(auto-correction)"]
E --> F["Final Destination<br/>(organized folders)"]
```

**Diagram sources**
- [source/expansion/converter.py:24-45](file://source/expansion/converter.py#L24-L45)
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/download.py:140-174](file://source/application/download.py#L140-L174)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)

**Section sources**
- [source/expansion/converter.py:24-45](file://source/expansion/converter.py#L24-L45)
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/download.py:140-174](file://source/application/download.py#L140-L174)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)

## Core Components
- Image link resolver: selects image URLs and live photo URLs based on configured format preference
- Download orchestrator: manages concurrency, resumes partial downloads, and writes metadata
- File signature validator: detects actual file type and renames accordingly
- Settings and persistence: controls format preferences, archive modes, and download records

**Section sources**
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/download.py:30-70](file://source/application/download.py#L30-L70)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)
- [source/module/settings.py:26-37](file://source/module/settings.py#L26-L37)

## Architecture Overview
The image processing pipeline integrates data extraction, URL generation, streaming, and post-processing.

```mermaid
sequenceDiagram
participant Ext as "Extractor"
participant Conv as "Converter"
participant Img as "Image Link Resolver"
participant Req as "HTTP Request"
participant Dl as "Download Orchestrator"
participant Sig as "Signature Validator"
Ext->>Conv : "Extract structured data"
Conv-->>Img : "Namespace(data)"
Img->>Req : "Resolve image URLs (format-aware)"
Req-->>Dl : "URLs + live links"
loop "Per image"
Dl->>Dl : "Generate path and name"
Dl->>Req : "GET stream with Range"
Req-->>Dl : "Bytes"
Dl->>Sig : "Validate file signature"
Sig-->>Dl : "Corrected extension"
Dl-->>Dl : "Move to final path"
end
```

**Diagram sources**
- [source/expansion/converter.py:24-45](file://source/expansion/converter.py#L24-L45)
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/request.py:26-70](file://source/application/request.py#L26-L70)
- [source/application/download.py:196-268](file://source/application/download.py#L196-L268)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)

## Detailed Component Analysis

### Image Link Resolution
- Extracts image tokens from either default or fallback URLs
- Supports fixed-format URLs (JPEG, PNG, WebP, HEIC, AVIF) and auto-format URLs
- Produces image URLs and live photo URLs for each image

```mermaid
flowchart TD
Start(["Start"]) --> GetImages["Extract imageList"]
GetImages --> TryDefault{"Default URLs present?"}
TryDefault --> |Yes| TokensDefault["Extract tokens from default URLs"]
TryDefault --> |No| TokensFallback["Extract tokens from fallback URLs"]
TokensDefault --> DecideFormat{"Format preference"}
TokensFallback --> DecideFormat
DecideFormat --> |Fixed| BuildFixed["Build format-specific URLs"]
DecideFormat --> |Auto| BuildAuto["Build auto-format URLs"]
BuildFixed --> Return["Return (images, lives)"]
BuildAuto --> Return
```

**Diagram sources**
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)

**Section sources**
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)

### Download Orchestration and Batch Processing
- Generates per-workspace paths and archives
- Skips existing files across supported formats
- Streams bytes with resume support and Range headers
- Moves temporary files to final destinations with corrected extensions

```mermaid
flowchart TD
A["run(urls, lives, index, nickname, filename, type, mtime)"] --> B["Generate path"]
B --> C{"Type is 图文/图集?"}
C --> |Yes| D["Prepare image tasks (urls × lives)"]
C --> |No| E["Raise error"]
D --> F["Filter by index and existence"]
F --> G["Create tasks with name and format"]
G --> H["Parallel download with semaphore"]
H --> I["Write chunks to temp file"]
I --> J["Detect real extension via signatures"]
J --> K["Move temp to final path"]
K --> L["Done"]
```

**Diagram sources**
- [source/application/download.py:71-112](file://source/application/download.py#L71-L112)
- [source/application/download.py:140-174](file://source/application/download.py#L140-L174)
- [source/application/download.py:196-268](file://source/application/download.py#L196-L268)
- [source/application/download.py:316-337](file://source/application/download.py#L316-L337)

**Section sources**
- [source/application/download.py:71-112](file://source/application/download.py#L71-L112)
- [source/application/download.py:140-174](file://source/application/download.py#L140-L174)
- [source/application/download.py:196-268](file://source/application/download.py#L196-L268)
- [source/application/download.py:316-337](file://source/application/download.py#L316-L337)

### File Signature Validation and Automatic Format Correction
- Reads up to a defined number of initial bytes
- Matches against known signatures for images and videos
- Renames the temporary file to the detected extension or keeps the requested format if unknown

```mermaid
flowchart TD
S["Open temp file"] --> R["Read up to N bytes"]
R --> M{"Signature matches?"}
M --> |Yes| SetExt["Set final name with detected extension"]
M --> |No| KeepFmt["Keep requested format"]
SetExt --> Done["Return final path"]
KeepFmt --> Done
```

**Diagram sources**
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)
- [source/application/download.py:316-337](file://source/application/download.py#L316-L337)

**Section sources**
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)
- [source/application/download.py:316-337](file://source/application/download.py#L316-L337)

### Progressive Download Handling
- Uses HTTP Range requests to resume partial downloads
- Detects 416 Range Not Satisfiable and triggers a fresh download
- Streams bytes in configurable chunk sizes

```mermaid
sequenceDiagram
participant DL as "Download Orchestrator"
participant NET as "HTTP Client"
DL->>DL : "Compute Range from resume position"
DL->>NET : "GET with Range header"
NET-->>DL : "206 Partial Content or 200 OK"
DL->>DL : "Write chunk to temp file"
NET-->>DL : "416 Range Not Satisfiable"
DL->>DL : "Delete temp, retry full download"
```

**Diagram sources**
- [source/application/download.py:205-223](file://source/application/download.py#L205-L223)
- [source/application/download.py:304-314](file://source/application/download.py#L304-L314)

**Section sources**
- [source/application/download.py:205-223](file://source/application/download.py#L205-L223)
- [source/application/download.py:304-314](file://source/application/download.py#L304-L314)

### Image Naming Conventions and Folder Organization
- Name format is configurable and supports fields such as publish time, title, and author
- Sequential numbering is applied per image set (e.g., filename_1, filename_2)
- Optional archive modes:
  - Author archive: separate folder per author
  - Per-workspace archive: each work gets its own folder
- Mapping updates handle author alias changes and folder renaming

```mermaid
flowchart TD
A["Name rules"] --> B["Assemble fields"]
B --> C["Sanitize and truncate"]
C --> D{"Author archive enabled?"}
D --> |Yes| E["Create author folder"]
D --> |No| F["Use base folder"]
E --> G["Archive under work name"]
F --> G
G --> H["Sequentially number images"]
```

**Diagram sources**
- [source/application/app.py:566-601](file://source/application/app.py#L566-L601)
- [source/module/mapping.py:46-88](file://source/module/mapping.py#L46-L88)

**Section sources**
- [source/application/app.py:566-601](file://source/application/app.py#L566-L601)
- [source/module/mapping.py:46-88](file://source/module/mapping.py#L46-L88)

### Configuration and Preferences
- Supported image formats: JPEG, PNG, WEBP, HEIC, AVIF
- Auto-format mode selects server-provided format dynamically
- Chunk size, retry count, and concurrency are configurable
- Download records prevent re-downloading completed works

Examples of configuration keys and behavior:
- image_format: "JPEG", "PNG", "WEBP", "HEIC", "AUTO"
- image_download, live_download, video_download
- folder_mode, author_archive, download_record
- chunk, max_retry, write_mtime

**Section sources**
- [source/module/settings.py:26-37](file://source/module/settings.py#L26-L37)
- [README.md:436-441](file://README.md#L436-L441)
- [README.md:443-459](file://README.md#L443-L459)
- [README.md:466-471](file://README.md#L466-L471)
- [README.md:478-483](file://README.md#L478-L483)
- [README.md:484-489](file://README.md#L484-L489)
- [README.md:496-501](file://README.md#L496-L501)

## Dependency Analysis
- Image link resolver depends on:
  - Data extraction utilities for nested keys
  - HTTP formatting helpers
- Download orchestrator depends on:
  - Static signatures for validation
  - Settings for format and concurrency
  - Persistence for download records
- Converter provides sanitized initial state for downstream parsing

```mermaid
graph LR
Conv["Converter"] --> Img["Image"]
Img --> Dl["Download"]
Dl --> Sig["Static Signatures"]
Dl --> Set["Settings"]
Dl --> Rec["Recorders"]
```

**Diagram sources**
- [source/expansion/converter.py:24-45](file://source/expansion/converter.py#L24-L45)
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/download.py:30-70](file://source/application/download.py#L30-L70)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)
- [source/module/settings.py:26-37](file://source/module/settings.py#L26-L37)
- [source/module/recorder.py:13-59](file://source/module/recorder.py#L13-59)

**Section sources**
- [source/expansion/converter.py:24-45](file://source/expansion/converter.py#L24-L45)
- [source/application/image.py:10-39](file://source/application/image.py#L10-L39)
- [source/application/download.py:30-70](file://source/application/download.py#L30-L70)
- [source/module/static.py:39-67](file://source/module/static.py#L39-L67)
- [source/module/settings.py:26-37](file://source/module/settings.py#L26-L37)
- [source/module/recorder.py:13-59](file://source/module/recorder.py#L13-L59)

## Performance Considerations
- Concurrency: controlled by a semaphore with a fixed worker limit
- Streaming: chunked downloads reduce memory footprint
- Resume: Range requests avoid re-downloading completed parts
- Signature scanning: reads only the first few bytes to detect formats efficiently

Recommendations:
- Adjust chunk size for network conditions
- Tune max_retry and worker count based on stability and storage throughput
- Enable author/archive modes judiciously to balance organization and filesystem overhead

**Section sources**
- [source/module/static.py:69](file://source/module/static.py#L69)
- [source/application/download.py:30-40](file://source/application/download.py#L30-L40)
- [source/application/download.py:304-314](file://source/application/download.py#L304-L314)

## Troubleshooting Guide
Common issues and resolutions:
- Corrupted or mismatched files
  - Cause: interrupted download or wrong extension
  - Resolution: signature validation automatically renames to detected format; if detection fails, file retains requested format and is moved safely
- Format conversion errors
  - Cause: server does not support requested format
  - Resolution: switch to AUTO mode or a widely supported format; verify availability on the platform
- Resume failures (416)
  - Cause: invalid Range request or stale cache
  - Resolution: the system deletes the temp file and retries a full download
- Duplicate downloads
  - Cause: missing records or disabled record mode
  - Resolution: enable download_record to skip previously downloaded works; clear records if re-download is intended
- Naming conflicts
  - Cause: special characters or long titles
  - Resolution: rely on built-in sanitization and truncation; customize name_format to your preference

Operational tips:
- Use AUTO format to avoid conversion errors
- Limit concurrent workers if experiencing timeouts or disk contention
- Verify signatures and final extensions after download for assurance

**Section sources**
- [source/application/download.py:219-223](file://source/application/download.py#L219-L223)
- [source/application/download.py:316-337](file://source/application/download.py#L316-L337)
- [source/module/recorder.py:13-59](file://source/module/recorder.py#L13-L59)
- [README.md:527-529](file://README.md#L527-L529)

## Conclusion
The image processing subsystem combines robust URL resolution, efficient streaming, resilient resume logic, and precise file signature validation to deliver reliable batch downloads across multiple formats. Configurable naming, archival strategies, and record keeping ensure organized and repeatable workflows tailored to diverse use cases.

## Appendices

### Example Configuration Keys and Descriptions
- image_format: "JPEG", "PNG", "WEBP", "HEIC", "AUTO"
- image_download: toggle for 图文/图集 downloads
- live_download: toggle for animated live photos
- folder_mode: per-workspace folder creation
- author_archive: per-author folder organization
- download_record: skip already-downloaded works
- chunk: byte size per stream iteration
- max_retry: retry attempts on transient failures
- write_mtime: set file modification time to publish time

**Section sources**
- [README.md:436-441](file://README.md#L436-L441)
- [README.md:443-459](file://README.md#L443-L459)
- [README.md:466-471](file://README.md#L466-L471)
- [README.md:478-483](file://README.md#L478-L483)
- [README.md:484-489](file://README.md#L484-L489)
- [README.md:496-501](file://README.md#L496-L501)

### User Script Integration (Optional)
- Browser user script exposes image format selection and batch download UI
- Supports selecting specific images by index for targeted downloads

**Section sources**
- [static/XHS-Downloader.js:1405-1418](file://static/XHS-Downloader.js#L1405-L1418)
- [static/XHS-Downloader.js:1570-1708](file://static/XHS-Downloader.js#L1570-L1708)