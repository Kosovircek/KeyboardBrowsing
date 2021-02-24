
document.addEventListener('keypress', (event)=>{
	console.log("key: " + event.code);

	if(event.code == "KeyA"){
	
		let elements = document.getElementsByTagName("a");
		console.log("elements");
		console.log(elements);
		pointToNearest([500,0], elements);


	}
});


function pointToNearest(pointerPos, elementList){

	let nearest = {
		id: null,
		dist: null,
		pos: null
	}
	let firstCheck = true;	

	//Find the nearest element in the array to the pointing position
	for(let i=0; i < elementList.length; i++){
	
		let elRect = elementList[i].getBoundingClientRect();
		let elPos = [elRect.left+window.scrollX, elRect.top+window.scrollY];

		let dist = calDist(pointerPos, elPos);

		let closer = false;

		if(firstCheck){ //Beacuse the default values are null
			closer = true;
			firstCheck = false;
		}
		else{
			if(dist < nearest.dist){ //Check the new element is close than the last 
				closer = true;
			}
		}

		//Change nearest if closer
		if(closer){
			console.log("its closer " + nearest.dist + " > " + dist);
			nearest.id = elementList[i].id; 
			nearest.dist = dist;
			nearest.pos = elPos;
		}

	}	

	//Point to the closest element with the overlay graphics pointer
	if(nearest.pos != null){
		renderPointer(nearest.pos);
	}

	//border the element
	document.getElementById(nearest.id).style.border = "20px soild blue";

}

function calDist(p1, p2){
	return Math.hypot(p2[0]-p1[0], p2[1]-p1[1]);
}

function renderPointer(position){
	let pointer = document.getElementById("overlayPointer");

	if(pointer == null){
		pointer = document.createElement("div");
		pointer.id = "overlayPointer"
		pointer.style.position = "absolute";
		pointer.style.width = "10px";
		pointer.style.height = "10px";
		pointer.style.zIndex = "99999999";
		pointer.style.backgroundColor = "red";

		document.body.appendChild(pointer);
	}

	pointer.style.left = position[0] + "px";
	pointer.style.top = position[1] + "px";	
}
