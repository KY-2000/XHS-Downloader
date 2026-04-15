// RedNote Post Downloader - Background Service Worker
// Handles file downloads and ZIP creation

// Import JSZip from local file
importScripts('lib/jszip.min.js');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadPost') {
    handleDownloadPost(message.data, message.fileName)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Download failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Main download handler
async function handleDownloadPost(postData, baseFileName) {
  console.log('Starting download process for:', baseFileName);
  
  const zip = new JSZip();
  
  try {
    // 1. Save metadata as JSON
    console.log('Adding metadata.json to ZIP...');
    zip.file('metadata.json', JSON.stringify(postData, null, 2));
    
    // 2. Save text content as readable file
    console.log('Adding post_content.txt to ZIP...');
    const textContent = formatPostAsText(postData);
    zip.file('post_content.txt', textContent);
    
    // 3. Download and add images
    if (postData.images && postData.images.length > 0) {
      console.log(`Downloading ${postData.images.length} images...`);
      const imageFolder = zip.folder('images');
      
      for (let i = 0; i < postData.images.length; i++) {
        const img = postData.images[i];
        console.log(`Downloading image ${i + 1}/${postData.images.length}: ${img.url}`);
        
        try {
          const blob = await fetchFileAsBlob(img.url, 3); // 3 retries
          const ext = getFileExtension(img.url) || 'jpg';
          const fileName = `${String(img.index).padStart(2, '0')}.${ext}`;
          imageFolder.file(fileName, blob);
          console.log(`✓ Image ${i + 1} downloaded successfully`);
        } catch (error) {
          console.error(`✗ Failed to download image ${i + 1}:`, error);
          // Continue with other images even if one fails
        }
        
        // Add small delay to avoid rate limiting
        await sleep(300);
      }
    }
    
    // 4. Download and add video if exists
    if (postData.video && postData.video.url) {
      console.log('Downloading video...');
      try {
        const videoBlob = await fetchFileAsBlob(postData.video.url, 3);
        zip.file('video.mp4', videoBlob);
        console.log('✓ Video downloaded successfully');
      } catch (error) {
        console.error('✗ Failed to download video:', error);
      }
    }
    
    // 5. Generate ZIP file
    console.log('Generating ZIP file...');
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    }, (metadata) => {
      console.log(`ZIP generation progress: ${Math.round(metadata.percent)}%`);
    });
    
    console.log(`ZIP file generated: ${(zipBlob.size / 1024 / 1024).toFixed(2)} MB`);
    
    // 6. Trigger download
    console.log('Triggering browser download...');
    const url = URL.createObjectURL(zipBlob);
    
    await chrome.downloads.download({
      url: url,
      filename: `${baseFileName}.zip`,
      saveAs: true,
      conflictAction: 'uniquify'
    });
    
    console.log('✓ Download completed successfully!');
    
    // Clean up object URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    
  } catch (error) {
    console.error('Error in handleDownloadPost:', error);
    throw error;
  }
}

// Fetch file as blob with retry logic
async function fetchFileAsBlob(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching: ${url} (attempt ${attempt}/${maxRetries})`);
      
      const response = await fetch(url, {
        headers: {
          'accept': 'image/*,video/*,*/*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'referer': 'https://www.xiaohongshu.com/'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Verify blob is not empty
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      console.log(`✓ Downloaded: ${(blob.size / 1024).toFixed(2)} KB`);
      return blob;
      
    } catch (error) {
      console.error(`✗ Attempt ${attempt} failed:`, error.message);
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait 1s, 2s, 4s...
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await sleep(delay);
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Format post data as readable text
function formatPostAsText(postData) {
  let text = '';
  
  // Header
  text += '='.repeat(60) + '\n';
  text += 'REDNOTE POST DOWNLOAD\n';
  text += '='.repeat(60) + '\n\n';
  
  // Basic info
  text += `Title: ${postData.title || 'N/A'}\n`;
  text += `Author: ${postData.author.nickname || 'N/A'}\n`;
  text += `Author ID: ${postData.author.userId || 'N/A'}\n`;
  text += `Post URL: ${postData.postUrl}\n`;
  text += `Post ID: ${postData.noteId}\n`;
  text += `Type: ${postData.type}\n`;
  
  if (postData.publishTime) {
    const date = new Date(postData.publishTime);
    text += `Published: ${date.toLocaleString()}\n`;
  }
  
  if (postData.lastUpdateTime) {
    const date = new Date(postData.lastUpdateTime);
    text += `Last Updated: ${date.toLocaleString()}\n`;
  }
  
  if (postData.location) {
    text += `Location: ${postData.location}\n`;
  }
  
  text += '\n' + '-'.repeat(60) + '\n\n';
  
  // Description
  text += 'DESCRIPTION:\n';
  text += postData.description || '(No description)\n';
  text += '\n';
  
  // Hashtags
  if (postData.hashtags && postData.hashtags.length > 0) {
    text += 'HASHTAGS:\n';
    text += postData.hashtags.map(tag => `#${tag}`).join(' ') + '\n';
    text += '\n';
  }
  
  // Pinned comment
  if (postData.pinnedComment) {
    text += '-'.repeat(60) + '\n';
    text += 'PINNED COMMENT:\n';
    text += postData.pinnedComment.text || '(No text)\n';
    if (postData.pinnedComment.author) {
      text += `by ${postData.pinnedComment.author}\n`;
    }
    text += '\n';
  }
  
  // Statistics
  text += '-'.repeat(60) + '\n';
  text += 'STATISTICS:\n';
  text += `  ❤️  Likes: ${postData.stats.likes}\n`;
  text += `  ⭐ Collects: ${postData.stats.collects}\n`;
  text += `  💬 Comments: ${postData.stats.comments}\n`;
  text += `  🔗 Shares: ${postData.stats.shares}\n`;
  text += '\n';
  
  // Media info
  text += '-'.repeat(60) + '\n';
  text += 'MEDIA:\n';
  if (postData.images) {
    text += `  📷 Images: ${postData.images.length}\n`;
  }
  if (postData.video) {
    text += `  🎥 Video: Yes`;
    if (postData.video.duration) {
      text += ` (${formatDuration(postData.video.duration)})`;
    }
    text += '\n';
  }
  if (!postData.images && !postData.video) {
    text += '  (No media)\n';
  }
  
  text += '\n' + '='.repeat(60) + '\n';
  text += `Downloaded: ${new Date(postData.extractedAt).toLocaleString()}\n`;
  text += '='.repeat(60) + '\n';
  
  return text;
}

// Format duration in milliseconds to readable string
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Get file extension from URL
function getFileExtension(url) {
  if (!url) return 'jpg';
  
  // Try to extract from URL parameters
  const formatMatch = url.match(/format[=/]([a-zA-Z0-9]+)/);
  if (formatMatch) {
    const format = formatMatch[1].toLowerCase();
    const formatMap = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'webp': 'webp',
      'gif': 'gif'
    };
    return formatMap[format] || 'jpg';
  }
  
  // Try to extract from URL path
  const pathMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  if (pathMatch) {
    return pathMatch[1].toLowerCase();
  }
  
  return 'jpg'; // Default
}

// Sleep utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Listen for download completion events
chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state && downloadDelta.state.current === 'complete') {
    console.log('Download completed:', downloadDelta.id);
  }
});

console.log('RedNote Post Downloader background service worker initialized');
