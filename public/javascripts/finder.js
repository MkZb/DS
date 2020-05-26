/**
 *Getting information about the player from the server
 *
 *@constructor
 */  
function FindPlayer(){
	var name = document.getElementById('getname').value
	document.getElementById("Sraka").innerHTML = name
	document.getElementById("head").innerHTML = "PLAYER SEARCH RESULT"
}

/**
 *Getting information about the match from the server
 *
 *@constructor
 */ 
function FindMatch(){
	var name = document.getElementById('getnum').value
	document.getElementById("Sraka").innerHTML = name
	document.getElementById("head").innerHTML = "MATCH SEARCH RESULT"
}