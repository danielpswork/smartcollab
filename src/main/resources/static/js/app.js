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
	
	$('#saveFormButton').click(function() {
		var data = {
			title: $('#titleForm').val(),
			description: $('#descriptionForm').val()
		}
		
		$.ajax({
			url: '/cards',
			method: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json"
		}).then(function(cardId) {
			console.log('Sucesso')
		}).catch(function(err) {
			console.log('Err', JSON.stringify(err))
		})
	})
	
	var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#show-dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
	
})

function createCards() {
	$('#cards').html('');
	
	$.ajax({
		url: '/cards'
	}).then(function(data){
		data.forEach(function(element) {
			createCard(element.id, element.title, null, element.description, null, 3);
		})
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
	
	
	
	
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
