chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id || 0 }, // Provide a default value of 0 for tabId
            files: ["content-script.js"]
        });});

