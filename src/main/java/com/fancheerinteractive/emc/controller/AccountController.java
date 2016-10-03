package com.fancheerinteractive.emc.controller;

import com.fancheerinteractive.emc.CustomSortHandler;
import com.fancheerinteractive.emc.UserUtil;
import com.fancheerinteractive.emc.domain.Account;
import com.fancheerinteractive.emc.domain.AccountPasswordReset;
import com.fancheerinteractive.emc.dto.AccountChangeCredentials;
import com.fancheerinteractive.emc.dto.CurrentUser;
import com.fancheerinteractive.emc.dto.ResponseMessage;
import com.fancheerinteractive.emc.dto.ShortAccount;
import com.fancheerinteractive.emc.repo.AccountPasswordResetRepository;
import com.fancheerinteractive.emc.repo.AccountRepository;
import com.fancheerinteractive.emc.repo.AccountSpecsHelper;
import com.fancheerinteractive.emc.service.UserService;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.springframework.data.jpa.domain.Specifications.where;

import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

/**
 * @author Harold Affo
 * 
 */
@RestController
public class AccountController {

	static final Logger logger = LoggerFactory
			.getLogger(AccountController.class);

	public final String DEFAULT_PAGE_SIZE = "0";

	@Value("${unauthenticated.registration.authorized.accountType}")
	private String AUTHORIZED_ACCOUNT_TYPE_UNAUTH_REG;

	// @Value("${server.scheme}")
	// private String SERVER_SCHEME;
	//
	// @Value("${server.hostname}")
	// private String SERVER_HOSTNAME;
	//
	// @Value("${server.port}")
	// private String SERVER_PORT;

	@Value("${server.email}")
	private String SERVER_EMAIL;

	@Value("${admin.email}")
	private String ADMIN_EMAIL;

	public AccountController() {

	}

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	UserService userService;


	@Autowired
	AccountPasswordResetRepository accountResetPasswordRepository;
	

	
	@RequestMapping(value = "/accounts/{id}", method = RequestMethod.GET)
	public Account getAccountById(@PathVariable Long id) {

		Account acc = accountRepository.findOne(id);

		if (acc == null || acc.isEntityDisabled()) {
			return null;
		} else {
			return acc;
		}
	}

	@PreAuthorize("hasPermission(#id, 'accessAccountBasedResource')")
	@RequestMapping(value = "/accounts/{id}", method = RequestMethod.POST)
	public ResponseMessage updateAccountById(@PathVariable Long id,
			@Valid @RequestBody Account account) {

		Account acc = accountRepository.findOne(id);
		if (acc == null || acc.isEntityDisabled()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"badAccount", id.toString());
		} else {
			// Validation
			if (account.getEmail() == null || account.getEmail().isEmpty()) {
				return new ResponseMessage(ResponseMessage.Type.danger,
						"emptyEmail", account.getEmail());
			}
			if (!acc.getEmail().equalsIgnoreCase(account.getEmail())
					&& accountRepository.findByTheAccountsEmail(account
							.getEmail()) != null) {
				return new ResponseMessage(ResponseMessage.Type.danger,
						"duplicateEmail", account.getEmail());
			}

			acc.setVenue(account.getVenue());
			acc.setFullName(account.getFullName());
			acc.setEmail(account.getEmail());
			acc.setPhone(account.getPhone());
			acc.setVenue(account.getVenue());

			accountRepository.save(acc);

			return new ResponseMessage(ResponseMessage.Type.success,
					"accountUpdated", acc.getId().toString());
		}
	}
	
	/**
	 * 
	 * */
	@PreAuthorize("hasPermission(#id, 'accessAccountBasedResource')")
	@RequestMapping(value = "/accounts/{id}", method = RequestMethod.DELETE)
	public ResponseMessage deleteAccountById(@PathVariable Long id) {

		Account acc = accountRepository.findOne(id);

		if (acc == null || acc.isEntityDisabled()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"badAccount", id.toString());
		} else {
			User u = userService.retrieveUserByUsername(acc.getUsername());
			if (u == null || !u.isEnabled()) {
				return new ResponseMessage(ResponseMessage.Type.danger,
						"badAccount", id.toString());
			} else {
				logger.debug("^^^^^^^^^^^^^^^^ about to disable user "
						+ acc.getUsername() + " ^^^^^^^^^^^^^^^^^");
				userService.disableUser(acc.getUsername());
				acc.setEntityDisabled(true);
				logger.debug("^^^^^^^^^^^^^^^^ about to save ^^^^^^^^^^^^^^^^^");
				accountRepository.save(acc);
				logger.debug("^^^^^^^^^^^^^^^^ saved ^^^^^^^^^^^^^^^^^");
				return new ResponseMessage(ResponseMessage.Type.success,
						"deletedAccount", id.toString());
			}
		}
	}



	
	/**
	 * User wants to log in
	 * */
	@RequestMapping(value = "/accounts/login", method = RequestMethod.GET)
	public ResponseMessage doNothing() {
		return new ResponseMessage(ResponseMessage.Type.success,
				"loginSuccess", "succes");
	}

	/**
	 * 
	 * */
	@RequestMapping(value = "/accounts/cuser", method = RequestMethod.GET)
	public CurrentUser getCUser() {
		User u = userService.getCurrentUser();
		CurrentUser cu = null;
		if (u != null && u.isEnabled()) {
			Account a = accountRepository.findByTheAccountsUsername(u
					.getUsername());
			cu = new CurrentUser();
			cu.setUsername(u.getUsername());
			cu.setAccountId(a.getId());
			cu.setAuthenticated(true);

			cu.setAuthorities(u.getAuthorities());

		}

		return cu;
	} 
	
	/**
	 * Unauthenticated user registers himself accountType -> (customer)
	 * 
	 * {\"username\":\"\" , \"password\":\"\" , \"firstname\":\"\" ,
	 * \"lastname\":\"\" , \"email\":\"\" , \"company\":\"\" ,
	 * \"signedConfidentialAgreement\":\"\" }
	 * */
	@RequestMapping(value = "/sooa/accounts/register", method = RequestMethod.POST)
	public ResponseMessage registerUserWhenNotAuthenticated(
			@RequestBody Account account) {

		// validate entry
		boolean validEntry = true;
		validEntry = userService.userExists(account.getUsername()) == true ? validEntry = false
				: validEntry;
		validEntry = accountRepository.findByTheAccountsEmail(account
				.getEmail()) != null ? validEntry = false : validEntry;
		validEntry = accountRepository.findByTheAccountsUsername(account
				.getUsername()) != null ? validEntry = false : validEntry;
		
		if (!validEntry) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"duplicateInformation", null);
		}

		Set<String> authAccT = StringUtils
				.commaDelimitedListToSet(AUTHORIZED_ACCOUNT_TYPE_UNAUTH_REG);

		if (account.getAccountType() == null
				|| !authAccT.contains(account.getAccountType())) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"accountTypeNotValid", null);
		}

		// create new user with provider role
		try {
			userService.createUserWithAuthorities(account.getUsername(),
					account.getPassword(), "user," + account.getAccountType());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			return new ResponseMessage(ResponseMessage.Type.danger,
					"errorWithUser", null);
		}

		// create account
		Account registeredAccount = new Account();
		try {
			// Make sure only desired data gets persisted
			registeredAccount.setUsername(account.getUsername());
			registeredAccount.setAccountType(account.getAccountType());
			registeredAccount.setVenue(account.getVenue());
			registeredAccount.setFullName(account.getFullName());
			registeredAccount.setPhone(account.getPhone());
			registeredAccount.setEmail(account.getEmail());
			registeredAccount.setVenue(account.getVenue());
			registeredAccount.setSignedConfidentialityAgreement(account
					.getSignedConfidentialityAgreement());

			accountRepository.save(registeredAccount);
		} catch (Exception e) {
			userService.deleteUser(account.getUsername());
			logger.error(e.getMessage(), e);
			return new ResponseMessage(ResponseMessage.Type.danger,
					"errorWithAccount", null);
		}

		// generate and send email
		this.sendRegistrationNotificationToAdmin(account);
		this.sendApplicationConfirmationNotification(account);

		return new ResponseMessage(ResponseMessage.Type.success, "userAdded",
				registeredAccount.getId().toString(), "true");
	}

	/**
	 * User forgot his password and requests a password reset
	 * */
	@RequestMapping(value = "/sooa/accounts/passwordreset", method = RequestMethod.POST)
	public ResponseMessage requestAccountPasswordReset(
			@RequestParam(required = false) String username,
			HttpServletRequest request) throws Exception {

		Account acc = null;

		if (username != null) {
			acc = accountRepository.findByTheAccountsUsername(username);
			if (acc == null) {
				acc = accountRepository.findByTheAccountsEmail(username);
			}
		} else {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"noUsernameOrEmail", null);
		}

		if (acc == null) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"wrongUsernameOrEmail", null);
		}

		User user = userService.retrieveUserByUsername(acc.getUsername());

		// start password reset process (for reset)
		// Create reset token. First get accountPasswordReset element from the
		// repository. If null create it.
		AccountPasswordReset arp = accountResetPasswordRepository
				.findByTheAccountsUsername(acc.getUsername());
		if (arp == null) {
			arp = new AccountPasswordReset();
			arp.setUsername(acc.getUsername());
		}

		arp.setCurrentToken(arp.getNewToken());
		arp.setTimestamp(new Date());
		arp.setNumberOfReset(arp.getNumberOfReset() + 1);

		accountResetPasswordRepository.save(arp);
		//
		// String port = "";
		// if (SERVER_PORT != null && !SERVER_PORT.isEmpty()) {
		// port = ":" + SERVER_PORT;
		// }

		// Generate url and email
		String url = getUrl(request) + "/#/resetPassword?userId="
				+ user.getUsername() + "&username=" + acc.getUsername()
				+ "&token="
				+ UriUtils.encodeQueryParam(arp.getCurrentToken(), "UTF-8");

		// System.out.println("****************** "+url+" *******************");

		// generate and send email
		this.sendAccountPasswordResetRequestNotification(acc, url);

		return new ResponseMessage(ResponseMessage.Type.success,
				"resetRequestProcessed", acc.getId().toString());
	}

	/**
	 * User wants to change his password when already logged in
	 * */
	@PreAuthorize("hasPermission(#accountId, 'accessAccountBasedResource')")
	@RequestMapping(value = "/accounts/{accountId}/passwordchange", method = RequestMethod.POST)
	public ResponseMessage changeAccountPassword(
			@RequestBody AccountChangeCredentials acc,
			@PathVariable Long accountId) {

		// check there is a username in the request
		if (acc.getUsername() == null || acc.getUsername().isEmpty()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"usernameMissing", null);
		}

		if (acc.getNewPassword() == null || acc.getNewPassword().length() < 4) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"invalidPassword", null);
		}

		Account onRecordAccount = accountRepository.findOne(accountId);
		if (!onRecordAccount.getUsername().equals(acc.getUsername())) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"invalidUsername", null);
		}

		userService.changePasswordForPrincipal(acc.getPassword(),
				acc.getNewPassword());

		// send email notification
		this.sendChangeAccountPasswordNotification(onRecordAccount);

		return new ResponseMessage(ResponseMessage.Type.success,
				"accountPasswordReset", onRecordAccount.getId().toString());
	}

	/**
	 * User has to change his password and accept the agreement to complete the
	 * registration process
	 * */
	@RequestMapping(value = "/sooa/accounts/{userId}/passwordreset", method = RequestMethod.POST, params = "token")
	public ResponseMessage resetAccountPassword(@RequestBody Account acc,
			@PathVariable String userId,
			@RequestParam(required = true) String token) {

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ -5 ^^^^^^^^^^^^^^^^^^");

		// check there is a username in the request
		if (acc.getUsername() == null || acc.getUsername().isEmpty()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"usernameMissing", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ -4 ^^^^^^^^^^^^^^^^^^");

		AccountPasswordReset apr = accountResetPasswordRepository
				.findByTheAccountsUsername(acc.getUsername());

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ -3 ^^^^^^^^^^^^^^^^^^");

		// check there is a reset request on record
		if (apr == null) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"noResetRequestFound", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ -2 ^^^^^^^^^^^^^^^^^^");

		// check that for username, the token in record is the token passed in
		// request
		if (!apr.getCurrentToken().equals(token)) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"incorrectToken", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ -1 ^^^^^^^^^^^^^^^^^^");

		// check token is not expired
		if (apr.isTokenExpired()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"expiredToken", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 0 ^^^^^^^^^^^^^^^^^^");

		User onRecordUser = userService.retrieveUserByUsername(userId);

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ "+onRecordUser.getPassword()+" ^^^^^^^^^^^^^^^^^^");

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 1 ^^^^^^^^^^^^^^^^^^");

		Account onRecordAccount = accountRepository
				.findByTheAccountsUsername(acc.getUsername());

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 2 ^^^^^^^^^^^^^^^^^^");

		userService.changePasswordForUser(onRecordUser.getPassword(),
				acc.getPassword(), userId);
		if (!onRecordUser.isCredentialsNonExpired()) {
			userService.enableUserCredentials(userId);
		}
		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 3 ^^^^^^^^^^^^^^^^^^");

		// send email notification
		this.sendResetAccountPasswordNotification(onRecordAccount);

		return new ResponseMessage(ResponseMessage.Type.success,
				"accountPasswordReset", onRecordAccount.getId().toString());
	}

	/**
	 * 
	 * */
	@RequestMapping(value = "/sooa/accounts/register/{userId}/passwordreset", method = RequestMethod.POST, params = "token")
	public ResponseMessage resetRegisteredAccountPassword(
			@RequestBody AccountChangeCredentials racc,
			@PathVariable String userId,
			@RequestParam(required = true) String token) {

		// check there is a username in the request
		if (racc.getUsername() == null || racc.getUsername().isEmpty()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"usernameMissing", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 0 ^^^^^^^^^^^^^^^^^^");

		AccountPasswordReset apr = accountResetPasswordRepository
				.findByTheAccountsUsername(racc.getUsername());

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 1 ^^^^^^^^^^^^^^^^^^");

		// check there is a reset request on record
		if (apr == null) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"noResetRequestFound", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 2 ^^^^^^^^^^^^^^^^^^");

		// check that for username, the token in record is the token passed in
		// request
		if (!apr.getCurrentToken().equals(token)) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"incorrectToken", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 3 ^^^^^^^^^^^^^^^^^^");

		// check token is not expired
		if (apr.isTokenExpired()) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"expiredToken", null);
		}

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 4 "+userId+" ^^^^^^^^^^^^^^^^^^");

		User onRecordUser = userService.retrieveUserByUsername(userId);
		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ "+onRecordUser.getPassword()+" ^^^^^^^^^^^^^^^^^^");

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 5 ^^^^^^^^^^^^^^^^^^");

		Account onRecordAccount = accountRepository
				.findByTheAccountsUsername(racc.getUsername());

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 6 ^^^^^^^^^^^^^^^^^^");

		// change the password
		userService.changePasswordForUser(onRecordUser.getPassword(),
				racc.getPassword(), userId);
		if (!onRecordUser.isCredentialsNonExpired()) {
			userService.enableUserCredentials(userId);
		}
		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 7 ^^^^^^^^^^^^^^^^^^");

		// update the agreement
		onRecordAccount.setSignedConfidentialityAgreement(racc
				.getSignedConfidentialityAgreement());
		onRecordAccount.setPending(false);
		accountRepository.save(onRecordAccount);

		// logger.debug("^^^^^^^^^^^^^^^^^^^^^ 8 ^^^^^^^^^^^^^^^^^^");
		Long expireTokenTime = (new Date()).getTime()
				- AccountPasswordReset.tokenValidityTimeInMilis;
		Date expireTokenDate = new Date();
		expireTokenDate.setTime(expireTokenTime);
		apr.setTimestamp(expireTokenDate);
		accountResetPasswordRepository.save(apr);

		// send email notification
		this.sendResetRegistrationAccountPasswordNotification(onRecordAccount);

		return new ResponseMessage(ResponseMessage.Type.success,
				"registeredAccountPasswordReset", onRecordAccount.getId()
						.toString());
	}

	/**
	 * 
	 * */
	@RequestMapping(value = "/sooa/accounts/forgottenusername", method = RequestMethod.GET)
	public ResponseMessage retrieveForgottenUsername(@RequestParam String email) {

		if (email == null || email.isEmpty()) {
			return new ResponseMessage(ResponseMessage.Type.danger, "badEmail",
					email);
		}

		Account acc = accountRepository.findByTheAccountsEmail(email);
		if (acc == null) {
			return new ResponseMessage(ResponseMessage.Type.danger,
					"noEmailRecords", email);
		}

		// send email with username
		this.sendRetrieveForgottenUsernameNotification(acc);

		return new ResponseMessage(ResponseMessage.Type.success,
				"usernameFound", email);

	}

	/* Other */

	@RequestMapping(value = "/sooa/emails/{email:.*}", method = RequestMethod.GET)
	public ResponseMessage accountEmailExist(@PathVariable String email,
			@RequestParam(required = false) String email1) {

		if (accountRepository.findByTheAccountsEmail(email) != null) {
			return new ResponseMessage(ResponseMessage.Type.success,
					"emailFound", email);
		} else {
			return new ResponseMessage(ResponseMessage.Type.success,
					"emailNotFound", email);
		}
	}

	@RequestMapping(value = "/sooa/usernames/{username}", method = RequestMethod.GET)
	public ResponseMessage accountUsernameExist(@PathVariable String username) {

		if (accountRepository.findByTheAccountsUsername(username) != null) {
			return new ResponseMessage(ResponseMessage.Type.success,
					"usernameFound", username);
		} else {
			return new ResponseMessage(ResponseMessage.Type.success,
					"usernameNotFound", username);
		}
	}
	

	private void sendApplicationConfirmationNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		// msg.setSubject("Fancheer Express Management Console Application Received");
		// msg.setTo(acc.getEmail());
		// msg.setText("Dear "
		// + acc.getUsername()
		// + " \n\n"
		// +
		// "Thank you for submitting an application for use of the Fancheer Express Management Console. You will be notified via email (using the email address you provided in your application) as to whether your application is approved or not approved."
		// + "\n\n" + "Sincerely, " + "\n\n" +
		// "The Fancheer Express Management Console Team"
		// + "\n\n" + "P.S: If you need help, contact us at '"
		// + ADMIN_EMAIL + "'");
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendAccountRegistrationNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setSubject("Welcome! You are successfully registered on Fancheer Express Management Console");
		// msg.setTo(acc.getEmail());
		// msg.setText("Dear " + acc.getUsername() + " \n\n"
		// +
		// "You've successfully registered on the Fancheer Express Management Console Site."
		// + " \n" + "Your username is: " + acc.getUsername() + " \n\n"
		// + "Please refer to the user guide for the detailed steps. "
		// + "\n\n" + "Sincerely, " + "\n\n" +
		// "The Fancheer Express Management Console Team"
		// + "\n\n"
		// + "P.S: If you need help, contact us at '@'");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendRegistrationNotificationToAdmin(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		// msg.setSubject("New Registration Application on Fancheer Express Management Console");
		// msg.setTo(ADMIN_EMAIL);
		// msg.setText("Hello Admin,  \n A new application has been submitted by "
		// + acc.getFullName() + " with username=" + acc.getUsername()
		// + " \n\n" + " and is waiting for approval." + "\n\n"
		// + "Sincerely, " + "\n\n" +
		// "The Fancheer Express Management Console Team" + "\n\n");
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendAccountRegistrationPasswordResetNotification(Account acc,
			String url) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Registration Notification ");
		// msg.setText("Dear "
		// + acc.getUsername()
		// + " \n\n"
		// +
		// "**** If you have not requested a new account, please disregard this email **** \n\n\n"
		// + "Your account request has been processed and you can proceed "
		// + "to login .\n"
		// + "You need to change your password in order to login.\n"
		// +
		// "Copy and paste the following url to your browser to initiate the password change:\n"
		// + url + " \n\n"
		// + "Please refer to the user guide for the detailed steps. "
		// + "\n\n" + "Sincerely, " + "\n\n" +
		// "The Fancheer Express Management Console Team"
		// + "\n\n" + "P.S: If you need help, contact us at ''");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendAccountPasswordResetRequestNotification(Account acc,
			String url) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Password Reset Request Notification");
		// msg.setText("Dear "
		// + acc.getUsername()
		// + " \n\n"
		// +
		// "**** If you have not requested a password reset, please disregard this email **** \n\n\n"
		// + "You password reset request has been processed.\n"
		// +
		// "Copy and paste the following url to your browser to initiate the password change:\n"
		// + url + " \n\n" + "Sincerely, " + "\n\n" +
		// "The Fancheer Express Management Console Team"
		// + "\n\n" + "P.S: If you need help, contact us at ''");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendChangeAccountPasswordNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Password Change Notification");
		// msg.setText("Dear " + acc.getUsername() + " \n\n"
		// + "Your password has been successfully changed." + " \n\n"
		// + "Sincerely,\n\n" + "The Fancheer Express Management Console Team");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendResetAccountPasswordNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Password Rest Notification");
		// msg.setText("Dear " + acc.getUsername() + " \n\n"
		// + "Your password has been successfully reset." + " \n"
		// + "Your username is: " + acc.getUsername() + " \n\n"
		// + "Sincerely,\n\n" + "The Fancheer Express Management Console Team");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendResetRegistrationAccountPasswordNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Registration and Password Notification");
		// msg.setText("Dear " + acc.getUsername() + " \n\n"
		// + "Your password has been successfully set." + " \n"
		// + "Your username is: " + acc.getUsername() + " \n"
		// +
		// "Your registration with the Fancheer Express Management Console is complete."
		// + " \n\n" + "Sincerely,\n\n" +
		// "The Fancheer Express Management Console Team");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private void sendRetrieveForgottenUsernameNotification(Account acc) {
		// SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
		//
		// msg.setTo(acc.getEmail());
		// msg.setSubject("Fancheer Express Management Console Username Notification");
		// msg.setText("Dear " + acc.getUsername() + " \n\n"
		// + "Your username is: " + acc.getUsername() + " \n\n"
		// + "Sincerely,\n\n" + "The Fancheer Express Management Console Team");
		//
		// try {
		// this.mailSender.send(msg);
		// } catch (MailException ex) {
		// logger.error(ex.getMessage(), ex);
		// }
	}

	private String generateNextUsername(String accountType) throws Exception {

		StringBuffer result = new StringBuffer();

		if (accountType.equals("provider")) {
			result.append("P-");
		} else if (accountType.equals("authorizedVendor")) {
			result.append("AV-");
		} else if (accountType.equals("supervisor")) {
			result.append("S-");
		} else if (accountType.equals("admin")) {
			result.append("A-");
		} else {
			result.append("U-");
		}

		int MAX_RETRY = 10;
		int retry = 0;
		while (userService.userExists(result.append(UserUtil.generateRandom())
				.toString())) {
			if (retry == MAX_RETRY) {
				throw new Exception("Can't generate username");
			}
			result.append(UserUtil.generateRandom()).toString();
			retry++;
		}

		return result.toString();
	}

	private String getUrl(HttpServletRequest request) {
		String scheme = request.getScheme();
		String host = request.getHeader("Host");
		return scheme + "://" + host + "/FancheerEMC";
	}


}
