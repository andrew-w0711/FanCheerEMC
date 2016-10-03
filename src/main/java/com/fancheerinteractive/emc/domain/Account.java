package com.fancheerinteractive.emc.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.domain.AbstractPersistable;

/**
 * @author haffo
 * 
 */
@Entity
public class Account implements Serializable {

	private static final long serialVersionUID = 20130625L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	protected Long id;

	@Transient
	private String registrationPassword;

	private boolean entityDisabled = false;

	// TODO remove it and check it doesn't affect REST API security
	private boolean pending = false;

	@Length(max = 100)
	private String accountType;

	@Length(max = 100)
	@Column(unique = true)
	private String username;
	
	@Email
	@Length(max = 100)
	@Column(unique = true)
	private String email;

	@Length(max = 100)
	@Column(unique = true)
	private String fullName;

	@Length(max = 100)
	private String phone;

	@Length(max = 100)
	private String venue;
 

	private Boolean signedConfidentialityAgreement = false;

	public Account() {
		this(null);
	}

	/**
	 * Creates a new account instance.
	 */
	public Account(Long id) {
		this.setId(id);
	}

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
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone
	 *            the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return the entityDisabled
	 */
	public boolean isEntityDisabled() {
		return entityDisabled;
	}

	/**
	 * @param entityDisabled
	 *            the entityDisabled to set
	 */
	public void setEntityDisabled(boolean entityDisabled) {
		this.entityDisabled = entityDisabled;
	}

	// Only used for registration
	/**
	 * @return the password
	 */
	public String getPassword() {
		return registrationPassword;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String registrationPassword) {
		this.registrationPassword = registrationPassword;
	}

	/**
	 * @return the accountType
	 */
	public String getAccountType() {
		return accountType;
	}

	/**
	 * @param accountType
	 *            the accountType to set
	 */
	public void setAccountType(String accountType) {
		this.accountType = accountType;
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
	 * @return the pending
	 */
	public boolean isPending() {
		return pending;
	}

	/**
	 * @param pending
	 *            the pending to set
	 */
	public void setPending(boolean pending) {
		this.pending = pending;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

 
	public String getVenue() {
		return venue;
	}

	public void setVenue(String venue) {
		this.venue = venue;
	}

	
	 
}
