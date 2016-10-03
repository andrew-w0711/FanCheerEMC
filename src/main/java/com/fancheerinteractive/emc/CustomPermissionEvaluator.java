package com.fancheerinteractive.emc;

import com.fancheerinteractive.emc.domain.Account;
import com.fancheerinteractive.emc.repo.AccountRepository;
import java.io.Serializable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * 
 * @author haffo
 */
@Component(value = "customPermissionEvaluator")
public class CustomPermissionEvaluator implements PermissionEvaluator {

	static final Logger logger = LoggerFactory
			.getLogger(CustomPermissionEvaluator.class);

	@Autowired
	AccountRepository accountRepository;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.security.access.PermissionEvaluator#hasPermission
	 * (org.springframework.security.core.Authentication, java.lang.Object,
	 * java.lang.Object)
	 */
	@Override
	public boolean hasPermission(Authentication authentication,
			Object targetDomainObject, Object permission) {
		logger.debug("^^^^^^^^^^^^^^^^^ 0 ^^^^^^^^^^^^^^^^^^");
		if ("accessAccountBasedResource".equals(permission)) {
			logger.debug("^^^^^^^^^^^^^^^^^ 1 ^^^^^^^^^^^^^^^^^^");
			Account acc = accountRepository
					.findByTheAccountsUsername(authentication.getName());
			logger.debug("^^^^^^^^^^^^^^^^^ 2 " + acc + " ^^^^^^^^^^^^^^^^^^");
			if (acc == null) {
				return false;
			}
			logger.debug("^^^^^^^^^^^^^^^^^ 3 acc.getId(): " + acc.getId()
					+ " targetDomainObject: " + targetDomainObject
					+ " ^^^^^^^^^^^^^^^^^^");
			if (acc.getId().equals(targetDomainObject)
					|| authentication.getAuthorities().contains(
							new SimpleGrantedAuthority("supervisor"))
					|| authentication.getAuthorities().contains(
							new SimpleGrantedAuthority("admin"))) {
				return true;
			}
		}

		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.security.access.PermissionEvaluator#hasPermission
	 * (org.springframework.security.core.Authentication, java.io.Serializable,
	 * java.lang.String, java.lang.Object)
	 */
	@Override
	public boolean hasPermission(Authentication authentication,
			Serializable targetId, String targetType, Object permission) {

		if ("accessAccountBasedResource".equals(permission)) {
			Account acc = accountRepository
					.findByTheAccountsUsername(authentication.getName());
			if (acc == null) {
				return false;
			}
			if (acc.getId() == targetId
					|| authentication.getAuthorities().contains(
							new SimpleGrantedAuthority("supervisor"))
					|| authentication.getAuthorities().contains(
							new SimpleGrantedAuthority("admin"))) {
				return true;
			}
		}

		return false;
	}

}
