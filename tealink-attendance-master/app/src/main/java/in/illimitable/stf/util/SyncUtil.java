package in.illimitable.stf.util;

import android.content.Context;
import android.content.Intent;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.MsgRunnable;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

/**
 * Created by illimitable on 10/5/17.
 */

public class SyncUtil {
    private Context context;
    private Storage storage;
    private DatabaseHelper dHelper;
    private boolean didEncounterFailure = false;
    public static String errorMsg = null;
    private ArrayList<String> processedRequests = new ArrayList<String>();
    private MsgRunnable postCompletionTask;
    private boolean includeFetch = true;
    private boolean syncStarted = false;

    public static final String SYNC_COMPLETED = "sync completed";

    public SyncUtil(Context context) {
        this.context = context;
        storage = new Storage(context);
        dHelper = DatabaseHelper.getInstance(context);
    }

    public void initSync() {
        if(syncStarted) {
            return;
        }
        errorMsg = null;
        syncStarted = true;
        postOfflineData();
    }

    private void postOfflineData() {
        HTTPRequestWrapper requestWrapper = dHelper.getRequest();
        String strResponse = null;
        if (requestWrapper != null) {
            String requestId = requestWrapper.requestId;
            if (processedRequests.contains(requestId)) {
                dHelper.releaseOfflineRecord(requestId);
                notifyCompletion();
                return;
            } else {
                strResponse = requestWrapper.execute();
                processedRequests.add(requestId);
            }
            try {
                JSONObject response = new JSONObject(strResponse);
                if (response.getInt("status") == 0) {
                    dHelper.deleteRequest(requestId);
                    long now = response.optLong("now", -1);
                    if (now != -1) {
                        storage.setLastVerifiedTime(now);
                        storage.setLastVerifiedTimeZone(Utility.getTimezoneOffset());
                    }
                } else {
                    if (response.has("msg")) {
                        String _msg = response.getString("msg").toLowerCase();
                        // System.out.println("##############################: "+_msg+" ##############################");
                        if (_msg.equals("invalid token.")) {
                            dHelper.deleteRequest(requestId);
                        } else if (_msg.indexOf("timezone")>=0) {
                            didEncounterFailure = true;
                            errorMsg = "Sync failed as server timezone is different from device timezone";
                        } else if (_msg.indexOf("invalid system time")>=0) {
                            didEncounterFailure = true;
                            errorMsg = "Sync failed as device time is invalid";
                        } else {
                            errorMsg = "Sync completed with failure(s)..";
                            didEncounterFailure = true;
                        }
                    } else {
                        errorMsg = "Sync completed with failure(s)..";
                        didEncounterFailure = true;
                    }
                    if (didEncounterFailure) {
                        dHelper.incrementRetyCountInOfflineRecord(requestId);
                    }
                    /*else if(response.has("status") && response.getInt("status")==1){
                        dHelper.deleteRequest(requestId);
                    }*/
                }
            } catch (Exception e) {
                errorMsg = "Sync completed with failure(s)..";
                dHelper.incrementRetyCountInOfflineRecord(requestId);
                didEncounterFailure = true;
            }
            postOfflineData();
        } else {
            pullDataFromServer();
        }
    }

    private void pullDataFromServer(){
        notifyCompletion();
    }

    private void notifyCompletion() {
        dHelper.deleteOldData();
        dHelper.releaseAllOfflineRecord();
        syncStarted = false;
        if(!didEncounterFailure){
            String timeStamp = new SimpleDateFormat("d MMM HH:mm").format(new Date());
            dHelper.insertToSyncMaster(1, timeStamp);
            storage.setLastSyncTime(System.currentTimeMillis());
            Intent bIntent = new Intent(SYNC_COMPLETED);
            LocalBroadcastManager.getInstance(context).sendBroadcast(bIntent);
        }
        if (postCompletionTask != null) {
            postCompletionTask.msg = didEncounterFailure;
            postCompletionTask.run();
        }
    }

    public void setPostCompletionTask(MsgRunnable runnable) {
        this.postCompletionTask = runnable;
    }

    public void setFetchStatus(boolean permission){
        includeFetch = permission;
    }

    /*public String getErrorMessage() {
        return errorMsg;
    }*/
}
