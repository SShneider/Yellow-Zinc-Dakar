console.log("connected")
const SQstorage = window.localStorage

let savedSettings = {
    removed:{},
    saved:{},
    done:{},
};
pageInitialization()
function pageInitialization(){
    try{
        const storageValue = JSON.parse(SQstorage.getItem("OMRCourseraSQ"))
        if(storageValue) savedSettings = {...storageValue}
    }
    catch{
        SQstorage.removeItem("OMRCourseraSQ")
    }
}

function filterResults(CourseCards){
    console.log("filterResults Triggered")
    console.log(savedSettings)
    for (let i = 0; i<CourseCards.length; i++){
        console.log(CourseCards[i].href)
        if(CourseCards[i].href in savedSettings.saved){
           
            CourseCards[i].parentNode.style.border = "8px solid green"
        }
    }
}

// function generateFilterButton(){
//     const AppButton = document.createElement("BUTTON")
//     AppButton.innerHTML = "Start Filtering"
//     AppButton.id = "searchQueryToggleButton"
//     AppButton.addEventListener("click", addButtons)
//     let buttonAnchor = document.getElementsByClassName("rc-NumberOfResultsSection")
//     buttonAnchor[0].appendChild(AppButton)
// }
const observer = new MutationObserver(mutations => {
    for(let mutation of mutations){
        for (let addedNode of mutation.addedNodes){
          if(addedNode.className == "rc-CourseraPlusSearchFilterOption"){
              //generateFilterButton()
              let CourseCards = document.getElementsByClassName("rc-DesktopSearchCard")
              addButtons(CourseCards)
              filterResults(CourseCards)
          }
        }
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


function saveForLater(e){
    const parentElement = getParentElement(e)
    parentElement.parentNode.style.border = "8px solid green"
    //parentElement.style.backgroundColor = "green"
    saveToLocalStorage(parentElement.href, "saved")

}
function notInterested(e){
    return 0
}
function alreadyCompleted(e){
    return 0
}
/*FILTER BUTTON GENERATORS START*/
function generateSaveForLater(){
    let saveForLaterButton = document.createElement("BUTTON")
    saveForLaterButton.className = "saveButton"        
    saveForLaterButton.innerHTML = "\u2764"
    saveForLaterButton.addEventListener("click", saveForLater)
    return saveForLaterButton;
}
function generateNotInterestedButton(){
    let notInterestedButton = document.createElement("BUTTON")
    notInterestedButton.className = "removeButton"
    notInterestedButton.innerHTML = "\u2716"
    notInterestedButton.addEventListener("click", notInterested)
    return notInterestedButton;
}
function generateAlreadyCompletedButton(){
    let alreadyCompletedButton  = document.createElement("BUTTON")
    alreadyCompletedButton.className = "completedButton"
    alreadyCompletedButton.innerHTML = "\u2713"
    alreadyCompletedButton.addEventListener("click", alreadyCompleted)
    return alreadyCompletedButton
}
/*FILTER BUTTON GENERATORS END*/
function getParentElement(e){
    e.preventDefault()
    e.stopPropagation()
    console.log(e.target.parentNode.parentNode)
    return e.target.parentNode.parentNode
}

function saveToLocalStorage(payloadIn, typeIn){
    if(!savedSettings[typeIn][payloadIn]) savedSettings[typeIn][payloadIn] = 1;
    SQstorage.setItem("OMRCourseraSQ", JSON.stringify(savedSettings))
}