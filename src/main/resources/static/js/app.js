$(document).ready(function() {
	
	$('.loggedContainer').hide()
	$('.container').show()
	
	$.ajax({
		url: '/user'
	}).then(function(data){
		$('.loggedContainer').show()
		$('.container').hide()
		$('#userName').html(data.userAuthentication.details.name);
		$('#userImage').attr("src", data.userAuthentication.details.picture);
		
		createCards();
		
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

function createCards() {
	$('#cards').html('');
	createCard('Card 1 ', 'Texto do Card 1', 5);
	createCard('Card 2 ', 'Texto do Card 2', 5);
	createCard('Card 3 ', 'Texto do Card 3', 5);
}

function createCard(name, text, size) {
	
	var cardHtml = '<div class="mdl-cell mdl-cell--' + size + '-col">';
	cardHtml += '		<div class="demo-card-wide mdl-card mdl-shadow--2dp">';
	cardHtml += '			<div class="mdl-card__title">';
	cardHtml += '				<h2 class="mdl-card__title-text">' + name + '</h2>';
	cardHtml += '			</div>';
	cardHtml += '		<div class="mdl-card__supporting-text">' + text + '</div>';
	cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	cardHtml += '			<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Moderar </a>';
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__menu">';
	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
	cardHtml += '				<i class="material-icons">share</i>';
	cardHtml += '			</button>';
	cardHtml += '		</div>';
	cardHtml += '	</div>';
	
	$('#cards').html($('#cards').html() + cardHtml);
	
}