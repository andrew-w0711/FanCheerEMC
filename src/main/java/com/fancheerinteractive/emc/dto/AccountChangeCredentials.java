package com.fancheerinteractive.emc.dto;

/**
 * @author haffo
 * 
 */
public class AccountChangeCredentials {

	private String username;
	private String newUsername;
	private String password;
	private String newPassword;
	private Boolean signedConfidentialityAgreement;
	private Long id;

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
	 * @return the newUsername
	 */
	public String getNewUsername() {
		return newUsername;
	}

	/**
	 * @param newUsername
	 *            the newUsername to set
	 */
	public void setNewUsername(String newUsername) {
		this.newUsername = newUsername;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the signedConfidentialityAgreement
	 */
	public Boolean getSignedConfidentialityAgreement() {
		return signedConfidentialityAgreement;
	}

	/**
	 * @param signedConfidentialityAgreement
	 *            the signedConfidentialityAgreement to set
	 */
	public void setSignedConfidentialityAgreement(
			Boolean signedConfidentialityAgreement) {
		this.signedConfidentialityAgreement = signedConfidentialityAgreement;
	}

	/**
	 * @return the newPassword
	 */
	public String getNewPassword() {
		return newPassword;
	}

	/**
	 * @param newPassword
	 *            the newPassword to set
	 */
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	
	

}
