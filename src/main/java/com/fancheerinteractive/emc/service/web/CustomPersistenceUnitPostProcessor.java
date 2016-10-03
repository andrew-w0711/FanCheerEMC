package com.fancheerinteractive.emc.service.web;

import java.util.Map.Entry;
import java.util.Properties;

import org.springframework.orm.jpa.persistenceunit.MutablePersistenceUnitInfo;
import org.springframework.orm.jpa.persistenceunit.PersistenceUnitPostProcessor;

/**
 * @author Dom
 * 
 *         Jul 29, 2009 PMS
 */
public class CustomPersistenceUnitPostProcessor implements
		PersistenceUnitPostProcessor {

	Properties persistenceProperties;

	/**
	 * @return the persistenceProperties
	 */
	public Properties getPersistenceProperties() {
		return persistenceProperties;
	}

	/**
	 * @param persistenceProperties
	 *            the persistenceProperties to set
	 */
	public void setPersistenceProperties(Properties persistenceProperties) {
		this.persistenceProperties = persistenceProperties;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.orm.jpa.persistenceunit.PersistenceUnitPostProcessor
	 * #postProcessPersistenceUnitInfo
	 * (org.springframework.orm.jpa.persistenceunit.MutablePersistenceUnitInfo)
	 */
	@Override
	public void postProcessPersistenceUnitInfo(MutablePersistenceUnitInfo arg0) {
		for (Entry<Object, Object> e : persistenceProperties.entrySet()) {
			arg0.addProperty(e.getKey().toString(), e.getValue().toString());
		}
	}

}
// End of Class
