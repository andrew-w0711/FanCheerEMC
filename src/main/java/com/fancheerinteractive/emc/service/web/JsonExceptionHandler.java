package com.fancheerinteractive.emc.service.web;

import com.fancheerinteractive.emc.dto.ResponseMessage;
import java.io.IOException;
import java.util.logging.Level;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * Called when an exception occurs during request processing. Transforms the
 * exception message into JSON format.
 */
@Component
public class JsonExceptionHandler implements HandlerExceptionResolver {
	private final ObjectMapper mapper = new ObjectMapper();

	static final Logger logger = LoggerFactory
			.getLogger(JsonExceptionHandler.class);

	@Override
	public ModelAndView resolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		try {
			if (ex instanceof AccessDeniedException) {
				logger.error("ERROR: Access Denied", ex);
				mapper.writeValue(response.getWriter(), new ResponseMessage(
						ResponseMessage.Type.danger, "accessDenied"));
			} else if (ex instanceof BadCredentialsException) {
				logger.error("ERROR: Bad Credentials", ex);
				mapper.writeValue(response.getWriter(), new ResponseMessage(
						ResponseMessage.Type.danger, ex.getMessage()));
			} else {
				logger.error("ERROR: " + ex.getMessage(), ex);
				mapper.writeValue(response.getWriter(), new ResponseMessage(
						ResponseMessage.Type.danger, "internalError"));
			}
		} catch (IOException e) {
			logger.error("ERROR: GAVE UP: " + e.getMessage(), e);
		} catch (RuntimeException ex1) {
			logger.error("ERROR: GAVE UP: " + ex1.getMessage(), ex1);
		}
		return new ModelAndView();
	}
}
