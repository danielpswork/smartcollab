$(document).ready(function() {
	
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type)) {
	            xhr.setRequestHeader("X-XSRF-TOKEN", getCookie('XSRF-TOKEN'));
	        }
	    }
	});
	
	function csrfSafeMethod(method) {
	    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	
	function getCookie(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                break;
	            }
	        }
	    }
	    return cookieValue;
	}
	
	$('#signIn').click(function() {
		document.location.href='/login';
	})	
	
	$('#logoutButton').click(function() {
		$.ajax({
			url: '/logout',
			method: 'POST'
		}).then(function(data, result, response) {
			$('.loggedContainer').hide();
			$('.container').show();
			console.log('Success');
		}).catch(function(err01, err02, err03) {
			console.log('Error');
		})
	})

	function showAboutDialog() {
		var aboutDialog = document.querySelector('dialog#aboutDialog');
	    var showAboutDialogButton = document.querySelector('#about');
	    if (! aboutDialog.showModal) {
	      dialogPolyfill.registerDialog(aboutDialog);
	    }
	    showAboutDialogButton.addEventListener('click', function() {
	    	aboutDialog.showModal();
	    });
	    aboutDialog.querySelector('.close').addEventListener('click', function() {
	    	aboutDialog.close();
	    });
	}
	
	showAboutDialog();
	
})
