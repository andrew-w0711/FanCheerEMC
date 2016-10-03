package com.fancheerinteractive.emc.config;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@Configuration
@EnableWebMvc
@ComponentScan({ "com.fancheerinteractive.emc" })
@Import({ AccountConfig.class })
public class WebAppConfig extends WebMvcConfigurerAdapter {

	@Override
	public void configureDefaultServletHandling(
			DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	} 
	
	 /*
	   * Here we register the Hibernate4Module into an ObjectMapper, then set this custom-configured
	   * ObjectMapper to the MessageConverter and return it to be added to the HttpMessageConverters of
	   * our application
	   */
	  public MappingJackson2HttpMessageConverter jacksonMessageConverter() {
	    MappingJackson2HttpMessageConverter messageConverter =
	        new MappingJackson2HttpMessageConverter();

	    ObjectMapper mapper = new ObjectMapper();
	    mapper.disable(SerializationFeature.INDENT_OUTPUT);
	    mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
	    mapper.setSerializationInclusion(Include.NON_NULL);

//	    // Registering Hibernate4Module to support lazy objects
//	    mapper.registerModule(new Hibernate4Module());

	    messageConverter.setObjectMapper(mapper);
	    return messageConverter;

	  }

	  public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
	    // Here we add our custom-configured HttpMessageConverter
	    converters.add(jacksonMessageConverter());
	    StringHttpMessageConverter stringConverter =
	        new StringHttpMessageConverter(Charset.forName("UTF-8"));
	    stringConverter.setSupportedMediaTypes(Arrays.asList( //
	        MediaType.TEXT_PLAIN, //
	        MediaType.TEXT_HTML, //
	        MediaType.APPLICATION_JSON));
	    converters.add(stringConverter);
	    super.configureMessageConverters(converters);
	  }

	  @Bean
	  public MultipartResolver multipartResolver() {
	    CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
	    return multipartResolver;
	  }

}
