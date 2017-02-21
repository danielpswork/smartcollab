var email;

function convertDateTime(dateTime){
	return dateTime.dayOfMonth + "/" + dateTime.monthValue + "/" + dateTime.year;
}


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
		email = data.userAuthentication.details.email;
				
		createCards();
		
	}).catch(function(err){
		console.log(err);
	})
	
	$('#saveFormButton').click(function() {		
		var data = {
			title: $('#titleForm').val(),
			description: $('#descriptionForm').val(),		
			login: email.split("@")[0]
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
			element.dateTime = convertDateTime(element.dateTime);
			
			createCard(element.id, 
						element.title, 
						element.login, 
						element.description, 
						element.dateTime, 
						3,
						element.moderator,
						element.likes);
		})
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
}

function createCard(id, title, login, description, date, size, moderator, likes) {
	
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
	cardHtml += 			'<div style="position: absolute; bottom: 120px;" >';
	cardHtml += 				'Por: ' + login + '<br/>';
	cardHtml += 				'Data: ' + date + '<br/>';
	cardHtml += 				'Moderador: ' + (moderator==null ? "Não definido" : moderator);
	cardHtml += 			'</div>';
	cardHtml += '		</div>'
	cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	cardHtml += '				<button  onclick="like(&quot;'+id+'&quot;)" class="mdl-button mdl-js-button mdl-button--icon mdl-button">';
	cardHtml += '	  				<i class="material-icons">thumb_up</i>';
	cardHtml += '				</button>';
	cardHtml += '				' + (likes==null ? 0 : likes.length);
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
	cardHtml += '			<a onclick="beModerator(&quot;'+id+'&quot;)" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Moderar </a>';
	cardHtml += '		</div>';
	cardHtml += '		<div class="mdl-card__menu">';
	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
	cardHtml += '				<i class="material-icons">share</i>';
	cardHtml += '			</button>';
	cardHtml += '		</div>';
	cardHtml += '	</div>';
	
	$('#cards').html($('#cards').html() + cardHtml);
	
}

function beModerator(id) {
	
	var card;
	$.ajax({
		url: '/cards/' + id+'/'+email.split("@")[0],
		method: 'GET',
		contentType: "application/json"		
	}).then(function(){	    
	    createCards();		
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
	
}

function like(id) {
	var card;
	$.ajax({
		url: '/cards/like/' + id+'/'+email.split("@")[0],
		method: 'GET',
		contentType: "application/json"		
	}).then(function(data){	    
	    createCards();		
	}).catch(function(err){
		console.log('Error: ' + JSON.stringify(err));
	})
}
