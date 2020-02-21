
let currentTabQuery = { active: true, currentWindow: true};
let currentTab;
let settingsButton;
let actionButton;
let dumpArea;
let clearDumpButton;
let bg;

let dump = function (content) {
	dumpArea.innerHTML+=content;
	return dumpArea.innerHTML;
}

let clearDump = function (){
	dumpArea.innerHTML="";
	bg.dumpCache="";
}

let showUnmonitoredState = () => {
	actionButton.addEventListener('click', monitorCurrentTab, false);
	actionButton.textContent='Monitor this tab';
}

let showMonitoredState = () => {
	actionButton.addEventListener('click', unmonitorCurrentTab, false);
	actionButton.textContent='Stop monitoring this tab';
}

let monitorCurrentTab = () => {
	bg.monitorTab(currentTab.id);
	actionButton.removeEventListener('click', monitorCurrentTab);
	showMonitoredState();
}

let unmonitorCurrentTab = () => {
	bg.unmonitorTab(currentTab.id);
	actionButton.removeEventListener('click', unmonitorCurrentTab);
	showUnmonitoredState();
}

let openSettingsPage = async () => browser.runtime.openOptionsPage();

let init = async () => {
	actionButton = document.getElementById('action');
	dumpArea = document.getElementById('dump');
	clearDumpButton = document.getElementById('clear_dump');
	settingsButton = document.getElementById('settings');
	bg = await browser.runtime.getBackgroundPage();
	bg.usePopupDump = dump;
	currentTab = await browser.tabs.query(currentTabQuery).then(tabs => tabs[0]);
	if(bg.isMonitored(currentTab.id)) showMonitoredState();
	else showUnmonitoredState();
	dump(bg.dumpCache);
	settingsButton.addEventListener('click', openSettingsPage, false);
	clearDumpButton.addEventListener('click', clearDump, false);
}

document.addEventListener('DOMContentLoaded', init);
