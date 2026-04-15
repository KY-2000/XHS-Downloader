// RedNote Post Downloader - Content Script
// Injected into xiaohongshu.com explore pages

(function() {
  'use strict';

  console.log('RedNote Post Downloader extension loaded');

  // Extract post information from page's __INITIAL_STATE__
  function extractNoteInfo() {
    try {
      // Try primary location
      const data = window.__INITIAL_STATE__?.noteData?.data?.noteData;
      if (data) return data;
      
      // Try alternative location
      const regex = /\/explore\/([^?]+)/;
      const match = window.location.href.match(regex);
      if (match) {
        return window.__INITIAL_STATE__.note.noteDetailMap[match[1]].note;
      }
      
      console.error('Failed to extract note info from __INITIAL_STATE__');
      return null;
    } catch (error) {
      console.error('Error extracting note info:', error);
      return null;
    }
  }

  // Extract hashtags from description text
  function extractHashtags(description) {
    if (!description) return [];
    const hashtagRegex = /#([^#\s，。、！；：""''【】《》（）]+)/g;
    const matches = description.match(hashtagRegex) || [];
    return matches.map(tag => tag.substring(1)); // Remove the # symbol
  }

  // Generate downloadable image URL with format conversion
  function generateSingleImageUrl(imageItem) {
    try {
      const url = imageItem.urlDefault || imageItem.url;
      if (!url) return null;
      
      const regex = /http:\/\/sns-webpic-qc\.xhscdn.com\/\d+\/[0-9a-z]+\/(\S+)!/;
      const match = url.match(regex);
      
      if (match && match[1]) {
        const format = 'jpeg'; // Default format, can be configured
        return `https://ci.xiaohongshu.com/${match[1]}?imageView2/format/${format}`;
      }
      
      return url;
    } catch (error) {
      console.error('Error generating image URL:', error);
      return null;
    }
  }

  // Generate video download URL
  function generateVideoUrl(note) {
    try {
      // Try origin video key first
      const key = note.video?.consumer?.originVideoKey;
      if (key) return `https://sns-video-bd.xhscdn.com/${key}`;
      
      // Fallback to h265 stream
      const video = note.video?.media?.stream?.h265;
      if (video && video.length > 0) {
        return video[video.length - 1].masterUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating video URL:', error);
      return null;
    }
  }

  // Extract pinned comment from DOM
  function extractPinnedComment() {
    try {
      // Look for comment items
      const commentItems = document.querySelectorAll('[class*="comment"]');
      
      for (const comment of commentItems) {
        // Look for pinned badge indicators
        const text = comment.textContent || '';
        if (text.includes('置顶') || text.includes('pinned')) {
          // Extract comment text
          const commentText = comment.querySelector('[class*="content"], [class*="text"]')?.textContent 
            || comment.textContent;
          
          // Extract author
          const author = comment.querySelector('[class*="author"], [class*="user"]')?.textContent;
          
          return {
            text: commentText.trim(),
            author: author?.trim() || null,
            isPinned: true
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting pinned comment:', error);
      return null;
    }
  }

  // Sanitize filename for safe file creation
  function sanitizeFileName(name) {
    if (!name) return 'untitled';
    return name
      .replace(/[<>:"\/\\|?*]/g, '_')  // Remove invalid characters
      .replace(/\s+/g, '_')             // Replace spaces with underscores
      .substring(0, 100);               // Limit length
  }

  // Collect all post data
  function collectPostData() {
    const note = extractNoteInfo();
    if (!note) {
      console.error('No note data available');
      return null;
    }

    const pinnedComment = extractPinnedComment();
    const description = note.desc || note.description || '';
    
    const postData = {
      noteId: note.noteId,
      title: note.title || '',
      description: description,
      hashtags: extractHashtags(description),
      author: {
        nickname: note.user?.nickname || note.user?.nickName || '',
        userId: note.user?.userId || ''
      },
      publishTime: note.time || null,
      lastUpdateTime: note.lastUpdateTime || null,
      location: note.ipLocation || null,
      type: note.type || 'unknown',
      stats: {
        likes: note.interactInfo?.likedCount || '0',
        collects: note.interactInfo?.collectedCount || '0',
        comments: note.interactInfo?.commentCount || '0',
        shares: note.interactInfo?.shareCount || '0'
      },
      pinnedComment: pinnedComment,
      images: [],
      video: null,
      postUrl: window.location.href,
      extractedAt: new Date().toISOString()
    };

    // Extract images
    if (note.imageList && note.imageList.length > 0) {
      postData.images = note.imageList.map((img, idx) => ({
        index: idx + 1,
        url: generateSingleImageUrl(img),
        thumbnail: img.urlDefault || img.url || '',
        width: img.width || null,
        height: img.height || null
      })).filter(img => img.url !== null);
    }

    // Extract video
    if (note.type === 'video') {
      const videoUrl = generateVideoUrl(note);
      if (videoUrl) {
        postData.video = {
          url: videoUrl,
          duration: note.video?.media?.video?.duration || null
        };
      }
    }

    return postData;
  }

  // Initiate download by sending data to background script
  async function downloadCompletePost() {
    try {
      console.log('Starting post download...');
      
      const postData = collectPostData();
      if (!postData) {
        throw new Error('Failed to collect post data');
      }

      const fileName = sanitizeFileName(postData.title || postData.noteId);
      
      console.log('Sending download request to background script:', {
        fileName,
        imageCount: postData.images.length,
        hasVideo: !!postData.video
      });

      // Send to background script
      chrome.runtime.sendMessage({
        action: 'downloadPost',
        data: postData,
        fileName: fileName
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Message sending failed:', chrome.runtime.lastError);
        } else {
          console.log('Download initiated successfully');
        }
      });

    } catch (error) {
      console.error('Error in downloadCompletePost:', error);
      chrome.runtime.sendMessage({
        action: 'downloadError',
        error: error.message
      });
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startDownload') {
      downloadCompletePost();
      sendResponse({ status: 'initiated' });
    } else if (message.action === 'checkPage') {
      const note = extractNoteInfo();
      sendResponse({ 
        isValidPage: !!note,
        noteId: note?.noteId || null
      });
    }
  });

  // Make function available globally for popup to call
  window.startPostDownload = downloadCompletePost;

})();
