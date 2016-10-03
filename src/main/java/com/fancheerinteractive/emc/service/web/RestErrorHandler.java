package com.fancheerinteractive.emc.service.web;

import com.fancheerinteractive.emc.dto.ResponseMessage;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 
 * @author haffo
 */
@ControllerAdvice
public class RestErrorHandler {

	static final Logger logger = LoggerFactory
			.getLogger(RestErrorHandler.class);

	@Autowired
	private MessageSource messageSource;

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ResponseMessage processValidationError(
			MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		String errorMessage = "validationError"
				+ this.processFieldErrors(result.getFieldErrors());
		return new ResponseMessage(ResponseMessage.Type.danger, errorMessage,
				"");
	}

	private String processFieldErrors(List<FieldError> fieldErrors) {

		StringBuilder sb = new StringBuilder();

		for (FieldError fieldError : fieldErrors) {
			String localizedErrorMessage = resolveLocalizedErrorMessage(fieldError);
			sb.append("\n");
			sb.append(fieldError.getField()).append(": ")
					.append(localizedErrorMessage);
		}

		String errorString = sb.toString();
		if (errorString.contains("exception")
				|| errorString.contains("Exception")) {
			return "Internal Error";
		} else {
			return sb.toString();
		}
	}

	private String resolveLocalizedErrorMessage(FieldError fieldError) {
		Locale currentLocale = LocaleContextHolder.getLocale();
		String localizedErrorMessage = messageSource.getMessage(fieldError,
				currentLocale);
		return localizedErrorMessage;
	}

}
