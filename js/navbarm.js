$("#navbar-open").click(function() {
	$("#navbar-wrapper").css("height", "1500px");
	$('#hamburger').addClass('transparent');
	setTimeout(function() {
		$('#navbar-pullout').addClass('show');
	}, 100);
	
});

function closeNav() {
	$('#navbar-pullout').removeClass('show');
	setTimeout(function() {
		$('#hamburger').removeClass('transparent');
	}, 200);
	setTimeout(function() {
		$("#navbar-wrapper").css("height", "150px");
	}, 300);
}