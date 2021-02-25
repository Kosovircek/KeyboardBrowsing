
// on ctrl and > down
//                                                                <---
    // get elements in selected area (first is the whole screen)     |
    // find the closest to the center                                |
    // mark it as selected                                           |
//                                                                   |
    // listen for further                                            |
        // if arrow input                                            |
        // redefine selected area and  -------------------------------

        // if enter
        // click selected


let ctrlDown = false;
let bothDown = false;
let selectedElementProps = { // Sotres selected element and its orginal background color so you can change it back when it is unselected
    element: null,
    backgroundColor: null
};
let selectionArea = {top: 0, left: 0, height: window.innerHeight, width: document.body.clientWidth}; // This are the bounds where on screen we want to search for elements

// Overlay seen when pressing ctrl + >
let selectionAreaOutlineDiv = document.createElement("div");
selectionAreaOutlineDiv.style.display = "none";
selectionAreaOutlineDiv.style.position = "fixed";
selectionAreaOutlineDiv.style.zIndex = 99999999;
selectionAreaOutlineDiv.style.border = "5px dotted blue";
selectionAreaOutlineDiv.style.boxSizing = "border-box";
selectionAreaOutlineDiv.style.backgroundImage = "url('http://127.0.0.1/devider.svg')"; // Todo(): host the image on a server
selectionAreaOutlineDiv.style.backgroundPosition = "center";
selectionAreaOutlineDiv.style.backgroundSize = "cover";
document.body.appendChild(selectionAreaOutlineDiv);
updateSelectionAreaDiv();


document.onkeydown = (event) => {

	var evtobj = window.event? event : e    
    
    // Extention only starts working when both ctrl and > keys are pressed down at the same time (but you can let go of ctrl after that)
    if(evtobj.keyCode == 17){// Ctrl key
        ctrlDown = true;
    }
    if(evtobj.keyCode == 60){// Grater than key >
        if(ctrlDown){

            // Call it only once per press (onkeydown gets constantly called when key is pressed down)
            if(bothDown == false){

                bothDown = true;

                // Show selection area overlay
                selectionAreaOutlineDiv.style.display = "block"; 
                
                // On both down start the extention functionality
                let elementsInArea = getElementsInSelectedArea(selectionArea);
                let closest = findClosesToTheCenter(elementsInArea, selectionArea);
                makrAsSelected(closest);

            }
        }
    }

    // Arrow keys are used to shrink selection area (half it in direction of the arrow)
    if(bothDown){

        if(evtobj.keyCode == 37){ // Left

            changeSelectionArea("left");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; // Hopped it overwrites defailut key down behaviour, bur it doesnt ....
        }
        if(evtobj.keyCode == 38){ // Up

            changeSelectionArea("up");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; 
        }
        if(evtobj.keyCode == 39){ // Right

            changeSelectionArea("right");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; 
        }
        if(evtobj.keyCode == 40){ // Down

            changeSelectionArea("down");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; 
        }

        // If you click enter click on selected element (or click on x,y position of center of selection area on screen if no element is selected)
        if(evtobj.keyCode == 13){ // Enter

            if(selectedElementProps.element != null){
                if(selectedElementProps.element.tagName == "INPUT"){
                    selectedElementProps.element.focus();
                    console.log("focused");
                }
                else{
                    selectedElementProps.element.click();
                }
            }else{
                selectionAreaOutlineDiv.style.display = "none";
                document.elementFromPoint(selectionArea.left+selectionArea.width/2, selectionArea.top+selectionArea.height/2).click();
            }
            
            return false;
        }

    }



}

// Hide selection area overlay and reset all the parameters so it starts fresh when you click ctrl+> again later
document.onkeyup = (event) => {

	var evtobj = window.event? event : e

    if(evtobj.keyCode == 17){
        
    }
    if(evtobj.keyCode == 60){

        ctrlDown = false;
        bothDown = false; // Put it in here because keyboard couldnt handle 3 keys down (but only with arrow down key idk why)
        selectionAreaOutlineDiv.style.display = "none";

        // Reset reviously selected elements bg color
        if(selectedElementProps.element != null){
            selectedElementProps.element.style.backgroundColor = selectedElementProps.backgroundColor;
        }
        //reset selection area end selected element
        selectedElementProps = {
            element: null,
            backgroundColor: null
        };
        selectionArea = {top: 0, left: 0, height: window.innerHeight, width: document.body.clientWidth};
        updateSelectionAreaDiv();
    }
    
}


function getElementsInSelectedArea(area){
    
    let allClickableElements = document.querySelectorAll('a,button,paper-tab,input');
 
    let elementsInArea = [];

    // Exclude all elements whos cetner is outside the selection area
    for(let i=0; i < allClickableElements.length; i++){

        let element = allClickableElements[i];

        let rect = element.getBoundingClientRect();

        let cp = { // CenterPosition of element
            x: rect.x + (rect.width/2),
            y: rect.y + (rect.height/2)
        }

        // If element center is within the selection area add it to elementsInArray array
        if(cp.x > area.left && cp.x < (area.left+area.width) && cp.y > area.top && cp.y < (area.top+area.height)){
            elementsInArea.push(
                {
                    elem: element,
                    x: cp.x,
                    y: cp.y
                }
            );
        }
    }

    return elementsInArea;    
}

function findClosesToTheCenter(elements, area){

    let areaCenter = {
        x: area.left + (area.width/2),
        y: area.top + (area.height/2)
    }

    let closestElement = null;

    let closestDist = 99999999;

    for(let i=0; i < elements.length; i++){

        let element = elements[i];

        let distance = Math.hypot(element.x-areaCenter.x, element.y-areaCenter.y);

        if(distance < closestDist){
            closestElement = element.elem;
            closestDist = distance;
        }
    }

    return closestElement;
}

function makrAsSelected(element){

    // Reset reviously selected elements bg color
    if(selectedElementProps.element != null){
        selectedElementProps.element.style.backgroundColor = selectedElementProps.backgroundColor;
    }

    // Save new elements bg color
    selectedElementProps.element = element;
    selectedElementProps.backgroundColor = element.style.backgroundColor;
    // Recolor new selected element
    element.style.backgroundColor = "red";

}


function changeSelectionArea(direction){

    if(direction == "up"){
        selectionArea.height = selectionArea.height/2;
    }
    if(direction == "right"){
        selectionArea.left += selectionArea.width/2;
        selectionArea.width = selectionArea.width/2;
    }
    if(direction == "down"){
        selectionArea.top += selectionArea.height/2;
        selectionArea.height = selectionArea.height/2;
    }
    if(direction == "left"){
        selectionArea.width = selectionArea.width/2;
    }

    updateSelectionAreaDiv();
}

function updateSelectionAreaDiv(){
    selectionAreaOutlineDiv.style.top = selectionArea.top+"px";
    selectionAreaOutlineDiv.style.left = selectionArea.left+"px";
    selectionAreaOutlineDiv.style.width = selectionArea.width+"px";
    selectionAreaOutlineDiv.style.height = selectionArea.height+"px";
}