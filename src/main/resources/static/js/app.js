var email;
var currCard;

function convertDate(date) {
    return date.dayOfMonth + "/" + date.monthValue + "/" + date.year;
}

function convertDateTime(dateTime) {
    return ' - ' + dateTime.dayOfMonth + '/' +
        dateTime.monthValue + '/' +
        dateTime.year + ' - ' +
        dateTime.hour + ':' +
        dateTime.minute
}

$(document).ready(function() {

    $('.loggedContainer').hide();
    $('.container').show();

    var snackbarContainer = document.querySelector('#demo-toast-example');

    $.ajax({
        url: '/user'
    }).then(function(data) {
        $('.loggedContainer').show()
        $('.container').hide()
        $('#userName').html(data.userAuthentication.details.name);
        $('#userImage').attr("src", data.userAuthentication.details.picture);
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
                timeout: 5000
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }).catch(function(err) {
            var data = {
                message: 'Erro ao salvar o card: ' + cardJSON.stringify(err),
                timeout: 5000
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
}

function createCard(id, title, login, description, date, moderator, likes, comments, local) {

    var descriptionId = 'description_' + id;

    date = convertDate(date);


    var cardHtml = '';
    cardHtml += '<div id="card' + id + '">';
    cardHtml += '<div class="mdl-cell mdl-cell--' + 3 + '-col">';
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
    cardHtml += '<div style="position: absolute; bottom: 120px;" >';
    cardHtml += '	Por: ' + login + '<br/>';
    cardHtml += '	Data: ' + date + '<br/>';
    cardHtml += '	Moderador: ' + (moderator == null ? "Não definido" : moderator);
    cardHtml += '</div>';
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
    }
    cardHtml += '		<div class="mdl-card__menu">';
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
    currCard = id;

    $.ajax({
        url: '/cards/' + id,
        method: 'GET',
        contentType: "application/json"
    }).then(function(data) {
        fillComments(data);
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })

}

function saveComment() {
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

        fillComments(data);

        $('#textFieldComment')[0].value = "";
        $('#textFieldComment')[0].focus();


    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function fillComments(data) {
    $('#commentList').html('');
    for (var i = data.comments.length - 1; i >= 0; i--) {
        var html = '<li class="mdl-list__item mdl-list__item--three-line">';
        html += '<span class="mdl-list__item-primary-content">';
        html += '<i class="material-icons mdl-list__item-avatar">person</i>';
        html += '<span style="font-weight: bold">' + data.comments[i].login + '</span>';
        html += '<span >' + convertDateTime(data.comments[i].dateTime) + '</span>';
        html += '<span class="mdl-list__item-text-body">';
        html += data.comments[i].text;
        html += '</span>';
        html += '</span>';
        html += '</li>';

        $('#commentList').html($('#commentList').html() + html);
    }
}

function closeCommentDialog() {
    $('#textFieldComment')[0].value = "";
    $('#commentList').html("");
    document.querySelector('#commentDialog').close();
}

function loadMyIdeias() {

    $('#cards').html('');

    $.ajax({
        url: '/cards/login=' + email.split("@")[0]
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
	$.ajax({
        url: '/cards/delete/' + id + '/' + email.split("@")[0],
        type: 'DELETE'
    }).then(function(data) {
    	createCards();
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}