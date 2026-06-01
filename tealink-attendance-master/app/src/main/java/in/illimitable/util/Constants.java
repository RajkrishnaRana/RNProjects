package in.illimitable.util;

import org.json.JSONObject;

/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class Constants {
    public static final String SITE_ID = "4";

    // public static JSONObject privileges;

    public static JSONObject weekly_calender_value = new JSONObject();
    public static final String STORAGE_SHARED_PREFERENCE_NAME = "STF_STORAGE_PREF";
    public static String BASE_URL = "";
    public static final String PROD_BASE_URL = "https://stf.illimitable.in/";
    public static final String STAGING_BASE_URL = "http://192.168.1.54:1350/";
    public static final String ACTION_GET_CLIENT_ALBUMS = "getclientalbums";
    public static final String ACTION_AUTHENTICATE_CLIENT = "getclientalbumauth";
    public static final String ACTION_GET_ALBUM_PHOTOS = "getalbumdetails";
    public static final String KEYSTORE_STRING = "1330392955980419481L";
    public static final long CUTOFF_TIME = 1598898600000L;

    public static final int MENU_HOME = 1;
    public static final int MENU_MY_PROFILE = 2;
    public static final int MENU_WORKERS = 3;
    public static final int MENU_IDENTIFY_WORKER = 4;
    public static final int MENU_TERMS_AND_CONDITIONS = 5;
    public static final int MENU_PRIVACY_POLICY = 6;
    public static final int MENU_SHARE = 7;
    public static final int MENU_SEND = 8;
    public static final int MENU_MARK_IN_TIME = 9;
    public static final int MENU_MARK_TIME = 10;
    public static final int MENU_PLUCKING_DETAILS = 11;
    public static final int MENU_NONPLUCKING_DETAILS = 12;
    // public static final int MENU_MARK_OUT_TIME = 12;
    public static final int MENU_PRINT = 13;
    public static final int MENU_SETTINGS = 14;
    public static final int MENU_NOTIFICATIONS = 15;
    public static final int MENU_LOGOUT = 16;

    public static int noOfCamera = 0;

    public static final boolean isStaging = true;
    /*static {
        if (isStaging) {
            BASE_URL = STAGING_BASE_URL;
        } else {
            BASE_URL = PROD_BASE_URL;
        }
    }*/

    public static JSONObject identifiedWorker = null;
    public static JSONObject selectedKamjari = null;
    public static JSONObject selectedSection = null;
    public static double measuredWeight = -1;
    public static double weightInKg = -1;
}
