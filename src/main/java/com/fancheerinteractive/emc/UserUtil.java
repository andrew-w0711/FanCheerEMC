package com.fancheerinteractive.emc;

import java.util.Calendar;
import java.util.Random;

/**
 * 
 * @author haffo
 */
public class UserUtil {


	public static final String[] AUTHORITY_LIST = { "user", "customer",
			  "supervisor", "admin" };
	public static final String[] ACCOUNT_TYPE_LIST = { "customer",
		  "supervisor", "admin" };
	public static String generateRandom() {
		int mon = Calendar.getInstance().get(Calendar.MONTH);
		int yea = Calendar.getInstance().get(Calendar.YEAR);
		int secs = Calendar.getInstance().get(Calendar.SECOND);
		Random rmd = new Random(System.currentTimeMillis());
		int rmdFile = rmd.nextInt(1000);
		return "" + yea + mon + rmdFile + secs;
	}
}
