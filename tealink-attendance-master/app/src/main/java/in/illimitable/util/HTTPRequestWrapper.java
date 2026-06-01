package in.illimitable.util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;

import org.json.JSONObject;

import java.io.File;
import java.io.InputStream;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.Date;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Set;

import in.illimitable.stf.BuildConfig;

/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class HTTPRequestWrapper {
    public static final int HTTP_POST_REQUEST = 1;
    public static final int HTTP_GET_REQUEST = 2;
    public Hashtable<String, String> headers = new Hashtable<String, String>();
    public Hashtable<String, String> params;
    public String url;
    public String body;
    public int requestMethod;
    public String requestId="";
    private Runnable offlineEventHandler;
    protected Context context;
    private static boolean printDebug = false; // BuildConfig.DEBUG;
    private static final boolean appendDeviceInfo = false;
    private static final boolean supportCookies = false;
    private boolean isofflineSupported = false;
    private boolean deleteFile = false;
    public String fileName;
    public String filePath;
    private HTTPUtil httpUtil;

    public HTTPRequestWrapper(Context context, String url, int requestMethod) {
        this.context = context;
        this.url = url;
        this.requestMethod = requestMethod;
        if(supportCookies){
            PersistentCookieStore persistentCookieStore = new PersistentCookieStore(context);
            CookieManager cookieManager = new CookieManager(persistentCookieStore, CookiePolicy.ACCEPT_ALL);
            CookieHandler.setDefault(cookieManager);
        }
    }

    public void addHeader(String key, String value) {
        headers.put(key, value);
    }

    public void setBodyData(String body) {
        this.body = body;
    }

    public void setBodyJSON(JSONObject body) {
        this.body = body.toString();
        addHeader("Content-Type","application/json");
    }

    public void setOfflineEventHandler(Runnable task){
        offlineEventHandler = task;
    }

    public void setParams(Hashtable<String, String> params){
        if(this.params== null){
            this.params = params;
        }else{
            Set<String> keys = params.keySet();
            for (String key : keys) {
                this.params.put(key, params.get(key));
            }
        }
    }

    public void addParam(String name, String value){
        if(this.params== null){
            this.params = new Hashtable<String,String>();
        }
        this.params.put(name, value);
    }

    public void setFile(String filePath, String fileName){
        this.filePath = filePath;
        this.fileName = fileName;
    }

    protected void preExecute(){
        /*if(!url.startsWith("http")){
            url = Constants.BASE_URL+ url;
        }*/
    }

    public InputStream executeToStream(){
        preExecute();
        if(!headers.containsKey("User-Agent")){
            headers.put("User-Agent","Mozilla/5.0 (ICPL; TEALink 5.0.0.0)");
        }
        if(!headers.containsKey("Accept-Encoding")){
            headers.put("Accept-Encoding","gzip");
        }
        if((!headers.containsKey("Content-Type")) && requestMethod == HTTP_POST_REQUEST){
            headers.put("Content-Type","application/x-www-form-urlencoded");
        }
        httpUtil = new HTTPUtil();
        InputStream response = null;
        if(checkConnectivity()){
            appendDeviceInfo();
            printDebug();
            if (filePath != null) {
                response =  httpUtil.uploadFileAsStream(url, fileName, new File(filePath), params, headers);
            }else {
                if (requestMethod == HTTP_POST_REQUEST) {
                    if (body != null && body.trim().length() > 0) {
                        response = httpUtil.postInBodyToStream(url, body, headers);
                    } else {
                        response = httpUtil.postResponseToStream(url, params, headers);
                    }
                } else {
                    response = httpUtil.getResponseToStream(url, null);
                }
            }
            if(response==null){
                if(offlineEventHandler!=null){
                    offlineEventHandler.run();
                }
            }
        }else{
            if(offlineEventHandler!=null){
                offlineEventHandler.run();
            }
        }
        return response;
    }

    public String execute() {
        preExecute();
        if(!headers.containsKey("Accept-Encoding")){
            headers.put("Accept-Encoding","gzip");
        }
        if((!headers.containsKey("Content-Type")) && requestMethod == HTTP_POST_REQUEST){
            headers.put("Content-Type","application/x-www-form-urlencoded");
        }
        httpUtil = new HTTPUtil();
        String response = null;
        if(checkConnectivity()){
            appendDeviceInfo();
            printDebug();
            if (filePath != null) {
                response = httpUtil.uploadFile(url, fileName, new File(filePath), params, headers);
            }else {
                if (requestMethod == HTTP_POST_REQUEST) {
                    if (body != null && body.trim().length() > 0) {
                        response = httpUtil.postInBody(url, body, headers);
                    } else {
                        response = httpUtil.postResponse(url, params, headers);
                    }
                } else {
                    response = httpUtil.getResponse(url, null);
                }
            }
            if(response==null){
                if(offlineEventHandler!=null){
                    offlineEventHandler.run();
                }else if(isofflineSupported){
                    saveToOfflineMaster();
                }
            }else{
                if(deleteFile && filePath != null){
                    File f = new File(filePath);
                    if(f.exists()){
                        f.delete();
                    }
                }
            }
        }else{
            if(offlineEventHandler!=null){
                offlineEventHandler.run();
            }else if(isofflineSupported){
                saveToOfflineMaster();
            }
        }
        if(printDebug){
            System.out.println("*********** Response *****************");
            System.out.println(response);
            System.out.println();
        }
        return response;
    }

    private void saveToOfflineMaster(){
        DatabaseHelper dHelper = DatabaseHelper.getInstance(context);
        dHelper.insertRequest(this);
    }

    private boolean checkConnectivity(){
        ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        boolean isConnected = activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        return isConnected;
    }

    private void appendDeviceInfo(){
        if(!appendDeviceInfo){
            return;
        }
        StringBuilder additionalDeviceInfo = new StringBuilder(url);
        if(url.indexOf('?')<0){
            additionalDeviceInfo.append("?");
        }
        additionalDeviceInfo.append("&_OS_Version=" );
        additionalDeviceInfo.append(Build.VERSION.RELEASE.replace(" ","-"));
        additionalDeviceInfo.append("&_DEVICE=");
        additionalDeviceInfo.append(Build.DEVICE.replace(" ","-"));
        additionalDeviceInfo.append("&_MODEL=");
        additionalDeviceInfo.append(Build.MODEL.replace(" ","-"));
        additionalDeviceInfo.append("&_PRODUCT=");
        additionalDeviceInfo.append(Build.PRODUCT.replace(" ","-"));
        additionalDeviceInfo.append("&_BRAND=");
        additionalDeviceInfo.append(Build.BRAND.replace(" ","-"));
        additionalDeviceInfo.append("&_LOCALTIME="+new Date().toString().replace(" ","-"));
        url = additionalDeviceInfo.toString();
    }

    private void printDebug(){
        if(!printDebug){
            return;
        }
        System.out.println("URL : "+url);

        if (requestMethod == HTTP_POST_REQUEST) {
            System.out.println("Request Method : POST");
        }else{
            System.out.println("Request Method : GET");
        }

        System.out.println("***********Body Data*****************");
        if (body != null) {
            System.out.println(body);
        }
        System.out.println(" ");

        System.out.println("***********Headers*****************");
        if(headers != null && headers.size()>0){
            Enumeration<String> headerKeys = headers.keys();
            while (headerKeys.hasMoreElements()) {
                String key = headerKeys.nextElement();
                System.out.println(key+" <-> "+ headers.get(key));
            }
        }
        System.out.println(" ");

        System.out.println("***********Params*****************");
        if(params != null && params.size()>0){
            Set<String> keys = params.keySet();
            for (String key : keys) {
                System.out.println(key+" <-> "+ params.get(key));
            }
        }
        System.out.println(" ");

        System.out.println("***********File Upload*****************");
        if(filePath != null){
            System.out.println(filePath);
        }
        System.out.println(" ");
    }

    public String getCookieValue(String keyName){
        return httpUtil.getCookieValue(keyName);
    }

    public void setOfflineSupported(boolean support){
        isofflineSupported = support;
    }

    public boolean isDeleteFile() {
        return deleteFile;
    }

    public void setDeleteFile(boolean deleteFile) {
        this.deleteFile = deleteFile;
    }
}
