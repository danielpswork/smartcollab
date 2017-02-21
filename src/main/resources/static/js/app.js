var login;

$(document).ready(function() {
	
	$('.loggedContainer').hide();
	$('.container').show();
	
	var snackbarContainer = document.querySelector('#demo-toast-example');
	
	$.ajax({
		url: '/user'
	}).then(function(data){
		$('.loggedContainer').show()
		$('.container').hide()
		$('#userName').html(data.userAuthentication.details.name);
		$('#userImage').attr("src", data.userAuthentication.details.picture);
		login = data.userAuthentication.details.email.split('@')[0];
		
		createCards();
		
	}).catch(function(err){
		console.log(err);
	})
	
	$('#saveFormButton').click(function() {
		
		var dates = new Date().toJSON().slice(0,10).split('-');

		var data = {
			title: $('#titleForm').val(),
			description: $('#descriptionForm').val(),
			author: login,
			creationDate: dates[2] + '/' + dates[1] + '/' + dates[0]
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

function createCards() {
	$('#cards').html('');
	
	$.ajax({
		url: '/cards'
	}).then(function(data){
		data.forEach(function(element) {
			createCard(element.id, element.title, element.author, element.description, element.moderator, element.creationDate, 3);
		});
	    $('a[name="moderate"]').click(function(){
	    	var button = this;
	    	updateModerator(button, $(this).parents().eq(2)[0].id , login);
	    });
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
}

function createCard(id, title, login, description, moderator, date, size) {
	
	var descriptionId = 'description_' + id;
	
	var cardHtml = '<div id="' + id + '" class="mdl-cell mdl-cell--' + size + '-col">';
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
	cardHtml += 				'Data: ' + date + '<br/>';
	cardHtml +=					'Moderador: ' + moderator;
	cardHtml += 			'</div>';
	cardHtml += '		</div>'
	cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	if(!moderator) {
		cardHtml += '			<a name="moderate" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Moderar</a>';
	}
	cardHtml += '			<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">1<i class="material-icons">thumb_up</i></a>';
	cardHtml += '			<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">1<i class="material-icons">comment</i></a>';
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__menu">';
	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
	cardHtml += '				<i class="material-icons">share</i>';
	cardHtml += '			</button>';
	cardHtml += '		</div>';
	cardHtml += '	</div>';
	
	$('#cards').html($('#cards').html() + cardHtml);
	
}

function updateModerator(button, id, login){
	
	var snackbarContainer = document.querySelector('#demo-toast-example');
	var card;
	$.ajax({
		url: '/cards/' + id
	}).then(function(data){
		this.card = data;
		this.card['moderator'] = login;

		$.ajax({
			url: '/cards',
			method: 'POST',
			data: JSON.stringify(this.card),
			contentType: "application/json"
		}).then(function(cardId) {
			//update card moderator
			var data = {message: 'Moderador alterado com sucesso!', timeout: 5000};
		    snackbarContainer.MaterialSnackbar.showSnackbar(data);
		}).catch(function(err) {
			var data = {message: 'Erro ao salvar o moderador! ', timeout: 5000};
		    snackbarContainer.MaterialSnackbar.showSnackbar(data);
		})
		
		$(button.parentElement.parentElement.parentElement).remove();
    	createCard(this.card.id, this.card.title, this.card.author,
    			this.card.description, this.card.moderator,
    			this.card.creationDate, 3);

	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	});
	
}
