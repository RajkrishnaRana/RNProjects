package in.illimitable.stf;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.media.MediaPlayer;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintJob;
import android.print.PrintManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

import es.dmoral.toasty.Toasty;
import in.illimitable.nfc.NFCUtil;
import in.illimitable.stf.databinding.ActivityHomeBinding;
import in.illimitable.stf.fragments.Dashboard;
import in.illimitable.stf.fragments.MarkTimeFragment;
import in.illimitable.stf.fragments.RecordNonpluckingFragment;
import in.illimitable.stf.fragments.RecordPluckingFragment;
import in.illimitable.stf.util.SyncUtil;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.LogUtil;
import in.illimitable.util.MsgRunnable;
import in.illimitable.util.ParcelableJsonObject;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

public class HomeActivity extends AppCompatActivity implements NfcAdapter.ReaderCallback{
    public static final int REQUEST_PERMISSIONS_LOCATION_SETTINGS_REQUEST_CODE = 701;
    public static final int REQUEST_PERMISSIONS_BLUETOOTH_REQUEST_CODE = 701;
    private Storage storage;
    private DatabaseHelper dHelper;

    private Vibrator vibrator;
    private MediaPlayer mp;
    private Typeface tf;

    private NfcAdapter nfcAdapter;
    private NFCUtil nfcUtil;
    private Handler handler;

    private AppBarConfiguration mAppBarConfiguration;
    ActivityHomeBinding binding;
    public NavController navController;
    private TextView textUserName;

    private JSONObject gardenConfig;

    private boolean syncStarted = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHomeBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        dHelper = DatabaseHelper.getInstance(this);
        String fontPath = "fonts/Californian FB Bold.ttf";
        tf = Typeface.createFromAsset(getAssets(), fontPath);

        storage = new Storage(this);
        gardenConfig = storage.getGardenConfig();
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        View navHeaderView = binding.navView.getHeaderView(0);
        textUserName = navHeaderView.findViewById(R.id.userName);
        TextView brandNameShort = navHeaderView.findViewById(R.id.brandNameShort);
        brandNameShort.setTypeface(tf);
        /*binding.appBarHome.progressBar.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                return true;
            }
        });*/
        textUserName.setText(storage.getUserName());
        try {
            PackageInfo pInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            String version = pInfo.versionName;
            TextView appVersion = navHeaderView.findViewById(R.id.appVersion);
            appVersion.setText("V - "+version);
        } catch (PackageManager.NameNotFoundException e) {
        }
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_logout)
                .setOpenableLayout(binding.drawerLayout)
                .build();
        navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(binding.navView, navController);

        Menu menu = binding.navView.getMenu();
        MenuItem logout = menu.findItem(R.id.nav_logout);
        logout.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem menuItem) {
                binding.drawerLayout.closeDrawers();
                doLogout();
                return true;
            }
        });
        MenuItem markTime = menu.findItem(R.id.nav_mark_time);
        MenuItem markOutTime = menu.findItem(R.id.nav_mark_out_time);
        String renameMarkTime = gardenConfig.optString("renameMarkTime", "Mark Time");
        boolean showMarkOut = gardenConfig.optBoolean("showMarkOut", false);
        if (showMarkOut) {
            renameMarkTime = "Mark In Time";
        } else{
            markOutTime.setVisible(false);
        }
        markTime.setTitle(renameMarkTime);
        try {
            vibrator = (Vibrator) getSystemService(android.content.Context.VIBRATOR_SERVICE);
        } catch (Exception e) {
        }
        if (Constants.BASE_URL == null || Constants.BASE_URL.equals("")) {
            Constants.BASE_URL = dHelper.getConfigValue(DatabaseHelper.SERVER_URL);
        }
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        nfcUtil = NFCUtil.getInstance(storage.getCompanyId());
        handler = new Handler();
    }

    public Typeface getTypeFace(){
        return tf;
    }

    public void doSync(View view){
        if (syncStarted) {
            return;
        }
        syncStarted = true;
        showInfoMessage("Sync in progress..");
        new Thread() {
            @Override
            public void run() {
                SyncUtil syncUtil = new SyncUtil(HomeActivity.this);
                syncUtil.setPostCompletionTask(postSyncTask);
                syncUtil.initSync();
            }
        }.start();
    }

    MsgRunnable postSyncTask = new MsgRunnable() {
        @Override
        public void run() {
            syncStarted = false;
            final Boolean didEncounterFailure = (Boolean) this.msg;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    String msg = "Sync completed..";
                    if (didEncounterFailure) {
                        msg = "Sync completed with failure(s)..";
                        if (SyncUtil.errorMsg != null) {
                            msg = SyncUtil.errorMsg;
                            SyncUtil.errorMsg = null;
                        }
                        showErrorMessage(msg);
                    } else {
                        showSuccessMessage(msg);
                    }
                    try {
                        Fragment fragment = getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment).getChildFragmentManager().getFragments().get(0);
                        if (fragment instanceof Dashboard) {
                            Dashboard dashboard = (Dashboard) fragment;
                            dashboard.updateLastSyncTime();
                            dashboard.enableSyncBtn();
                        }
                    } catch (Exception e) {
                    }
                }
            });
        }
    };


    private void showLogoutDialog() {
        final AlertDialog.Builder builder =
                new AlertDialog.Builder(this);
        builder.setTitle("Logout");
        builder.setMessage("Do you really want to logout?");
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
                doLogout();
            }
        });
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    @Override
    public void onBackPressed() {
        if (navController.getCurrentDestination().getId() == R.id.nav_home) {
            showLogoutDialog();
            return;
        } else if (navController.getCurrentDestination().getId() == R.id.nav_record_plucking) {
            try {
                Fragment fragment = getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment).getChildFragmentManager().getFragments().get(0);
                if (fragment != null && fragment instanceof RecordPluckingFragment) {
                    RecordPluckingFragment recordPluckingFragment = (RecordPluckingFragment) fragment;
                    if (recordPluckingFragment.isIdentifyingView) {
                        recordPluckingFragment.gotoRecordingView();
                        return;
                    } else if (recordPluckingFragment.connectingToBluetoothScale) {
                        return;
                    }
                }
            } catch (Exception e){}
        }
        super.onBackPressed();
    }

    public void showErrorMessage(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideProgressLoader();
                Toasty.error(HomeActivity.this, msg).show();
            }
        });
    }

    public void showErrorMessageLong(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideProgressLoader();
                Toasty.error(HomeActivity.this, msg, Toasty.LENGTH_LONG).show();
            }
        });
    }

    public void showSuccessMessage(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideProgressLoader();
                Toasty.success(HomeActivity.this, msg).show();
            }
        });
    }

    public void showInfoMessage(final String msg) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                hideProgressLoader();
                Toasty.info(HomeActivity.this, msg).show();
            }
        });
    }

    private void doLogout() {
        showProgressLoader("Logging out...");
        new Thread() {
            @Override
            public void run() {
                try {
                    final String userId = storage.getUserId();
                    if (userId != null) {
                        HTTPRequestWrapper requestWrapper = new HTTPRequestWrapper(HomeActivity.this, Constants.BASE_URL + "app/log-application-activity.json", 1);
                        JSONObject activity = new JSONObject();
                        activity.put("userId", userId);
                        activity.put("activityName", "LOGOUT");
                        activity.put("activityTime", "" + System.currentTimeMillis());
                        requestWrapper.setOfflineSupported(true);
                        requestWrapper.setBodyJSON(activity);
                        try {
                            //requestWrapper.execute();
                        } catch (Exception e1) {
                            e1.printStackTrace();
                        }
                    }
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            STFApplication application = (STFApplication) getApplication();
                            application.disconnectSocket();
                            hideProgressLoader();
                            storage.setLoginStatus(false);
                            finish();
                        }
                    });
                } catch (Exception ex) {
                    ex.printStackTrace();

                }
            }
        }.start();
    }

    /*public void updateLoader(boolean isBusy) {
        showProgressLoader(null, isBusy);
    }*/

    public void showProgressLoader(String msg) {
        if (msg==null) {
            msg="";
        }
        binding.appBarHome.progressBar.setTextMsg(msg);
        binding.appBarHome.progressBar.setVisibility(View.VISIBLE);
    }

    public void hideProgressLoader() {
        binding.appBarHome.progressBar.setVisibility(View.GONE);
    }

    public void printRecordsForToday(){
        showProgressLoader("Preparing data to print..");
        final String roundOff = storage.getRoundOff();
        new Thread(){
            @Override
            public void run() {
                try {
                    String recordingStats = dHelper.getConfigValue(DatabaseHelper.PLUCKING_RECORDING_STAT);
                    String recordingStatVal = "n/a";
                    if (recordingStats != null) {
                        try {
                            JSONObject jRecordingStat = new JSONObject(recordingStats);
                            int count = jRecordingStat.getInt("count");
                            long duration = jRecordingStat.getLong("duration");
                            if(count!=0 && duration!=0) {
                                duration = duration/1000;
                                if(duration != 0) {
                                    long speed = duration/count;
                                    if(speed !=0) {
                                        recordingStatVal = speed+" sec/plucker";
                                    }
                                }
                            }
                        }catch (Exception e){}
                    }
                    JSONArray pluckingWorkers = dHelper.getWorkersWithPluckingData();
                    JSONArray requiredWorkers = new JSONArray();
                    JSONObject arrangedDataTmp = new JSONObject();
                    JSONArray nonPluckingWorkers = new JSONArray();
                    if(pluckingWorkers.length()>0) {
                        for (int loop = 0, length = pluckingWorkers.length(); loop < length; loop++) {
                            String workerId = pluckingWorkers.getJSONObject(loop).getString(DatabaseHelper.WORKER_ID);
                            String weighment = pluckingWorkers.getJSONObject(loop).getString(DatabaseHelper.WEIGHMENT_NUMBER);
                            String quantity = pluckingWorkers.getJSONObject(loop).getString(DatabaseHelper.RECORD_QUANTITY);
                            long recordTime = pluckingWorkers.getJSONObject(loop).getLong(DatabaseHelper.RECORD_TIME);
                            JSONObject tmp = new JSONObject();
                            if (arrangedDataTmp.has(workerId)) {
                                tmp = arrangedDataTmp.getJSONObject(workerId);
                            }
                            JSONObject innerTmp = new JSONObject();
                            innerTmp.put("qty", Utility.companyRoundOff(roundOff, Double.parseDouble(quantity)));
                            innerTmp.put("time", recordTime);
                            tmp.put(weighment, innerTmp);
                            arrangedDataTmp.put(workerId, tmp);
                        }
                        Iterator<String> keys = arrangedDataTmp.keys();
                        StringBuffer sb = new StringBuffer("(");
                        while (keys.hasNext()) {
                            sb.append("'" + keys.next() + "',");
                        }
                        sb.delete(sb.length() - 1, sb.length());
                        sb.append(")");
                        requiredWorkers = dHelper.getPluckingWorkersAttendance(sb.toString());
                        nonPluckingWorkers = dHelper.getNonPluckingWorkersAttendanceModified(sb.toString());
                    }else{
                        nonPluckingWorkers = dHelper.getNonPluckingWorkersAttendanceModified(null);
                    }
                    if(pluckingWorkers.length()==0 && nonPluckingWorkers.length()==0){
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                hideProgressLoader();
                                Toasty.info(HomeActivity.this, "No Records found to print").show();
                            }
                        });
                        return;
                    }
                    String currentVersion = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
                    final String html = Utility.getPluckingPrintHtml(requiredWorkers, arrangedDataTmp, nonPluckingWorkers, recordingStatVal, storage.getDeviceName(), storage.getUserName(), dHelper.getSyncDate(1), currentVersion);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            doWebViewPrint(html);
                        }
                    });
                    return;
                }catch (Exception e){
                    // e.printStackTrace();
                    StringWriter sw = new StringWriter();
                    PrintWriter pw = new PrintWriter(sw);
                    e.printStackTrace(pw);
                    String sStackTrace = sw.toString();
                    LogUtil.writeLog(HomeActivity.this, "err", sStackTrace, storage);
                }
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toasty.error(HomeActivity.this, "Failed to print, please try later").show();
                        hideProgressLoader();
                    }
                });
            }
        }.start();

    }


    private void doWebViewPrint(String html) {
        WebView webView = new WebView(this);

        webView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                createWebPrintJob(view);
            }
        });
        // System.out.println(html);
        webView.loadDataWithBaseURL(null, html, "text/HTML", "UTF-8", null);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            webView.getSettings().setSafeBrowsingEnabled(false);
        }
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
    }

    @SuppressLint("NewApi")
    private void createWebPrintJob(WebView webView) {
        try {
            PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
            String printDate = "";
            Date dt = new Date();
            try {
                printDate = new SimpleDateFormat("d MMM yyyy").format(dt);
            } catch (Exception e) {
                printDate = new SimpleDateFormat("d MMM YYYY").format(dt);
            }
            StringBuilder sb = new StringBuilder(gardenConfig.optString("companyName", "TEAlink"));
            sb.append("-");
            sb.append(printDate);
            sb.append(" on ");
            sb.append(storage.getDeviceName());
            PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter(sb.toString());
            hideProgressLoader();
            String jobName = getString(R.string.app_name) + " Document";
            PrintJob printJob = printManager.print("TEAlink Mobile Print", printAdapter,
                    new PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .setMediaSize(PrintAttributes.MediaSize.UNKNOWN_PORTRAIT)
                            //.setMediaSize(PrintAttributes.MediaSize.ISO_A5)
                            //.setMediaSize(PrintAttributes.MediaSize.UNKNOWN_LANDSCAPE)
                            .build());
        }catch (Exception e){}
    }

    private void notifyUserUpdated() {
        textUserName.setText(storage.getUserName());
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                vibrator.vibrate(VibrationEffect.createOneShot(150, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                vibrator.vibrate(150);
            }
            mp = MediaPlayer.create(HomeActivity.this, R.raw.updated);
            mp.start();
            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                public void onCompletion(MediaPlayer mp) {
                    mp.release();
                    mp = null;
                }
            });
        } catch (Exception e) {
        }
    }

    public void hideKeyboardInFragment() {
        try {
            InputMethodManager imm = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
            View view = findViewById(R.id.nav_host_fragment);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setTitle(String tag, String title) {
        try {
            binding.appBarHome.toolbar.setTitle(title);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    @Override
    public void onTagDiscovered(Tag tag) {
        try {
            String msg = nfcUtil.readData(tag);
            if (msg.length() != 0) {
                final JSONObject worker = dHelper.getWorkerDetails(msg);
                if (!worker.optString(DatabaseHelper.WORKER_ID).equals("")) {
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            if (isIdentifyingMode(worker)) {
                                //Log event if required
                            }else{
                                Bundle args = new Bundle();
                                args.putParcelable("workerData", new ParcelableJsonObject(worker));
                                navController.navigate(R.id.nav_worker_details, args);
                            }
                        }
                    });
                } else {
                    Fragment fragment = getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment).getChildFragmentManager().getFragments().get(0);
                    if (fragment != null && fragment instanceof Dashboard) {
                        JSONObject user = dHelper.getAuthorisedUser(msg);
                        String userId = user.optString(DatabaseHelper.AUTHORISED_USER_ID);
                        String userName = user.optString(DatabaseHelper.AUTHORISED_USER_NAME);
                        String userEmail = user.optString(DatabaseHelper.AUTHORISED_USER_EMAIL);
                        if (!userId.equals("")) {
                            storage.setUserId(userId);
                            storage.setUserName(userName);
                            storage.setUserEmail(userEmail);
                            handler.post(new Runnable() {
                                @Override
                                public void run() {
                                    notifyUserUpdated();
                                }
                            });
                        }
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    private boolean isIdentifyingMode(JSONObject worker) {
        Fragment fragment = getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment).getChildFragmentManager().getFragments().get(0);
        if (fragment != null && fragment instanceof RecordPluckingFragment) {
            RecordPluckingFragment pluckingFragment = (RecordPluckingFragment) fragment;
            pluckingFragment.workerIdentified(worker, "NFC");
            return  true;
        }else if (fragment != null && fragment instanceof MarkTimeFragment) {
            MarkTimeFragment markTimeFragment = (MarkTimeFragment) fragment;
            markTimeFragment.workerIdentified(worker, "NFC");
            return  true;
        }else if (fragment != null && fragment instanceof RecordNonpluckingFragment) {
            RecordNonpluckingFragment recordNonpluckingFragment = (RecordNonpluckingFragment) fragment;
            recordNonpluckingFragment.workerIdentified(worker, "NFC");
            return  true;
        }
        return false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!Utility.checkPermissions(this)) {
            Toasty.error(this, "Required permissions not available..").show();
            doLogout();
        }
        try {
            if(nfcAdapter==null){
                return;
            }
            if(!nfcAdapter.isEnabled()){
                Toasty.info(this, "Please enable NFC").show();
                return;
            }
            nfcAdapter.enableReaderMode(this, this, NfcAdapter.FLAG_READER_NFC_A |
                            NfcAdapter.FLAG_READER_NFC_B |
                            NfcAdapter.FLAG_READER_NFC_F |
                            NfcAdapter.FLAG_READER_NFC_V |
                            NfcAdapter.FLAG_READER_NFC_BARCODE |
                            NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS,
                    null);
        }catch (Throwable e){
            e.printStackTrace();
        }
        long lastVerifiedTimeZone = storage.getLastVerifiedTimeZone();
        long lastVerifiedTime = storage.getLastVerifiedTime();
        if (lastVerifiedTimeZone ==-1) {
            doLogout();
            Toasty.info(HomeActivity.this, "Logging you out for application update").show();
        } else if (lastVerifiedTimeZone != Utility.getTimezoneOffset()) {
            doLogout();
            Toasty.info(HomeActivity.this, "Device timezone has changed since last sync").show();
        } else if (System.currentTimeMillis()<lastVerifiedTime){
            doLogout();
            Toasty.info(HomeActivity.this, "Device date/time seems to be incorrect").show();
        }
    }

}
