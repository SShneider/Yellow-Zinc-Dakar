console.log("connected")
const ButtonAnchor = document.getElementsByClassName("rc-NumberOfResultsSection")
const AppButton = document.createElement("BUTTON")

AppButton.innerHTML = "Start Filtering"
AppButton.id = "searchQueryToggleButton"
AppButton.addEventListener("click", addButtons)
document.body.appendChild(AppButton)

function addButtons(){
    console.log("addButtonsTriggered")
    let CourseCards = document.getElementsByClassName("rc-DesktopSearchCard")
    for(let i = 0; i<CourseCards.length; i++){
        CourseCards[i].style.backgroundColor = "black"
    }
}