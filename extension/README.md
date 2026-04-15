# RedNote Post Downloader - Browser Extension

A Chrome/Edge browser extension to download complete RedNote (XiaoHongShu) posts including all media files and text content as organized ZIP archives.

## Features

✅ **Complete Post Downloads**
- Download all images from a post
- Download video files (if available)
- Extract and save post text content
- Extract and save pinned comments
- Save comprehensive metadata as JSON

✅ **Organized ZIP Structure**
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

✅ **User-Friendly Interface**
- Simple popup UI
- Real-time status updates
- Configurable image format (JPEG/PNG/WEBP)
- Progress indicators

## Installation

### Development Mode (Chrome/Edge)

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

## Usage

1. **Navigate to a RedNote Post**
   - Open any post on xiaohongshu.com
   - Supported URLs:
     - `https://www.xiaohongshu.com/explore/[PostID]`
     - `https://www.xiaohongshu.com/discovery/item/[PostID]`

2. **Open Extension Popup**
   - Click the extension icon in your browser toolbar

3. **Configure Settings (Optional)**
   - Choose image format: JPEG, PNG, or WEBP
   - Settings are saved automatically

4. **Download**
   - Click "Download This Post" button
   - Wait for the download to complete
   - Check your browser's downloads folder for the ZIP file

## What Gets Downloaded

### metadata.json
Contains structured data including:
- Post ID and title
- Author information
- Description and hashtags
- Engagement statistics (likes, comments, shares, collects)
- Publish time and location
- Pinned comment (if available)
- Image and video URLs
- Extraction timestamp

### post_content.txt
Human-readable formatted text with:
- Post title and author
- Full description
- All hashtags
- Pinned comment
- Statistics summary
- Media information

### images/ folder
- All images from the post
- Numbered sequentially (01.jpg, 02.jpg, etc.)
- Original quality from RedNote CDN

### video.mp4 (if applicable)
- Video file from the post
- Original quality from RedNote CDN

## Configuration

### Image Format
Choose your preferred image format:
- **JPEG** (default): Best compatibility, smaller file size
- **PNG**: Lossless quality, larger file size
- **WEBP**: Modern format, good compression

Settings are saved in browser sync storage and persist across sessions.

## Troubleshooting

### "Not a RedNote post page"
- Make sure you're on a valid post page
- URL should contain `/explore/` or `/discovery/item/`
- Try refreshing the page

### "Content script not loaded"
- Refresh the page and try again
- Make sure the extension is properly installed
- Check that you're on xiaohongshu.com

### Download fails
- Check your internet connection
- Verify that you can access RedNote normally
- Some posts may have restricted access
- Try again after a few minutes

### ZIP file is incomplete
- Some images may fail to download due to network issues
- Check browser console (F12) for error messages
- The extension will continue downloading other files even if one fails

## Technical Details

### Architecture
- **Manifest Version**: 3
- **Content Script**: Extracts post data from page
- **Background Service Worker**: Handles downloads and ZIP creation
- **Popup UI**: User interface for triggering downloads

### Permissions
- `activeTab`: Access current tab to inject content script
- `downloads`: Trigger file downloads
- `storage`: Save user preferences
- `*://www.xiaohongshu.com/*`: Access RedNote pages

### Dependencies
- **JSZip** (v3.10.1): ZIP file creation library
  - Included locally in `lib/jszip.min.js`
  - No external CDN required

### Privacy
- No data is sent to external servers
- All processing happens locally in your browser
- No analytics or tracking
- Open source code for transparency

## Development

### File Structure
```
extension/
├── manifest.json          # Extension manifest
├── popup.html             # Popup UI
├── popup.js               # Popup logic
├── content.js             # Content script (data extraction)
├── background.js          # Service worker (downloads)
├── lib/
│   └── jszip.min.js      # JSZip library
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Building Icons
The included icons are simple blue placeholders. To create custom icons:
1. Use the included `icons/create_icons.html` in a browser
2. Or use any image editor to create 16x16, 48x48, and 128x128 PNG files
3. Replace files in `icons/` folder

## Limitations

- Only works on xiaohongshu.com (not mobile app)
- Requires the post to be fully loaded before downloading
- Cannot download content from private/restricted accounts
- Video quality depends on what's available on RedNote CDN
- May not work if RedNote changes their page structure

## Contributing

This extension is based on the XHS-Downloader project:
- GitHub: https://github.com/JoeanAmier/XHS-Downloader
- License: GNU General Public License v3.0

## License

GNU General Public License v3.0

This extension inherits the license from the original XHS-Downloader project.

## Disclaimer

This extension is for personal use only. Users are responsible for:
- Complying with RedNote's Terms of Service
- Respecting copyright and intellectual property rights
- Following applicable laws and regulations

The developers are not responsible for any misuse of this extension.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Open an issue on the XHS-Downloader GitHub repository
3. Review browser console (F12) for error messages

---

**Version**: 1.0.0  
**Based on**: XHS-Downloader v2.8  
**Last Updated**: 2026-04-14
