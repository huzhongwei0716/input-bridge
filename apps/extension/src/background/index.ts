console.log('InputBridge Background Service Worker Running');

chrome.runtime.onInstalled.addListener(() => {
    console.log('InputBridge installed');
});
