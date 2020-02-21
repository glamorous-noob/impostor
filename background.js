var usePopupDump;
var dumpCache = "";

const monitoredTabsIds = new Set();

var getDefinedTargets = async () => browser.storage.local.get(null)

var getNumberOfTargets = async () => {
	let targets = await getDefinedTargets();
	return Object.keys(targets).length;
}

var addTarget = async (URL, localPath) => {
	currentTargets = await getDefinedTargets();
	keyvalue={};
	keyvalue[URL]=localPath;
	await browser.storage.local.set(keyvalue);
}

let monitorCallback = async details => {
	text = details.tabId +" made a request to "+details.url;
	if(isMonitored(details.tabId)) text += '<br/>NOICE :)<br/><br/>'
	else text += '<br/>5ORDA!!!!!<br/><br/>';
	console.log(text);
	dumpCache = usePopupDump(text+'<br/>');
	return {};
}

var monitorTab = tabId => {
	addMonitoredTab(tabId);
	if(!browser.webRequest.onBeforeRequest.hasListener(monitorCallback)){
		let requestFilter = {'urls': ['<all_urls>']};
		browser.webRequest.onBeforeRequest.addListener(monitorCallback, requestFilter);
	}
	text = 'registered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
	console.log(text);
	dumpCache=usePopupDump(text+'<br/>');
};

var unmonitorTab = tabId => {
	removeMonitoredTab(tabId);
	if(noMonitoredTabs()) browser.webRequest.onBeforeRequest.removeListener(monitorCallback);
	text = 'unregistered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
	console.log(text);
	dumpCache=usePopupDump(text+'<br/>');
};

var isMonitored = tabId => monitoredTabsIds.has(tabId);

let addMonitoredTab = tabId =>  monitoredTabsIds.add(tabId);

let removeMonitoredTab = tabId =>  monitoredTabsIds.delete(tabId);

let noMonitoredTabs = () => monitoredTabsIds.size==0;

let tabRemoved = (tabId, removeInfo) => {
	if(isMonitored(tabId)) unmonitorTab(tabId);
}


browser.tabs.onRemoved.addListener(tabRemoved);