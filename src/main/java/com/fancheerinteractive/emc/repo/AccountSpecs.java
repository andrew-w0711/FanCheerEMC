package com.fancheerinteractive.emc.repo;

import com.fancheerinteractive.emc.domain.Account;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

/**
 * 
 * @author haffo
 */
public class AccountSpecs {

	public static Specification<Account> hasAccountType(final String accountType) {
		return new Specification<Account>() {
			public Predicate toPredicate(Root<Account> root,
					CriteriaQuery<?> query, CriteriaBuilder builder) {
				return builder.equal(root.get("accountType"), accountType);
			}
		};
	}

	public static Specification<Account> companyIsLike(final String searchTerm) {
		return new Specification<Account>() {
			public Predicate toPredicate(Root<Account> root,
					CriteriaQuery<?> query, CriteriaBuilder builder) {
				return builder.like(
						builder.lower(root.<String> get("company")),
						getLikePattern(searchTerm));
			}

			private String getLikePattern(final String searchTerm) {
				StringBuilder pattern = new StringBuilder();
				pattern.append(searchTerm.toLowerCase());
				pattern.append("%");
				return pattern.toString();
			}
		};

	}
}
