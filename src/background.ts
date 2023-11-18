chrome.action.onClicked.addListener((tab) => {
    debugger;
    chrome.scripting.executeScript({
        target: { tabId: tab.id || 0 }, // Provide a default value of 0 for tabId
        files: ["content-script.js"]
    });
});

chrome.runtime.onMessage.addListener((request) => {
    const csvData = request.join("\n");
    const obj: chrome.downloads.DownloadOptions = {
        filename: "deals.csv",
        url: 'data:application/text;charset=utf-8,' + encodeURIComponent(csvData),
        conflictAction: "prompt",
        saveAs: true
    };
    chrome.downloads.download(obj);
});