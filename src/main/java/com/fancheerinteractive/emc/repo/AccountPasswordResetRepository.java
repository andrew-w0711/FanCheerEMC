package com.fancheerinteractive.emc.repo;

import com.fancheerinteractive.emc.domain.AccountPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * 
 * @author haffo
 */
public interface AccountPasswordResetRepository extends
		JpaRepository<AccountPasswordReset, Long> {

	/**
	 * Find an account by the username of the account. Username is unique.
	 * */
	@Query("select apr from AccountPasswordReset apr where apr.username = ?1")
	public AccountPasswordReset findByTheAccountsUsername(String username);
}
