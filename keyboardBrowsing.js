




// on ctrl down
//                                                                <---
    // get elements in selected area (first is the whole screen)     |
    // find the closest to the center                                |
    // mark it as selected                                           |
//                                                                   |
    // listen for further                                            |
    // if arrow input                                                |
    // redefine selected area and  -----------------------------------

    // if enter
    // click selected


let ctrlDown = false;
let bothDown = false;
let selectedElementProps = {
    element: null,
    backgroundColor: null
};
let selectionArea = {top: 0, left: 0, height: window.innerHeight, width: document.body.clientWidth};

let selectionAreaOutlineDiv = document.createElement("div");
selectionAreaOutlineDiv.style.display = "none";
selectionAreaOutlineDiv.style.position = "fixed";
selectionAreaOutlineDiv.style.zIndex = 99999999;
selectionAreaOutlineDiv.style.border = "5px dotted blue";
selectionAreaOutlineDiv.style.boxSizing = "border-box";
selectionAreaOutlineDiv.style.backgroundImage = "url('http://127.0.0.1/devider.svg')";
selectionAreaOutlineDiv.style.backgroundPosition = "center";
selectionAreaOutlineDiv.style.backgroundSize = "cover";
document.body.appendChild(selectionAreaOutlineDiv);
updateSelectionAreaDiv();


document.onkeydown = (event) => {

	var evtobj = window.event? event : e
	console.log("onkeydown: " + evtobj.keyCode);
    
    
    if(evtobj.keyCode == 17){// Ctrl key
        ctrlDown = true;
    }
    if(evtobj.keyCode == 60){// Grater than key
        if(ctrlDown){

            // Call it only once per press (onkeydown gets constantly called when key is pressed down)
            if(bothDown == false){

                bothDown = true;
                selectionAreaOutlineDiv.style.display = "block";

                console.log("start");

                
                // On both down
                let elementsInArea = getElementsInSelectedArea(selectionArea);
                let closest = findClosesToTheCenter(elementsInArea, selectionArea);
                makrAsSelected(closest);

                console.log("end");
            }
        }
    }

    if(bothDown){

        //window.scrollTo(0, 0);

        if(evtobj.keyCode == 37){ // Left
            console.log("arrow left");

            changeSelectionArea("left");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; //overwrites default behaviour
        }
        if(evtobj.keyCode == 38){ // Up
            console.log("arrow up");

            changeSelectionArea("up");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; //overwrites default behaviour
        }
        if(evtobj.keyCode == 39){ // Right
            console.log("arrow right");

            changeSelectionArea("right");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; //overwrites default behaviour
        }
        if(evtobj.keyCode == 40){ // Down
            console.log("arrow down");

            changeSelectionArea("down");
            let elementsInArea = getElementsInSelectedArea(selectionArea);
            let closest = findClosesToTheCenter(elementsInArea, selectionArea);
            makrAsSelected(closest);

            return false; //overwrites default behaviour
        }


        if(evtobj.keyCode == 13){ // Enter
            console.log("enter");

            if(selectedElementProps.element != null){
                selectedElementProps.element.click();
            }else{
                document.elementFromPoint(selectionArea.left+selectionArea.width/2, selectionArea.top+selectionArea.height/2).click();
                console.log("clicked at location");
            }
            
            return false; //overwrites default behaviour
        }

    }



}

document.onkeyup = (event) => {

	var evtobj = window.event? event : e

    if(evtobj.keyCode == 17){
        
    }
    if(evtobj.keyCode == 60){
        //bothDown = false;
        ctrlDown = false;
        bothDown = false; // Put it in here because keyboard couldnt handle 3 keys down (but only with arrow down key idk why)
        selectionAreaOutlineDiv.style.display = "none";

        // Reset reviously selected elements bg color
        if(selectedElementProps.element != null){
            selectedElementProps.element.style.backgroundColor = selectedElementProps.backgroundColor;
            console.log("recolored");
        }
        //reset selection area
        selectedElementProps = {
            element: null,
            backgroundColor: null
        };
        selectionArea = {top: 0, left: 0, height: window.innerHeight, width: document.body.clientWidth};
        updateSelectionAreaDiv();
    }
    
}


function getElementsInSelectedArea(area){
    
    let allClickableElements = document.querySelectorAll('a,button');
 
    let elementsInArea = [];

    
    // Exclude all elements whos cetner is outside the selection area
    for(let i=0; i < allClickableElements.length; i++){

        let element = allClickableElements[i];

        let rect = element.getBoundingClientRect();

        let cp = { // CenterPosition
            x: rect.x + (rect.width/2),
            y: rect.y + (rect.height/2)
        }

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

    console.log("returning elements in the area: " + elementsInArea.length); 
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

    console.log("returning closest element: " + closestElement);
    console.log(closestElement);
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