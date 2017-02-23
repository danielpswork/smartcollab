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
		    dialog = document.querySelector('dialog#insertDialog');
			dialog.close();
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
			createCard(element.id, element.title, element.author, element.description, 
					element.moderator, element.creationDate, 3, 
					element.votedUsers.length, element.comments.length);
		});
		moderateButton();
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
}

function createCard(id, title, login, description, moderator, date, size, votedUsersNumber, commentsNumber) {
	
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
	cardHtml += 			'<div style="position: relative; top: 80px;" >';
	cardHtml += 				'Por: ' + login + '<br/>';
	cardHtml += 				'Data: ' + date + '<br/>';
	if(moderator!=null) {
		cardHtml +=					'Moderador: ' + moderator;
	}
	else {
		cardHtml +=					'Moderador: Sem moderador';
	}
	cardHtml += 			'</div>';
	cardHtml += '		</div>'
	cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	if(!moderator) {
		cardHtml += '			<a name="moderate" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Moderar</a>';
	}
	cardHtml += '			<a onclick="updateNumberOfVoters(\''+ id +'\',\'' + login +'\')" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">' + votedUsersNumber + '  <i class="material-icons">thumb_up</i></a>';
	cardHtml += '			<a onclick="openCommentDialog(\'' + id + '\')" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">'+ commentsNumber + '  <i class="material-icons">comment</i></a>';
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__menu">';
	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
	cardHtml += '				<i class="material-icons">share</i>';
	cardHtml += '			</button>';
	cardHtml += '		</div>';
	cardHtml += '	</div>';
	
	$('#cards').html($('#cards').html() + cardHtml);
	
}

function updateNumberOfVoters(id, login){
	$.ajax({
		url: '/cards/' + id + '/' + login
	}).then(function(card){
		$("#"+card.id).remove();
    	createCard(card.id, card.title, card.author,
    			card.description, card.moderator,
    			card.creationDate, 3, card.votedUsers.length, card.comments.length);
    	moderateButton();
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	});
}

function updateModerator(button, id, login){
	
	var snackbarContainer = document.querySelector('#demo-toast-example');
	var card;
	$.ajax({
		url: '/cards/' + id + '/moderator/' + login
	}).then(function(card){
		$(button.parentElement.parentElement.parentElement).remove();
		createCard(card.id, card.title, card.author,
    			card.description, card.moderator,
    			card.creationDate, 3, 
    			(card.votedUsers ? card.votedUsers.length : 0), 
    			card.comments.length);
    	moderateButton();
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	});
	
}

function moderateButton(){
	$('a[name="moderate"]').click(function(){
    	var button = this;
    	updateModerator(button, $(this).parents().eq(2)[0].id , login);
    });
}

function openCommentDialog(id) {
	dialog = document.querySelector('dialog#commentDialog');
	$.ajax({
		url: '/cards/' + id
	}).then(function(card){
		$('h4#dialogCardTitle').html(card.title);
		$('p#dialogCardDescription').html(card.description);
		$('input[name=cardId]').val(card.id);
		var ul = $('#commentsList');
		ul.html('');
		for (var int = 0; int < card.comments.length; int++) {
			ul.append('<li class="mdl-list__item">');
			ul.append('<span class="mdl-list__item-primary-content">');
			ul.append('<i class="material-icons">account_circle</i><strong>' + card.comment[int].author + '</strong> em ' + card.comment[int].creationDate + ' disse<br />');
			ul.append(card.comment[int].text);
			ul.append('</span>');
			ul.append('</li>');
		}
	})
	dialog.showModal();
}

function saveComment() {
	var dates = new Date().toJSON().slice(0,10).split('-');
	var comment = {
			text: $('#commentForm').val(),
			author: login,
			creationDate : dates[2] + '/' + dates[1] + '/' + dates[0]
	}

	$.ajax({
		url: '/cards/' + $('input[name=cardId]').val() +'/comment',
		method: 'POST',
		data: JSON.stringify(comment),
		contentType: "application/json"
	}).then(function(card) {
		$('#commentForm').html('');
		var data = {message: 'Moderador alterado com sucesso!', timeout: 5000};
		openCommentDialog(card.id);
	}).catch(function(err) {
		var data = {message: 'Erro ao salvar o moderador! ', timeout: 5000};
	})
}

function closeCommentDialog() {
	dialog = document.querySelector('dialog#commentDialog');
	dialog.close();
	createCards();
}