function loadpage(page){
    window.location.assign(page);
}

function new_game(){
	var name = prompt("User name");
	
    while (name=="" || !name){
        name = prompt("User name");
    }
	sessionStorage.setItem("username", name);
	
	loadpage("./html/phasergame.html");
}

function load_game(){
	loadpage("./html/load.html");
}


function how_to_play(){
	loadpage("./html/how_to_play.html");
}