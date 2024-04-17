chrome.action.onClicked.addListener((tab) => {
	let newURL = chrome.runtime.getURL("app.html");
	chrome.tabs.create({ url: newURL });
});
