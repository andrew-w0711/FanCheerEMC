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
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

/**
 * Just return 401-unauthorized for every unauthorized request. The client side
 * catches this and handles login itself.
 */
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

	static final Logger logger = LoggerFactory
			.getLogger(JsonExceptionHandler.class);

	private final ObjectMapper mapper = new ObjectMapper();

	@Override
	public final void commence(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException authException)
			throws IOException {
		try {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

			if (authException instanceof BadCredentialsException) {
				logger.error("ERROR: Bad Credentials", authException);
				mapper.writeValue(response.getWriter(),
						new ResponseMessage(ResponseMessage.Type.danger,
								authException.getMessage()));

			} else if (authException instanceof DisabledException) {
				logger.error("ERROR: Disabled User", authException);
				mapper.writeValue(response.getWriter(),
						new ResponseMessage(ResponseMessage.Type.danger,
								authException.getMessage()));
			} else if (authException instanceof LockedException) {
				logger.error("ERROR: Locked User", authException);
				mapper.writeValue(response.getWriter(),
						new ResponseMessage(ResponseMessage.Type.danger,
								authException.getMessage()));
			} else if (authException instanceof CredentialsExpiredException) {
				logger.error("ERROR: Credentials Expired", authException);
				mapper.writeValue(response.getWriter(), new ResponseMessage(
						ResponseMessage.Type.danger,
						"accountCredentialsExpired"));
			} else if (authException instanceof AccountExpiredException) {
				logger.error("ERROR: Account Expired", authException);
				mapper.writeValue(response.getWriter(),
						new ResponseMessage(ResponseMessage.Type.danger,
								authException.getMessage()));
			} else {
				logger.debug("[Exception]: "
						+ authException.getClass().getSimpleName());
				logger.error("ERROR: Other Error", authException);
				mapper.writeValue(response.getWriter(), new ResponseMessage(
						ResponseMessage.Type.danger, "accessDenied"));
			}

		} catch (IOException e) {
			logger.error("ERROR: GAVE UP: " + e.getMessage(), e);
		}
		// response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
		// authException.getMessage());
	}
}
