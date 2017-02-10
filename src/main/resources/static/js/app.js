$(document).ready(function() {
	
	$('.loggedContainer').hide()
	$('.container').show()
	
	$.ajax({
		url: '/user'
	}).then(function(data){
		$('#userName').html(data.userAuthentication.details.name);
		$('#userImage').attr("src", data.userAuthentication.details.picture);
		$('.loggedContainer').show()
		$('.container').hide()
	}).catch(function(err){
		console.log(err);
	})
	
	$('#signIn').click(function() {
		document.location.href='/login';
	})	
	
	$('#logoutButton').click(function() {
		$.ajax({
			url: '/logout',
			method: 'POST'
		}).then(function(data, result, response) {
			$('.loggedContainer').hide()
			$('.container').show()
			console.log('Success');
		}).catch(function(err01, err02, err03) {
			console.log('Error');
		})
	})
	
})