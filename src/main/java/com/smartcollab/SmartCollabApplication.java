package com.smartcollab;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SmartCollabApplication {
	
	@Bean
	public AuthoritiesExtractor authoritiesExtractor(
	        //@Value("#{'ciandt.com'.split(',')}") final List<String> allowedDomains) {
	        @Value("#{'${security.allowed-domains}'.split(',')}") final List<String> allowedDomains) {

	    return new AuthoritiesExtractor() {
	        @Override
	        public List<GrantedAuthority> extractAuthorities(final Map<String, Object> map) {
	            if (map != null && map.containsKey("email")) {
	                final String domain = map.get("email").toString().split("@")[1];
	                if (!allowedDomains.contains(domain)) {
	                    throw new BadCredentialsException("Not an allowed domain");
	                }
	                final List<GrantedAuthority> list = AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_USER");
	                return list;
	            }
	            return null;
	        }
	    };
	}

	@RequestMapping("/user")
	public Principal user(Principal principal) {
		return principal;
	}

	public static void main(String[] args) {
		SpringApplication.run(SmartCollabApplication.class, args);
	}
}
