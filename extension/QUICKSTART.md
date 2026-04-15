# 🚀 Quick Start Guide - RedNote Post Downloader Extension

## Installation (30 seconds)

### Chrome/Edge Browser

1. **Open Extensions Page**
   - Type in address bar: `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
   
2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `extension` folder
   - ✓ Extension installed!

4. **Verify Installation**
   - You should see the RedNote Downloader icon in your browser toolbar
   - Pin it to the toolbar for easy access

## First Download (1 minute)

1. **Open a RedNote Post**
   - Go to any post on xiaohongshu.com
   - Example: `https://www.xiaohongshu.com/explore/65d1234567890abcdef`

2. **Click Extension Icon**
   - Click the extension icon in your toolbar
   - You should see: "✓ Ready to download"

3. **Download**
   - Click "Download This Post" button
   - Wait for the download to complete (depends on number of images/video size)
   - Check your Downloads folder for a ZIP file

## What You'll Get

```
📦 PostTitle_PostID.zip
   ├── 📄 metadata.json          (Complete post data)
   ├── 📝 post_content.txt       (Formatted text with hashtags & pinned comment)
   ├── 📁 images/
   │   ├── 01.jpg                (All post images)
   │   ├── 02.jpg
   │   └── ...
   └──  video.mp4              (If post has video)
```

## Settings

- **Image Format**: Choose JPEG, PNG, or WEBP (default: JPEG)
- Settings save automatically
- Change anytime in the popup

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Not a RedNote post page" | Make sure URL contains `/explore/` or `/discovery/item/` |
| "Content script not loaded" | Refresh the page and try again |
| Download not starting | Check internet connection, try again |
| Some files missing | Network issue - try again, extension will retry 3 times |

## Tips

✅ Works best when post is fully loaded (all images visible)  
✅ Large posts (many images/videos) may take 1-2 minutes  
✅ Downloads work even if you're not logged into RedNote  
✅ ZIP files are organized and ready to use  

## Need Help?

- Check `README.md` for detailed documentation
- Review browser console (F12) for error messages
- Open issue on GitHub: https://github.com/JoeanAmier/XHS-Downloader

---

**That's it! Start downloading RedNote posts with all content included! 🎉**
