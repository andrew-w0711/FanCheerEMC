package com.fancheerinteractive.emc.repo;

import com.fancheerinteractive.emc.domain.Account;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

/**
 * 
 * @author haffo
 */
public interface AccountRepository extends JpaRepository<Account, Long>,
		JpaSpecificationExecutor<Account> {

	/**
	 * Find an account by the username of the account. Username is unique.
	 * */
	@Query("select a from Account a where a.username = ?1")
	public Account findByTheAccountsUsername(String username);

	/**
	 * Find an account by the email address of the account. Email address is
	 * unique.
	 * */
	@Query("select a from Account a where a.email = ?1")
	public Account findByTheAccountsEmail(String email);

	/**
	 * 
	 * */
	@Query("select a from Account a where a.accountType = ?1")
	public List<Account> findByTheAccountsAccountType(String accountType);
}
