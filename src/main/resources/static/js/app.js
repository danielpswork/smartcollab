var userLogin;
var snackbarContaine;

$(document).ready(function() {
	
	$('.loggedContainer').hide();
	$('.container').show();

	snackbarContainer = document.querySelector('#demo-toast-example');
	
	$.ajax({
		url: '/user'
	}).then(function(data){
		$('.loggedContainer').show()
		$('.container').hide()
		$('#userName').html(data.userAuthentication.details.name);
		$('#userImage').attr("src", data.userAuthentication.details.picture);
		
		userLogin = data.userAuthentication.details.email;
		
		createCards();
		
	}).catch(function(err){
		console.log(err);
	})
	
	/* Save new card */
	$('#saveFormButton').click(function() {
		var data = {
			title: $('#titleForm').val(),
			description: $('#descriptionForm').val(),
			loginCreator: userLogin.split('@')[0] // splits login from domain
		}
		
		$.ajax({
			url: '/cards',
			method: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json"
		}).then(function(cardId) {
			createCards();
			$('#titleForm').val('');
			$('#descriptionForm').val('');
			var data = {message: 'Card salvo com sucesso!', timeout: 5000};
		    snackbarContainer.MaterialSnackbar.showSnackbar(data);
		}).catch(function(err) {
			var data = {message: 'Erro ao salvar o card: ' + cardJSON.stringify(err), timeout: 5000};
		    snackbarContainer.MaterialSnackbar.showSnackbar(data);
		})
	})
	
	var dialog = document.querySelector('dialog#insertDialog');
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

/* saveModeratorturns logged user into a moderator */
function saveModerator(pid) { 
	var data = {
		id: pid,
		loginModerator: userLogin.split('@')[0]
	}
	
	$.ajax({
		url: '/cards/updateCardModerator',
		method: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json"
	}).then(function(cardId) {
		createCards();
		var data = {message: 'Moderador salvo com sucesso!', timeout: 5000};
	    snackbarContainer.MaterialSnackbar.showSnackbar(data);
	}).catch(function(err) {
		var data = {message: 'Erro ao salvar o Moderador: ' + cardJSON.stringify(err), timeout: 5000};
	    snackbarContainer.MaterialSnackbar.showSnackbar(data);
	})
}

/* createCards retrieves cards and display them on screen */
function createCards() {
	$('#cards').html('');
	
	$.ajax({
		url: '/cards'
	}).then(function(data){
		data.forEach(function(element) {
			createCard(element.id, element.title, element.loginCreator, element.loginModerator, element.description, element.displayDateNow, element.likes, 3);
		})
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
}

/* Mounts cards to be displayed on the screen */
function createCard(id, title, login, loginModerator, description, date, likes, size) {
	
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
	if(!loginModerator || 0 === loginModerator.length){
		cardHtml += 			'<div style="position: absolute; bottom: 60px;" >';
		cardHtml += 				'Por: ' + login + '<br/>';
		cardHtml += 				'Data: ' + date;
		cardHtml += 			'</div>';
		cardHtml += '		</div>';
		cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
		cardHtml += '			<a onClick="saveModerator(\''+id+'\')" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect moderarButton">Moderar</a>';
	}
	else{
		cardHtml += 			'<div style="position: absolute; bottom: 60px;" >';
		cardHtml += 				'Por: ' + login + '<br/>';
		cardHtml += 				'Data: ' + date + '<br/>';
		cardHtml += 				'Moderador: ' + loginModerator + '<br/>';
		cardHtml += 			'</div>';
		cardHtml += '		</div>';
		cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	}
	
	cardHtml += '		<a><i class="material-icons likeButton">plus_one</i></a> 5';
	cardHtml += '		<a><i class="material-icons commentButton">mode_comment</i></a> 5';
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__menu">';
	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
	cardHtml += '				<i class="material-icons">share</i>';
	cardHtml += '			</button>';
	cardHtml += '		</div>';
	cardHtml += '	</div>';
	
	$('#cards').html($('#cards').html() + cardHtml);
	
}
