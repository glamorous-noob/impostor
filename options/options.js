'use strict';
let targetCountSpan;
let URLpatternTag;
let impostorTag;
let addTargetButton;
let clearTargetsButton;
let targetsTableBody;
let bg;

let storeImpostor = (URL,fileObj) => {
    let fr = new FileReader();
    fr.onload = e => {
        let fileBytes = e.target.result;
        bg.storeImpostor(URL, fileBytes);
    }
    fr.readAsBinaryString(fileObj);
}

// TODO
let isURLvalid = URL => true;

let addTarget = async () =>{
    let URL = URLpatternTag.value;
    let impostorInfo = impostorTag.files[0].name
    if(!isURLvalid(URL)) return;
    storeImpostor(URL, impostorTag.files[0]);
    await bg.addTarget(URL, impostorInfo);
}

let clearTargets = async () => bg.clearTargets();

let createTableRow = async (URLpattern, impostorInfo) => {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    td1.textContent = URLpattern;
    tr.appendChild(td1);
    let td2 = document.createElement('td');
    td2.textContent = impostorInfo;
    tr.appendChild(td2);
    return tr;
}

var refreshData = async () => {
    targetCountSpan.textContent = await bg.getNumberOfTargets();
    targetsTableBody.textContent="";
    let targets = await bg.getDefinedTargets();
    for(const URLpattern in targets){
        let impostorInfo = targets[URLpattern];
        let tr = createTableRow(URLpattern, impostorInfo);
        targetsTableBody.appendChild(tr);
    }
}

let init = async () => {
    targetCountSpan = document.getElementById("targetCount");
    URLpatternTag = document.getElementById("URLpattern");
    impostorTag = document.getElementById("Impostor");
    addTargetButton = document.getElementById("addTarget");
    clearTargetsButton = document.getElementById("clearTargets");
    targetsTableBody = document.getElementById("TargetsTable").getElementsByTagName("tbody")[0];
    
    bg = await browser.runtime.getBackgroundPage();
    bg.refreshOptionsPageData = refreshData;

    addTargetButton.addEventListener("click", addTarget);
    clearTargetsButton.addEventListener('click', clearTargets);

    refreshData();
}

let cleanForeignReferences = () => {
    bg.refreshOptionsPageData = undefined;
    bg = undefined;
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('unload', cleanForeignReferences);