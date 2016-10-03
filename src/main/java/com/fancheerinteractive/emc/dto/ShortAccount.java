package com.fancheerinteractive.emc.dto;

import java.io.Serializable;

/**
 * Class used to carry minimum necessary set of account information when needed
 * by users other than account holder and authorized users.
 * 
 * @author haffo
 * 
 */
public class ShortAccount implements Serializable {

	private static final long serialVersionUID = 20130625L;

	private String email;

	private Long id;

	private String fullName;
	private String phone;
	private String venue;
	private String username;
	private String accountType;
	private String title;

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
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	// /**
	// * @return the cehrTechnologies
	// */
	// public List<CehrTechnology> getCehrTechnologies() {
	// return cehrTechnologies == null ? cehrTechnologies = new
	// LinkedList<CehrTechnology>()
	// : cehrTechnologies;
	// }
	//
	// /**
	// * @param cehrTechnologies
	// * the cehrTechnologies to set
	// */
	// public void setCehrTechnologies(List<CehrTechnology> cehrTechnologies) {
	// this.cehrTechnologies = cehrTechnologies;
	// }

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
