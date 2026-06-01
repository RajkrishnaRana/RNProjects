package in.illimitable.util;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteStatement;
import android.os.Environment;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;


/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class DatabaseHelper extends SQLiteOpenHelper {

    private Context context;
    private static DatabaseHelper helper;

    private static final String TAG = "Smart Tea Farm APP";

    public static final String DATABASE_NAME = "stf.db";
    public static final int DATABASE_VERSION = 18;

    /**
     * TABLE NAMES *
     */
    public static final String OFFLINE_MASTER = "OFFLINE_MASTER";
    public static final String FILE_UPLOAD_MASTER = "FILE_UPLOAD_MASTER";
    public static final String REQUEST_HEADER_MASTER = "REQUEST_HEADER_MASTER";
    public static final String REQUEST_PARAM_MASTER = "REQUEST_PARAM_MASTER";
    public static final String NOTIFICATION_MASTER = "NOTIFICATION_MASTER";
    public static final String WORKER_MASTER = "WORKER_MASTER";
    public static final String KAMJARI_MASTER = "KAMJARI_MASTER";
    public static final String SECTION_MASTER = "SECTION_MASTER";
    public static final String BOOK_MASTER = "BOOK_MASTER";
    public static final String WORKER_TYPE_MASTER = "WORKER_TYPE_MASTER";
    public static final String CONFIG_MASTER = "CONFIG_MASTER";
    public static final String ATTENDANCE_MASTER = "ATTENDANCE_MASTER";
    public static final String SYNC_MASTER = "SYNC_MASTER";
    public static final String PLUCKED_QUANTITY_MASTER = "PLUCKED_QUANTITY_MASTER";
    public static final String AUTHORISED_USER_MASTER = "AUTHORISED_USER_MASTER";
    public static final String BATCH_MASTER = "BATCH_MASTER";
    public static final String SHIFT_MASTER = "SHIFT_MASTER";

    /**
     * COLUMN NAMES *
     */

    /* OFFLINE_MASTER_TABLE */
    public static final String REQUEST_ID = "request_id";
    public static final String REQUEST_TYPE = "request_type";
    public static final String REQUEST_URL = "request_url";
    public static final String REQUEST_BODY = "request_body";
    public static final String REQUEST_IDENTIFIER = "request_identifier";
    public static final String REQUEST_UNDER_PROCESS = "under_processing";
    public static final String REQUEST_RETRYCOUNT = "retry_count";
    public static final String REQUEST_DELETE_FILE = "delete_file";
    /* IMAGE_SUBMISSION_MASTER */
    public static final String IMAGE_ID = "image_id";
    /* FILE_UPLOAD_MASTER*/
    public static final String FILE_ID = "file_id";
    public static final String FILE_PATH = "file_path";
    public static final String FILE_NAME = "file_name";
    /* REQUEST_HEADER_MASTER */
    public static final String HEADER_NAME = "header_name";
    public static final String HEADER_VALUE = "header_value";
    /* REQUEST_PARAM_MASTER */
    public static final String PARAM_NAME = "param_name";
    public static final String PARAM_VALUE = "param_value";
    /*NOTIFICATION_MASTER*/
    public static final String NOTIFICATION_ID = "notification_id";
    public static final String NOTIFICATION_HEADER = "notification_header";
    public static final String NOTIFICATION_BODY = "notification_body";
    public static final String NOTIFICATION_TIME_STAMP = "notification_time_stamp";
    public static final String NOTIFICATION_READ = "notification_read";
    /*WORKER_MASTER*/
    public static final String WORKER_ID = "worker_id";
    public static final String WORKER_NAME = "worker_name";
    public static final String WORKER_CODE = "worker_code";
    public static final String WORKER_GENDER = "worker_gender";
    public static final String WORKER_TYPE_ID = "worker_type_id";
    public static final String WORKER_TYPE_NAME = "worker_type_name";
    public static final String WORKER_SUBTYPE_ID = "worker_subtype_id";
    public static final String WORKER_SUBTYPE_NAME = "worker_subtype_name";
    public static final String WORKER_BOOK_ID = "worker_book_id";
    public static final String WORKER_BOOK_NAME = "worker_book_name";
    public static final String WORKER_KAMJARI_ID = "worker_kamjari_id";
    public static final String WORKER_KAMJARI_NAME = "worker_kamjari_name";
    public static final String WORKER_SECTION_ID = "worker_section_id";
    public static final String WORKER_SECTION_NAME = "worker_section_name";
    public static final String WORKER_IRIS_SCAN_STATUS = "worker_iris_scan_status";
    public static final String WORKER_IMAGE_PATH = "worker_image_path";
    public static final String WORKER_EMP_NUMBER = "worker_emp_no";
    public static final String WORKER_DIVISION = "worker_div";
    public static final String WORKER_BOOK_EMP_NUMBER = "worker_div_emp_no";
    public static final String WORKER_DEFAULT_KAMJARI = "worker_default_kamjari";
    /*KAMJARI_MASTER*/
    public static final String KAMJARI_ID = "kamjari_id";
    public static final String KAMJARI_NAME = "kamjari_name";
    public static final String KAMJARI_CODE = "kamjari_code";
    public static final String KAMJARI_IS_ACTIVE = "kamjari_is_active";
    public static final String KAMJARI_PARENT_ID = "kamjari_parent_id";
    public static final String KAMJARI_TYPE = "kamjari_type";
    public static final String KAMJARI_IS_DEFAULT = "kamjari_is_default";
    /*SECTION_MASTER*/
    public static final String SECTION_ID = "section_id";
    public static final String SECTION_NAME = "section_name";
    public static final String SECTION_CODE = "section_code";
    public static final String SECTION_IS_ACTIVE = "section_is_active";
    /*BOOK_MASTER*/
    public static final String BOOK_ID = "book_id";
    public static final String BOOK_NAME = "book_name";
    /*WORKER_TYPE_MASTER*/
    public static final String WORKERTYPE_ID = "workertype_id";
    public static final String WORKERTYPE_NAME = "workertype_name";
    public static final String WORKERTYPE_SUBTYPE = "workertype_subtype";
    /*CONFIG_MASTER*/
    public static final String CONFIG_ID = "config_id";
    public static final String CONFIG_VALUE = "config_value";
    /*ATTENDANCE_MASTER*/
    public static final String ATTENDANCE_ID = "attendance_id";
    public static final String ATTENDANCE_WORKER_ID = "attendance_worker_id";
    public static final String ATTENDANCE_DATE = "attendance_date";
    public static final String ATTENDANCE_TIME = "attendance_time";
    /*SYNC_MASTER*/
    public static final String SYNC_ID = "sync_id";
    public static final String LAST_SYNC_DATE = "last_sync_date";
    /*PLUCKED_QUANTITY_MASTER*/
    public static final String PLUCKED_QUANTITY_ID = "plucked_quantity_id";
    public static final String RECORD_QUANTITY = "record_quantity";
    public static final String RECORD_DATE = "record_date";
    public static final String WEIGHMENT_NUMBER = "weighment_number";
    public static final String RECORD_TIME = "record_time";
    /*AUTHORISED_USER_MASTER*/
    public static final String AUTHORISED_USER_ID = "authorised_user_id";
    public static final String AUTHORISED_USER_NAME = "authorised_user_name";
    public static final String AUTHORISED_USER_EMAIL = "authorised_user_email";
    /*BATCH_MASTER*/
    public static final String BATCH_ID = "batch_id";
    public static final String BATCH_NAME = "batch_name";
    public static final String DIV_ID = "div_id";
    public static final String BATCH_TYPE ="batch_type";
    /*SHIFT_MASTER*/
    public static final String SHIFT_ID = "shift_id";
    public static final String SHIFT_CODE = "shift_code";

    public static final int SERVER_URL = 1001;
    public static final int PLUCKING_RECORDING_STAT = 2001;

    public DatabaseHelper(Context context) {
        // super(context, context.getExternalFilesDir(null)+ File.separator + "stf"  + File.separator + "stf.db", null, DATABASE_VERSION);
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        this.context = context;
    }

    public static synchronized DatabaseHelper getInstance(Context context) {
        if (helper == null) {
            helper = new DatabaseHelper(context);
        }
        return helper;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS " + OFFLINE_MASTER + " ("
                + REQUEST_ID + " INTEGER primary key autoincrement ,"
                + REQUEST_TYPE + " TEXT ,"
                + REQUEST_URL + " TEXT ,"
                + REQUEST_BODY + " TEXT ,"
                + REQUEST_IDENTIFIER + " TEXT ,"
                + REQUEST_UNDER_PROCESS + " TEXT ,"
                + REQUEST_RETRYCOUNT + " INTEGER ,"
                + REQUEST_DELETE_FILE + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + FILE_UPLOAD_MASTER + " ("
                + FILE_ID + " INTEGER primary key autoincrement ,"
                + REQUEST_ID + " TEXT ,"
                + FILE_PATH + " TEXT ,"
                + FILE_NAME + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + REQUEST_HEADER_MASTER + " ("
                + REQUEST_ID + " TEXT ,"
                + HEADER_NAME + " TEXT ,"
                + HEADER_VALUE + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + REQUEST_PARAM_MASTER + " ("
                + REQUEST_ID + " TEXT ,"
                + PARAM_NAME + " TEXT ,"
                + PARAM_VALUE + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + NOTIFICATION_MASTER + " ("
                + NOTIFICATION_ID + " INTEGER primary key autoincrement ,"
                + NOTIFICATION_HEADER + " TEXT ,"
                + NOTIFICATION_BODY + " TEXT ,"
                + NOTIFICATION_TIME_STAMP + " TEXT ,"
                + NOTIFICATION_READ + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + WORKER_MASTER + " ("
                + WORKER_ID + " TEXT  PRIMARY KEY,"
                + WORKER_NAME + " TEXT ,"
                + WORKER_CODE + " TEXT ,"
                + WORKER_GENDER + " TEXT ,"
                + WORKER_TYPE_ID + " TEXT ,"
                + WORKER_TYPE_NAME + " TEXT ,"
                + WORKER_SUBTYPE_ID + " TEXT ,"
                + WORKER_SUBTYPE_NAME + " TEXT ,"
                + WORKER_BOOK_ID + " TEXT ,"
                + WORKER_BOOK_NAME + " TEXT ,"
                + WORKER_KAMJARI_ID + " TEXT ,"
                + WORKER_KAMJARI_NAME + " TEXT ,"
                + WORKER_SECTION_ID + " TEXT ,"
                + WORKER_SECTION_NAME + " TEXT ,"
                + WORKER_IRIS_SCAN_STATUS + " TEXT ,"
                + WORKER_IMAGE_PATH + " TEXT ,"
                + WORKER_EMP_NUMBER + " INTEGER ,"
                + WORKER_DIVISION + " TEXT ,"
                + WORKER_BOOK_EMP_NUMBER + " TEXT ,"
                + WORKER_DEFAULT_KAMJARI + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + KAMJARI_MASTER + " ("
                + KAMJARI_ID + " TEXT ,"
                + KAMJARI_CODE + " TEXT ,"
                + KAMJARI_NAME + " TEXT ,"
                + KAMJARI_IS_ACTIVE + " TEXT ,"
                + KAMJARI_PARENT_ID + " TEXT ,"
                + KAMJARI_TYPE + " TEXT ,"
                + KAMJARI_IS_DEFAULT + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + SECTION_MASTER + " ("
                + SECTION_ID + " TEXT ,"
                + SECTION_CODE + " TEXT ,"
                + SECTION_NAME + " TEXT ,"
                + SECTION_IS_ACTIVE + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + BOOK_MASTER + " ("
                + BOOK_ID + " TEXT ,"
                + BOOK_NAME + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + WORKER_TYPE_MASTER + " ("
                + WORKERTYPE_ID + " TEXT ,"
                + WORKERTYPE_NAME + " TEXT ,"
                + WORKERTYPE_SUBTYPE + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + CONFIG_MASTER + " ("
                + CONFIG_ID + " integer PRIMARY KEY ,"
                + CONFIG_VALUE + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + ATTENDANCE_MASTER + " ("
                + ATTENDANCE_ID + " INTEGER primary key autoincrement ,"
                + ATTENDANCE_WORKER_ID + " TEXT ,"
                + BATCH_ID + " TEXT ,"
                + SECTION_ID + " TEXT ,"
                + KAMJARI_ID + " TEXT ,"
                + ATTENDANCE_DATE + " TEXT ,"
                + ATTENDANCE_TIME + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + SYNC_MASTER + " ("
                + SYNC_ID + " integer PRIMARY KEY ,"
                + LAST_SYNC_DATE + " TEXT"
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + PLUCKED_QUANTITY_MASTER + " ("
                + PLUCKED_QUANTITY_ID + " INTEGER primary key autoincrement ,"
                + WORKER_ID + " TEXT ,"
                + RECORD_DATE + " TEXT ,"
                + RECORD_QUANTITY + " REAL ,"
                + WEIGHMENT_NUMBER + " TEXT ,"
                + SECTION_CODE + " TEXT ,"
                + RECORD_TIME + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + AUTHORISED_USER_MASTER + " ("
                + AUTHORISED_USER_ID + " TEXT ,"
                + AUTHORISED_USER_NAME + " TEXT ,"
                + AUTHORISED_USER_EMAIL + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + BATCH_MASTER + " ("
                + BATCH_ID + " TEXT ,"
                + BATCH_NAME + " TEXT ,"
                + DIV_ID + " TEXT ,"
                + SHIFT_ID + " TEXT ,"
                + BATCH_TYPE + " TEXT "
                + ");");
        db.execSQL("CREATE TABLE IF NOT EXISTS " + SHIFT_MASTER + " ("
                + SHIFT_ID + " TEXT ,"
                + SHIFT_CODE + " TEXT ,"
                + KAMJARI_ID + " TEXT "
                + ");");
        Log.d(TAG, "Table Created");

        db.execSQL("CREATE INDEX IF NOT EXISTS WORKER_ID_IDX ON " + WORKER_MASTER + " ("
                + WORKER_ID + ");");

        db.execSQL("CREATE INDEX IF NOT EXISTS ATTENDANCE_DATE_IDX ON " + ATTENDANCE_MASTER + " ("
                + ATTENDANCE_DATE + ");");

        db.execSQL("CREATE INDEX IF NOT EXISTS RECORD_DATE_IDX ON " + PLUCKED_QUANTITY_MASTER + " ("
                + RECORD_DATE + ");");

        db.execSQL("CREATE INDEX IF NOT EXISTS ATTENDANCE_WORKER_ID_IDX ON " + ATTENDANCE_MASTER + " ("
                + ATTENDANCE_WORKER_ID + ");");

        db.execSQL("CREATE INDEX IF NOT EXISTS RECORD_WORKER_ID_IDX ON " + PLUCKED_QUANTITY_MASTER + " ("
                + WORKER_ID + ");");
        Log.d(TAG, "Index Created");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion == 1) {
            db.execSQL("CREATE TABLE IF NOT EXISTS " + SYNC_MASTER + " ("
                    + SYNC_ID + " integer PRIMARY KEY ,"
                    + LAST_SYNC_DATE + " TEXT"
                    + ");");
        }
        if (oldVersion <= 2) {
            db.execSQL("ALTER TABLE " + SECTION_MASTER + " ADD COLUMN " + SECTION_CODE + " TEXT ");
            db.execSQL("ALTER TABLE " + KAMJARI_MASTER + " ADD COLUMN " + KAMJARI_CODE + " TEXT ");
        }
        if (oldVersion <= 3) {
            db.execSQL("ALTER TABLE " + OFFLINE_MASTER + " ADD COLUMN " + REQUEST_DELETE_FILE + " TEXT ");
        }

        if (oldVersion <= 4) {
            db.execSQL("CREATE TABLE IF NOT EXISTS " + PLUCKED_QUANTITY_MASTER + " ("
                    + PLUCKED_QUANTITY_ID + " INTEGER primary key autoincrement ,"
                    + WORKER_ID + " TEXT ,"
                    + RECORD_DATE + " TEXT ,"
                    + RECORD_QUANTITY + " REAL ,"
                    + WEIGHMENT_NUMBER + " TEXT"
                    + ");");
        }

        if (oldVersion <= 5) {
            db.execSQL("ALTER TABLE " + WORKER_MASTER + " ADD COLUMN " + WORKER_EMP_NUMBER + " INTEGER ");
            db.execSQL("ALTER TABLE " + WORKER_MASTER + " ADD COLUMN " + WORKER_DIVISION + " TEXT ");

            db.execSQL("CREATE TABLE IF NOT EXISTS " + AUTHORISED_USER_MASTER + " ("
                    + AUTHORISED_USER_ID + " TEXT ,"
                    + AUTHORISED_USER_NAME + " TEXT"
                    + ");");
        }

        if (oldVersion <= 6) {
            db.execSQL("ALTER TABLE " + WORKER_MASTER + " ADD COLUMN " + WORKER_BOOK_EMP_NUMBER + " TEXT ");
        }

        if (oldVersion <= 7) {
            db.execSQL("ALTER TABLE " + ATTENDANCE_MASTER + " ADD COLUMN " + ATTENDANCE_TIME + " TEXT ");
        }

        if (oldVersion <= 8) {
            db.execSQL("CREATE INDEX IF NOT EXISTS WORKER_ID_IDX ON " + WORKER_MASTER + " ("
                    + WORKER_ID + ");");

            db.execSQL("CREATE INDEX IF NOT EXISTS ATTENDANCE_DATE_IDX ON " + ATTENDANCE_MASTER + " ("
                    + ATTENDANCE_DATE + ");");

            db.execSQL("CREATE INDEX IF NOT EXISTS RECORD_DATE_IDX ON " + PLUCKED_QUANTITY_MASTER + " ("
                    + RECORD_DATE + ");");

            db.execSQL("CREATE INDEX IF NOT EXISTS ATTENDANCE_WORKER_ID_IDX ON " + ATTENDANCE_MASTER + " ("
                    + ATTENDANCE_WORKER_ID + ");");

            db.execSQL("CREATE INDEX IF NOT EXISTS RECORD_WORKER_ID_IDX ON " + PLUCKED_QUANTITY_MASTER + " ("
                    + WORKER_ID + ");");
        }

        if (oldVersion <= 9) {
            db.execSQL("ALTER TABLE " + PLUCKED_QUANTITY_MASTER + " ADD COLUMN " + SECTION_CODE + " TEXT ");
        }

        if (oldVersion <= 10) {
            db.execSQL("ALTER TABLE " + PLUCKED_QUANTITY_MASTER + " ADD COLUMN " + RECORD_TIME + " TEXT ");
        }

        if (oldVersion <= 11) {
            db.execSQL("ALTER TABLE " + AUTHORISED_USER_MASTER + " ADD COLUMN " + AUTHORISED_USER_EMAIL + " TEXT ");
        }

        if(oldVersion <= 12) {
            db.execSQL("CREATE TABLE IF NOT EXISTS " + BATCH_MASTER + " ("
                    + BATCH_ID + " TEXT ,"
                    + BATCH_NAME + " TEXT ,"
                    + DIV_ID + " TEXT ,"
                    + SHIFT_ID + " TEXT "
                    + ");");
            db.execSQL("CREATE TABLE IF NOT EXISTS " + SHIFT_MASTER + " ("
                    + SHIFT_ID + " TEXT ,"
                    + SHIFT_CODE + " TEXT "
                    + ");");
        }

        if (oldVersion <= 13) {
            db.execSQL("ALTER TABLE " + KAMJARI_MASTER + " ADD COLUMN " + KAMJARI_TYPE + " TEXT ");
        }
        if (oldVersion <= 14) {
            db.execSQL("ALTER TABLE " + ATTENDANCE_MASTER + " ADD COLUMN " + BATCH_ID + " TEXT ");
            db.execSQL("ALTER TABLE " + ATTENDANCE_MASTER + " ADD COLUMN " + SECTION_ID + " TEXT ");
            db.execSQL("ALTER TABLE " + ATTENDANCE_MASTER + " ADD COLUMN " + KAMJARI_ID + " TEXT ");
        }
        if (oldVersion <= 15) {
            db.execSQL("ALTER TABLE " + BATCH_MASTER + " ADD COLUMN " + BATCH_TYPE + " TEXT ");
            db.execSQL("ALTER TABLE " + SHIFT_MASTER + " ADD COLUMN " + KAMJARI_ID + " TEXT ");
        }
        if (oldVersion <= 16) {
            db.execSQL("ALTER TABLE " + WORKER_MASTER + " ADD COLUMN " + WORKER_DEFAULT_KAMJARI + " TEXT ");
        }
        if (oldVersion <= 17) {
            db.execSQL("ALTER TABLE " + KAMJARI_MASTER + " ADD COLUMN " + KAMJARI_IS_DEFAULT + " TEXT ");
        }
    }

    public synchronized void deleteAllTables() {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + OFFLINE_MASTER);
            db.execSQL("delete from " + FILE_UPLOAD_MASTER);
            db.execSQL("delete from " + REQUEST_HEADER_MASTER);
            db.execSQL("delete from " + REQUEST_PARAM_MASTER);
            db.execSQL("delete from " + NOTIFICATION_MASTER);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
    }

    public synchronized void deleteDataForNewUser() {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + NOTIFICATION_MASTER);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
    }

    @SuppressLint("Range")
    public String insertToOfflineMaster(String requestType, String requestUrl, String requestBody, String deleteFile) {
        SQLiteDatabase db = this.getWritableDatabase();
        String requestId = null;
        try {
            ContentValues values = new ContentValues();
            values.put(REQUEST_TYPE, requestType);
            values.put(REQUEST_URL, requestUrl);
            values.put(REQUEST_BODY, requestBody);
            values.put(REQUEST_IDENTIFIER, "");
            values.put(REQUEST_UNDER_PROCESS, "FALSE");
            values.put(REQUEST_RETRYCOUNT, 0);
            values.put(REQUEST_DELETE_FILE, deleteFile);
            db.insert(OFFLINE_MASTER, null, values);
            Cursor cursor = db.rawQuery("select " + REQUEST_ID + " from "
                            + OFFLINE_MASTER + " order by " + REQUEST_ID + " DESC limit 1",
                    null);
            cursor.moveToFirst();
            requestId = "" + cursor.getInt(cursor.getColumnIndex(REQUEST_ID));
            cursor.close();
        } catch (Exception e) {
            Log.i(TAG, "insertToOfflineMaster :: " + e.getMessage());
        }
        return requestId;
    }

    public void insertToFileUploadMaster(String requestId, String filePath, String fileName) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            ContentValues values = new ContentValues();
            values.put(REQUEST_ID, requestId);
            values.put(FILE_PATH, filePath);
            values.put(FILE_NAME, fileName);
            db.insert(FILE_UPLOAD_MASTER, null, values);
        } catch (Exception ex) {
            Log.i(TAG, "insertToFileUpload " + ex.getMessage());
        }
    }

    public void insertToRequestHeaderMaster(String requestId, String headerName, String headerValue) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            ContentValues values = new ContentValues();
            values.put(REQUEST_ID, requestId);
            values.put(HEADER_NAME, headerName);
            values.put(HEADER_VALUE, headerValue);
            db.insert(REQUEST_HEADER_MASTER, null, values);
        } catch (Exception ex) {
            Log.i(TAG, "insertToRequestHeaderMaster " + ex.getMessage());
        }
    }

    public void insertToRequestParamMaster(String requestId, String paramName, String paramValue) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            ContentValues values = new ContentValues();
            values.put(REQUEST_ID, requestId);
            values.put(PARAM_NAME, paramName);
            values.put(PARAM_VALUE, paramValue);
            db.insert(REQUEST_PARAM_MASTER, null, values);
        } catch (Exception ex) {
            Log.i(TAG, "insertToRequestParamMaster " + ex.getMessage());
        }
    }

    public synchronized void insertRequest(HTTPRequestWrapper wrapper) {
        String url = wrapper.url;

        if (url.indexOf(Constants.BASE_URL) == 0) {
            url = url.substring(Constants.BASE_URL.length(), url.length());
        }

        String type = "" + wrapper.requestMethod;
        String body = wrapper.body;
        if (body == null) {
            body = "";
        }
        String deleteFile = "" + wrapper.isDeleteFile();
        String requestId = insertToOfflineMaster(type, url, body, deleteFile);
        wrapper.requestId = requestId;
        if (wrapper.headers != null && wrapper.headers.size() > 0) {
            Enumeration<String> keys = wrapper.headers.keys();
            while (keys.hasMoreElements()) {
                String key = keys.nextElement();
                insertToRequestHeaderMaster(requestId, key,
                        wrapper.headers.get(key));
            }
        }

        if (wrapper.params != null && wrapper.params.size() > 0) {
            Set<String> keys = wrapper.params.keySet();
            for (String key : keys) {
                insertToRequestParamMaster(requestId, key, wrapper.params.get(key));
            }
        }

        if (wrapper.filePath != null && wrapper.fileName != null) {
            insertToFileUploadMaster(requestId, wrapper.filePath, wrapper.fileName);
        }
    }

    public synchronized void insertIntoNotificationMaster(String header, String body) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String sql = "INSERT INTO " + NOTIFICATION_MASTER + " ( "
                    + NOTIFICATION_HEADER
                    + ", " + NOTIFICATION_BODY
                    + ", " + NOTIFICATION_TIME_STAMP
                    + ", " + NOTIFICATION_READ + " ) VALUES ( ?, ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindString(1, header);
            stmt.bindString(2, body);
            stmt.bindLong(3, System.currentTimeMillis());
            stmt.bindString(4, "0");
            stmt.execute();
            stmt.clearBindings();
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized Hashtable<String, ArrayList<String>> insertToWorkerMaster(JSONArray workers) {
        SQLiteDatabase db = this.getWritableDatabase();
        Hashtable<String, ArrayList<String>> prevData = new Hashtable<>();
        ArrayList<String> workersWithProfileImage = new ArrayList<>();
        try {
            JSONArray prevValues = getAllWorkersScanandImage();
            db.execSQL("delete from " + WORKER_MASTER);
            String sql = "INSERT INTO " + WORKER_MASTER + " ( "
                    + WORKER_ID
                    + ", " + WORKER_NAME
                    + ", " + WORKER_CODE
                    + ", " + WORKER_GENDER
                    + ", " + WORKER_TYPE_ID
                    + ", " + WORKER_TYPE_NAME
                    + ", " + WORKER_SUBTYPE_ID
                    + ", " + WORKER_SUBTYPE_NAME
                    + ", " + WORKER_BOOK_ID
                    + ", " + WORKER_BOOK_NAME
                    + ", " + WORKER_KAMJARI_ID
                    + ", " + WORKER_KAMJARI_NAME
                    + ", " + WORKER_SECTION_ID
                    + ", " + WORKER_SECTION_NAME
                    + ", " + WORKER_EMP_NUMBER
                    + ", " + WORKER_DIVISION
                    + ", " + WORKER_BOOK_EMP_NUMBER
                    + ", " + WORKER_DEFAULT_KAMJARI + " ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < workers.length(); loop++) {
                stmt.bindString(1, workers.getJSONObject(loop).getString("_id").toLowerCase());
                stmt.bindString(2, workers.getJSONObject(loop).getString("workerName"));
                stmt.bindString(3, workers.getJSONObject(loop).getString("workerCode"));
                stmt.bindString(4, workers.getJSONObject(loop).getString("gender"));
                stmt.bindString(5, workers.getJSONObject(loop).optString("workerType", ""));
                stmt.bindString(6, workers.getJSONObject(loop).optString("workerTypeName", "N/A"));
                stmt.bindString(7, workers.getJSONObject(loop).optString("workerSubType", ""));
                stmt.bindString(8, workers.getJSONObject(loop).optString("workerSubTypeName", "N/A"));
                stmt.bindString(9, workers.getJSONObject(loop).getString("book"));
                stmt.bindString(10, workers.getJSONObject(loop).getString("bookName"));
                stmt.bindString(11, workers.getJSONObject(loop).optString("kamjariId", ""));
                stmt.bindString(12, workers.getJSONObject(loop).optString("kamjariName", "N/A"));
                stmt.bindString(13, workers.getJSONObject(loop).optString("sectionId", ""));
                stmt.bindString(14, workers.getJSONObject(loop).optString("sectionName", "N/A"));
                stmt.bindLong(15, workers.getJSONObject(loop).optInt("empNo", 999999));
                stmt.bindString(16, workers.getJSONObject(loop).optString("div", ""));
                stmt.bindString(17, workers.getJSONObject(loop).optString("bookName", "") +"-"+ workers.getJSONObject(loop).optInt("empNo", 999999));
                stmt.bindString(18, workers.getJSONObject(loop).optString("defaultKamjari", ""));
                if (workers.getJSONObject(loop).getBoolean("profileImage")) {
                    workersWithProfileImage.add(workers.getJSONObject(loop).getString("_id").toLowerCase());
                }
                stmt.execute();
                stmt.clearBindings();
            }
            SQLiteStatement stmt2 = db.compileStatement("UPDATE " + WORKER_MASTER + " set " + WORKER_IMAGE_PATH + " = ? where " + WORKER_ID + " = ?");
            for (int loop = 0; loop < prevValues.length(); loop++) {
                String imagePath = prevValues.getJSONObject(loop).optString(WORKER_IMAGE_PATH, "");
                String workerId = prevValues.getJSONObject(loop).getString(WORKER_ID);
                if (!imagePath.equals("")) {
                    workersWithProfileImage.remove(workerId);
                }
                stmt2.bindString(1, imagePath);
                stmt2.bindString(2, workerId);
                stmt2.execute();
                stmt2.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
        prevData.put("WORKERS_WITH_PROFILE_IMAGE", workersWithProfileImage);
        return prevData;
    }

    public synchronized void insertToAuthorisedUserMaster(JSONArray users) {
        if (users == null) {
            return;
        }
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + AUTHORISED_USER_MASTER);
            String sql = "INSERT INTO " + AUTHORISED_USER_MASTER + " ( "
                    + AUTHORISED_USER_ID
                    + ", " + AUTHORISED_USER_NAME
                    + ", " + AUTHORISED_USER_EMAIL + " ) VALUES ( ?, ?, ?)";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < users.length(); loop++) {
                stmt.bindString(1, users.getJSONObject(loop).getString("_id"));
                stmt.bindString(2, users.getJSONObject(loop).getString("name"));
                stmt.bindString(3, users.getJSONObject(loop).getString("email"));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToKamjariMaster(JSONArray kamjaris) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + KAMJARI_MASTER);
            String sql = "INSERT INTO " + KAMJARI_MASTER + " ( "
                    + KAMJARI_ID
                    + ", " + KAMJARI_CODE
                    + ", " + KAMJARI_NAME
                    + ", " + KAMJARI_IS_ACTIVE
                    + ", " + KAMJARI_PARENT_ID
                    + ", " + KAMJARI_TYPE
                    + ", " + KAMJARI_IS_DEFAULT + " ) VALUES ( ?, ?, ?, ?, ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < kamjaris.length(); loop++) {
                stmt.bindString(1, kamjaris.getJSONObject(loop).getString("id"));
                stmt.bindString(2, kamjaris.getJSONObject(loop).getString("code"));
                stmt.bindString(3, kamjaris.getJSONObject(loop).getString("name"));
                stmt.bindString(4, String.valueOf(kamjaris.getJSONObject(loop).getBoolean("isActive")));
                stmt.bindString(5, kamjaris.getJSONObject(loop).getString("parent"));
                stmt.bindString(6, kamjaris.getJSONObject(loop).getString("type"));
                stmt.bindString(7, String.valueOf(kamjaris.getJSONObject(loop).optBoolean("isDefault", false)));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToSectionMaster(JSONArray sections) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + SECTION_MASTER);
            String sql = "INSERT INTO " + SECTION_MASTER + " ( "
                    + SECTION_ID
                    + ", " + SECTION_CODE
                    + ", " + SECTION_NAME
                    + ", " + SECTION_IS_ACTIVE + " ) VALUES ( ?, ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < sections.length(); loop++) {
                stmt.bindString(1, sections.getJSONObject(loop).getString("id"));
                stmt.bindString(2, sections.getJSONObject(loop).getString("code"));
                stmt.bindString(3, sections.getJSONObject(loop).getString("name"));
                stmt.bindString(4, String.valueOf(sections.getJSONObject(loop).getBoolean("isActive")));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToBookMaster(JSONArray books) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + BOOK_MASTER);
            String sql = "INSERT INTO " + BOOK_MASTER + " ( "
                    + BOOK_ID
                    + ", " + BOOK_NAME + " ) VALUES ( ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < books.length(); loop++) {
                stmt.bindString(1, books.getJSONObject(loop).getString("id"));
                stmt.bindString(2, books.getJSONObject(loop).getString("name"));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToWorkerTypeMaster(JSONArray workerTypes) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + WORKER_TYPE_MASTER);
            String sql = "INSERT INTO " + WORKER_TYPE_MASTER + " ( "
                    + WORKERTYPE_ID
                    + ", " + WORKERTYPE_NAME
                    + ", " + WORKERTYPE_SUBTYPE + " ) VALUES ( ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < workerTypes.length(); loop++) {
                stmt.bindString(1, workerTypes.getJSONObject(loop).getString("id"));
                stmt.bindString(2, workerTypes.getJSONObject(loop).getString("name"));
                stmt.bindString(3, workerTypes.getJSONObject(loop).getJSONArray("subtypes").toString());
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToBatchMaster(JSONArray array) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + BATCH_MASTER);
            String sql = "INSERT INTO " + BATCH_MASTER + " ( "
                    + BATCH_ID
                    + ", " + BATCH_NAME
                    + ", " + DIV_ID
                    + ", " + SHIFT_ID
                    + ", " + BATCH_TYPE + " ) VALUES ( ?, ?, ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < array.length(); loop++) {
                stmt.bindString(1, array.getJSONObject(loop).getString("id"));
                stmt.bindString(2, array.getJSONObject(loop).getString("name"));
                stmt.bindString(3, array.getJSONObject(loop).getString("div"));
                stmt.bindString(4, array.getJSONObject(loop).getString("defaultShift"));
                stmt.bindString(5, array.getJSONObject(loop).optString("type", ""));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToShiftMaster(JSONArray array) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("delete from " + SHIFT_MASTER);
            String sql = "INSERT INTO " + SHIFT_MASTER + " ( "
                    + SHIFT_ID
                    + ", " +  SHIFT_CODE
                    + ", " + KAMJARI_ID + " ) VALUES ( ?, ?, ? )";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(sql);
            for (int loop = 0; loop < array.length(); loop++) {
                stmt.bindString(1, array.getJSONObject(loop).getString("_id"));
                stmt.bindString(2, array.getJSONObject(loop).getString("code"));
                stmt.bindString(3, array.getJSONObject(loop).getString("kamjariId"));
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void insertToAttendanceMaster(String workerId, String batchId, String sectionId, String kamjariId) {
        SQLiteDatabase db = this.getWritableDatabase();
        if((batchId==null) || batchId.equals("-1")) {
            batchId ="";
        }
        if((sectionId==null) || sectionId.equals("-1")) {
            sectionId ="";
        }
        if((kamjariId==null) || kamjariId.equals("-1")) {
            kamjariId ="";
        }
        try {
            String sql = "INSERT INTO " + ATTENDANCE_MASTER + " ( "
                    + ATTENDANCE_WORKER_ID
                    + ", " + BATCH_ID
                    + ", " + SECTION_ID
                    + ", " + KAMJARI_ID
                    + ", " + ATTENDANCE_DATE
                    + ", " + ATTENDANCE_TIME + " ) VALUES ( ?, ?, ?, ?, ?, ? )";
            long today = Utility.getDateFromNow(0);
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindString(1, workerId);
            stmt.bindString(2, batchId);
            stmt.bindString(3, sectionId);
            stmt.bindString(4, kamjariId);
            stmt.bindLong(5, today);
            stmt.bindLong(6, System.currentTimeMillis());
            stmt.execute();
            stmt.clearBindings();
        } catch (Exception ex) {
            // ex.printStackTrace();
        }
    }

    public synchronized void removeFromAttendanceMaster(String workerId) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            long today = Utility.getDateFromNow(0);
            String sql = "delete from "
                    + ATTENDANCE_MASTER
                    + " where "
                    + ATTENDANCE_WORKER_ID
                    + " = '"
                    + workerId
                    + "' and "
                    + ATTENDANCE_DATE
                    + " = "
                    + today;
            db.execSQL(sql);
        } catch (Exception ex) {
            // ex.printStackTrace();
        } finally {

        }
    }

    public synchronized void insertToConfigMaster(int configId, String configValue) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String sql = "INSERT OR REPLACE INTO " + CONFIG_MASTER + " ( "
                    + CONFIG_ID
                    + ", " + CONFIG_VALUE + " ) VALUES ( ?, ? )";
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindLong(1, configId);
            stmt.bindString(2, configValue);
            stmt.execute();
            stmt.clearBindings();
        } catch (Exception ex) {
            // ex.printStackTrace();
        }
    }

    public synchronized void insertPluckingRecordingStat(int count, long duration) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            long date = cal.getTimeInMillis();
            JSONObject jStat = new JSONObject("{date :"+date+", duration: 0, count: 0}");
            Cursor cursor = db.rawQuery("select "+CONFIG_VALUE+" from "
                    + CONFIG_MASTER
                    + " where " + CONFIG_ID
                    + " = "
                    + PLUCKING_RECORDING_STAT, null);
            if(cursor.moveToFirst()) {
                String stat = cursor.getString(0);
                JSONObject jStat1 = new JSONObject(stat);
                if (jStat1.getLong("date")==date) {
                    jStat = jStat1;
                }
            }
            cursor.close();
            jStat.put("duration", jStat.getLong("duration") + duration);
            jStat.put("count", jStat.getInt("count") + count);
            String sql = "INSERT OR REPLACE INTO " + CONFIG_MASTER + " ( "
                    + CONFIG_ID
                    + ", " + CONFIG_VALUE + " ) VALUES ( ?, ? )";
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindLong(1, PLUCKING_RECORDING_STAT);
            stmt.bindString(2, jStat.toString());
            stmt.execute();
            stmt.clearBindings();
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized void insertToSyncMaster(int syncId, String syncDate) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String sql = "INSERT OR REPLACE INTO " + SYNC_MASTER + " ( "
                    + SYNC_ID
                    + ", " + LAST_SYNC_DATE + " ) VALUES ( ?, ? )";
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindLong(1, syncId);
            stmt.bindString(2, syncDate);
            stmt.execute();
            stmt.clearBindings();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @SuppressLint("Range")
    public synchronized HTTPRequestWrapper getRequest() {
        HTTPRequestWrapper wrapper = null;
        String identifier = UUID.randomUUID().toString();
        try {
            SQLiteDatabase db = this.getWritableDatabase();
            db.execSQL("update "
                    + OFFLINE_MASTER
                    + " set "
                    + REQUEST_UNDER_PROCESS
                    + " = 'TRUE', "
                    + REQUEST_IDENTIFIER
                    + "= '"
                    + identifier
                    + "' where "
                    + REQUEST_ID
                    + " in( select "
                    + REQUEST_ID
                    + " from "
                    + OFFLINE_MASTER
                    + " where "
                    + REQUEST_UNDER_PROCESS
                    + " = 'FALSE' order by "
                    + REQUEST_RETRYCOUNT
                    + ","
                    + REQUEST_ID
                    + " limit 1)");
            Cursor cursor = db.rawQuery("select * from "
                    + OFFLINE_MASTER
                    + " where "
                    + REQUEST_IDENTIFIER
                    + " = '"
                    + identifier
                    + "'", null);

            if (cursor.moveToFirst()) {
                String requestId = "" + cursor.getInt(cursor.getColumnIndex(REQUEST_ID));
                String requestType = cursor.getString(cursor.getColumnIndex(REQUEST_TYPE));
                String requestUrl = cursor.getString(cursor.getColumnIndex(REQUEST_URL));
                String requestBody = cursor.getString(cursor.getColumnIndex(REQUEST_BODY));

                if (requestUrl.indexOf("http") < 0) {
                    requestUrl = Constants.BASE_URL + requestUrl;
                }

                wrapper = new HTTPRequestWrapper(context, requestUrl, Integer.parseInt(requestType));
                wrapper.setBodyData(requestBody);
                wrapper.requestId = requestId;
                cursor = db.rawQuery("select * from "
                        + REQUEST_HEADER_MASTER
                        + " where "
                        + REQUEST_ID
                        + " = "
                        + requestId, null);
                while (cursor.moveToNext()) {
                    String key = cursor.getString(cursor.getColumnIndex(HEADER_NAME));
                    String value = cursor.getString(cursor.getColumnIndex(HEADER_VALUE));
                    wrapper.addHeader(key, value);
                }
                cursor = db.rawQuery("select * from "
                        + REQUEST_PARAM_MASTER
                        + " where " + REQUEST_ID
                        + " = "
                        + requestId, null);
                while (cursor.moveToNext()) {
                    String key = cursor.getString(cursor.getColumnIndex(PARAM_NAME));
                    String value = cursor.getString(cursor.getColumnIndex(PARAM_VALUE));
                    wrapper.addParam(key, value);
                }

                cursor = db.rawQuery("select * from "
                        + FILE_UPLOAD_MASTER
                        + " where " + REQUEST_ID
                        + " = "
                        + requestId, null);
                if (cursor.moveToFirst()) {
                    wrapper.setFile(cursor.getString(cursor.getColumnIndex(FILE_PATH)), cursor.getString(cursor.getColumnIndex(FILE_NAME)));
                }
            }
            cursor.close();
        } catch (Exception e) {
            e.printStackTrace();
            releaseOfflineRecordByUniqueId(identifier);
        }
        return wrapper;
    }

    public synchronized void incrementRetyCountInOfflineRecord(String requestId) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update "
                    + OFFLINE_MASTER
                    + " set "
                    + REQUEST_RETRYCOUNT
                    + " = "
                    + REQUEST_RETRYCOUNT
                    + " + 1, "
                    + REQUEST_UNDER_PROCESS
                    + " = 'FALSE', "
                    + REQUEST_IDENTIFIER
                    + "  = '' where "
                    + REQUEST_ID
                    + " = "
                    + requestId;
            db.execSQL(query);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public synchronized void releaseOfflineRecord(String requestId) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("update "
                    + OFFLINE_MASTER
                    + " set "
                    + REQUEST_UNDER_PROCESS
                    + " = 'FALSE', "
                    + REQUEST_IDENTIFIER
                    + "  = '' where "
                    + REQUEST_ID
                    + " = "
                    + requestId);
        } catch (Exception e) {
        }
    }

    public synchronized void releaseAllOfflineRecord() {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("update "
                    + OFFLINE_MASTER
                    + " set "
                    + REQUEST_UNDER_PROCESS
                    + " = 'FALSE', "
                    + REQUEST_IDENTIFIER
                    + "  = ''");
        } catch (Exception e) {
        }
    }

    public synchronized void releaseOfflineRecordByUniqueId(String uniqueId) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            db.execSQL("update "
                    + OFFLINE_MASTER
                    + " set "
                    + REQUEST_UNDER_PROCESS
                    + " = 'FALSE', "
                    + REQUEST_IDENTIFIER
                    + "  = '' where "
                    + REQUEST_IDENTIFIER
                    + " = '"
                    + uniqueId
                    + "'");
        } catch (Exception e) {
        }
    }

    @SuppressLint("Range")
    public synchronized void deleteRequest(String requestId) {
        SQLiteDatabase db = this.getWritableDatabase();
        ArrayList<String> ids = new ArrayList<String>();
        String filePath = null;
        String deleteFile = "false";
        try {
            Cursor cursor = db.rawQuery("select * from " + FILE_UPLOAD_MASTER + " where " + REQUEST_ID + " = " + requestId, null);
            if (cursor.moveToFirst()) {
                filePath = cursor.getString(cursor.getColumnIndex(FILE_PATH));
                if (filePath != null) {
                    filePath = filePath.trim();
                }
            }
            try {
                cursor.close();
            } catch (Exception e) {
            }
            Cursor cursor1 = db.rawQuery("select * from " + OFFLINE_MASTER + " where " + REQUEST_ID + " = " + requestId, null);
            if (cursor1.moveToFirst()) {
                deleteFile = cursor1.getString(cursor1.getColumnIndex(REQUEST_DELETE_FILE));
                if (deleteFile != null) {
                    deleteFile = deleteFile.toLowerCase().trim();
                }
            }
            try {
                cursor1.close();
            } catch (Exception e) {
            }
            db.execSQL("delete from " + OFFLINE_MASTER + " where " + REQUEST_ID + " = " + requestId);
            db.execSQL("delete from " + FILE_UPLOAD_MASTER + " where " + REQUEST_ID + " = " + requestId);
            db.execSQL("delete from " + REQUEST_HEADER_MASTER + " where " + REQUEST_ID + " = " + requestId);
            db.execSQL("delete from " + REQUEST_PARAM_MASTER + " where " + REQUEST_ID + " = " + requestId);
            //Storage storage = new Storage(context);
            if (filePath != null && (!filePath.equals("")) && deleteFile.equals("true")) {
                try {
                    File file = new File(filePath);
                    if (file.exists()) {
                        file.delete();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getOfflineRecordCount() {
        int count = 0;
        SQLiteDatabase db = this.getReadableDatabase();
        try {
            Cursor cursor = db.rawQuery("select count(" + REQUEST_ID + ") from " + OFFLINE_MASTER, null);
            cursor.moveToFirst();
            count = cursor.getInt(0);
            cursor.close();
        } catch (Exception ex) {
        }
        return count;
    }

    public JSONArray getOfflineRecord() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + OFFLINE_MASTER, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getHeadersForRequest(String requestId) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + REQUEST_HEADER_MASTER + " where " + REQUEST_ID + " = " + requestId, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception e) {
        }
        return toReturn;
    }

    public JSONArray getParametersForRequest(String requestId) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + REQUEST_PARAM_MASTER + " where " + REQUEST_ID + " = " + requestId, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception e) {
        }
        return toReturn;
    }

    @SuppressLint("Range")
    public String getFilePathForRequest(String requestId) {
        String filePath = null;
        try {
            SQLiteDatabase db = this.getReadableDatabase();
            Cursor cursor = db.rawQuery("select * from " + FILE_UPLOAD_MASTER + " where " + REQUEST_ID + " = " + requestId, null);
            if (cursor.moveToFirst()) {
                filePath = cursor.getString(cursor.getColumnIndex(FILE_PATH));
            }
            cursor.close();
        } catch (Exception e) {

        }
        return filePath;
    }

    public JSONArray getAllNotifications() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + NOTIFICATION_MASTER + " order by " + NOTIFICATION_TIME_STAMP + " desc", null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public int getUnreadNotificationCount() {
        int count = 0;
        SQLiteDatabase db = this.getReadableDatabase();
        try {
            Cursor cursor = db.rawQuery("select count(" + NOTIFICATION_ID + ") from " + NOTIFICATION_MASTER + " where  " + NOTIFICATION_READ + " = '0'", null);
            cursor.moveToFirst();
            count = cursor.getInt(0);
            cursor.close();
        } catch (Exception ex) {
        }
        return count;
    }

    public JSONArray getAllWorkers(String bookId) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            String query = "select * from " + WORKER_MASTER;
            if (bookId != null) {
                query += " where " + WORKER_BOOK_ID + " = '" + bookId + "' order by " + WORKER_EMP_NUMBER;
            } else {
                query += " order by " + WORKER_EMP_NUMBER;
            }
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllWorkersScanandImage() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            String query = "select " + WORKER_ID + ", " + WORKER_IRIS_SCAN_STATUS + ", " + WORKER_IMAGE_PATH + " from " + WORKER_MASTER + " order by " + WORKER_ID;
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllKamjaris() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + KAMJARI_MASTER + " where " + KAMJARI_IS_ACTIVE + "='true' order by " + KAMJARI_ID, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllSections() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + SECTION_MASTER + " where " + SECTION_IS_ACTIVE + "='true' order by " + SECTION_NAME, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllBooks() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + BOOK_MASTER + " order by " + BOOK_ID, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllBatches() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + BATCH_MASTER + " order by " + BATCH_NAME, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllPluckingBatches() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + BATCH_MASTER + " where "+BATCH_TYPE+" = 'PLUCKING' order by " + BATCH_NAME, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllNonPluckingBatches() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + BATCH_MASTER + " where "+BATCH_TYPE+" != 'PLUCKING' order by " + BATCH_NAME, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllShifts() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + SHIFT_MASTER + " order by " + SHIFT_CODE, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllPluckingShifts() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor kamjariCursor = db.rawQuery("select "+KAMJARI_ID+" from " + KAMJARI_MASTER + " where " + KAMJARI_TYPE+" ='PLUCKING'", null);
            StringBuilder sb = new StringBuilder(" (");
            int kamjariCounter = 0;
            while (kamjariCursor.moveToNext()) {
                if(kamjariCounter>0) {
                    sb.append(",");
                }
                sb.append("'");
                sb.append(kamjariCursor.getString(0));
                sb.append("'");
                kamjariCounter++;
            }
            sb.append(") ");
            Cursor cursor = db.rawQuery("select * from " + SHIFT_MASTER + " where "+KAMJARI_ID+" in "+sb.toString()+" order by " + SHIFT_CODE, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return toReturn;
    }

    public JSONArray getAllNonPluckingShifts() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor kamjariCursor = db.rawQuery("select "+KAMJARI_ID+" from " + KAMJARI_MASTER + " where " + KAMJARI_TYPE+" !='PLUCKING'", null);
            StringBuilder sb = new StringBuilder(" (");
            int kamjariCounter = 0;
            while (kamjariCursor.moveToNext()) {
                if(kamjariCounter>0) {
                    sb.append(",");
                }
                sb.append("'");
                sb.append(kamjariCursor.getString(0));
                sb.append("'");
                kamjariCounter++;
            }
            sb.append(") ");
            Cursor cursor = db.rawQuery("select * from " + SHIFT_MASTER + " where "+KAMJARI_ID+" in "+sb.toString()+" order by " + SHIFT_CODE, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return toReturn;
    }

    public JSONArray getAllPluckingKamjaris() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + KAMJARI_MASTER + " where " + KAMJARI_TYPE + "='PLUCKING' order by " + KAMJARI_NAME, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getAllWorkerTypes() {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from " + WORKER_TYPE_MASTER + " order by " + WORKERTYPE_ID, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    if (cursor.getColumnName(loop).equals(WORKERTYPE_SUBTYPE)) {
                        tmp.put(cursor.getColumnName(loop), new JSONArray(cursor.getString(loop)));
                    } else {
                        tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                    }
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getWorkerDetails(String workerId) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + WORKER_MASTER + " where " + WORKER_ID + " = '" + workerId + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
            if (!toReturn.optString(WORKER_ID).equals("")) {
                String query2 = "select " + RECORD_QUANTITY + " from " + PLUCKED_QUANTITY_MASTER + " where " + WORKER_ID + " = '" + workerId + "' and " + RECORD_DATE + " ='" + Utility.getDateFromNow(0) + "' GROUP BY " + WEIGHMENT_NUMBER;
                Cursor cursor2 = db.rawQuery(query2, null);
                String roundOff = new Storage(context).getRoundOff();
                double total = 0;
                String totalStr="";
                while (cursor2.moveToNext()) {
                    double val = Utility.companyRoundOff(roundOff, cursor2.getDouble(0));
                    if(totalStr.length()>0){
                        totalStr+="+";
                    }
                    totalStr+=val;
                    total += val;
                }
                cursor2.close();
                toReturn.put("PLUCKED_QUANTITY", total + " KG");
                toReturn.put("PLUCKED_QUANTITY_BREAKUP", totalStr);
            }
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getWorkerDetailsByWorkerCode(String workerCode) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + WORKER_MASTER + " where " + WORKER_CODE + " = '" + workerCode + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getWorkerDetailsByWorkerCodeOrEmpNo(String code) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + WORKER_MASTER + " where " + WORKER_CODE + " = '" + code + "' OR " + WORKER_BOOK_EMP_NUMBER + " = '" + code + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getSectionDetailsBySectionCode(String sectionCode) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + SECTION_MASTER + " where " + SECTION_CODE + " = '" + sectionCode + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getKamjariDetailsByKamjariCode(String kamjariCode) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + KAMJARI_MASTER + " where " + KAMJARI_CODE + " = '" + kamjariCode + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONObject getAuthorisedUser(String userId) {
        SQLiteDatabase db = this.getReadableDatabase();
        JSONObject toReturn = new JSONObject();
        try {
            String query = "select * from " + AUTHORISED_USER_MASTER + " where " + AUTHORISED_USER_ID + " = '" + userId + "'";
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn = tmp;
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getWorkerDetailsWithAttendance(String bookId) {
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            String whereClause = "";
            String orderBy = WORKER_NAME;
            if (bookId != null) {
                whereClause = " where " + WORKER_BOOK_ID + " = '" + bookId + "' ";
                orderBy = WORKER_EMP_NUMBER;
            }
            Cursor cursor = db.rawQuery("select * from "
                    + WORKER_MASTER
                    + " LEFT OUTER JOIN  ( select "
                    + ATTENDANCE_WORKER_ID
                    + ", count(*) as attendance_count from "
                    + ATTENDANCE_MASTER
                    + " where "
                    + ATTENDANCE_DATE
                    + " =" + today
                    + " group by " + ATTENDANCE_WORKER_ID + " ) ON "
                    + WORKER_ID
                    + " = "
                    + ATTENDANCE_WORKER_ID
                    + whereClause
                    + " order by  "
                    + orderBy, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    @SuppressLint("Range")
    public String getConfigValue(int configId) {
        SQLiteDatabase db = this.getReadableDatabase();
        String toReturn = null;
        try {
            String query = "select * from " + CONFIG_MASTER + " where " + CONFIG_ID + " = " + configId;
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                toReturn = cursor.getString(cursor.getColumnIndex(CONFIG_VALUE));
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    @SuppressLint("Range")
    public String getSyncDate(int syncId) {
        SQLiteDatabase db = this.getReadableDatabase();
        String toReturn = null;
        try {
            String query = "select * from " + SYNC_MASTER + " where " + SYNC_ID + " = " + syncId;
            Cursor cursor = db.rawQuery(query, null);
            while (cursor.moveToNext()) {
                toReturn = cursor.getString(cursor.getColumnIndex(LAST_SYNC_DATE));
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    @SuppressLint("Range")
    public synchronized String updateWorkerScanStatus(String workerId) {
        String scanCount = "0";
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "select * from " + WORKER_MASTER + " where " + WORKER_ID + " = '" + workerId + "'";
            Cursor cursor = db.rawQuery(query, null);
            cursor.moveToNext();
            scanCount = cursor.getString(cursor.getColumnIndex(WORKER_IRIS_SCAN_STATUS));
            if (scanCount == null || scanCount.equals("")) {
                scanCount = "0";
            }
            int scanCountI = Integer.parseInt(scanCount);
            query = "update " + WORKER_MASTER + " set " + WORKER_IRIS_SCAN_STATUS + " = '" + (scanCountI + 1) + "' where " + WORKER_ID + " = '" + workerId + "'";
            db.execSQL(query);
            scanCount = "" + (scanCountI + 1);
        } catch (Exception ex) {
            ex.printStackTrace();
            scanCount = "0";
        }
        return scanCount;
    }

    public synchronized void updateWorkerKamjari(String workerId, String kamjariId, String kamjariName) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_KAMJARI_ID + " = '" + kamjariId + "', " + WORKER_KAMJARI_NAME + " = '" + kamjariName + "' where " + WORKER_ID + " = '" + workerId + "'";
            db.execSQL(query);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public synchronized void updateWorkerSection(String workerId, String sectionId, String sectionName) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_SECTION_ID + " = '" + sectionId + "', " + WORKER_SECTION_NAME + " = '" + sectionName + "' where " + WORKER_ID + " = '" + workerId + "'";
            db.execSQL(query);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public synchronized void clearAllWorkerScanStatus() {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_IRIS_SCAN_STATUS + " = '0' ";
            db.execSQL(query);
        } catch (Exception ex) {
        }
    }

    public synchronized void clearWorkerScanStatus(String workerId) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_IRIS_SCAN_STATUS + " = '0' where " + WORKER_ID + " = '" + workerId + "'";
            db.execSQL(query);
        } catch (Exception ex) {
        }
    }

    public synchronized void updateWorkerImage(String workerId, String imagePath) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_IMAGE_PATH + " = '" + imagePath + "' where " + WORKER_ID + " = '" + workerId + "'";
            db.execSQL(query);
        } catch (Exception ex) {
        }
    }

    public synchronized void updateMultipleWorkerImage(Hashtable<String, String> workers) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_IMAGE_PATH + " = ? where " + WORKER_ID + " = ?";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(query);
            Set<String> workerIds = workers.keySet();
            for (String id : workerIds) {
                stmt.bindString(1, workers.get(id));
                stmt.bindString(2, id);
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void updateMultipleWorkerScan(Hashtable<String, String> workers) {
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String query = "update " + WORKER_MASTER + " set " + WORKER_IRIS_SCAN_STATUS + " = ? where " + WORKER_ID + " = ?";
            db.beginTransactionNonExclusive();
            SQLiteStatement stmt = db.compileStatement(query);
            Set<String> workerIds = workers.keySet();
            for (String id : workerIds) {
                stmt.bindString(1, workers.get(id));
                stmt.bindString(2, id);
                stmt.execute();
                stmt.clearBindings();
            }
            db.setTransactionSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            db.endTransaction();
        }
    }

    public synchronized void markNotificationsRead() {
        SQLiteDatabase db = getWritableDatabase();
        try {
            db.execSQL("update "
                    + NOTIFICATION_MASTER
                    + " set "
                    + NOTIFICATION_READ
                    + " = '1'");
        } catch (Exception e) {
        }
    }

    public synchronized void deleteOldData() {
        long deleteDate = Utility.getDateFromNow(-15);
        try {
            SQLiteDatabase db = this.getWritableDatabase();
            deleteDate = Utility.getDateFromNow(-7);
            long deleteDateFrom2 = Utility.getDateFromNow(-2);
            db.delete(NOTIFICATION_MASTER, NOTIFICATION_TIME_STAMP + " < " + deleteDate, null);
            db.delete(ATTENDANCE_MASTER, ATTENDANCE_DATE + " < " + deleteDateFrom2, null);
            db.delete(PLUCKED_QUANTITY_MASTER, RECORD_DATE + " < " + deleteDateFrom2, null);
        } catch (Exception e) {
            Log.d(TAG, "deleteOldVisitAndProcessedTicket " + e.getMessage());
        }
    }

    public synchronized void insertToPluckedQuantityMaster(String workerID, double qnty, String weighmentNo, String sectionCode) {
        long recordDate = Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getWritableDatabase();
        try {
            String sql = "INSERT OR REPLACE INTO " + PLUCKED_QUANTITY_MASTER + " ( "
                    + WORKER_ID
                    + ", " + RECORD_DATE
                    + ", " + RECORD_QUANTITY
                    + ", " + WEIGHMENT_NUMBER
                    + ", " + SECTION_CODE
                    + ", " + RECORD_TIME
                    + " ) VALUES ( ?, ?, ?, ?, ?, ? )";
            SQLiteStatement stmt = db.compileStatement(sql);
            stmt.bindString(1, workerID);
            stmt.bindString(2, "" + recordDate);
            stmt.bindDouble(3, qnty);
            stmt.bindString(4, weighmentNo);
            stmt.bindString(5, sectionCode);
            stmt.bindString(6, ""+System.currentTimeMillis());
            stmt.execute();
            stmt.clearBindings();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        // insertToAttendanceMaster(workerID, null, null, null);
    }

    public JSONArray getWorkersWithPluckingData() {
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select * from "
                    + PLUCKED_QUANTITY_MASTER
                    + " where "
                    + RECORD_DATE
                    + " =" + today
                    + " order by "
                    + WORKER_ID+", "+WEIGHMENT_NUMBER, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getPluckingWorkersAttendance(String workers) {
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        try {
            Cursor cursor = db.rawQuery("select " + WORKER_ID + ", " + WORKER_NAME + ", " + WORKER_CODE + ", " + WORKER_BOOK_NAME + ", " + WORKER_EMP_NUMBER + ", " + WORKER_BOOK_EMP_NUMBER + ", IN_TIME, OUT_TIME from "
                    + WORKER_MASTER
                    + " LEFT OUTER JOIN  ( select "
                    + ATTENDANCE_WORKER_ID
                    + ", min(" + ATTENDANCE_TIME + ") as IN_TIME, max(" + ATTENDANCE_TIME + ") as OUT_TIME FROM "
                    + ATTENDANCE_MASTER
                    + " where "
                    + ATTENDANCE_DATE
                    + " =" + today
                    + " group by " + ATTENDANCE_WORKER_ID + " ) ON "
                    + WORKER_ID
                    + " = "
                    + ATTENDANCE_WORKER_ID
                    + " where "
                    + WORKER_ID
                    + " in "
                    + workers
                    + " order by  "
                    + WORKER_BOOK_NAME
                    + ", " + WORKER_EMP_NUMBER, null);
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                JSONObject tmp = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    tmp.put(cursor.getColumnName(loop), cursor.getString(loop));
                }
                toReturn.put(tmp);
            }
            cursor.close();
        } catch (Exception ex) {
        }
        return toReturn;
    }

    public JSONArray getNonPluckingWorkersAttendance(String pluckingWorkers){
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        JSONObject dataMap = new JSONObject();
        String query = "SELECT "
                +ATTENDANCE_WORKER_ID
                +" AS worker_id, "
                +ATTENDANCE_TIME
                +" AS time FROM "
                +ATTENDANCE_MASTER
                +" WHERE "
                +ATTENDANCE_DATE
                +"="+today;
        if(pluckingWorkers!= null){
            query = query
                    + " AND ATTENDANCE_WORKER_ID NOT IN "
                    +pluckingWorkers;
        }
        try {
            Cursor cursor = db.rawQuery(query, null);
            StringBuffer sb = new StringBuffer("(");
            String columnName=null;
            String columnValue = null;
            String lastWorkerId = null;
            while (cursor.moveToNext()) {
                int columns = cursor.getColumnCount();
                for (int loop = 0; loop < columns; loop++) {
                    columnName = cursor.getColumnName(loop);
                    columnValue = cursor.getString(loop);
                    if(columnName.equals(WORKER_ID)){
                        if(!dataMap.has(columnValue)){
                            dataMap.put(columnValue, new JSONArray());
                        }
                        sb.append("'" + columnValue + "',");
                        lastWorkerId = columnValue;
                    }else{
                        dataMap.getJSONArray(lastWorkerId).put(columnValue);
                    }
                }
            }
            cursor.close();
            if(sb.length()>1){
                sb.delete(sb.length() - 1, sb.length());
                sb.append(")");
                Cursor cursor2 = db.rawQuery("select " + WORKER_ID + ", " + WORKER_NAME + ", " + WORKER_CODE + ", " + WORKER_BOOK_NAME + ", " + WORKER_EMP_NUMBER + ", " + WORKER_BOOK_EMP_NUMBER + " from "
                        + WORKER_MASTER
                        + " where "
                        + WORKER_ID
                        + " in "
                        + sb.toString()
                        + " order by  "
                        + WORKER_BOOK_NAME
                        + ", " + WORKER_EMP_NUMBER, null);
                while (cursor2.moveToNext()) {
                    int columns = cursor2.getColumnCount();
                    JSONObject tmp = new JSONObject();
                    for (int loop = 0; loop < columns; loop++) {
                        columnName = cursor2.getColumnName(loop);
                        columnValue = cursor2.getString(loop);
                        tmp.put(columnName, columnValue);
                        if(columnName.equals(WORKER_ID)){
                            tmp.put("auth_logs", dataMap.getJSONArray(columnValue));
                        }
                    }
                    toReturn.put(tmp);
                }
            }else{
                return toReturn;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return toReturn;
    }

    public JSONArray getNonPluckingWorkersAttendanceModified(String pluckingWorkers){
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        JSONArray toReturn = new JSONArray();
        List<JSONObject> jsonValues = new ArrayList<JSONObject>();
        JSONObject dataMap = new JSONObject();
        Storage s = new Storage(context);
        boolean printTimeWise = s.printTimeWise();
        String query = "SELECT "
                +ATTENDANCE_WORKER_ID
                +" AS worker_id, "
                +BATCH_ID
                +" , "
                +SECTION_ID
                +" , "
                +KAMJARI_ID
                +" , "
                +ATTENDANCE_TIME
                +" AS time FROM "
                +ATTENDANCE_MASTER
                +" WHERE "
                +ATTENDANCE_DATE
                +"="+today;
        if(pluckingWorkers!= null){
            query = query
                    + " AND ATTENDANCE_WORKER_ID NOT IN "
                    +pluckingWorkers;
        }
        query = query + " ORDER BY " + ATTENDANCE_TIME;
        HashMap<String, ArrayList<String>> workerBatchMap = new HashMap<>();
        HashMap<String, ArrayList<String>> workerSectionMap = new HashMap<>();
        HashMap<String, ArrayList<String>> workerKamjariMap = new HashMap<>();
        HashMap<String, String> batchMap = new HashMap<>();
        HashMap<String, String> sectionMap = new HashMap<>();
        HashMap<String, String> kamjariMap = new HashMap<>();
        ArrayList<String> workerIds = new ArrayList<>();
        JSONArray temp = new JSONArray();
        try {
            Cursor cursor = db.rawQuery(query, null);
            StringBuffer sb = new StringBuffer("(");
            String columnName=null;
            String columnValue = null;
            String lastWorkerId = null;
            while (cursor.moveToNext()) {
                String batchId = "";
                String sectionId = "";
                String kamjariId = "";
                String workerId = null;
                int columns = cursor.getColumnCount();
                JSONObject row = new JSONObject();
                for (int loop = 0; loop < columns; loop++) {
                    columnName = cursor.getColumnName(loop);
                    columnValue = cursor.getString(loop);
                    if(columnName.equals(WORKER_ID)){
                        workerId = columnValue;
                        if(!workerIds.contains(workerId)) {
                            workerIds.add(workerId);
                            workerBatchMap.put(workerId, new ArrayList<String>());
                            workerSectionMap.put(workerId, new ArrayList<String>());
                            workerKamjariMap.put(workerId, new ArrayList<String>());
                        }
                    } else if (columnName.equals(BATCH_ID)) {
                        batchId = columnValue;
                    } else if (columnName.equals(SECTION_ID)) {
                        sectionId = columnValue;
                    } else if (columnName.equals(KAMJARI_ID)) {
                        kamjariId = columnValue;
                    }
                    row.put(columnName, columnValue);
                }
                ArrayList<String> batchArray = workerBatchMap.get(workerId);
                ArrayList<String> sectionArray = workerSectionMap.get(workerId);
                ArrayList<String> kamjariArray = workerKamjariMap.get(workerId);
                if(batchId.length()>0) {
                    if(!batchArray.contains(batchId)) {
                        batchArray.add(batchId);
                    }
                }
                if(sectionId.length()>0) {
                    if(!sectionArray.contains(sectionId)) {
                        sectionArray.add(sectionId);
                    }
                }
                if(kamjariId.length()>0) {
                    if(!kamjariArray.contains(kamjariId)) {
                        kamjariArray.add(kamjariId);
                    }
                }
                temp.put(row);
            }
            cursor.close();
            for (int loop=0, length = workerIds.size(); loop<length; loop++) {
                sb.append("'" + workerIds.get(loop) + "'");
                if(loop != (length-1)) {
                    sb.append(",");
                }
            }
            JSONObject workerCache = new JSONObject();
            ArrayList<String> orderedWorkers = new ArrayList<>();
            if(workerIds.size()>0){
                // sb.delete(sb.length() - 1, sb.length());
                sb.append(")");
                Cursor cursor2 = db.rawQuery("select " + WORKER_ID + ", " + WORKER_NAME + ", " + WORKER_CODE + ", " + WORKER_BOOK_NAME + ", " + WORKER_EMP_NUMBER + ", " + WORKER_BOOK_EMP_NUMBER + " from "
                        + WORKER_MASTER
                        + " where "
                        + WORKER_ID
                        + " in "
                        + sb.toString()
                        + " order by  "
                        + WORKER_BOOK_NAME
                        + ", " + WORKER_EMP_NUMBER, null);
                while (cursor2.moveToNext()) {
                    int columns = cursor2.getColumnCount();
                    JSONObject tmp = new JSONObject();
                    String workerId = null;
                    for (int loop = 0; loop < columns; loop++) {
                        columnName = cursor2.getColumnName(loop);
                        columnValue = cursor2.getString(loop);
                        tmp.put(columnName, columnValue);
                        if(columnName.equals(WORKER_ID)){
                            workerId = columnValue;
                            orderedWorkers.add(workerId);
                        }
                    }
                    workerCache.put(workerId, tmp);
                }
                cursor2.close();
                Cursor batchCursor = db.rawQuery("Select "+ BATCH_ID+", "+BATCH_NAME+" from "+ BATCH_MASTER, null);
                while (batchCursor.moveToNext()) {
                    String key = batchCursor.getString(0);
                    String value = batchCursor.getString(1);
                    batchMap.put(key, value);
                }
                batchCursor.close();
                Cursor sectionCursor = db.rawQuery("Select "+ SECTION_ID+", "+SECTION_CODE+" from "+ SECTION_MASTER, null);
                while (sectionCursor.moveToNext()) {
                    String key = sectionCursor.getString(0);
                    String value = sectionCursor.getString(1);
                    sectionMap.put(key, value);
                }
                sectionCursor.close();
                Cursor kamjariCursor = db.rawQuery("Select "+ KAMJARI_ID+", "+KAMJARI_NAME+" from "+ KAMJARI_MASTER, null);
                while (kamjariCursor.moveToNext()) {
                    String key = kamjariCursor.getString(0);
                    String value = kamjariCursor.getString(1);
                    kamjariMap.put(key, value);
                }
                kamjariCursor.close();
                JSONObject groupedData = new JSONObject();
                for (int loop=0, length = temp.length(); loop<length; loop++) {
                    String batchId = temp.getJSONObject(loop).getString(BATCH_ID);
                    String sectionId = temp.getJSONObject(loop).getString(SECTION_ID);
                    String kamjariId = temp.getJSONObject(loop).getString(KAMJARI_ID);
                    String workerId = temp.getJSONObject(loop).getString(WORKER_ID);
                    String time  = temp.getJSONObject(loop).getString("time");
                    ArrayList<String> batchArray = workerBatchMap.get(workerId);
                    ArrayList<String> sectionArray = workerSectionMap.get(workerId);
                    ArrayList<String> kamjariArray = workerKamjariMap.get(workerId);
                    if((batchId.length()<1) && (batchArray.size()==1)) {
                        batchId = batchArray.get(0);
                    }
                    if((sectionId.length()<1) && (sectionArray.size()==1)) {
                        sectionId = sectionArray.get(0);
                    }
                    if((kamjariId.length()<1) && (kamjariArray.size()==1)) {
                        kamjariId = kamjariArray.get(0);
                    }
                    String key = batchId + "_" + sectionId + "_" + kamjariId;
                    // String key = batchId;
                    if(!groupedData.has(key)) {
                        groupedData.put(key, new JSONObject());
                    }
                    JSONObject current = groupedData.getJSONObject(key);
                    if(!current.has(workerId)) {
                        JSONObject _obj = new JSONObject();
                        if(batchMap.containsKey(batchId)) {
                            batchId = batchMap.get(batchId);
                        }
                        if(sectionMap.containsKey(sectionId)) {
                            sectionId = sectionMap.get(sectionId);
                        }
                        if(kamjariMap.containsKey(kamjariId)) {
                            kamjariId = kamjariMap.get(kamjariId);
                        }
                        _obj.put(BATCH_ID, batchId);
                        _obj.put(SECTION_ID, sectionId);
                        _obj.put(KAMJARI_ID, kamjariId);
                        _obj.put("auth_logs", new JSONArray());
                        _obj.put("firstTime", time);
                        current.put(workerId, _obj);
                    }
                    JSONObject details = current.getJSONObject(workerId);
                    JSONArray auth_logs = details.getJSONArray("auth_logs");
                    auth_logs.put(time);
                }
                Iterator<String> groupedKeys = groupedData.keys();
                while (groupedKeys.hasNext()) {
                    String currentKey = groupedKeys.next();
                    JSONObject _groupedData = groupedData.getJSONObject(currentKey);
                    for(String workerId: workerIds) {
                        if(_groupedData.has(workerId)) {
                            JSONObject obj = _groupedData.getJSONObject(workerId);
                            JSONObject cache = workerCache.getJSONObject(workerId);
                            obj.put(WORKER_ID, cache.getString(WORKER_ID));
                            obj.put(WORKER_NAME, cache.getString(WORKER_NAME));
                            obj.put(WORKER_CODE, cache.getString(WORKER_CODE));
                            obj.put(WORKER_BOOK_NAME, cache.getString(WORKER_BOOK_NAME));
                            obj.put(WORKER_EMP_NUMBER, cache.getString(WORKER_EMP_NUMBER));
                            obj.put(WORKER_BOOK_EMP_NUMBER, cache.getString(WORKER_BOOK_EMP_NUMBER));
                            // toReturn.put(obj);
                            jsonValues.add(obj);
                        }
                    }
                }
            }else{
                return toReturn;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        Collections.sort(jsonValues, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject o1, JSONObject o2) {
                String book1 = "";
                String batch1 = "";
                int empNo1 = 0;
                String book2 = "";
                String batch2 = "";
                int empNo2 = 0;
                int time1 = 0;
                int time2 = 0;
                book1 = o1.optString(WORKER_BOOK_NAME, "");
                batch1 = o1.optString(BATCH_ID, "");
                book2 = o2.optString(WORKER_BOOK_NAME, "");
                batch2 = o2.optString(BATCH_ID, "");
                try {
                    String tmp = o1.optString(WORKER_EMP_NUMBER, "0");
                    empNo1 = Integer.parseInt(tmp);
                } catch (Exception e) {
                }
                try {
                    String tmp = o2.optString(WORKER_EMP_NUMBER, "0");
                    empNo2 = Integer.parseInt(tmp);
                } catch (Exception e) {
                }
                if (printTimeWise) {
                    try {
                        String tmp = o1.optString("firstTime", "0");
                        time1 = Integer.parseInt(tmp);
                    } catch (Exception e) {
                    }
                    try {
                        String tmp = o2.optString("firstTime", "0");
                        time2 = Integer.parseInt(tmp);
                    } catch (Exception e) {
                    }
                }
                int i = batch1.compareTo(batch2);
                if (i != 0) {
                    return i;
                }
                if (!printTimeWise) {
                    i = book1.compareTo(book2);
                    if (i != 0) {
                        return i;
                    }
                    return Integer.compare(empNo1, empNo2);
                } else {
                    return Integer.compare(time1, time2);
                }
            }
        });
        for (JSONObject jo: jsonValues) {
            toReturn.put(jo);
        }
        return toReturn;
    }

    public int presentToday() {
        int count = 0;
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        try {
            Cursor cursor = db.rawQuery("SELECT COUNT(*) as present from (SELECT DISTINCT("
                    + WORKER_ID
                    + ") from "
                    + PLUCKED_QUANTITY_MASTER
                    + " WHERE "
                    + RECORD_DATE
                    + " = " + today
                    + " UNION SELECT DISTINCT("
                    + ATTENDANCE_WORKER_ID
                    + ") from "
                    + ATTENDANCE_MASTER
                    + " WHERE "
                    + ATTENDANCE_DATE
                    + " = " + today
                    + ")", null);
            if (cursor.moveToFirst()) {
                count = cursor.getInt(0);
            }
        } catch (Exception e) {
        }
        return count;
    }

    public int pluckedQuantityToday(){
        int total =0;
        String today = "" + Utility.getDateFromNow(0);
        SQLiteDatabase db = this.getReadableDatabase();
        String roundOff = new Storage(context).getRoundOff();
        // roundOff = dbRoundOff(roundOff, RECORD_QUANTITY);
        roundOff = dbRoundOff("", RECORD_QUANTITY);
        try {
            Cursor cursor = db.rawQuery("SELECT SUM(QTY) FROM (SELECT"
                    + roundOff
                    + "AS QTY FROM "
                    + PLUCKED_QUANTITY_MASTER
                    + " WHERE "
                    + RECORD_DATE
                    + " = " + today
                    + " GROUP BY "
                    + WORKER_ID
                    + ", "
                    + WEIGHMENT_NUMBER
                    + ")", null);
            if (cursor.moveToFirst()) {
                total = cursor.getInt(0);
            }
        } catch (Exception e) {
        }
        return total;
    }

    public int workerCount() {
        int count = 0;
        SQLiteDatabase db = this.getReadableDatabase();
        try {
            Cursor cursor = db.rawQuery("SELECT COUNT("
                    + WORKER_ID
                    + ") as worker_count from "
                    + WORKER_MASTER, null);
            if (cursor.moveToFirst()) {
                count = cursor.getInt(0);
            }
        } catch (Exception e) {
        }
        return count;
    }

    public static String dbRoundOff(String roundOff, String columnName){
        if(roundOff==null){
            roundOff ="round";
        }
        if(roundOff.equals("round")){
            return " ROUND("+columnName+") ";
        }else if(roundOff.equals("floor")){
            return " CAST("+columnName+" AS INT) ";
        }else if(roundOff.equals("ceil")){
            return " CAST(ROUND("+columnName+" + 0.5) AS INT) ";
        }
        return " "+columnName+" ";
    }
}
