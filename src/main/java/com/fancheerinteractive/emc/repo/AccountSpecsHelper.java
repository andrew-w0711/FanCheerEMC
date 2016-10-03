package com.fancheerinteractive.emc.repo;

import com.fancheerinteractive.emc.domain.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

/**
 * 
 * @author haffo
 */
public class AccountSpecsHelper extends SpecsHelper<Account> {

	static final Logger logger = LoggerFactory
			.getLogger(AccountSpecsHelper.class);

	@Override
	public Specification<Account> getSpecificationFromString(String filterKey,
			String filterValue) {
		if ("accountType".equals(filterKey)) {
			return AccountSpecs.hasAccountType(filterValue);
		} else if ("company".equals(filterKey)) {
			return AccountSpecs.companyIsLike(filterValue);
		}
		return null;
	}

}
