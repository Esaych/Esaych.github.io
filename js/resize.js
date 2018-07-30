var resizeToFit = function() {
	var w = $(this).width(); //this = window
	var h = $(this).height(); //this = window
	var new_w = w/1300;
	var new_h = h/650;
	
	var new_use = new_w;
	if (new_w > new_h)
		new_use = new_h;
	
	if (new_use > 1.6)
		new_use = 1.6;
	
	if (new_use < 0.5)
		new_use = 0.5;
		
	var new_scale = "scale(" + new_use + ")";
	
	$("#wrapper").css("transform", new_scale);
	$("#navbar").css("transform", new_scale);
	$("#content").css("transform", new_scale);

	//index only code
	if ($("#content-lower").length) {
		$("#content-lower").css("transform", new_scale);
		
		if (w < 1300) {
			$("#content-lower").css("display", "none")
		} else {
			$("#content-lower").css("display", "inherit")
		}
		
		$("#content-wrapper").css("margin-right", ((w-1300)/2.5) + "px");
	}
	
	//art only code
	if ($("#art-pane").length) {
		new_w = 95/new_use;
		
		var new_w_val = new_w + "%";
		$("#content").css("width", new_w_val);
		
		if (new_use > 1) {
			$("#content").css("transform-origin", "top center");
		} else {
			$("#content").css("transform-origin", "top left");
		}
	}
	
	if (w <= 1024) {
		location.href = location.href.replace(".htm", "m.htm");
	}
}

var resizeResumeToFit = function() {
	var w = $(this).width(); //this = window
	var h = $(this).height(); //this = window
	
	var new_h = h/w*1300;
	if (new_h < 685) {
		new_h = 685;
	}
	var new_h_val = new_h + "px";
	$("#content").css("height", new_h_val);
}


var resizeArtToFit = function() {
	var w = $(this).width(); //this = window
	var h = $(this).height(); //this = window
	
	var new_h = h/w*1300;
	if (new_h < 685) {
		new_h = 685;
	}
	var new_h_val = new_h + "px";
	$("#content").css("height", new_h_val);
}

$(window).on('resize', function() {
	resizeToFit();
	
	if ($("#resume-frame").length) {
		resizeResumeToFit();
	}
	if ($("#art-pane").length) {
		resizeArtToFit();
	}
});