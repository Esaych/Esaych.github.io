var resizeToFit = function() {
	var w = $(this).width(); //this = window
	if (w > 1024) {
		location.href = location.href.replace("m.htm", ".htm");
	}
}

$(window).on('resize', function() {
	resizeToFit();
});
resizeToFit();