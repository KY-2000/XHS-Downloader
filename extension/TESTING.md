# Testing Checklist

## Pre-Installation

- [ ] All required files are present in `extension/` folder
- [ ] manifest.json is valid JSON
- [ ] No syntax errors in JavaScript files
- [ ] JSZip library is downloaded in `lib/` folder
- [ ] Icon PNG files exist in `icons/` folder

## Installation

- [ ] Open `chrome://extensions/` (or `edge://extensions/`)
- [ ] Enable "Developer mode"
- [ ] Click "Load unpacked"
- [ ] Select the `extension` folder
- [ ] Extension appears in extensions list
- [ ] Extension icon appears in toolbar
- [ ] No errors shown in extension details page

## Basic Functionality

### Test Case 1: Image Post (Single Image)
- [ ] Navigate to a single-image post on xiaohongshu.com
- [ ] Click extension icon
- [ ] Status shows "✓ Ready to download"
- [ ] Click "Download This Post" button
- [ ] Status changes to "⏳ Downloading..."
- [ ] Download starts in browser
- [ ] ZIP file is saved to Downloads folder
- [ ] ZIP contains:
  - [ ] metadata.json
  - [ ] post_content.txt
  - [ ] images/ folder with 1 image
- [ ] metadata.json has correct data
- [ ] post_content.txt is readable and complete

### Test Case 2: Image Post (Multiple Images)
- [ ] Navigate to a multi-image post (e.g., 9 images)
- [ ] Click extension icon
- [ ] Click "Download This Post"
- [ ] Wait for download to complete
- [ ] ZIP contains all images in images/ folder
- [ ] Images are numbered sequentially (01.jpg, 02.jpg, etc.)
- [ ] All images open correctly

### Test Case 3: Video Post
- [ ] Navigate to a video post
- [ ] Click extension icon
- [ ] Click "Download This Post"
- [ ] Wait for download (may take longer for video)
- [ ] ZIP contains video.mp4
- [ ] Video file plays correctly
- [ ] metadata.json shows type: "video"

### Test Case 4: Post with Pinned Comment
- [ ] Navigate to a post with a pinned comment
- [ ] Download the post
- [ ] Check post_content.txt for pinned comment section
- [ ] Check metadata.json for pinnedComment field
- [ ] Pinned comment text is correct

### Test Case 5: Post with Hashtags
- [ ] Navigate to a post with multiple hashtags
- [ ] Download the post
- [ ] Check metadata.json hashtags array
- [ ] Check post_content.txt for hashtags section
- [ ] All hashtags are extracted correctly

## Settings

### Image Format
- [ ] Open extension popup
- [ ] Change image format to PNG
- [ ] Download a post
- [ ] Images are in PNG format
- [ ] Change to WEBP
- [ ] Download a post
- [ ] Images are in WEBP format
- [ ] Close and reopen popup
- [ ] Setting is saved (WEBP selected)

## Error Handling

### Invalid Page
- [ ] Navigate to non-RedNote page (e.g., google.com)
- [ ] Click extension icon
- [ ] Status shows "❌ Not a RedNote post page"
- [ ] Download button is disabled

### RedNote Homepage
- [ ] Navigate to xiaohongshu.com homepage (not a post)
- [ ] Click extension icon
- [ ] Status shows appropriate error message
- [ ] Download button is disabled

### Network Error Simulation
- [ ] Turn off internet connection
- [ ] Try to download a post
- [ ] Error message is displayed
- [ ] Extension doesn't crash

## Performance

### Large Post
- [ ] Find a post with 9+ images
- [ ] Download the post
- [ ] Monitor download time
- [ ] All images download successfully
- [ ] No timeout errors

### Multiple Downloads
- [ ] Download 3 different posts in sequence
- [ ] Each download completes successfully
- [ ] No memory leaks or crashes
- [ ] Extension remains responsive

## Browser Compatibility

### Chrome
- [ ] All features work on Chrome (version 88+)
- [ ] No console errors

### Edge
- [ ] All features work on Edge (version 88+)
- [ ] No console errors

## Edge Cases

### Post with Very Long Title
- [ ] Download a post with title > 100 characters
- [ ] Filename is truncated properly
- [ ] No errors occur

### Post with Special Characters
- [ ] Download a post with emojis in title/description
- [ ] Files are created successfully
- [ ] JSON is valid
- [ ] Text file displays correctly

### Post with No Description
- [ ] Download a post with empty description
- [ ] metadata.json handles null/empty gracefully
- [ ] post_content.txt shows appropriate message

### Post with No Hashtags
- [ ] Download a post without hashtags
- [ ] metadata.json shows empty array
- [ ] No errors

## Console Logs

- [ ] Open browser console (F12)
- [ ] Download a post
- [ ] Check console for errors
- [ ] Informative logs are present
- [ ] No red error messages (warnings are OK)

## Memory/Resource Usage

- [ ] Open Task Manager
- [ ] Download a large post
- [ ] Monitor memory usage
- [ ] Memory is released after download
- [ ] No excessive resource consumption

## Post-Download Verification

### File Integrity
- [ ] ZIP file opens without errors
- [ ] All files inside are valid
- [ ] Images display correctly
- [ ] Video plays correctly
- [ ] JSON is valid and parseable
- [ ] Text file is properly formatted

### Data Accuracy
- [ ] metadata.json contains:
  - [ ] Correct noteId
  - [ ] Correct author information
  - [ ] Correct statistics
  - [ ] Correct timestamps
  - [ ] Valid image URLs
- [ ] post_content.txt is human-readable
- [ ] All text content matches the post

## Final Checks

- [ ] Extension works without being logged into RedNote
- [ ] Extension doesn't interfere with normal browsing
- [ ] Extension icon displays correctly
- [ ] Popup UI is responsive and clean
- [ ] No memory leaks after multiple uses
- [ ] Browser doesn't show any warnings

## Notes & Issues

Document any issues found during testing:

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

**Tested By**: ________________  
**Date**: ________________  
**Browser Version**: ________________  
**Result**: ☐ PASS  ☐ FAIL (with notes above)
