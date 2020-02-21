let targetCountSpan;
let URLpatternTag;
let impostorTag;
let addTargetButton;
let bg;

// TODO
let isURLvalid = (URL) => true;
let isPathValid = (URL) => true;

let addTarget = async () =>{
    let URL = URLpatternTag.value;
    let path = impostorTag.value;
    if(!(isURLvalid(URL) && isPathValid(path))) return;
    await bg.addTarget(URL, path);
    refreshData();
}

var refreshData = async () => {
    targetCountSpan.textContent = await bg.getNumberOfTargets();
}

let init = async () => {
    bg = await browser.runtime.getBackgroundPage();
    
    targetCountSpan = document.getElementById("targetCount");
    URLpatternTag = document.getElementById("URLpattern");
    impostorTag = document.getElementById("ImpostorPath");
    addTargetButton = document.getElementById("addTarget");
    
    
    addTargetButton.addEventListener("click", addTarget);

    refreshData();
}

document.addEventListener('DOMContentLoaded', init);