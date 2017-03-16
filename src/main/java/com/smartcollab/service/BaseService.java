package com.smartcollab.service;

import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

public abstract class BaseService {

	private static final String EMAIL_KEY = "email";

	private static final String PICTURE_KEY = "picture";

	/**
	 * Returns the logged in user login
	 * 
	 * @return user login
	 */
	protected String getLoggedUser() {
		String email = getDetailByKey(EMAIL_KEY);

		return email.split("@")[0];
	}

	/**
	 * Returns the logged in user profile picture URL
	 * 
	 * @return picture URL
	 */
	protected String getLoggedAvatarUrl() {
		return getDetailByKey(PICTURE_KEY);
	}

	@SuppressWarnings("unchecked")
	private String getDetailByKey(String key) {
		OAuth2Authentication auth = (OAuth2Authentication) SecurityContextHolder.getContext().getAuthentication();
		UsernamePasswordAuthenticationToken userAuthentication = (UsernamePasswordAuthenticationToken) auth
				.getUserAuthentication();

		Map<String, String> details = (Map<String, String>) userAuthentication.getDetails();
		return details.get(key);
	}

}
