package com.fancheerinteractive.emc.dto;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

/**
 * @author haffo
 * 
 */
public class CurrentUser {

	private String username;
	private Long accountId;
	private boolean isAuthenticated = false;
	private Collection<GrantedAuthority> authorities;

	/**
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @param username
	 *            the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * @return the isAuthenticated
	 */
	public boolean isAuthenticated() {
		return isAuthenticated;
	}

	/**
	 * @param isAuthenticated
	 *            the isAuthenticated to set
	 */
	public void setAuthenticated(boolean isAuthenticated) {
		this.isAuthenticated = isAuthenticated;
	}

	/**
	 * @return the authorities
	 */
	public Collection<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	/**
	 * @param authorities
	 *            the authorities to set
	 */
	public void setAuthorities(Collection<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	/**
	 * @return the accountId
	 */
	public Long getAccountId() {
		return accountId;
	}

	/**
	 * @param accountId
	 *            the accountId to set
	 */
	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

}
