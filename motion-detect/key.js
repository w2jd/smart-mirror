function on_key_down() {
	var keycode = event.keyCode;
	if ( keycode == 50 ) {	// 2
		document.getElementById("pagemain").style.display="block";
		document.getElementById("pagecal").style.display="none";
	} else if ( keycode == 53 ) {	// 5
		document.getElementById("pagemain").style.display="none";
		document.getElementById("pagecal").style.display="block";
	}
}	
