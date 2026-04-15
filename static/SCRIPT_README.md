# XHS-Downloader Enhanced - Tampermonkey Script

## What is This?

An **enhanced version** of the XHS-Downloader Tampermonkey user script that downloads **complete RedNote posts** including:

- **All media files** (images and videos)
- **Post text content** (title, description)
- **All hashtags**
- **Pinned comment**
- **Author information**
- **Engagement statistics**
- **Album batch download** with automatic download

Everything is packaged in a **single ZIP file** with organized structure!

## Installation

### Step 1: Install Tampermonkey

1. **Chrome/Edge**: [Install Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. **Firefox**: [Install Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
3. **Safari**: [Install Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

### Step 2: Install the Script

1. Open Tampermonkey Dashboard
2. Click **"Create a new script"**
3. Delete the default template
4. Paste the entire contents of `XHS-Downloader.js`
5. Click **"Save"** (Ctrl+S)
6. Script installed!

> **Important**: The script requires `GM_xmlhttpRequest` grant to bypass CORS when downloading images. If you previously installed an older version, please **remove it and re-install** to get the new permissions.

## Usage

### Single Post Download

1. **Navigate to any RedNote post**
   - Go to: `https://www.xiaohongshu.com/explore/[PostID]`
   - Or: `https://www.xiaohongshu.com/discovery/item/[PostID]`

2. **Open Tampermonkey menu**
   - Click the Tampermonkey icon in your browser toolbar
   - You'll see: **"Download Note Files"**

3. **Click the menu item**
   - The script auto-scrolls to load comments
   - Downloads all media + text content
   - Saves as a ZIP file to your downloads folder

### Album Batch Download

1. **Navigate to an album/board page**
   - Go to: `https://www.xiaohongshu.com/board/[BoardID]`

2. **Open Tampermonkey menu**
   - You'll see: **"Download Album All Content"**

3. **Click the menu item**
   - A selection modal appears showing all notes with thumbnails
   - Select notes you want to download (click to toggle)
   - Use **"Select All"** / **"Deselect All"** buttons
   - Click **"Download Selected"**

4. **Automatic download flow**
   - Each selected note opens in a new tab
   - Download starts automatically after page loads
   - Tabs open **sequentially** (one at a time)
   - All images are downloaded by default (no selection modal)

### What You Get

```
PostTitle_PostID.zip
   ├── metadata.json          # Complete post data (JSON format)
   ├── post_content.txt       # Readable text with all content
   ├── images/                # All images (if image post)
   │   ├── 01.jpg
   │   ├── 02.jpg
   │   └── ...
   └── video.mp4              # Video file (if video post)
```

### metadata.json Contains

```json
{
  "noteId": "65d1234567890abcdef",
  "title": "Post Title",
  "description": "Post description...",
  "hashtags": ["tag1", "tag2"],
  "author": {
    "nickname": "Author Name",
    "userId": "5f12345678901234"
  },
  "publishTime": 1712188800000,
  "type": "normal",
  "stats": {
    "likes": "7",
    "collects": "5",
    "comments": "12",
    "shares": "3"
  },
  "pinnedComment": {
    "text": "Pinned comment text...",
    "author": "Author Name",
    "isPinned": true
  },
  "postUrl": "https://www.xiaohongshu.com/explore/...",
  "extractedAt": "2026-04-14T10:30:00.000Z"
}
```

### post_content.txt Contains

```
============================================================
REDNOTE POST DOWNLOAD
============================================================

Title: Post Title
Author: Author Name
Post URL: https://www.xiaohongshu.com/explore/...
Type: normal

------------------------------------------------------------

DESCRIPTION:
Post description text...

HASHTAGS:
#tag1 #tag2 #tag3

------------------------------------------------------------
PINNED COMMENT:
Pinned comment text...
by Author Name

------------------------------------------------------------
STATISTICS:
  Likes: 7
  Collects: 5
  Comments: 12
  Shares: 3

============================================================
Downloaded: 4/14/2026, 6:30:00 PM
============================================================
```

## Features

### Enhanced Features (Compared to Original Script)

| Feature | Original Script | Enhanced Script |
|---------|----------------|-----------------|
| Download images/videos | Yes | Yes |
| Save post text | No | Yes (metadata.json + post_content.txt) |
| Extract hashtags | No | Yes |
| Download pinned comment | No | Yes |
| Auto-scroll for comments | No | Yes |
| Album batch download | No | Yes (with visual selection) |
| Auto-download from album | No | Yes (via URL parameter) |
| CORS bypass for images | No | Yes (via GM_xmlhttpRequest) |
| Organized ZIP structure | Basic | Full organization |

### Key Benefits

1. **Complete Archive**: Get everything from a post in one download
2. **Album Support**: Batch download multiple notes from an album page
3. **Auto-Download**: Album downloads trigger automatically on each note tab
4. **Searchable**: Text files make it easy to search content later
5. **Structured**: JSON format for programmatic access
6. **Human-Readable**: post_content.txt for easy reading
7. **No Server Needed**: Everything runs in your browser

## Menu Items

| Page Type | Menu Item | Description |
|-----------|-----------|-------------|
| Explore page | Download Note Files | Download single post with all content |
| Album/Board page | Extract Album Note Links | Extract all note URLs to clipboard |
| Album/Board page | Download Album All Content | Batch download with visual selection |

## Settings

Access via Tampermonkey menu on any xiaohongshu.com page:

| Setting | Default | Description |
|---------|---------|-------------|
| Image Download Selection Mode | On | When on, shows modal to pick images. When off, downloads all automatically |
| File Packaging | On | Package multiple files as ZIP |
| Image Format | JPEG | Output format for downloaded images |
| Keep Menu Visible | Off | Menu stays visible without hover |

> **Tip**: For album auto-download, the script temporarily disables "Image Download Selection Mode" so all images download automatically without showing the selection modal.

## Troubleshooting

### CORS errors when downloading images
- **Symptom**: "Failed to fetch" or "CORS policy" errors in console
- **Solution**: Make sure you installed the script with `GM_xmlhttpRequest` grant
  - Remove old script from Tampermonkey
  - Re-install using the latest version
  - Tampermonkey will prompt to accept new permissions

### "Exception Occurred - Error downloading image note"
- **Cause**: Usually CORS blocking or network issues
- **Solution**: Ensure `GM_xmlhttpRequest` grant is active (re-install script)

### Album download opens tabs but nothing downloads
- **Check**: Allow popups for xiaohongshu.com
  - When browser blocks popups, click the blocker icon
  - Select **"Always allow popups from xiaohongshu.com"**
- **Check**: Look at the note tab's console (F12) for error messages

### Select All / Deselect All buttons crash
- **Fixed**: Updated to use semantic class names instead of style-based selectors

### Download button not brightening when notes are selected
- **Fixed**: Button now properly toggles opacity between 0.5 (disabled) and 1.0 (enabled)

### Pinned comment not extracted
- **Note**: The script auto-scrolls to load comments before extraction
- If still missing, scroll down manually and try again

### "Cannot read properties of undefined (reading 'includes')"
- **Fixed**: `currentUrl` global variable is now set before calling download functions

### Video posts show "Video data not found"
- **Normal**: This means the post is an image post incorrectly marked as video
- The script handles this gracefully and skips video download

## Technical Details

### CORS Bypass

The script uses `GM_xmlhttpRequest` to bypass CORS restrictions when downloading images from `ci.xiaohongshu.com` and `xhscdn.com` CDN servers. This requires:

```
// @grant          GM_xmlhttpRequest
// @connect        xhscdn.com
// @connect        xiaohongshu.com
// @connect        ci.xiaohongshu.com
// @connect        *
```

### Auto-Download Flow

Album batch download uses a sequential flow:

1. User selects notes in modal
2. Script opens first note tab with `?auto_download=true` URL parameter
3. Note page detects parameter and calls `extractDownloadLinks(false)`
4. Waits for download to complete (~15 seconds)
5. Opens next note tab
6. Repeats until all selected notes are downloaded

### Key Global Variables

The script depends on these global variables that must be set before calling download functions:

- `currentUrl` - Must be set to `window.location.href` before calling `extractDownloadLinks()`
- `config.imageCheckboxSwitch` - Temporarily set to `false` for auto-download to skip image selection modal

## Requirements

- Tampermonkey extension installed
- Internet connection (to load JSZip library from CDN)
- Modern browser (Chrome, Firefox, Edge, Safari)
- Access to xiaohongshu.com
- Allow popups for xiaohongshu.com (for album downloads)

## Privacy & Security

- **No external data collection**: All processing happens in your browser
- **No tracking**: No analytics or user behavior tracking
- **Open source**: Code is transparent and auditable
- **CORS bypass**: Uses Tampermonkey's `GM_xmlhttpRequest` for cross-origin requests
- **CDN dependency**: Loads JSZip from cdnjs.cloudflare.com

## License

GNU General Public License v3.0

This script is based on the XHS-Downloader project:
- GitHub: https://github.com/JoeanAmier/XHS-Downloader
- Original Author: JoeanAmier

## Disclaimer

- For **personal use only**
- Respect RedNote's **Terms of Service**
- Respect **copyright** and intellectual property rights
- Follow all **applicable laws and regulations**
- Authors are **not responsible** for misuse

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Open browser console (F12) for error details
3. Open an issue on GitHub: https://github.com/JoeanAmier/XHS-Downloader/issues

## Tips

- **Best results**: Wait for page to fully load before downloading
- **Comments**: Script auto-scrolls to load comments for pinned comment extraction
- **Large posts**: Be patient - videos take longer to download
- **Album downloads**: Allow popups for seamless auto-download experience
- **Image selection**: Disable "Image Download Selection Mode" in settings to always download all images

---

**Version**: 2.0.0
**Based on**: XHS-Downloader v2.3.1
**Last Updated**: 2026-04-14
