'use strict';
var usePopupDump;
var updateActionButtonState = undefined;
var refreshOptionsPageData = undefined;
var dumpCache = "";
let definedTargetsKey = "DEFINED_TARGETS"
let definedTargetsObj = {};
let definedTargetsInitialized = false;
const monitoredTabsIds = new Set();

let isListeningToRequests = () => browser.webRequest.onBeforeRequest.hasListener(monitorCallback);

let listenToRequests = async () => {
	if(!isListeningToRequests()){
		let definedURLs = await getDefinedURLs();
		let requestFilter = {'urls': definedURLs};
		browser.webRequest.onBeforeRequest.addListener(monitorCallback, requestFilter);
	}
}

let stopListeningToRequests = () => browser.webRequest.onBeforeRequest.removeListener(monitorCallback);

let initializeDefinedTargets = async () => {
	let storedTargets = await browser.storage.local.get(definedTargetsKey);
	if(definedTargetsKey in storedTargets)
		definedTargetsObj = JSON.parse(storedTargets[definedTargetsKey]);
	else
		storeDefinedTargets();
	definedTargetsInitialized = true;
}

var getDefinedTargets = async () => {
	if(!definedTargetsInitialized) await initializeDefinedTargets();
	return definedTargetsObj;
}

var getDefinedURLs = async () => Object.keys(await getDefinedTargets());

var getNumberOfTargets = async () => (await getDefinedURLs()).length;

var definedTargetsExist = async () => (await getDefinedURLs()).length != 0;

let storeDefinedTargets = async () => {
	let storageObj = {};
	storageObj[definedTargetsKey]=JSON.stringify(definedTargetsObj);
	browser.storage.local.set(storageObj);
}

var addTarget = async (URL, localPath) => {
	definedTargetsObj[URL] = localPath;
	storeDefinedTargets();
}

var clearTargets = async () => {
	stopListeningToRequests()
	definedTargetsObj = {};
	storeDefinedTargets();
}

let definedTargetsChanged = (changes, areaName) => {
	if (areaName == "local" && (definedTargetsKey in changes)){
		if (updateActionButtonState!=undefined) updateActionButtonState();
		if (refreshOptionsPageData!=undefined) refreshOptionsPageData();
	}
}

let monitorCallback = async details => {
	text = details.tabId +" made a request to "+details.url;
	if(isMonitored(details.tabId)) text += '<br/>NOICE :)<br/><br/>'
	else text += '<br/>5ORDA!!!!!<br/><br/>';
	console.log(text);
	dumpCache = usePopupDump(text+'<br/>');
	return {};
}

var monitorTab = async tabId => {
	addMonitoredTab(tabId);
	listenToRequests()
	text = 'registered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
	console.log(text);
	dumpCache=usePopupDump(text+'<br/>');
};

var unmonitorTab = tabId => {
	removeMonitoredTab(tabId);
	if(!monitoredTabsExist()) stopListeningToRequests();
	text = 'unregistered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
	console.log(text);
	dumpCache=usePopupDump(text+'<br/>');
};

var isMonitored = tabId => monitoredTabsIds.has(tabId);

let addMonitoredTab = tabId =>  monitoredTabsIds.add(tabId);

let removeMonitoredTab = tabId =>  monitoredTabsIds.delete(tabId);

let monitoredTabsExist = () => monitoredTabsIds.size!=0;

let tabRemoved = (tabId, removeInfo) => {
	if(isMonitored(tabId)) unmonitorTab(tabId);
}


browser.tabs.onRemoved.addListener(tabRemoved);
browser.storage.onChanged.addListener(definedTargetsChanged);