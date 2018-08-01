var resizeToFit = function() {
	var w = $(this).width(); //this = window
	var h = $(this).height();
	if (w/h > 1) {
		location.href = location.href.replace("m.htm", ".htm");
	}
}

$(window).on('resize', function() {
	resizeToFit();
});
resizeToFit();