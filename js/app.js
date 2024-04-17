const $container = document.getElementById('urlContainer');
const $h2 = document.querySelector('h2.tabCount');
const $timestamp = document.querySelector('p.timestamp');

const getTimeStamp = () => {
	const date = new Date();
	let h = String(date.getHours()).padStart(2, '0');
	let m = String(date.getMinutes()).padStart(2, '0');
	let s = String(date.getSeconds()).padStart(2, '0');
	let tzdiff = date.getTimezoneOffset() / 60;
	let offset = String(tzdiff).padStart(2, '0');
	tzdiff = tzdiff * -1;
	let timestr = h + ':' + m;
	// timestr += tzdiff < 0 ? '-' : '+';
	// timestr += offset;
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const YYYY = date.getFullYear();
	return `${YYYY}-${mm}-${dd} ${timestr}`;
};

const getGroupFromId = (groups, id) => {
	if (id === chrome.tabGroups.TAB_GROUP_ID_NONE) {
		return null;
	}
	return groups.find((g) => g.id == id);
};

const getTabsList = (tabWindow, currentTab, tabGroups, tabs) => {
	return tabs
		.filter((t) => t.id !== currentTab.id)
		.map((t) => {
			const group = getGroupFromId(tabGroups, t.groupId);
			return `<li
				is="opentab-link"
				data-tabid="${t.id}"
				data-windowid="${tabWindow.id}"
				data-groupcolor="${group?.color}"
				data-group="${group?.title}"
				data-tabtitle="${t.title}">${t.url}</li>`;
		})
		.join('');
};

window.addEventListener('load', async () => {
	const currentTab = await chrome.tabs.getCurrent();
	const tabGroups = await chrome.tabGroups.query({});
	const allWindows = await chrome.windows.getAll({ populate: true });
	// - 1 because we don't want to count the extension one!
	const tabCount = allWindows.map((t) => t.tabs.length).reduce((a, b) => a + b, 0) - 1;
	const windowCount = allWindows.length;
	const windowLists = allWindows.map((w) => {
		const tabContent = getTabsList(w, currentTab, tabGroups, w.tabs);
		const result = `<ul class='openWindow'>${tabContent}</ul>`;
		return result;
	});

	$timestamp.textContent = getTimeStamp();
	$h2.textContent = `${tabCount} tabs | ${windowCount} windows`;
	$container.innerHTML = windowLists.join('');
});
