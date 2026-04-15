# Browser Extension: RedNote Post Downloader

## Overview
Convert the existing XHS-Downloader Tampermonkey script into a Chrome/Edge browser extension that can download complete RedNote posts including all media files and text content (post text + pinned comment) packaged as a ZIP file with JSON metadata.

## Architecture

### Existing Code Analysis
The current Tampermonkey script (`static/XHS-Downloader.js`) already has most of the functionality we need:
- **Data extraction**: `extractNoteInfo()` extracts post data from `unsafeWindow.__INITIAL_STATE__`
- **Media URLs**: `generateImageUrl()` and `generateVideoUrl()` extract download URLs
- **File download**: `downloadFile()`, `downloadImage()`, `downloadVideo()` handle file fetching
- **ZIP packaging**: `downloadFiles()` uses JSZip to package multiple images
- **Post structure**: The `note` object contains all needed fields (title, desc, imageList, video, etc.)

### New Extension Structure
```
extension/
├── manifest.json              # Extension manifest (V3)
├── popup.html                 # Extension popup UI
├── popup.js                   # Popup logic
├── content.js                 # Content script (injected into xiaohongshu.com)
├── background.js              # Service worker for downloads
├── lib/
│   └── jszip.min.js          # JSZip library
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Implementation Tasks

### Task 1: Create Extension Manifest
**File**: `extension/manifest.json`
- Manifest Version 3
- Permissions: `activeTab`, `downloads`, `storage`
- Host permissions: `*://www.xiaohongshu.com/*`
- Content script: Inject on xiaohongshu explore pages
- Background service worker for handling downloads
- Browser action popup for user controls

### Task 2: Create Content Script
**File**: `extension/content.js`

**Key functions to port from Tampermonkey script:**

1. **extractNoteInfo()** - Extract post data from page's `__INITIAL_STATE__`
   - Access: `unsafeWindow.__INITIAL_STATE__.noteData?.data?.noteData` or `window.__INITIAL_STATE__.note.noteDetailMap[noteId].note`
   - Returns: Complete note object with title, desc, imageList, video, user info, etc.

2. **extractPinnedComment()** - NEW: Extract pinned comment from DOM
   - Query DOM for pinned comment element
   - Look for element with "置顶评论" (pinned comment) badge
   - Extract comment text and author

3. **generateImageUrl()** - Port from script (lines 460-481)
   - Convert imageList to downloadable URLs with format conversion

4. **generateVideoUrl()** - Port from script (lines 448-458)
   - Extract video download URL from note.video object

5. **extractName()** - Port from script (lines 691-698)
   - Generate filename from post title

**Data collection flow:**
```javascript
function collectPostData() {
  const note = extractNoteInfo();
  const pinnedComment = extractPinnedComment();
  
  const postData = {
    title: note.title,
    description: note.desc,
    hashtags: extractHashtags(note.desc),
    author: {
      nickname: note.user?.nickname || note.user?.nickName,
      userId: note.user?.userId
    },
    publishTime: note.time,
    location: note.ipLocation,
    stats: {
      likes: note.interactInfo?.likedCount,
      collects: note.interactInfo?.collectedCount,
      comments: note.interactInfo?.commentCount,
      shares: note.interactInfo?.shareCount
    },
    pinnedComment: pinnedComment,
    images: note.imageList?.map((img, idx) => ({
      index: idx + 1,
      url: generateSingleImageUrl(img),
      thumbnail: img.urlDefault || img.url
    })),
    video: note.type === 'video' ? {
      url: generateVideoUrl(note)
    } : null,
    postUrl: window.location.href,
    noteId: note.noteId
  };
  
  return postData;
}
```

### Task 3: Create Download Handler in Content Script
**File**: `extension/content.js` (continued)

```javascript
async function downloadCompletePost() {
  const postData = collectPostData();
  const fileName = sanitizeFileName(postData.title || postData.noteId);
  
  // Send to background script for downloading
  chrome.runtime.sendMessage({
    action: 'downloadPost',
    data: postData,
    fileName: fileName
  });
}
```

### Task 4: Create Background Script
**File**: `extension/background.js`

**Purpose**: Handle file downloads and ZIP creation (avoids CORS issues)

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadPost') {
    handleDownloadPost(message.data, message.fileName);
  }
});

async function handleDownloadPost(postData, baseFileName) {
  const zip = new JSZip();
  
  // 1. Save metadata as JSON
  zip.file('metadata.json', JSON.stringify(postData, null, 2));
  
  // 2. Save text content as separate file for easy reading
  const textContent = formatPostAsText(postData);
  zip.file('post_content.txt', textContent);
  
  // 3. Download images
  if (postData.images && postData.images.length > 0) {
    const imageFolder = zip.folder('images');
    for (const img of postData.images) {
      const blob = await fetchFileAsBlob(img.url);
      const ext = getFileExtension(img.url);
      imageFolder.file(`${img.index}.${ext}`, blob);
    }
  }
  
  // 4. Download video if exists
  if (postData.video && postData.video.url) {
    const videoBlob = await fetchFileAsBlob(postData.video.url);
    zip.file('video.mp4', videoBlob);
  }
  
  // 5. Generate and download ZIP
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  // Trigger download
  const url = URL.createObjectURL(zipBlob);
  chrome.downloads.download({
    url: url,
    filename: `${baseFileName}.zip`,
    saveAs: true
  });
}

async function fetchFileAsBlob(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'image/*,video/*',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
  });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  return await response.blob();
}

function formatPostAsText(postData) {
  let text = '';
  text += `Title: ${postData.title}\n\n`;
  text += `Author: ${postData.author.nickname}\n`;
  text += `Post URL: ${postData.postUrl}\n`;
  if (postData.publishTime) {
    text += `Published: ${new Date(postData.publishTime).toLocaleString()}\n`;
  }
  text += '\n---\n\n';
  text += `${postData.description}\n\n`;
  text += `Hashtags: ${postData.hashtags.join(' ')}\n\n`;
  if (postData.pinnedComment) {
    text += `--- Pinned Comment ---\n`;
    text += `${postData.pinnedComment.text}\n`;
    if (postData.pinnedComment.author) {
      text += `by ${postData.pinnedComment.author}\n`;
    }
    text += '\n';
  }
  text += `---\n\n`;
  text += `Stats:\n`;
  text += `  Likes: ${postData.stats.likes}\n`;
  text += `  Collects: ${postData.stats.collects}\n`;
  text += `  Comments: ${postData.stats.comments}\n`;
  text += `  Shares: ${postData.stats.shares}\n`;
  if (postData.images) {
    text += `\nImages: ${postData.images.length}\n`;
  }
  if (postData.video) {
    text += `Video: Yes\n`;
  }
  return text;
}
```

### Task 5: Create Popup UI
**File**: `extension/popup.html` & `popup.js`

Simple popup with:
- "Download This Post" button (when on explore page)
- Status indicator (downloading, success, error)
- Settings: image format (JPEG/PNG/WEBP), include pinned comment toggle

### Task 6: Implement Pinned Comment Extraction
**File**: `extension/content.js`

```javascript
function extractPinnedComment() {
  // Find pinned comment in the DOM
  const pinnedBadges = document.querySelectorAll('.comment-item');
  for (const comment of pinnedBadges) {
    const pinnedLabel = comment.querySelector('.pinned-badge, .置顶');
    if (pinnedLabel) {
      const text = comment.querySelector('.comment-text')?.textContent;
      const author = comment.querySelector('.author-name')?.textContent;
      return { text, author, isPinned: true };
    }
  }
  return null;
}
```

**Note**: Need to inspect actual RedNote DOM structure to identify correct selectors. May require testing on live page.

### Task 7: Add Error Handling & User Feedback
- Show download progress in popup
- Handle network errors with retry logic (3 attempts)
- Display success/error notifications
- Validate that we're on a post page before enabling download

### Task 8: Testing & Debugging
1. Load unpacked extension in Chrome
2. Test on various post types:
   - Image posts (single and multiple images)
   - Video posts
   - Posts with pinned comments
   - Posts with hashtags
3. Verify ZIP structure is correct
4. Check JSON metadata completeness
5. Test download of large files (videos)

## Key Differences from Original Script

1. **Text content inclusion**: Original script only downloads media files. New extension adds:
   - `metadata.json` with all post data
   - `post_content.txt` with formatted readable text

2. **Pinned comment extraction**: New feature not in original script

3. **Extension architecture**: 
   - Original: Tampermonkey script with `unsafeWindow` access
   - New: Chrome extension with content script + background service worker

4. **File organization**:
   - Original: Flat file download or ZIP with images only
   - New: Organized ZIP with folders (`images/`, metadata files)

5. **User interface**:
   - Original: Floating menu on page
   - New: Browser extension popup + badge icon

## JSON Metadata Structure

```json
{
  "noteId": "65d1234567890abcdef",
  "title": "【梦幻紫调治愈壁纸】云海山峦的温柔梦境",
  "description": "当群山染上梦幻的紫，\n云雾便成了温柔的纱。...",
  "hashtags": ["紫色系壁纸", "治愈系风景", "手机壁纸", ...],
  "author": {
    "nickname": "Junmei Wallpaper",
    "userId": "5f12345678901234"
  },
  "publishTime": 1712188800000,
  "stats": {
    "likes": "7",
    "collects": "5",
    "comments": "12",
    "shares": "3"
  },
  "pinnedComment": {
    "text": "限免内礼貌取，非100%回，随缘发送...",
    "author": "Junmei Wallpaper",
    "isPinned": true
  },
  "images": [
    {
      "index": 1,
      "url": "https://ci.xiaohongshu.com/xxx?imageView2/format/jpeg",
      "thumbnail": "http://sns-webpic-qc.xhscdn.com/..."
    }
  ],
  "video": null,
  "postUrl": "https://www.xiaohongshu.com/explore/65d123...",
  "extractedAt": "2026-04-14T10:30:00.000Z"
}
```

## Technical Considerations

1. **CORS**: Background script handles downloads to avoid CORS restrictions
2. **Memory**: For large posts (many images/videos), stream download instead of loading all into memory
3. **Rate limiting**: Add delay between file downloads to avoid being blocked
4. **Browser compatibility**: Target Chrome/Edge (Manifest V3)
5. **JSZip**: Include as local dependency rather than CDN for offline functionality

## Files to Create

1. `extension/manifest.json`
2. `extension/popup.html`
3. `extension/popup.js`
4. `extension/content.js`
5. `extension/background.js`
6. `extension/lib/jszip.min.js`
7. `extension/icons/icon16.png`
8. `extension/icons/icon48.png`
9. `extension/icons/icon128.png`

## Files to Reference (No Modification)

- `static/XHS-Downloader.js` - Use as reference for logic
- `source/application/explore.py` - Reference for data structure
- `source/application/image.py` - Reference for image URL generation

## Estimated Timeline
- Tasks 1-2: 1-2 hours (manifest + content script)
- Tasks 3-4: 2-3 hours (download logic + background script)
- Tasks 5-6: 1-2 hours (popup UI + pinned comment)
- Tasks 7-8: 2-3 hours (testing + debugging)
- **Total**: 6-10 hours
