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
	createCard(1, 'Card 1 ', 'danielps', 'Texto do Card 1 jkshf kjhsdf ksjdhdf kjsdkfjhskdj', '15/11/2016', 3);
	createCard(2, 'Card 2 ', 'tfonseca', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '02/09/2016', 3);
	createCard(3, 'Card 3 ', 'danielps', 'Texto do Card 3', '19/01/2017', 3);
	createCard(4, 'Card 4 ', 'tfonseca', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '04/02/2017', 3);
	createCard(5, 'Card 5 ', 'danielps', 'Texto do Card 5', '10/12/2016', 3);
}

function createCard(id, title, login, description, date, size) {
	
	var descriptionId = 'description_' + id;
	
	var cardHtml = '<div class="mdl-cell mdl-cell--' + size + '-col">';
	cardHtml += '		<div class="demo-card-wide mdl-card mdl-shadow--2dp">';
	cardHtml += '			<div class="mdl-card__title">';
	cardHtml += '				<h2 class="mdl-card__title-text">' + title + '</h2>';
	cardHtml += '			</div>';
	cardHtml += '		<div class="mdl-card__supporting-text">';
	cardHtml += '			<div id="' + descriptionId + '">' + description.substring(0, 230);
	if (description.length > 230) {
		cardHtml += '...</div>';
		cardHtml += '		<div class="mdl-tooltip mdl-tooltip--large" for="' + descriptionId + '">' + description + '</div>';
	} else {
		cardHtml += '</div>';
	}
	cardHtml += 			'<div style="position: absolute; bottom: 60px;" >';
	cardHtml += 				'Por: ' + login + '<br/>';
	cardHtml += 				'Data: ' + date;
	cardHtml += 			'</div>';
	cardHtml += '		</div>'
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
