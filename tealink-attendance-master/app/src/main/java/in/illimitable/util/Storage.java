package in.illimitable.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.scottyab.aescrypt.AESCrypt;

import org.json.JSONObject;

/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class Storage {

    private SharedPreferences preferences;

    private static final String storageFolderPath = "STORAGE_FOLDER_PATH";
    private static final String tokenId = "FCM_TOKEN";
    private static final String enableLoging = "ENABLE_LOGGING";
    private static final String logFolderName = "LOG_FOLDER_NAME";
    private static final String companyId = "COMP_ID";
    private static final String lastLoginTime = "LAST_LOGIN_TIME";
    private static final String userName = "USER_NAME";
    private static final String privileges = "PRIVILEGES";
    private static final String userEmail = "USER_EMAIL";
    private static final String loginToken = "LOGIN_TOKEN";
    private static final String loginTokenKey = "LOGIN_TOKEN_KEY";
    private static final String userId = "USER_ID";
    private static final String loggedInStatus = "LOG_IN_STATUS";
    private static final String subscriptionEndDate = "SUBSCRIPTION_END_DATE";
    private static final String encryptedLoginId = "ENCRYPTED_LOGIN_ID";
    private static final String encryptedPassword = "ENCRYPTED_PASSWORD";
    private static final String lastSyncTime = "LAST_SYNC_TIME";
    private static final String LocationServiceStatus = "LOCATION_SERVICE_STATUS";
    private static final String GPSINTERVAL = "GPS_INTERVAL";
    private static final String dayStart = "DAY_START";
    private static final String dayEnd = "DAY_END";
    private static final String weeklyCalender = "WEEKLY_CALENDER";
    private static final String locationPostUrl = "LOCATION_POST_URL";
    private static final String weighingScaleName = "WEIGHING_SCALE_NAME";
    private static final String deviceId = "DEVICE_ID";
    private static final String deviceName = "DEVICE_NAME";
    private static final String tareWeight = "TARE_WEIGHT";
    private static final String moistureContent = "MOISTURE_CONTENT";
    private static final String standardDeviation = "STANDARD_DEVIATION";
    private static final String cutOffOne = "CUTOFF_ONE";
    private static final String cutOffTwo = "CUTOFF_TWO";
    private static final String cutOffThree = "CUTOFF_THREE";
    private static final String cutOffFour = "CUTOFF_FOUR";
    private static final String roundOff = "ROUND_OFF";
    private static final String modeOneShot = "MODE_ONE_SHOT";
    private static final String flashOnRecord = "FLASH_ON_RECORD";
    private static final String flashDuration = "FLASH_DURATION";
    private static final String exportedDate = "EXPORTED_DATE";
    private static final String lastWeighmentNumber = "LAST_WEIGHMENT_NO";
    private static final String lastWeighmentTime = "LAST_WEIGHMENT_TIME";
    // private static final String imageMandatory = "IMAGE_MANDATORY";
    private static final String enableDownloadImage = "ENABLE_DOWNLOAD_IMAGE";
    private static final String gardenConfig = "GARDEN_CONFIG";
    private static final String printTimeWise = "PRINT_TIME_WISE";
    private static final String lastVerifiedTimeZone = "LAST_VERIFIED_TIME_ZONE";
    private static final String lastVerifiedTime = "LAST_VERIFIED_TIME";
    private static final String allowWorkerUpdate = "ALLOW_WORKER_UPDATE";
    private static final String allowWorkerAssign = "ALLOW_WORKER_ASSIGN";

    public Storage(Context context) {
        preferences = context.getSharedPreferences(
                Constants.STORAGE_SHARED_PREFERENCE_NAME, Context.MODE_PRIVATE);
    }

    public String getTokenId() {
        return preferences.getString(Storage.tokenId, null);
    }

    public void setTokenId(String token) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.tokenId, token);
        editor.commit();
    }

    public String getStorageFolderPath() {
        return preferences.getString(Storage.storageFolderPath, null);
    }

    public void setStorageFolderPath(String path) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.storageFolderPath, path);
        editor.commit();
    }

    public String getWeighingScaleName() {
        return preferences.getString(Storage.weighingScaleName, "");
    }

    public void setWeighingScaleName(String name) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.weighingScaleName, name);
        editor.commit();
    }

    public String getDeviceId() {
        return preferences.getString(Storage.deviceId, "");
    }

    public void setDeviceId(String id) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.deviceId, id);
        editor.commit();
    }

    public String getDeviceName() {
        return preferences.getString(Storage.deviceName, "");
    }

    public void setDeviceName(String name) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.deviceName, name);
        editor.commit();
    }

    public boolean isEnableLoging() {
        return preferences.getBoolean(Storage.enableLoging, true);
    }

    public void setEnableLoging(boolean enableLoging) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.enableLoging, enableLoging);
        editor.commit();
    }

    public String getLogFolderName() {
        return preferences.getString(Storage.logFolderName, "stf");
    }

    public void setLogFolderName(String appFolderName) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.logFolderName, appFolderName);
        editor.commit();
    }

    public String getCompanyId() {
        return preferences.getString(Storage.companyId, null);
    }

    public void setCompanyId(String companyId) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.companyId, companyId);
        editor.commit();
    }

    public String getLoginToken() {
        return preferences.getString(Storage.loginToken, null);
    }

    public void setLoginToken(String loginToken) {
        SharedPreferences.Editor editor = preferences.edit();
        if(loginToken== null){
            editor.remove(Storage.loginToken);
        }else{
            editor.putString(Storage.loginToken, loginToken);
        }
        editor.commit();
    }

    public String getUserId() {
        return preferences.getString(Storage.userId, null);
    }

    public void setUserId(String userId) {
        SharedPreferences.Editor editor = preferences.edit();
        if(userId== null){
            editor.remove(Storage.userId);
        }else{
            editor.putString(Storage.userId, userId);
        }
        editor.commit();
    }

    public String getLoginTokenKey() {
        return preferences.getString(Storage.loginTokenKey, null);
    }

    public void setLoginTokenKey(String loginTokenKey) {
        SharedPreferences.Editor editor = preferences.edit();
        if(loginTokenKey == null){
            editor.remove(Storage.loginTokenKey);
        }else{
            editor.putString(Storage.loginTokenKey, loginTokenKey);
        }
        editor.commit();
    }

    public String getLastLoginTime() {
        return preferences.getString(Storage.lastLoginTime, "n/a");
    }

    public void setLastLoginTime(String lastLoginTime) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.lastLoginTime, lastLoginTime);
        editor.commit();
    }

    public String getUserName() {
        return preferences.getString(Storage.userName, "--");
    }

    public void setUserName(String userName) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.userName, userName);
        editor.commit();
    }

    public String getUserEmail() {
        return preferences.getString(Storage.userEmail, "--");
    }

    public void setUserEmail(String userEmail) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.userEmail, userEmail);
        editor.commit();
    }

    public float getStandardDeviation() {
        return preferences.getFloat(Storage.standardDeviation, 0.0f);
    }

    public void setStandardDeviation(float standardDeviation) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putFloat(Storage.standardDeviation, standardDeviation);
        editor.commit();
    }

    public float getMoistureContent() {
        return preferences.getFloat(Storage.moistureContent, 0.0f);
    }

    public void setMoistureContent(float moistureContent) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putFloat(Storage.moistureContent, moistureContent);
        editor.commit();
    }

    public float getTareWeight() {
        return preferences.getFloat(Storage.tareWeight, 0.0f);
    }

    public void setTareWeight(float tareWeight) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putFloat(Storage.tareWeight, tareWeight);
        editor.commit();
    }

    public JSONObject getPrivileges() {
        String privilegeStr = preferences.getString(Storage.privileges, "{}");
        try {
            JSONObject privileges = new JSONObject(privilegeStr);
            return privileges;
        } catch (Exception ex) {
            return new JSONObject();
        }
    }

    public void setPrivileges(JSONObject privileges) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.privileges, privileges.toString());
        editor.commit();
    }

    public String getAppName() {
        return "Smart Tea Farm";
    }

    public void setLoginStatus(boolean isLoggedIn) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.loggedInStatus, isLoggedIn);
        editor.commit();
    }

    public boolean isLoggedIn() {
        return preferences.getBoolean(Storage.loggedInStatus, false);
    }

    public void setSubscriptionEndDate(long subscriptionEndDate) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.subscriptionEndDate, subscriptionEndDate);
        editor.commit();
    }

    public long getSubscriptionEndDate() {
        return preferences.getLong(Storage.subscriptionEndDate, 0);
    }

    public String getLoginId() {
        String encryptedLoginId =  preferences.getString(Storage.encryptedLoginId, null);
        if(encryptedLoginId==null){
            return null;
        }else{
            try{
                return AESCrypt.decrypt(Constants.KEYSTORE_STRING, encryptedLoginId);
            }catch (Exception e){
                return null;
            }
        }
    }

    public void setLoginId(String loginId) {
        try{
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString(Storage.encryptedLoginId, AESCrypt.encrypt(Constants.KEYSTORE_STRING, loginId));
            editor.commit();
        }catch (Exception e){
        }

    }

    public String getPassword() {
        String encryptedPassword =  preferences.getString(Storage.encryptedPassword, null);
        if(encryptedPassword==null){
            return null;
        }else{
            try{
                return AESCrypt.decrypt(Constants.KEYSTORE_STRING, encryptedPassword);
            }catch (Exception e){
                return null;
            }
        }
    }

    public void setPassword(String password) {
        try{
            SharedPreferences.Editor editor = preferences.edit();
            editor.putString(Storage.encryptedPassword, AESCrypt.encrypt(Constants.KEYSTORE_STRING, password));
            editor.commit();
        }catch (Exception e){
        }
    }

    public long getLastSyncTime() {
        return preferences.getLong(Storage.lastSyncTime, System.currentTimeMillis());
    }

    public void setLastSyncTime(long lastSyncTime) {
        try{
            SharedPreferences.Editor editor = preferences.edit();
            editor.putLong(Storage.lastSyncTime, lastSyncTime);
            editor.commit();
        }catch (Exception e){
        }
    }

    public boolean isEnabledLocationService() {
        return preferences.getBoolean(Storage.LocationServiceStatus, true);
    }

    public void setEnabledLocationService(boolean enableLocationService) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.LocationServiceStatus, enableLocationService);
        editor.commit();
    }

    public long getGPSInterval() {
        return preferences.getLong(Storage.GPSINTERVAL, 10 * 60 * 1000);
    }

    public void setGPSInterval(long gPSINTERVAL) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.GPSINTERVAL, gPSINTERVAL);
        editor.commit();
    }

    public String getLocationPostUrl() {
        return preferences.getString(Storage.locationPostUrl, Constants.BASE_URL + "submit-user-location.json");
    }

    public void setLocationPostUrl(String locationPostUrl) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.locationPostUrl, locationPostUrl);
        editor.commit();
    }

    public String getDayStart() {
        return preferences.getString(Storage.dayStart, "0930");
    }

    public void setDayStart(String dayStart) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.dayStart, dayStart);
        editor.commit();
    }

    public String getDayEnd() {
        return preferences.getString(Storage.dayEnd, "1830");
    }

    public void setDayEnd(String dayEnd) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.dayEnd, dayEnd);
        editor.commit();
    }

    public JSONObject getWeeklyCalender() {
        String weekly_calender_string = preferences.getString(Storage.weeklyCalender, null);
        if (weekly_calender_string == null) {
            return Constants.weekly_calender_value;
        } else {
            try {
                return new JSONObject(weekly_calender_string);
            } catch (Exception ex) {
                return Constants.weekly_calender_value;
            }
        }
    }

    public void setWeeklyCalender(JSONObject weeklyCalender) {
        if(weeklyCalender == null){
            return;
        }
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.weeklyCalender, weeklyCalender.toString());
        editor.commit();
    }

    public void setFirstCutOff(long firstCutOff) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.cutOffOne, firstCutOff);
        editor.commit();
    }

    public long getFirstCutOff() {
        return preferences.getLong(Storage.cutOffOne, 27000000);
    }

    public void setSecondCutOff(long secondCutOff) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.cutOffTwo, secondCutOff);
        editor.commit();
    }

    public long getSecondCutOff() {
        return preferences.getLong(Storage.cutOffTwo, 34200000);
    }

    public void setThirdCutOff(long thirdCutOff) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.cutOffThree, thirdCutOff);
        editor.commit();
    }

    public long getThirdCutOff() {
        return preferences.getLong(Storage.cutOffThree, 48600000);
    }

    public void setFourthCutOff(long thirdCutOff) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.cutOffFour, thirdCutOff);
        editor.commit();
    }

    public long getFourthCutOff() {
        return preferences.getLong(Storage.cutOffFour, 59400000);
    }


    public String getRoundOff() {
        return preferences.getString(Storage.roundOff, "floor");
    }

    public void setRoundOff(String roundOff) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.roundOff, roundOff);
        editor.commit();
    }

    public boolean isModeOneShot() {
        return preferences.getBoolean(Storage.modeOneShot, true);
    }

    public void setOneShotMode(boolean oneshot) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.modeOneShot, oneshot);
        editor.commit();
    }

    public boolean flashOnRecord() {
        return preferences.getBoolean(Storage.flashOnRecord, false);
    }

    public void setFlashOnRecord(boolean flash) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.flashOnRecord, flash);
        editor.commit();
    }

    public int getFlashDuration() {
        return preferences.getInt(Storage.flashDuration, 0);
    }

    public void setFlashDuration(int duration) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putInt(Storage.flashDuration, duration);
        editor.commit();
    }

    public void setExportedDate(long date) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.exportedDate, date);
        editor.commit();
    }

    public long getExportedDate() {
        return preferences.getLong(Storage.exportedDate, 0);
    }

    public void setLastWeighmentNumber(int weighment) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putInt(Storage.lastWeighmentNumber, weighment);
        editor.putLong(Storage.lastWeighmentTime, System.currentTimeMillis());
        editor.commit();
    }

    public int getLastWeighmentNumber() {
        return preferences.getInt(Storage.lastWeighmentNumber, 0);
    }

    public long getLastWeighmentTime() {
        return preferences.getLong(Storage.lastWeighmentTime, 0);
    }

    /*public void setImageMandatory(boolean isLoggedIn) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.imageMandatory, isLoggedIn);
        editor.commit();
    }

    public boolean isImageMadatory() {
        return preferences.getBoolean(Storage.imageMandatory, false);
    }*/

    public boolean getEnableDownloadImage() {
        return preferences.getBoolean(Storage.enableDownloadImage, true);
    }

    public void setEnableDownloadImage(boolean flag) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.enableDownloadImage, flag);
        editor.commit();
    }

    public JSONObject getGardenConfig() {
        String gardenConfig = preferences.getString(Storage.gardenConfig, "{}");
        try {
            JSONObject config = new JSONObject(gardenConfig);
            return config;
        } catch (Exception ex) {
            return new JSONObject();
        }
    }

    public void setGardenConfig(JSONObject input) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(Storage.gardenConfig, input.toString());
        editor.commit();
    }

    public boolean printTimeWise() {
        return preferences.getBoolean(Storage.printTimeWise, false);
    }

    public void setPrintTimeWise(boolean input) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.printTimeWise, input);
        editor.commit();
    }

    public long getLastVerifiedTimeZone() {
        return  preferences.getLong(Storage.lastVerifiedTimeZone, -1);
    }

    public void setLastVerifiedTimeZone(long input) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.lastVerifiedTimeZone, input);
        editor.commit();
    }

    public long getLastVerifiedTime() {
        return  preferences.getLong(Storage.lastVerifiedTime, -1);
    }

    public void setLastVerifiedTime(long input) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putLong(Storage.lastVerifiedTime, input);
        editor.commit();
    }

    public boolean isWorkerUpdateAllowed() {
        return preferences.getBoolean(Storage.allowWorkerUpdate, false);
    }

    public void setWorkerUpdateAllowed(boolean allowWorkerUpdate) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.allowWorkerUpdate, allowWorkerUpdate);
        editor.commit();
    }

    public boolean isWorkerAssignAllowed() {
        return preferences.getBoolean(Storage.allowWorkerAssign, false);
    }

    public void setWorkerAssignAllowed(boolean allowWorkerUpdate) {
        SharedPreferences.Editor editor = preferences.edit();
        editor.putBoolean(Storage.allowWorkerAssign, allowWorkerUpdate);
        editor.commit();
    }
}
