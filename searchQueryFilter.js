console.log("connected")

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
              addButtons()
          }
        }
    }
})
observer.observe(document, { childList: true, subtree: true });
function addButtons(){
    console.log("addButtonsTriggered")
    let CourseCards = document.getElementsByClassName("rc-DesktopSearchCard")
    for(let i = 0; i<CourseCards.length; i++){
        let saveForLaterButton = document.createElement("BUTTON")
        let notInterestedButton = generateRemoveButton()
        let alreadyCompletedButton  = document.createElement("BUTTON")
        saveForLaterButton.className = "saveButton"        
        alreadyCompletedButton.className = "completedButton"
        saveForLaterButton.innerHTML = "\u2764"
        notInterestedButton.innerHTML = "\u2716"
        alreadyCompletedButton.innerHTML = "\u2713"
        let buttonDiv = document.createElement("div")
        buttonDiv.className = "buttonDiv"
        buttonDiv.appendChild(alreadyCompletedButton)
        buttonDiv.appendChild(saveForLaterButton)
        buttonDiv.appendChild(notInterestedButton)
        CourseCards[i].appendChild(buttonDiv)
    }
}
function generateRemoveButton(){
    let notInterestedButton = document.createElement("BUTTON")
    notInterestedButton.className = "removeButton"
    notInterestedButton.addEventListener("click", getParentElement)
    return notInterestedButton;
}

function getParentElement(e){
    e.preventDefault()
    e.stopPropagation()
    console.log(e.target.parentNode.parentNode)
    e.target.parentNode.parentNode.remove()
}