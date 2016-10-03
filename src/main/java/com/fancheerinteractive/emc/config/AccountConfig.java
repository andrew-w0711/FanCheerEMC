package com.fancheerinteractive.emc.config;

import java.util.Properties;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaDialect;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author Harold Affo
 */
@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@EnableJpaRepositories("com.fancheerinteractive.emc")
@PropertySource(value = { "classpath:serverAuthWeb.properties",
		"classpath:serverConfigurationWeb.properties" })
@ImportResource({ "classpath:security-config.xml" })
public class AccountConfig {

	@Autowired
	private Environment env;

	@Qualifier("fancheer_emc_datasource")
	@Bean
	public DataSource dataSource() {
		final JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
		dsLookup.setResourceRef(true);
		DataSource dataSource = dsLookup
				.getDataSource("jdbc/fancheer_jndi");
		return dataSource;
	}

	@Bean
	public ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource m = new ResourceBundleMessageSource();
		m.setBasename("messages");
		return m;
	}

	@Bean
	public org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean entityManagerFactory(
			DataSource dataSource, JpaVendorAdapter jpaVendorAdapter) {
		LocalContainerEntityManagerFactoryBean lef = new LocalContainerEntityManagerFactoryBean();
		lef.setDataSource(dataSource);
		lef.setPersistenceUnitName(env.getProperty("jpa.persistenceUnitName"));
		lef.setJpaVendorAdapter(jpaVendorAdapter);
		lef.setJpaProperties(jpaProperties());
		lef.setPackagesToScan("com.fancheerinteractive.emc.domain");
		lef.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
		return lef;
	}

	@Bean
	public JpaVendorAdapter jpaVendorAdapter() {
		HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
		jpaVendorAdapter.setShowSql(Boolean.getBoolean(env
				.getProperty("jpa.showSql")));
		jpaVendorAdapter.setGenerateDdl(Boolean.getBoolean(env
				.getProperty("jpa.generateDdl")));
		jpaVendorAdapter.setDatabase(Database.MYSQL);
		jpaVendorAdapter.setDatabasePlatform(env
				.getProperty("jpa.databasePlatform"));

		return jpaVendorAdapter;
	}

	private Properties jpaProperties() {
		Properties properties = new Properties();
		// properties.put("hibernate.cache.use_second_level_cache",
		// env.getProperty("hibernate.cache.use_second_level_cache"));
		// properties.put("hibernate.cache.region.factory_class",
		// env.getProperty("hibernate.cache.region.factory_class"));
		// properties.put("hibernate.cache.use_query_cache",
		// env.getProperty("hibernate.cache.use_query_cache"));
		properties.put("hibernate.hbm2ddl.auto",
				env.getProperty("hibernate.hbm2ddl.auto"));
		// properties.put("hibernate.dialect",
		// env.getProperty("hibernate.dialect"));
		properties.put("hibernate.globally_quoted_identifiers",
				env.getProperty("hibernate.globally_quoted_identifiers"));
		return properties;
	}

	@Bean
	public PlatformTransactionManager transactionManager(
			EntityManagerFactory entityManagerFactory) {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(entityManagerFactory);
		transactionManager.setJpaDialect(new HibernateJpaDialect());
		return transactionManager;
	}

	// @Bean
	// public org.springframework.orm.jpa.JpaTransactionManager
	// transactionManager(
	// EntityManagerFactory entityManagerFactory) {
	// JpaTransactionManager transactionManager = new JpaTransactionManager();
	// transactionManager.setEntityManagerFactory(entityManagerFactory);
	// // transactionManager.setJpaDialect(new HibernateJpaDialect());
	// return transactionManager;
	// }

	// @Bean
	// public JavaMailSenderImpl mailSender() {
	// JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
	// // mailSender.setHost(env.getProperty("mail.host"));
	// // mailSender.setPort(Integer.valueOf(env.getProperty("mail.port")));
	// // mailSender.setProtocol(env.getProperty("mail.protocol"));
	// // mailSender.setUsername(env.getProperty("mail.username"));
	// // mailSender.setPassword(env.getProperty("mail.password"));
	// // Properties javaMailProperties = new Properties();
	// // javaMailProperties.setProperty("mail.smtps.auth", "false");
	// // javaMailProperties.setProperty("mail.debug", "true");
	//
	// mailSender.setHost(env.getProperty("mail.host"));
	// mailSender.setPort(Integer.valueOf(env.getProperty("mail.port")));
	// mailSender.setProtocol(env.getProperty("mail.protocol"));
	// Properties javaMailProperties = new Properties();
	// javaMailProperties.setProperty("mail.smtp.auth",
	// env.getProperty("mail.auth"));
	// javaMailProperties.setProperty("mail.debug",
	// env.getProperty("mail.debug"));
	//
	// mailSender.setJavaMailProperties(javaMailProperties);
	// return mailSender;
	// }
	//
	// @Bean
	// PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
	// return new PersistenceExceptionTranslationPostProcessor();
	// }
	//
	// @Bean
	// public org.springframework.mail.SimpleMailMessage templateMessage() {
	// org.springframework.mail.SimpleMailMessage templateMessage = new
	// org.springframework.mail.SimpleMailMessage();
	// templateMessage.setFrom(env.getProperty("mail.from"));
	// templateMessage.setSubject(env.getProperty("mail.subject"));
	// return templateMessage;
	// }
}
