'use strict';
var dump = undefined;
var updateActionButtonState = undefined;
var refreshOptionsPageData = undefined;
var dumpCache = "";
let impostorsDBName = "IMPOSTORS";
let filesObjectStoreName = "IMPOSTORS_FILES";
let impostorsDBObj = undefined;
let definedTargetsKey = "DEFINED_TARGETS"
let definedTargetsObj = {};
let definedTargetsInitialized = false;
const monitoredTabsIds = new Set();

let usePopupDump = text => {
	if(dump!=undefined) return dump(text);
	else return dumpCache;
}

var storeImpostor = (URL,fileBytes) => {
	let request = window.indexedDB.open(impostorsDBName, 1);
	request.onupgradeneeded = e => {
		console.log("Creating database");
		impostorsDBObj = e.target.result;
		impostorsDBObj.onerror = e => console.log("such shit");
		impostorsDBObj.createObjectStore(filesObjectStoreName);
	}
	request.onsuccess = e => {
		impostorsDBObj = e.target.result;
		impostorsDBObj.onerror = e => console.log("such shit");
		let transaction = impostorsDBObj.transaction(filesObjectStoreName, "readwrite");
		let objectStore = transaction.objectStore(filesObjectStoreName);
		let addRequest = objectStore.add(fileBytes, URL);
		addRequest.onsuccess = e => console.log("file stored successfully");
	}
}

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

var addTarget = async (URL, impostorInfo) => {
	definedTargetsObj[URL] = impostorInfo;
	if(monitoredTabsExist()) listenToRequests();
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
	let text = details.tabId +" made a request to "+details.url;
	if(isMonitored(details.tabId)) text += '<br/>NOICE :)<br/><br/>'
	else text += '<br/>5ORDA!!!!!<br/><br/>';
	console.log(text);
	dumpCache = usePopupDump(text+'<br/>');
	return {};
}

let isListeningToRequests = () => browser.webRequest.onBeforeRequest.hasListener(monitorCallback);

let listenToRequests = async () => {
	if(!isListeningToRequests()){
		let definedURLs = await getDefinedURLs();
		let requestFilter = {'urls': definedURLs};
		browser.webRequest.onHeadersReceived.addListener(monitorCallback, requestFilter, ["responseHeaders"]);
	}
}

let stopListeningToRequests = () => browser.webRequest.onBeforeRequest.removeListener(monitorCallback);

var monitorTab = async tabId => {
	addMonitoredTab(tabId);
	if(definedTargetsExist()) listenToRequests();
	let text = 'registered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
	console.log(text);
	dumpCache=usePopupDump(text+'<br/>');
};

var unmonitorTab = tabId => {
	removeMonitoredTab(tabId);
	if(!monitoredTabsExist()) stopListeningToRequests();
	let text = 'unregistered '+tabId+' : '+JSON.stringify([...monitoredTabsIds]);
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