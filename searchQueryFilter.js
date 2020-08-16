
console.log("connected")
const SQstorage = window.localStorage
let savedSettings = {
    removed:{},
    saved:{},
    done:{},
};
pageInitialization()
function pageInitialization(){
    loadData();
    startUp();
}
function loadData(){
    try{
        const storageValue = JSON.parse(SQstorage.getItem("OMRCourseraSQ"))
        if(storageValue) savedSettings = {...storageValue}
    }
    catch{
        SQstorage.removeItem("OMRCourseraSQ")
    }
}
function startUp(){
    let CourseCards = document.getElementsByClassName("rc-DesktopSearchCard")
    addButtons(CourseCards)
    filterResults(CourseCards)
}
function filterResults(CourseCards){
    // console.log("filterResults Triggered")
    // console.log(savedSettings)
    // console.log(CourseCards)
    const cardsToRemove = [];
    for (let i = 0; i<CourseCards.length; i++){
        // console.log(CourseCards[i].href)
        if(CourseCards[i].href in savedSettings.removed || CourseCards[i].href in savedSettings.done || CourseCards[i].href in savedSettings.saved){
            cardsToRemove.push(CourseCards[i])
        }
    }
    for(let i = 0; i<cardsToRemove.length; i++){
        cardsToRemove[i].remove();
    }
}

const observer = new MutationObserver(mutations => {
    //console.log(mutations)
    for(let mutation of mutations){
        console.log(mutation.target.className)
        if(mutation.target.className === "filters-section horizontal-box" ){
            startUp();
           break;
          }
        // for (let addedNode of mutation.addedNodes){
           
        //   if(addedNode.className == "rc-Suggestion" ){
        //     startUp();
        //   }
        // }
    }
})
observer.observe(document, { childList: true, subtree: true });
function addButtons(CourseCards){
    console.log("addButtonsTriggered")
    for(let i = 0; i<CourseCards.length; i++){
        let buttonDiv = createButtonDiv()
        CourseCards[i].appendChild(buttonDiv)
    }
}
function createButtonDiv(){
    let saveForLaterButton = generateSaveForLater()
    let notInterestedButton = generateNotInterestedButton()
    let alreadyCompletedButton  = generateAlreadyCompletedButton()
    let buttonDiv = document.createElement("div")
    buttonDiv.className = "buttonDiv"
    buttonDiv.appendChild(alreadyCompletedButton)
    buttonDiv.appendChild(saveForLaterButton)
    buttonDiv.appendChild(notInterestedButton)
    return buttonDiv
}

function processFilterButtons(e, sourceIn){
    e.preventDefault()
    e.stopPropagation()
    const parentElement = getParentElement(e)
    saveToLocalStorage(parentElement.href, sourceIn)
    parentElement.remove()
}

/*FILTER BUTTON GENERATORS START*/
function generateSaveForLater(){
    let saveForLaterButton = document.createElement("BUTTON")
    saveForLaterButton.className = "saveButton"        
    saveForLaterButton.innerHTML = "\u2764"
    saveForLaterButton.addEventListener("click", ()=>{processFilterButtons(event, "saved")})
    return saveForLaterButton;
}
function generateNotInterestedButton(){
    let notInterestedButton = document.createElement("BUTTON")
    notInterestedButton.className = "removeButton"
    notInterestedButton.innerHTML = "\u2716"
    notInterestedButton.addEventListener("click", ()=>{processFilterButtons(event, "removed")})
    return notInterestedButton;
}
function generateAlreadyCompletedButton(){
    let alreadyCompletedButton  = document.createElement("BUTTON")
    alreadyCompletedButton.className = "completedButton"
    alreadyCompletedButton.innerHTML = "\u2713"
    alreadyCompletedButton.addEventListener("click", ()=>{processFilterButtons(event, "done")})
    return alreadyCompletedButton
}
/*FILTER BUTTON GENERATORS END*/
function getParentElement(e){
    console.log(e.target.parentNode.parentNode)
    return e.target.parentNode.parentNode
}

function saveToLocalStorage(payloadIn, typeIn){
    if(!savedSettings[typeIn][payloadIn]) savedSettings[typeIn][payloadIn] = 1;
    SQstorage.setItem("OMRCourseraSQ", JSON.stringify(savedSettings))
}