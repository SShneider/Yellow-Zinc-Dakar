const pageNum = (function(uriIn) {
    if (uriIn == "") return 0;
    if(uriIn.length == 0) return 0;
    else if(uriIn[0].indexOf("page")===-1) return 0
    else return uriIn[0][5]
})(window.location.search.substr(1).split('&'));


function fetchData(){
    fetch("https://lua9b20g37-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Breact-instantsearch%205.2.3%3BJS%20Helper%202.26.1&x-algolia-application-id=LUA9B20G37&x-algolia-api-key=dcc55281ffd7ba6f24c3a9b18288499b", {
        "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
        },
        "referrer": "https://www.coursera.org/search?query=python&",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `{\"requests\":[{\"indexName\":\"DO_NOT_DELETE_PLACEHOLDER_INDEX_NAME\",\"params\":\"query=&page=${pageToGet}&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&optionalFilters=query%3AEMPTY_QUERY&facets=%5B%5D&tagFilters=\"},{\"indexName\":\"prod_all_products_term_optimization\",\"params\":\"query=&hitsPerPage=15&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&optionalFilters=query%3AEMPTY_QUERY&ruleContexts=%5B%22en%22%5D&facets=%5B%5D&tagFilters=\"},{\"indexName\":\"test_suggestions\",\"params\":\"query=&hitsPerPage=7&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&optionalFilters=query%3AEMPTY_QUERY&facets=%5B%5D&tagFilters=\"}]}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    }).then(function (response){
        response.json().then(function(data) {
            console.log(data);
    })})
}
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
    const cardsToRemove = [];
    for (let i = 0; i<CourseCards.length; i++){
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
       // console.log(mutation.target.className)
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