package in.illimitable.stf.util;

import android.content.Context;
import android.os.Environment;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;

import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

/**
 * Created by illimitable on 11/9/17.
 */

public class WorkerDetailsDownloader {
    private static String logFolderName = null;
    private static final  int batchDownloadSize = 50;
    public static void downloadIrisData(ArrayList<String> workersWithIrisData, Context context) throws Exception{
        HTTPRequestWrapper wrapper = new HTTPRequestWrapper(context, Constants.BASE_URL+"app/download-worker-iris-data.zip", HTTPRequestWrapper.HTTP_POST_REQUEST);
        if(logFolderName == null){
            logFolderName = new Storage(context).getLogFolderName();
        }
        DatabaseHelper helper = DatabaseHelper.getInstance(context);
        int innerLoop=0;
        Hashtable<String, String> updates = new Hashtable<>();
        for(int loop=0; loop< workersWithIrisData.size(); ){
            JSONObject requestBody = new JSONObject();
            JSONArray workerIds = new JSONArray();
            for(innerLoop=0; innerLoop< 10; innerLoop++){
                if((innerLoop + loop) < workersWithIrisData.size()){
                    workerIds.put(workersWithIrisData.get(loop+innerLoop));
                    updates.put(workersWithIrisData.get(loop+innerLoop), "2");
                }
            }
            requestBody.put("workerIds", workerIds);
            wrapper.setBodyJSON(requestBody);
            InputStream is = wrapper.executeToStream();
            File zipFile = new File(context.getExternalFilesDir(null)+ File.separator + logFolderName + File.separator + "templateData.zip");
            if(zipFile.exists()){
                zipFile.delete();
            }
            File baseDir = new File(context.getExternalFilesDir(null)+ File.separator + logFolderName  + File.separator + "templateData");
            baseDir.mkdirs();
            byte[] buffer = new byte[24 * 1024];
            int read = is.read(buffer);
            FileOutputStream fos = new FileOutputStream(zipFile);
            while(read>0){
                fos.write(buffer, 0, read);
                read = is.read(buffer);
            }
            fos.flush();
            is.close();
            Utility.unzip(zipFile, new File(context.getExternalFilesDir(null)+ File.separator + logFolderName + File.separator + "templateData"));
            zipFile.delete();
            helper.updateMultipleWorkerScan(updates);

            loop +=innerLoop;
        }
    }

    public static void downloadProfileImage(ArrayList<String> workersWithProfileImage, Context context) throws Exception{
        HTTPRequestWrapper wrapper = new HTTPRequestWrapper(context, Constants.BASE_URL+"app/download-worker-image.zip", HTTPRequestWrapper.HTTP_POST_REQUEST);
        if(logFolderName == null){
            logFolderName = new Storage(context).getLogFolderName();
        }
        DatabaseHelper helper = DatabaseHelper.getInstance(context);
        String basePath = context.getExternalFilesDir(null)+ File.separator + logFolderName  + File.separator + "profileImage";
        int innerLoop=0;
        for(int loop=0; loop< workersWithProfileImage.size(); ){
            JSONObject requestBody = new JSONObject();
            JSONArray workerIds = new JSONArray();
            Hashtable<String, String> updates = new Hashtable<>();
            for(innerLoop=0; innerLoop< batchDownloadSize; innerLoop++){
                if((innerLoop + loop) < workersWithProfileImage.size()){
                    String id = workersWithProfileImage.get(loop+innerLoop);
                    workerIds.put(id);
                    updates.put(id, basePath+ File.separator + id + ".jpg");
                }
            }
            requestBody.put("workerIds", workerIds);
            wrapper.setBodyJSON(requestBody);
            InputStream is = wrapper.executeToStream();
            File zipFile = new File(context.getExternalFilesDir(null)+ File.separator + logFolderName + File.separator + "profileImage.zip");
            if(zipFile.exists()){
                zipFile.delete();
            }
            File baseDir = new File(basePath);
            baseDir.mkdirs();
            byte[] buffer = new byte[50 * 1024];
            int read = is.read(buffer);
            FileOutputStream fos = new FileOutputStream(zipFile);
            while(read>0){
                fos.write(buffer, 0, read);
                read = is.read(buffer);
            }
            fos.flush();
            is.close();
            Utility.unzip(zipFile, new File(context.getExternalFilesDir(null)+ File.separator + logFolderName + File.separator + "profileImage"));
            zipFile.delete();
            helper.updateMultipleWorkerImage(updates);
            loop +=innerLoop;
        }
    }
}
