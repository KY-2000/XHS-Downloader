// RedNote Post Downloader - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const downloadBtn = document.getElementById('downloadBtn');
  const imageFormatSelect = document.getElementById('imageFormat');
  
  let isValidPage = false;
  
  // Load saved settings
  const savedFormat = await chrome.storage.sync.get('imageFormat');
  if (savedFormat.imageFormat) {
    imageFormatSelect.value = savedFormat.imageFormat;
  }
  
  // Save settings when changed
  imageFormatSelect.addEventListener('change', async () => {
    await chrome.storage.sync.set({ imageFormat: imageFormatSelect.value });
  });
  
  // Check if current tab is a valid RedNote post page
  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url) {
        updateStatus('error', '❌ No active tab');
        return;
      }
      
      // Check if URL matches RedNote explore pages
      const isRedNotePage = tab.url.includes('xiaohongshu.com/explore/') || 
                           tab.url.includes('xiaohongshu.com/discovery/item/');
      
      if (!isRedNotePage) {
        updateStatus('error', '❌ Not a RedNote post page');
        downloadBtn.disabled = true;
        return;
      }
      
      // Send message to content script to verify page has post data
      chrome.tabs.sendMessage(tab.id, { action: 'checkPage' }, (response) => {
        if (chrome.runtime.lastError) {
          updateStatus('error', '❌ Content script not loaded');
          downloadBtn.disabled = true;
          return;
        }
        
        if (response && response.isValidPage) {
          isValidPage = true;
          updateStatus('ready', `✓ Ready to download (Post ID: ${response.noteId?.substring(0, 8)}...)`);
          downloadBtn.disabled = false;
        } else {
          updateStatus('error', '❌ No post data found on this page');
          downloadBtn.disabled = true;
        }
      });
      
    } catch (error) {
      console.error('Error checking tab:', error);
      updateStatus('error', '❌ Error: ' + error.message);
    }
  }
  
  // Update status display
  function updateStatus(type, message) {
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
  }
  
  // Handle download button click
  downloadBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !isValidPage) {
        updateStatus('error', '❌ Cannot download from this page');
        return;
      }
      
      // Update UI to show downloading state
      updateStatus('downloading', '⏳ Downloading... Please wait');
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<span class="spinner"></span>Downloading...';
      
      // Send message to content script to start download
      chrome.tabs.sendMessage(tab.id, { action: 'startDownload' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Message failed:', chrome.runtime.lastError);
          updateStatus('error', '❌ Download failed: ' + chrome.runtime.lastError.message);
          resetButton();
          return;
        }
        
        // Show success message
        updateStatus('success', '✓ Download started! Check your downloads folder');
        downloadBtn.innerHTML = '✓ Download Started';
        
        // Reset button after 3 seconds
        setTimeout(() => {
          resetButton();
        }, 3000);
      });
      
    } catch (error) {
      console.error('Download error:', error);
      updateStatus('error', '❌ Error: ' + error.message);
      resetButton();
    }
  });
  
  // Reset button to initial state
  function resetButton() {
    downloadBtn.disabled = !isValidPage;
    downloadBtn.innerHTML = 'Download This Post';
    if (isValidPage) {
      updateStatus('ready', '✓ Ready to download');
    }
  }
  
  // Listen for download status updates from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadProgress') {
      updateStatus('downloading', `⏳ Downloading... ${message.percent}%`);
    } else if (message.action === 'downloadComplete') {
      updateStatus('success', '✓ Download complete!');
      setTimeout(resetButton, 2000);
    } else if (message.action === 'downloadError') {
      updateStatus('error', '❌ Download failed: ' + message.error);
      resetButton();
    }
  });
  
  // Initial check when popup opens
  checkCurrentTab();
});
