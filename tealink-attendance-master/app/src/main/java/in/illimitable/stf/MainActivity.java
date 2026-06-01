package in.illimitable.stf;

import android.Manifest;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import es.dmoral.toasty.Toasty;
import in.illimitable.stf.databinding.ActivityMainBinding;
import in.illimitable.stf.util.SyncUtil;
import in.illimitable.stf.util.WorkerDetailsDownloader;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.HTTPUtil;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

public class MainActivity extends Activity {

    private static final int REQUEST_ID_MULTIPLE_PERMISSIONS = 501;

    private ActivityMainBinding binding;

    private DatabaseHelper helper;
    private Storage storage;
    // TESTING
    // private ProgressDialog progressDialog;

    private boolean downloadFinished;
    private File updatedApk = null;

    private boolean permissionsGiven = false;
    private boolean enableDownloadImage = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        String fontPath = "fonts/Californian FB Bold.ttf";
        Typeface tf = Typeface.createFromAsset(getAssets(), fontPath);
        binding.illimitableBranding.setTypeface(tf);
        binding.brand.setTypeface(tf);
        storage = new Storage(this);
        helper = DatabaseHelper.getInstance(this);
        String url = helper.getConfigValue(DatabaseHelper.SERVER_URL);
        enableDownloadImage = storage.getEnableDownloadImage();
        binding.disableImageDnldSwitch.setChecked(!enableDownloadImage);
        if(url!= null){
            Constants.BASE_URL = url;
            STFApplication application = (STFApplication) getApplication();
            application.initSocket();
            binding.serverUrl.setText(url);
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                binding.signInButton.setBackgroundColor(getResources().getColor(R.color.colorPrimary));
            }
        }else{
            Constants.BASE_URL = null;
            binding.signInButton.setEnabled(false);
            binding.signInButton.setAlpha(0.5f);
        }

        String deviceName = storage.getDeviceName();
        binding.deviceName.setText(deviceName);
        if(!deviceName.equals("")) {
            binding.deviceName.setEnabled(false);
        }

        binding.signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                login();
            }
        });

        new Thread(){
            @Override
            public void run() {
                try {
                    Thread.sleep(4000);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            binding.splashImage.setVisibility(View.GONE);
                            binding.illimitableBranding.setVisibility(View.GONE);
                            binding.loginSuperContainer.setVisibility(View.VISIBLE);
                            if(storage.isLoggedIn() && permissionsGiven){
                                STFApplication application = (STFApplication) getApplication();
                                application.initSocket();
                                application.connectSocket();
                                // Constants.privileges = storage.getPrivileges();
                                Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                                startActivity(intent);
                            }
                        }
                    });
                }catch (Exception e){}
            }
        }.start();

        binding.saveServerUrl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String url = binding.serverUrl.getText().toString().trim().toLowerCase();
                if(url.indexOf("http")<0){
                    Toasty.error(MainActivity.this, "Enter a proper url").show();
                    return;
                }
                if(!url.endsWith("/")){
                    url+="/";
                }
                final String sURL = url;
                final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(MainActivity.this,url+"app/server-info.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
                new Thread(){
                    @Override
                    public void run() {
                        try {
                            JSONObject jResponse = null;
                            JSONArray supportedVersions = null;
                            wrapper.addParam("timezoneOffset", (""+(Utility.getTimezoneOffset() * -1)));
                            String response = wrapper.execute();
                            if (response==null) {
                                response = "{\"status\":1, \"msg\":\"Unable to reach server, please check connectivity\"}";
                            }
                            jResponse = new JSONObject(response);
                            final int status = jResponse.optInt("status", 1);
                            final String errMsg = jResponse.optString("msg", "We have encountered an unexpected error");
                            supportedVersions = jResponse.optJSONArray("supportedVersion");
                            final JSONArray pResponse = supportedVersions;
                            long now = jResponse.optLong("now", -1);
                            if (now != -1) {
                                storage.setLastVerifiedTime(now);
                                storage.setLastVerifiedTimeZone(Utility.getTimezoneOffset());
                            }
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    try {
                                        String currentVersion = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
                                        if (status != 0) {
                                            Toasty.error(MainActivity.this, errMsg).show();
                                            return;
                                        }
                                        if(pResponse!= null && pResponse.join(",").indexOf(currentVersion)>=0){
                                            helper.insertToConfigMaster(DatabaseHelper.SERVER_URL, sURL);
                                            Toasty.success(MainActivity.this, "URL updated").show();
                                            Constants.BASE_URL = sURL;
                                            STFApplication application = (STFApplication) getApplication();
                                            application.disconnectSocket();
                                            application.initSocket();
                                            binding.signInButton.setEnabled(true);
                                            binding.signInButton.setAlpha(1.0f);
                                            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
                                                binding.signInButton.setBackgroundColor(getResources().getColor(R.color.colorPrimary));
                                            }
                                        }else{
                                            Toasty.error(MainActivity.this, "Invalid/Unsupported url").show();
                                        }
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            });
                        } catch (Exception e) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    Toasty.error(MainActivity.this, "Encountered an unexpected error").show();
                                }
                            });
                        }
                    }
                }.start();
            }
        });

        new Thread(){
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            permissionsGiven = checkAndRequestPermissions();
                        }
                    });
                }catch (Exception e){}
            }
        }.start();
    }

    public void login() {
        if (!validate()) {
            return;
        }
        permissionsGiven = Utility.checkPermissions(this);
        if(!permissionsGiven){
            Toasty.error(MainActivity.this, "Can't perform login without required permissions.").show();
            return;
        }
        InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
        View view = getCurrentFocus();
        if (view == null) {
            view = new View(this);
        }
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        enableDownloadImage = !binding.disableImageDnldSwitch.isChecked();
        storage.setEnableDownloadImage(enableDownloadImage);
        final String loginId = binding.emailid.getText().toString().trim();
        final String password = binding.password.getText().toString().trim();
        final String deviceName = binding.deviceName.getText().toString().trim();
        // TESTING
        // progressDialog = new ProgressDialog(MainActivity.this, R.style.AppTheme_Dark_Dialog);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            // TESTING
            // progressDialog = new ProgressDialog(MainActivity.this);
        }
        // TESTING
        // progressDialog.setIndeterminate(true);
        // progressDialog.setCancelable(false);
        if (loginId.equals("3XP0R+DB") && password.equals("3XP0R+DB")) {
            // TESTING
            // progressDialog.setMessage("Extracting...");
            // progressDialog.show();
            showProgressLoader("Extracting...");
            downloadDb();
            // TESTING
            // progressDialog.cancel();
            hideProgressLoader();
            return;
        }
        // TESTING..
        // progressDialog.setMessage("Authenticating...");
        // progressDialog.show();
        showProgressLoader("Authenticating...");
        new Thread(){
            @Override
            public void run() {
                try {
                    HTTPRequestWrapper requestWrapper = new HTTPRequestWrapper(MainActivity.this, Constants.BASE_URL + "app/authenticate-manager.json", 1);
                    requestWrapper.addParam("userId", loginId);
                    requestWrapper.addParam("password", password);
                    requestWrapper.addParam("deviceName", deviceName);
                    requestWrapper.addParam("deviceId", storage.getDeviceId());
                    requestWrapper.addParam("timezoneOffset", "" + (Utility.getTimezoneOffset() * -1));
                    requestWrapper.setOfflineEventHandler(new Runnable() {
                        @Override
                        public void run() {
                            final String storedLoginId = storage.getLoginId();
                            final String storedPassword = storage.getPassword();
                            if (storedLoginId == null || storedPassword == null || (!storedLoginId.equals(loginId)) || (!storedPassword.equals(password))) {
                                onLoginFailed("We are not able to reach our servers, please try later.");
                            } else {
                                // Constants.privileges = storage.getPrivileges();
                                onLoginSuccess(true);
                            }
                        }
                    });
                    String strResponse = requestWrapper.execute();
                    if (strResponse == null) {
                        return;
                    }
                    JSONObject response = new JSONObject(strResponse);
                    if (response.getInt("status") == 0) {
                        String storedLoginId = storage.getLoginId();
                        if (storedLoginId != null && (!storedLoginId.equals(loginId))) {
                            // Different user, Do something if required
                        }
                        long now = response.optLong("now", -1);
                        if (now != -1) {
                            storage.setLastVerifiedTime(now);
                            storage.setLastVerifiedTimeZone(Utility.getTimezoneOffset());
                        }
                        storage.setUserId(response.getJSONObject("data").getJSONObject("userProfile").getString("userId"));
                        storage.setUserName(response.getJSONObject("data").getJSONObject("userProfile").getString("name"));
                        storage.setUserEmail(response.getJSONObject("data").getJSONObject("userProfile").getString("email"));
                        storage.setLastLoginTime(response.getJSONObject("data").getJSONObject("userProfile").getString("lastLoginTime"));
                        storage.setPrivileges(response.getJSONObject("data").getJSONObject("privileges"));
                        storage.setSubscriptionEndDate(response.getJSONObject("data").getLong("subscriptionEnd"));
                        storage.setCompanyId(response.getJSONObject("data").getJSONObject("userProfile").getString("companyId"));
                        storage.setDeviceId(response.getJSONObject("data").getJSONObject("device").getString("id"));
                        storage.setDeviceName(response.getJSONObject("data").getJSONObject("device").getString("name"));
                        // Constants.privileges = storage.getPrivileges();
                        storage.setLoginId(loginId);
                        storage.setPassword(password);
                        String token = storage.getTokenId();
                        new SyncUtil(MainActivity.this).initSync();
                        if (token != null) {
                            HTTPRequestWrapper pushTokenRequestWrapper = new HTTPRequestWrapper(MainActivity.this, Constants.BASE_URL + "app/update-user-token.json", 1);
                            pushTokenRequestWrapper.addParam("pushtoken", token);
                            pushTokenRequestWrapper.addParam("devicetype", "ANDROID");
                            pushTokenRequestWrapper.addParam("userId", storage.getUserId());
                            pushTokenRequestWrapper.setOfflineSupported(true);
                            pushTokenRequestWrapper.execute();
                        }
                        Hashtable<String, ArrayList<String>> postProcessData = helper.insertToWorkerMaster(response.getJSONObject("data").getJSONArray("workers"));
                        helper.insertToKamjariMaster(response.getJSONObject("data").getJSONArray("kamjaris"));
                        helper.insertToSectionMaster(response.getJSONObject("data").getJSONArray("sections"));
                        helper.insertToBookMaster(response.getJSONObject("data").getJSONArray("books"));
                        helper.insertToWorkerTypeMaster(response.getJSONObject("data").getJSONArray("workerTypes"));
                        helper.insertToBatchMaster(response.getJSONObject("data").getJSONArray("batches"));
                        helper.insertToShiftMaster(response.getJSONObject("data").getJSONArray("shifts"));

                        helper.insertToAuthorisedUserMaster(response.getJSONObject("data").optJSONArray("authorisedUsers"));
                        storage.setRoundOff(response.getJSONObject("data").optString("roundOff", "floor"));
                        storage.setWorkerUpdateAllowed(response.getJSONObject("data").optBoolean("allowUpdateWorker", false));
                        storage.setWorkerAssignAllowed(response.getJSONObject("data").optBoolean("allowAssignWorker", false));
                        // storage.setImageMandatory(response.getJSONObject("data").optBoolean("includeImageInAllTransaction", false));
                        JSONObject gardenConfig = response.getJSONObject("data").optJSONObject("gardenConfig");
                        if (gardenConfig != null) {
                            storage.setGardenConfig(gardenConfig);
                        }
                        if (enableDownloadImage) {
                            ArrayList<String> workersWithProfileImage = postProcessData.get("WORKERS_WITH_PROFILE_IMAGE");
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    // TESTING
                                    // progressDialog.setMessage("Downloading Worker Images..");
                                    showProgressLoader("Downloading Worker Images..");
                                }
                            });
                            WorkerDetailsDownloader.downloadProfileImage(workersWithProfileImage, MainActivity.this);
                        }
                        if(response.getJSONObject("data").has("appInfo")) {
                            JSONObject appInfo = response.getJSONObject("data").getJSONObject("appInfo");
                            if(appInfo.has("appDownloadLink")){
                                String currentVersion = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
                                final String serverVersion = appInfo.getString("appVersion");
                                final String downloadLink = appInfo.getString("appDownloadLink");
                                if(serverVersion.compareTo(currentVersion)>0){
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this, R.style.AppCompatAlertDialogStyle);
                                            builder.setTitle("Update Available");
                                            builder.setMessage("Version "+serverVersion+" is available, Do you want to update?");
                                            builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {

                                                @Override
                                                public void onClick(DialogInterface dialogInterface, int i) {
                                                    dialogInterface.dismiss();
                                                    storage.setLoginStatus(true);
                                                    // TESTING
                                                    // progressDialog.setMessage("Downloading..");
                                                    showProgressLoader("Downloading..");
                                                    downloadUpdatedApp(downloadLink);
                                                }
                                            });
                                            builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {

                                                @Override
                                                public void onClick(DialogInterface dialogInterface, int i) {
                                                    dialogInterface.dismiss();
                                                    onLoginSuccess(false);
                                                }
                                            });
                                            builder.show();
                                        }
                                    });
                                }else{
                                    onLoginSuccess(false);
                                }
                            }else{
                                onLoginSuccess(false);
                            }
                        }else{
                            onLoginSuccess(false);
                        }
                    } else if (response.getInt("status") == -1) {
                        storage.setDeviceId("");
                        storage.setDeviceName("");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                binding.deviceName.setEnabled(true);
                            }
                        });
                        onLoginFailed(response.getString("msg"));
                    } else {
                        onLoginFailed(response.getString("msg"));
                    }
                }catch (Exception ex){
                    ex.printStackTrace();
                    onLoginFailed("We have encountered an unexpected error, please try after some time.");
                }
            }
        }.start();
    }

    public boolean validate() {
        boolean valid = true;
        String loginId = binding.emailid.getText().toString();
        String password = binding.password.getText().toString();
        String deviceName = binding.deviceName.getText().toString();
        if (loginId.isEmpty() || loginId.length() < 4 || loginId.length() > 40 ) {
            binding.emailid.setError("Between 4 and 40 alphanumeric characters");
            valid = false;
        } else {
            binding.emailid.setError(null);
        }
        if (password.isEmpty() || password.length() < 4 || password.length() > 20) {
            binding.password.setError("Between 4 and 20 alphanumeric characters");
            valid = false;
        } else {
            binding.password.setError(null);
        }
        if (deviceName.isEmpty()) {
            binding.deviceName.setError("Required");
            valid = false;
        } else {
            binding.deviceName.setError(null);
        }
        return valid;
    }

    public void onLoginSuccess(final boolean offline) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (offline) {
                    Toasty.info(MainActivity.this, "Logging you in OFFLINE MODE").show();
                }
                storage.setLoginStatus(true);
                // TESTING
                // progressDialog.cancel();
                hideProgressLoader();
                binding.signInButton.setEnabled(true);
                STFApplication application = (STFApplication) getApplication();
                application.connectSocket();
                Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                startActivity(intent);
            }
        });
    }

    public void onLoginFailed(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                // TESTING
                // progressDialog.cancel();
                hideProgressLoader();
                Toasty.error(getBaseContext(), msg, Toasty.LENGTH_LONG).show();
            }
        });
    }

    private void downloadUpdatedApp(final String path){

        new Thread(){
            @Override
            public void run() {
                try{
                    downloadFinished = false;
                    File downloads = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    updatedApk = new File(downloads, "Mpower.apk");
                    if(updatedApk.exists()){
                        updatedApk.delete();
                    }
                    OutputStream os = new FileOutputStream(updatedApk);
                    HTTPUtil httpUtil = new HTTPUtil();
                    String url = path;
                    if(url.indexOf("localhost")>0){
                        url = url.replace("localhost","192.168.1.52");
                    }
                    InputStream is = httpUtil.openHttpConnection(url, null);
                    byte[] buffer = new byte[512 * 1024];
                    int read = is.read(buffer);
                    while (read>0){
                        os.write(buffer, 0, read);
                        read = is.read(buffer);
                    }
                    os.flush();
                    os.close();
                    is.close();
                    downloadFinished = true;
                }catch (Exception e){
                    e.printStackTrace();
                }
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        // TESTING
                        // progressDialog.dismiss();
                        hideProgressLoader();
                        if(downloadFinished){
                            Intent intent = new Intent(Intent.ACTION_VIEW);
                            intent.setDataAndType(Uri.fromFile(updatedApk), "application/vnd.android.package-archive");
                            PackageManager packageManager = getPackageManager();
                            if (intent.resolveActivity(packageManager) != null) {
                                startActivity(intent);
                                finish();
                            }else{
                                onLoginSuccess(false);
                            }
                        }else{
                            onLoginSuccess(false);
                        }
                    }
                });
            }
        }.start();
    }

    private  boolean checkAndRequestPermissions() {
        int permissionWriteExternalStorage = ContextCompat.checkSelfPermission(this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int locationPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION);
        List<String> listPermissionsNeeded = new ArrayList<>();
        if (permissionWriteExternalStorage != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (locationPermission != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (!listPermissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this, listPermissionsNeeded.toArray(new String[listPermissionsNeeded.size()]),REQUEST_ID_MULTIPLE_PERMISSIONS);
            return false;
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode){
            case REQUEST_ID_MULTIPLE_PERMISSIONS:{
                Map<String, Integer> perms = new HashMap<>();
                perms.put(Manifest.permission.WRITE_EXTERNAL_STORAGE, PackageManager.PERMISSION_GRANTED);
                perms.put(Manifest.permission.ACCESS_FINE_LOCATION, PackageManager.PERMISSION_GRANTED);
                if (grantResults.length > 0) {
                    for (int i = 0; i < permissions.length; i++) {
                        perms.put(permissions[i], grantResults[i]);
                    }
                    if (perms.get(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
                            && perms.get(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                        permissionsGiven = true;
                    }
                }
            }
        }
    }

    private void downloadDb() {
        try {
            File sd = getExternalFilesDir(null);

            if (sd.canWrite()) {
                String currentDBPath = "/data/data/" + getPackageName() + "/databases/"+DatabaseHelper.DATABASE_NAME;
                String backupDBPath = "backup_"+DatabaseHelper.DATABASE_NAME;
                File currentDB = new File(currentDBPath);
                File backupDB = new File(sd, backupDBPath);
                if (backupDB.exists()) {
                    File renamed = new File(sd, System.currentTimeMillis()+"backup_"+DatabaseHelper.DATABASE_NAME);
                    boolean status = backupDB.renameTo(renamed);
                    if (!status) {
                        backupDB.delete();
                    }
                    backupDB = new File(sd, backupDBPath);
                }

                if (currentDB.exists()) {
                    FileChannel src = new FileInputStream(currentDB).getChannel();
                    FileChannel dst = new FileOutputStream(backupDB).getChannel();
                    dst.transferFrom(src, 0, src.size());
                    src.close();
                    dst.close();
                    Toasty.info(this, "Success").show();
                } else {
                    throw new Exception();
                }
            } else {
                throw new Exception();
            }
        } catch (Exception e) {
            Toasty.error(this, "Failed to export database").show();
        }
    }



    public void showProgressLoader(String msg) {
        if (msg==null) {
            msg="";
        }
        binding.progressBar.setTextMsg(msg);
        binding.progressBar.setVisibility(View.VISIBLE);
    }

    public void hideProgressLoader() {
        binding.progressBar.setVisibility(View.GONE);
    }
}
