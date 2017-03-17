var email;
var currCard;
var avatarUrl;

var commentDate;

var cardTemplate;
var commentTemplate;


function convertDate(date) {
    return date.dayOfMonth + "/" + date.monthValue + "/" + date.year;
}

function convertCommentDateTime(commentDateTime) {
    return commentDateTime.dayOfMonth.toString() + "-" 
    		+ commentDateTime.monthValue.toString() + "-" 
    		+ commentDateTime.year.toString() + "-" 
    		+ commentDateTime.hour.toString() + "-" 
    		+ commentDateTime.minute.toString() + "-"
    		+ commentDateTime.second.toString();
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
    
    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    	  if(v1 === v2) {
    	    return options.fn(this);
    	  }
    	  return options.inverse(this);
    	});
    
    Handlebars.registerHelper('convertDateTime', function(dateTime) {
    	return convertDateTime(dateTime);
  	});
    
    Handlebars.registerHelper('convertCommentDateTime', function(dateTime) {
    	return convertCommentDateTime(dateTime);
  	});
    
    
    
    cardTemplate = Handlebars.compile($("#card-template").html());    
    commentTemplate = Handlebars.compile($("#comment-template").html());

    $.ajax({
        url: '/user'
    }).then(function(data) {
        $('.loggedContainer').show();
        $('.container').hide();
        $('#show-dialog').show();
        $('#userName').html(data.userAuthentication.details.name);
        $('#userImage').attr("src", data.userAuthentication.details.picture);
        avatarUrl = data.userAuthentication.details.picture;
        
        avatarUrl = data.userAuthentication.details.picture;
        email = data.userAuthentication.details.email;

        createCards();

    }).catch(function(err) {
        console.log(err);
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
            createCards();
            
            var dialog = document.querySelector('dialog#insertDialog');
            dialog.close();
            
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
                element.avatarUrl,
                null);
        })
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    });
}

function createCard(id, title, login, description, date, moderator, likes, comments, avatarUrl, local) {

    var descriptionId = 'description_' + id;
    var currUserLogin = email.split("@")[0];

    date = convertDate(date);
    
    var context = {id: id, title: title, login: login, descriptionId: descriptionId, description: description,
    				descriptionTrunc: description.substring(0, 160), descriptionNeedsTrunc: (description.length > 160), 
    				date: date, moderator: moderator, 
    				nomeModerador: (moderator == null ? "ninguém" : moderator), 
    				likes: likes, likesCount: (likes == null ? 0 : likes.length), 
    				comments: comments, commentsCount: (comments == null ? 0 : comments.length), 
    				avatarUrl: avatarUrl, local: local, loggedUserCardOwner: (currUserLogin == login) };
    var cardHtml = cardTemplate(context);

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
            data.avatarUrl,
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
            data.avatarUrl,
            id);
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function comment(id) {
    if(!document.querySelector('#commentDialog').open){
    	document.querySelector('#commentDialog').showModal();
    }    		
    $('#textFieldComment')[0].focus();
    $('#commentModal').html('');
    currCard = id;

    $.ajax({
        url: '/cards/' + id,
        method: 'GET',
        contentType: "application/json"
    }).then(function(card) {
    	
    	var loggedUser = email.split("@")[0];
    	var context = {card: card, loggedUser: loggedUser}
    	
        var commentHtml = commentTemplate(context);
        $('#commentModal').html($('#commentModal').html() + commentHtml);
        
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })

}

function saveComment() {
	$('#commentModal').html('');
	
    var data = [currCard,
        $('#textFieldComment')[0].value
    ];

    $.ajax({
        url: '/cards/comment',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json"
    }).then(function(card) {


        $('#card' + card.id).html('');
        createCard(card.id,
        	card.title,
            card.login,
            card.description,
            card.dateTime,
            card.moderator,
            card.likes,
            card.comments,
            card.avatarUrl,
            card.id);

        var loggedUser = email.split("@")[0];
    	var context = {card: card, loggedUser: loggedUser}
    	
        var commentHtml = commentTemplate(context);

        $('#commentModal').html($('#commentModal').html() + commentHtml);
        
        $('#textFieldComment')[0].value = "";
        $('#textFieldComment')[0].focus();

    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
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
        url: '/cards/myideas'
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
                element.avatarUrl,
                null);
        })
    }).catch(function(err) {
        console.log('Error: ' + JSON.stringify(err));
    })
}

function loadMoreRecent() {

    $('#cards').html('');

    $.ajax({
        url: '/cards/bydate'
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
                element.avatarUrl,
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
	
	var snackbarContainer = document.querySelector('#demo-toast-example');
	var data = [currCard, user, date];
	 $.ajax({
		 url: '/cards/comment/delete',
		 method: 'POST',
		 data: JSON.stringify(data),
		 contentType: "application/json"
	 }).then(function(data) {
		 comment(currCard);
		 createCards();
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

