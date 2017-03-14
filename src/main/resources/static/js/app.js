var email;
var currCard;
var avatarUrl;

var commentDate;

function convertDate(date) {
    return date.dayOfMonth + "/" + date.monthValue + "/" + date.year;
}

function convertCommentDateTime(commentDateTime) {
    return commentDateTime.dayOfMonth.toString() + commentDateTime.monthValue.toString() + commentDateTime.year.toString() + commentDateTime.hour.toString() + commentDateTime.minute.toString();
}

function convertDateTime(dateTime) {
	if (dateTime.minute < 10)
    return ' - ' + dateTime.dayOfMonth + '/' +
        dateTime.monthValue + '/' +
        dateTime.year + ' - ' +
        dateTime.hour + ':' +
        '0' + dateTime.minute;
	else
		return ' - ' + dateTime.dayOfMonth + '/' +
        dateTime.monthValue + '/' +
        dateTime.year + ' - ' +
        dateTime.hour + ':' +
        dateTime.minute;
}

$(document).ready(function() {

    $('.loggedContainer').hide();
    $('.container').show();
    $('#show-dialog').hide();

    var snackbarContainer = document.querySelector('#demo-toast-example');

    $.ajax({
        url: '/user'
    }).then(function(data) {
        $('.loggedContainer').show();
        $('.container').hide();
        $('#show-dialog').show();
        $('#userName').html(data.userAuthentication.details.name);
        $('#userImage').attr("src", data.userAuthentication.details.picture);
        
        avatarUrl = data.userAuthentication.details.picture;
        email = data.userAuthentication.details.email;

        createCards();

    }).catch(function(err) {
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
            var data = {
                message: 'Card salvo com sucesso!',
                timeout: 2000
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }).catch(function(err) {
            var data = {
                message: 'Erro ao salvar o card: ' + cardJSON.stringify(err),
                timeout: 2000
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        })
    })
    
    var dialog = document.querySelector('dialog#insertDialog');
    var showDialogButton = document.querySelector('#show-dialog');
    if (!dialog.showModal) {
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
    dialog = document.querySelector('dialog#insertDialog');
    $.ajax({
        url: '/cards'
    }).then(function(data) {
        data.forEach(function(element) {
            createCard(element.id,
                element.title,
                element.login,
                element.description,
                element.dateTime,
                element.moderator,
                element.likes,
                element.comments,
                null);
        })
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
    
    dialog.close();
}

function createCard(id, title, login, description, date, moderator, likes, comments, local) {

    var descriptionId = 'description_' + id;
    var currUserLogin = email.split("@")[0];

    date = convertDate(date);


    var cardHtml = '';
    cardHtml += '<div id="card' + id + '">';
    cardHtml += '<div class="mdl-cell mdl-cell--' + 3 + '-col">';
    cardHtml += '		<div class="demo-card-wide mdl-card mdl-shadow--2dp">';
    cardHtml += '			<div class="mdl-card__title">';
    cardHtml += '				<h2 class="mdl-card__title-text">' + title + '</h2>';
    cardHtml += '			</div>';
    cardHtml += '		<div id="cardInfo">';
    cardHtml += '			<i class="material-icons mdl-list__item-avatar">person</i>  ' + login + ' em ' + date + '<br/>';
    cardHtml += '		</div>';
    cardHtml += '		<div class="mdl-card__supporting-text">';
    cardHtml += '			<div id="' + descriptionId + '">' + description.substring(0, 160);

    if (description.length > 160) {
        cardHtml += '...</div>';
        cardHtml += '		<div class="mdl-tooltip mdl-tooltip--large" for="' + descriptionId + '">' + description + '</div>';
    } else {
        cardHtml += '</div>';
    }
    cardHtml += '		</div>'
    cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
    cardHtml += '				<button  onclick="like(&quot;' + id + '&quot;)" class="mdl-button mdl-js-button mdl-button--icon mdl-button">';
    cardHtml += '	  				<i class="material-icons md-light">thumb_up</i>';
    cardHtml += '				</button>';
    cardHtml += '				<span style="top: 10px; right: 2px" class="mdl-badge" data-badge="' + +(likes == null ? 0 : likes.length) + '"></span>';
    cardHtml += '				<button style="left:165px;" onclick="comment(&quot;' + id + '&quot;)" class="mdl-button mdl-js-button mdl-button--icon mdl-button">';
    cardHtml += '	  				<i class="material-icons">comment</i>';
    cardHtml += '				</button>';
    cardHtml += ' <span style="float:right; top: 15px; right: 2px" class="mdl-badge" data-badge="' + +(comments == null ? 0 : comments.length) + '"></span>';
    cardHtml += '		</div>';
    if (moderator == null) {
        cardHtml += '		<div class="mdl-card__actions mdl-card--border">';
        cardHtml += '			<a onclick="beModerator(&quot;' + id + '&quot;)" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Moderar </a>';
        cardHtml += '		</div>';
    } else {
        cardHtml += '		<div class="mdl-card__actions mdl-card--border moderator">';
        cardHtml += '			Moderado por ' + (moderator == null ? "ninguém" : moderator);
        cardHtml += '		</div>';
    }
    cardHtml += '		<div class="mdl-card__menu">';
    if (currUserLogin == login) {
    	cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
    	cardHtml += '				<i class="material-icons" onClick="editCard(&quot;' + id + '&quot;)">edit</i>';
    	cardHtml += '			</button>';
    }
    cardHtml += '			<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">';
    cardHtml += '				<i class="material-icons" onclick="deleteCard(&quot;' + id + '&quot;)">close</i>';
    cardHtml += '			</button>';
    cardHtml += '		</div>';
    cardHtml += '	</div>';
    cardHtml += '</div>';

    if (local == undefined) {
        $('#cards').html($('#cards').html() + cardHtml);
    } else {
        $('#card' + local).html(cardHtml);
    }

}

function beModerator(id) {

    var card;
    $.ajax({
        url: '/cards/' + id + '/' + email.split("@")[0],
        method: 'GET',
        contentType: "application/json"
    }).then(function(data) {
        $('#card' + id).html('');
        createCard(data.id,
            data.title,
            data.login,
            data.description,
            data.dateTime,
            data.moderator,
            data.likes,
            data.comments,
            id);
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function like(id) {
    var card;
    $.ajax({
        url: '/cards/like/' + id + '/' + email.split("@")[0],
        method: 'GET',
        contentType: "application/json"
    }).then(function(data) {
        $('#card' + id).html('');
        createCard(data.id,
            data.title,
            data.login,
            data.description,
            data.dateTime,
            data.moderator,
            data.likes,
            data.comments,
            id);
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function comment(id) {
    document.querySelector('#commentDialog').showModal();
    $('#textFieldComment')[0].focus();
    $('#commentModal').html('');
    currCard = id;

    $.ajax({
        url: '/cards/' + id,
        method: 'GET',
        contentType: "application/json"
    }).then(function(data) {
    	
    	var html = '<h2>' + data.title + '</h2>';
    	html += '<p>Criado por: ' + data.login + ' ' + convertDateTime(data.dateTime);
    	if (data.moderator != null) {
    		html += ' Moderador: ' + data.moderator;
    	}
    	html += '</p>';
        html += '<p>' + data.description + '</p>';
        html += '<ul id="commentList" class="demo-list-three mdl-list">'
        html += fillComments(data);
        html += '</ul>';

        $('#commentModal').html($('#commentModal').html() + html);
        
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })

}

function saveComment() {
	$('#commentModal').html('');
	
    var data = [currCard,
        email.split("@")[0],
        $('#textFieldComment')[0].value
    ];

    $.ajax({
        url: '/cards/comment',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json"
    }).then(function(data) {


        $('#card' + data.id).html('');
        createCard(data.id,
            data.title,
            data.login,
            data.description,
            data.dateTime,
            data.moderator,
            data.likes,
            data.comments,
            data.id);

        var html = '<h2>' + data.title + '</h2>';
    	html += '<p>Criado por: ' + data.login + ' ' + convertDateTime(data.dateTime);
    	if (data.moderator != null) {
    		html += ' Moderador: ' + data.moderator;
    	}
    	html += '</p>';
        html += '<p>' + data.description + '</p>';
        html += '<ul id="commentList" class="demo-list-three mdl-list">'
        html += fillComments(data);
        html += '</ul>';

        $('#commentModal').html($('#commentModal').html() + html);
        
        $('#textFieldComment')[0].value = "";
        $('#textFieldComment')[0].focus();

    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function fillComments(data) {
	var html = '';
	var loggedUser = email.split("@")[0];
	var commentText;
    for (var i =  0; i < data.comments.length; i++) {
    	commentText = data.comments[i].text;
    	
        html += '<li class="mdl-list__item mdl-list__item--three-line" style="height:auto;">';
        html += '<span class="mdl-list__item-primary-content" style="height:auto;">';
        html += '<i class="material-icons mdl-list__item-avatar">person</i>';
        html += '<span style="font-weight: bold">' + data.comments[i].login + '</span>';
        html += '<span >' + convertDateTime(data.comments[i].dateTime) + '</span>';
        html += '<span class="mdl-list__item-text-body" style="height:auto;">';
        html += commentText;
        html += '</span>';
        html += '</span>';
	    if(data.comments[i].login === loggedUser){
	    	html += '<button title="Editar comentário" id="editComment" onClick="openEditCommentDialog(&quot;' + data.id + '&quot;,&quot;' + convertCommentDateTime(data.comments[i].dateTime) + '&quot;,&quot;' + commentText +'&quot;)" class="mdl-button mdl-js-button mdl-button--icon mdl-button"> <i class="material-icons">mode_edit</i> </button>'
	    	html += '<button title="Excluir comentário" id="deleteComment" onClick="deleteComment(&quot;' + data.id + ',' + data.comments[i].login + ',' + data.comments[i].dateTime + '&quot;)" class="mdl-button mdl-js-button mdl-button--icon mdl-button"> <i class="material-icons">delete</i> </button>'
	    }
        html += '</li>';
    }
    return html;
}

function closeCommentDialog() {
    $('#textFieldComment')[0].value = "";
    $('#commentList').html("");
    document.querySelector('#commentDialog').close();
}

function closeEditionDialog() {
    document.querySelector('#editDialog').close();
}

function loadMyIdeias() {

    $('#cards').html('');

    $.ajax({
        url: '/cards/login' + email.split("@")[0]
    }).then(function(data) {
        data.forEach(function(element) {
            createCard(element.id,
                element.title,
                element.login,
                element.description,
                element.dateTime,
                element.moderator,
                element.likes,
                element.comments,
                null);
        })
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function deleteCard(id){
	var snackbarContainer = document.querySelector('#demo-toast-example');
	
	$.ajax({
        url: '/cards/delete/' + id + '/' + email.split("@")[0],
        type: 'DELETE'
    }).then(function(data) {
    	if(data === true){
        	snackbar = {
                    message: "Card removido com sucesso!",
                    timeout: 2000
        	};
        	snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
        	createCards();
    	}else{
    		snackbar = {
                    message: "Card de outro usuário não pode ser removido!",
                    timeout: 2000
        	};
        	snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
    	}
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function openEditCommentDialog(id, date, commentText){
	currCard = id;
	commentDate = date;
	document.querySelector('#editCommentDialog').showModal();
    $('#textFieldEditComment')[0].focus();
    $('#textFieldEditComment')[0].value = commentText;
}

function closeEditCommentDialog() {
    $('#textFieldEditComment')[0].value = "";
    document.querySelector('#editCommentDialog').close();
}

function saveEditedComment() {
	var snackbarContainer = document.querySelector('#demo-toast-example');
	var data = [currCard, email.split("@")[0], commentDate, $('#textFieldEditComment')[0].value];
	 $.ajax({
		 url: '/cards/comment/edit',
		 method: 'POST',
		 data: JSON.stringify(data),
		 contentType: "application/json"
	 }).then(function(data) {
		 closeEditCommentDialog();
		 closeCommentDialog();
		 comment(currCard);
	 }).catch(function(err) {
		 console.log('Error: ' + JSON.stringify(err));
	 })
}

function deleteComment(id, user, date){
	$.ajax({
        url: '/cards/deleteComment/' + id + '/' + email.split("@")[0] + "/" + date,
        type: 'DELETE'
    }).then(function(data) {
    	if(data === true){
        	snackbar = {
                    message: "Card removido com sucesso!",
                    timeout: 2000
        	};
        	snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
        	createCards();
    	}else{
    		snackbar = {
                    message: "Card de outro usuário não pode ser removido!",
                    timeout: 2000
        	};
        	snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
    	}
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function editCard(id) {
	document.querySelector('#editDialog').showModal();
    
    $.ajax({
        url: '/cards/' + id,
        method: 'GET',
        contentType: "application/json"
    }).then(function(data) {
        $('#titleFormEdit').val(data.title);
        $('#descriptionFormEdit').val(data.description);
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })

}

function saveModifiedCard() {
}

