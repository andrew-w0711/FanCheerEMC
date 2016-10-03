package com.fancheerinteractive.emc.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.Iterator;
import java.util.Random;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fancheerinteractive.emc.dto.Json;

/**
 * @author Harold Affo
 * 
 */
@RestController
@PropertySource(value = {
"classpath:serverConfigurationWeb.properties" })
public class PromoController {
	

	@Autowired
	private Environment env;
	
	@RequestMapping(value = "/promo/uploadImage", method = RequestMethod.POST)
 	    public String handleFileUpload(MultipartHttpServletRequest request)
	            throws Exception {
		 	String venueCode = request.getParameter("venueCode");
		 	venueCode = venueCode != null && venueCode != "" ? venueCode:"default";
	        Iterator<String> itrator = request.getFileNames();
	        MultipartFile multiFile = request.getFile(itrator.next());
	                try {
  	            String fileName=multiFile.getOriginalFilename();
 	            byte[] bytes = multiFile.getBytes();
				String rootPath = env.getProperty("upload.promos.root");
				File dir = new File(rootPath + File.separator + venueCode);
				if (!dir.exists())
					dir.mkdirs();
				String ext = FilenameUtils.getExtension(fileName);
				String baseName =  FilenameUtils.getBaseName(fileName);
				File serverFile = new File(dir.getAbsolutePath()
						+ File.separator + baseName +  "-" + new Date().getTime()  + "." + ext);
				BufferedOutputStream stream = new BufferedOutputStream(
						new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();
				
				String name = venueCode +   File.separator  + serverFile.getName();
				 return name;
	        } catch (Exception e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	            throw new Exception("Error while loading the file");
	        }
 	    }
	 
}
