let targetCountSpan;
let URLpatternTag;
let impostorTag;
let addTargetButton;
let targetsTableBody;
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
    targetsTableBody.textContent="";
    let targets = await bg.getDefinedTargets();
    for(const URLpattern in targets){
        let impostorPath = targets[URLpattern];
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        td1.textContent = URLpattern
        tr.appendChild(td1);
        let td2 = document.createElement('td');
        td2.textContent = impostorPath;
        tr.appendChild(td2);
        targetsTableBody.appendChild(tr);
    }
}

let init = async () => {
    bg = await browser.runtime.getBackgroundPage();
    
    targetCountSpan = document.getElementById("targetCount");
    URLpatternTag = document.getElementById("URLpattern");
    impostorTag = document.getElementById("ImpostorPath");
    addTargetButton = document.getElementById("addTarget");
    targetsTableBody = document.getElementById("TargetsTable").getElementsByTagName("tbody")[0];
    
    
    addTargetButton.addEventListener("click", addTarget);

    refreshData();
}

document.addEventListener('DOMContentLoaded', init);