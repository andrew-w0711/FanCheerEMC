package com.fancheerinteractive.emc;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;

/**
 * 
 * @author haffo
 */
public class CustomSortHandler {

	static final Logger logger = LoggerFactory
			.getLogger(CustomSortHandler.class);

	String ARRAY_DELIMITOR = ",";
	String SORT_INFO_DELIMITOR = "::";
	List<String> sorts = null;

	public CustomSortHandler(List<String> sorts) {
		this.sorts = sorts;
	}

	public CustomSortHandler(String sorts) {
		try {
			this.sorts = sorts == null ? null : Arrays.asList(sorts
					.split(ARRAY_DELIMITOR));
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

	public Sort getSort() {
		if (sorts != null && !sorts.isEmpty()) {
			List<Sort.Order> ords = new LinkedList<Sort.Order>();
			for (String individualSort : sorts) {
				String sortField = "";
				String sortDirection = "";
				String[] sortInfo = individualSort.split(SORT_INFO_DELIMITOR);
				if (sortInfo.length == 2) {
					sortField = sortInfo[0];
					sortDirection = sortInfo[1];
					ords.add(new Sort.Order(Sort.Direction
							.fromString(sortDirection), sortField));
				} else {
					// TODO error
				}
			}
			return new Sort(ords);
		} else {
			return null;
		}
	}

}
