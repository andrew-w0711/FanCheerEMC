package com.fancheerinteractive.emc.config;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class WebAppInitializer implements WebApplicationInitializer {
	@Override
	public void onStartup(final ServletContext servletContext)
			throws ServletException {

		final AnnotationConfigWebApplicationContext root = new AnnotationConfigWebApplicationContext();
		root.setServletContext(servletContext);
		root.scan("com.fancheerinteractive.emc");
		// web app servlet
		servletContext.addListener(new ContextLoaderListener(root));
		Dynamic servlet = servletContext.addServlet("fancheer-emc",
				new DispatcherServlet(root));
		servlet.setLoadOnStartup(1);
		servlet.addMapping("/api/*");
		servlet.setAsyncSupported(true);

	}

	
	
	
}
