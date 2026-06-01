package in.illimitable.util;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;
import androidx.core.content.PermissionChecker;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import in.illimitable.stf.HomeActivity;

/**
 * Created by illimitable.in on 21-Mar-17.
 */

public class Utility {
    private final static char[] hexArray = "0123456789abcdef".toCharArray();
    private final static DecimalFormat df = new DecimalFormat();
    static {
        df.setMaximumFractionDigits(1);
    }

    // public static final int TIMEZONE_OFFSET = Calendar.getInstance().get(Calendar.ZONE_OFFSET);
    public static int getTimezoneOffset() {
        return Calendar.getInstance().get(Calendar.ZONE_OFFSET);
    }

    public static long getDateTimeInMillisecondsUTC() {
        return System.currentTimeMillis() - getTimezoneOffset();
    }

    public static long getDateTimeInMillisecondsUTC(Date date) {
        return date.getTime() - getTimezoneOffset();
    }

    public static Date getDateTimeFromMillisecondsUTC(long milliseconds) {
        Date dt = new Date();
        dt.setTime(milliseconds + getTimezoneOffset());
        return dt;
    }

    public static long getDateFromNow(int days) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        cal.add(Calendar.DAY_OF_YEAR, days);
        return cal.getTimeInMillis();
    }

    public static long getAttendanceTimeForPluckingWorkers(long firstCutOff) {
        long now = System.currentTimeMillis();
        long dateStart = getDateFromNow(0);
        if ((now - dateStart) < (10.25 * 60 * 60 * 1000)) {
            now = dateStart + firstCutOff;
        }
        return now;
    }

    public static int getWeighmentCountBasedOnTime() {

        long now = System.currentTimeMillis();
        long dateStart = getDateFromNow(0);
        if ((now - dateStart) < (10.25 * 60 * 60 * 1000)) {
            return 1;
        } else if ((now - dateStart) < (13 * 60 * 60 * 1000)) {
            return 2;
        } else {
            return 3;
        }
    }

    public static int getWeighmentCountBasedOnTime(int lastWeighmentNo, long lastWeighmentTime) {
        if(lastWeighmentNo==0) {
            return  1;
        }
        long dateStart = getDateFromNow(0);
        if(lastWeighmentTime<dateStart) {
            return  1;
        }
        long now = System.currentTimeMillis();
        if((now - lastWeighmentTime)>(45 * 60 * 1000)) {
            if(lastWeighmentNo>=3) {
                return  4;
            } else {
                return lastWeighmentNo +1;
            }
        }
        return lastWeighmentNo;
    }

    public static String[] getArrayForKey(JSONArray jArray, String key) {
        try {
            String[] arr = new String[jArray.length()];
            for (int loop = 0; loop < jArray.length(); loop++) {
                arr[loop] = jArray.getJSONObject(loop).getString(key);
            }
            return arr;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void copyFile(String sourceFilePath, String destinationFilePath) throws Exception {
        File outputFile = new File(destinationFilePath);
        if (outputFile.exists()) {
            outputFile.delete();
        }
        outputFile.createNewFile();
        FileInputStream fis = new FileInputStream(sourceFilePath);
        FileOutputStream fos = new FileOutputStream(outputFile);
        byte[] buffer = new byte[512 * 1024];
        int read = fis.read(buffer);
        while (read >= 0) {
            fos.write(buffer, 0, read);
            read = fis.read(buffer);
        }
        fos.flush();
        fis.close();
        fos.close();
    }

    public static final double getNearestCurrency(double input) {
        double fraction = input - ((int) input);
        if (fraction > 0.95) {
            return input - fraction + 1;
        } else if (fraction > 0.90) {
            return input - fraction + 0.95;
        } else if (fraction > 0.85) {
            return input - fraction + 0.90;
        } else if (fraction > 0.80) {
            return input - fraction + 0.85;
        } else if (fraction > 0.75) {
            return input - fraction + 0.80;
        } else if (fraction > 0.70) {
            return input - fraction + 0.75;
        } else if (fraction > 0.65) {
            return input - fraction + 0.70;
        } else if (fraction > 0.60) {
            return input - fraction + 0.65;
        } else if (fraction > 0.55) {
            return input - fraction + 0.60;
        } else if (fraction > 0.50) {
            return input - fraction + 0.55;
        } else if (fraction > 0.45) {
            return input - fraction + 0.50;
        } else if (fraction > 0.40) {
            return input - fraction + 0.45;
        } else if (fraction > 0.35) {
            return input - fraction + 0.40;
        } else if (fraction > 0.30) {
            return input - fraction + 0.35;
        } else if (fraction > 0.25) {
            return input - fraction + 0.30;
        } else if (fraction > 0.20) {
            return input - fraction + 0.25;
        } else if (fraction > 0.15) {
            return input - fraction + 0.20;
        } else if (fraction > 0.10) {
            return input - fraction + 0.15;
        } else if (fraction > 0.05) {
            return input - fraction + 0.10;
        } else {
            return input - fraction;
        }
    }

    public static final double getItemTotal(double rate, int qnty) {
        rate = (double) Math.round(rate * 100) / 100;
        return rate * qnty;
        /*int wholeNumber = (int) rate;
        double fraction = rate - wholeNumber;
        return (wholeNumber * qnty) + (fraction * qnty) ;*/
    }

    public static final String getTitleCase(String input) {
        if (input == null) {
            return "";
        }
        String[] words = input.split(" ");
        StringBuilder sb = new StringBuilder();
        if (words[0].length() > 0) {
            sb.append(Character.toUpperCase(words[0].charAt(0)) + words[0].subSequence(1, words[0].length()).toString().toLowerCase());
            for (int i = 1; i < words.length; i++) {
                sb.append(" ");
                sb.append(Character.toUpperCase(words[i].charAt(0)) + words[i].subSequence(1, words[i].length()).toString().toLowerCase());
            }
        }
        return sb.toString();
    }

    public static boolean deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            File[] children = dir.listFiles();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDirectory(children[i]);
                if (!success) {
                    return false;
                }
            }
        }
        return dir.delete();
    }

    public static void unzip(File zipFile, File targetDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(
                new BufferedInputStream(new FileInputStream(zipFile)));
        try {
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " +
                            dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            /* if time should be restored as well
            long time = ze.getTime();
            if (time > 0)
                file.setLastModified(time);
            */
            }
        } finally {
            zis.close();
        }
    }

    public static void deleteRecursive(File fileOrDirectory) {

        if (fileOrDirectory.isDirectory())
            for (File child : fileOrDirectory.listFiles())
                deleteRecursive(child);

        fileOrDirectory.delete();

    }

    public static boolean checkPermissions(Context context) {
        int permissionWriteExternalStorage = PermissionChecker.checkSelfPermission(context,
                Manifest.permission.WRITE_EXTERNAL_STORAGE);
        int locationPermission = PermissionChecker.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION);
        List<String> listPermissionsNeeded = new ArrayList<>();
        /*if (permissionWriteExternalStorage != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }*/
        if (locationPermission != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (!listPermissionsNeeded.isEmpty()) {
            return false;
        }
        return true;
    }

    public static boolean checkBluetoothPermissions(Activity activity) {
        int permissionBluetoothScan = PermissionChecker.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_SCAN);
        int permissionBluetoothConnect = PermissionChecker.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_CONNECT);
        List<String> listPermissionsNeeded = new ArrayList<>();
        if (permissionBluetoothScan != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.BLUETOOTH_SCAN);
        }
        if (permissionBluetoothConnect != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.BLUETOOTH_CONNECT);
        }
        if (!listPermissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(activity, listPermissionsNeeded.toArray(new String[listPermissionsNeeded.size()]), HomeActivity.REQUEST_PERMISSIONS_BLUETOOTH_REQUEST_CODE);
            return false;
        }
        return true;
    }


    public static String bytesToHexString(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    public static byte[] hexStringToByteArray(String s) {
        byte[] b = new byte[s.length() / 2];
        for (int i = 0; i < b.length; i++) {
            int index = i * 2;
            int v = Integer.parseInt(s.substring(index, index + 2), 16);
            b[i] = (byte) v;
        }
        return b;
    }

    public static JSONArray hashSetToArray(HashSet<String> set) {
        JSONArray arr = new JSONArray();
        for (String s : set) {
            arr.put(s);
        }
        return arr;
    }

    @SuppressLint("NewApi")
    public static String getPluckingPrintHtml(JSONArray workers, JSONObject pluckingData, JSONArray nonPluckingWorkers, String recordindStatVal, String deviceName, String operator, String syncTime, String currentVersion) {
        // long cutOff1 = cutOffs[0];
        // long cutoff2 = cutOffs[1];
        // long cutoff3 = cutOffs[2];
        // long cutoff4 = cutOffs[3];
        // long today = getDateFromNow(0);
        // cutOff1 += today;
        // cutoff2 += today;
        // cutoff3 += today;
        // cutoff4 += today;

        if(syncTime==null){
            syncTime="n/a";
        }
        double grandTotal = 0;
        // int totalWorkers = 0;
        boolean hasMultipleGroups = false;
        Date dt = new Date();
        String printedOn = "";
        try {
            printedOn = new SimpleDateFormat("d MMM yyyy HH:mm").format(dt);
        } catch (Exception e) {
            printedOn = new SimpleDateFormat("d MMM YYYY HH:mm").format(dt);
        }
        StringBuffer html = new StringBuffer("<html><head><title>TEAlink</title><style> body{color:#000000;} table {width:100%;border-top: 0.5px solid rgba(0,0,0,0.5);} table caption{text-align: left;font-weight: bold;text-decoration: underline;} .bold{font-weight: bold;} .table1 tr td:first-child {border-left: 0.5px solid rgba(0,0,0,0.5);border-right: 0.5px solid rgba(0,0,0,0.5);border-bottom: 0.5px solid rgba(0,0,0,0.5);} .table1 thead tr th:first-child {border-left: 0.5px solid rgba(0,0,0,0.5);border-right: 0.5px solid rgba(0,0,0,0.5);border-bottom: 0.5px solid rgba(0,0,0,0.5);} .table1 thead tr th:last-child {border-right: 0.5px solid rgba(0,0,0,0.5);border-bottom: 0.5px solid rgba(0,0,0,0.5);} .table1 tr td:last-child {border-right: 0.5px solid rgba(0,0,0,0.5);border-bottom: 0.5px solid rgba(0,0,0,0.5);} .table2 thead tr th:first-child {border-left: 0.5px solid rgba(0,0,0,0.5);} .table2 thead tr th:last-child {border-right: 0.5px solid rgba(0,0,0,0.5);} .table2 thead tr th {border-bottom: 0.5px solid rgba(0,0,0,0.5);} .table2 tr td:first-child {border-left: 0.5px solid rgba(0,0,0,0.5);} .table2 tr td:last-child {border-right: 0.5px solid rgba(0,0,0,0.5);} .table2 tr td {border-bottom: 0.5px solid rgba(0,0,0,0.5);} td {font-size: 9px;padding: 3px;} th {font-size:9px !important;padding: 3px !important;} .col10{width:10%;} .col8{width:8%;} .col7{width:7%;} .col20{width:20%;} .col3{width:3%;} .col2{width:2%;} .col5{width:5%;} .col15{width:15%;} .col25{width:25%;} .col40{width:40%;} .col43{width:43%;} div{float: left;} .late{text-decoration:underline;} .right{text-align:right; padding-right:10px;} .font11{font-size:11px;} .font12{font-size:12px;} .fontSmall{font-size:7px !important}</style></head><body>");

        String printDate = "";
        try {
            printDate = new SimpleDateFormat("d MMM yyyy").format(dt);
        } catch (Exception e) {
            printDate = new SimpleDateFormat("d MMM YYYY").format(dt);
        }
        html.append("<div>V - "+currentVersion+"&nbsp; | &nbsp; <span class=\"bold\">");
        html.append(printDate + "</span>&nbsp;&nbsp; printed on - " + printedOn + "&nbsp;&nbsp; <span style=\"font-size: 11px;\">(Last synced at - "+syncTime+")</span></div><p>&nbsp;</p>");

        if(workers.length()>0) {
            html.append("<table class=\"table1\" cellspacing=\"0\" cellpadding=\"0\">");
            html.append("<thead>");
            html.append("<tr class=\"bold\">");
            html.append("<th>");
            html.append("<div class=\"col3\">&nbsp;</div>");
            html.append("<div class=\"col10\">ID1</div>");
            html.append("<div class=\"col10\">ID2</div>");
            html.append("<div class=\"col20\">NAME</div>");
            html.append("<div class=\"col10\">TIME1</div>");
            html.append("<div class=\"col7\">KG1</div>");
            html.append("<div class=\"col7\">KG2</div>");
            html.append("<div class=\"col10\">TIME2</div>");
            html.append("<div class=\"col7\">KG3</div>");
            html.append("<div class=\"col7\">KG4</div>");
            html.append("<div class=\"col7\">TOT</div>");
            html.append("</th>");
            html.append("<th>");
            html.append("<div class=\"col3\">&nbsp;</div>");
            html.append("<div class=\"col10\">ID1</div>");
            html.append("<div class=\"col10\">ID2</div>");
            html.append("<div class=\"col20\">NAME</div>");
            html.append("<div class=\"col10\">TIME1</div>");
            html.append("<div class=\"col7\">KG1</div>");
            html.append("<div class=\"col7\">KG2</div>");
            html.append("<div class=\"col10\">TIME2</div>");
            html.append("<div class=\"col7\">KG3</div>");
            html.append("<div class=\"col7\">KG4</div>");
            html.append("<div class=\"col7\">TOT</div>");
            html.append("</th>");
            html.append("</tr>");
            html.append("</thead>");
            try {
                int slno = 1;
                String bookNo = "-1";
                double total = 0;
                double kg1t = 0;
                double kg2t = 0;
                double kg3t = 0;
                double kg4t = 0;
                double kg1gt = 0;
                double kg2gt = 0;
                double kg3gt = 0;
                double kg4gt = 0;
                int w1t = 0;
                int w2t = 0;
                int w1gt = 0;
                int w2gt = 0;
                for (int loop = 0, length = workers.length(); loop < length; loop++) {
                    if (slno % 2 == 1) {
                        html.append("<tr>");
                    }
                    String currBook = workers.getJSONObject(loop).optString(DatabaseHelper.WORKER_BOOK_NAME, "&nbsp;");
                    if ((loop != 0) && (!bookNo.equals(currBook))) {
                        hasMultipleGroups = true;
                        if (slno % 2 == 0) {
                            html.append("<td>");
                            html.append("<div class=\"col3 bold\">&nbsp;</div>");
                            html.append("<div class=\"col10\">&nbsp;</div>");
                            html.append("<div class=\"col10\">&nbsp;</div>");
                            html.append("<div class=\"col20\">&nbsp;</div>");
                            html.append("<div class=\"col10\">&nbsp;</div>");
                            html.append("<div class=\"col7\">&nbsp;</div>");
                            html.append("<div class=\"col7\">&nbsp;</div>");
                            html.append("<div class=\"col10\">&nbsp;</div>");
                            html.append("<div class=\"col7\">&nbsp;</div>");
                            html.append("<div class=\"col7\">&nbsp;</div>");
                            html.append("<div class=\"col7 bold\">&nbsp;</div>");
                            html.append("</td>");
                            // slno = 1;
                        }
                        slno = 1;
                        html.append("</tr><tr><td></td><td class=\"bold\"><div class=\"col43\">Subtotal </div>");
                        html.append("<div class=\"col10\"> " + w1t + " No</div>");
                        html.append("<div class=\"col7\">" + df.format(kg1t) + "</div>");
                        html.append("<div class=\"col7\">" + df.format(kg2t) + "</div>");
                        html.append("<div class=\"col10\"> " + w2t + " No</div>");
                        html.append("<div class=\"col7\">" + df.format(kg3t) + "</div>");
                        html.append("<div class=\"col7\">" + df.format(kg4t) + "</div>");
                        html.append("<div class=\"col7\">" + df.format(total) + "</div>");
                        html.append("</td></tr><tr>");
                        total = 0;
                        kg1t = kg2t = kg3t = kg4t = 0;
                        w1t = w2t = 0;
                    }
                    boolean lateInTime1 = false;
                    boolean lateInTime2 = false;
                    bookNo = currBook;
                    String empNo = workers.getJSONObject(loop).optString(DatabaseHelper.WORKER_EMP_NUMBER, "&nbsp;");
                    String code = workers.getJSONObject(loop).optString(DatabaseHelper.WORKER_CODE, "&nbsp;");
                    String name = workers.getJSONObject(loop).optString(DatabaseHelper.WORKER_NAME, "&nbsp;");
                    String time1 = workers.getJSONObject(loop).optString("IN_TIME", "&nbsp;");
                    String time2 = workers.getJSONObject(loop).optString("OUT_TIME", "&nbsp;");
                    String time1Org = "";
                    if (empNo.equals("999999")) {
                        empNo = "&nbsp;";
                    }
                    if (!time1.equals("&nbsp;")) {
                        try {
                            long ltime1 = Long.parseLong(time1);
                            // if (ltime1 > cutOff1) {
                            //    lateInTime1 = true;
                            // }
                            time1Org = time1;
                            dt.setTime(ltime1);
                            time1 = new SimpleDateFormat("HH:mm").format(dt);
                            w1t++;
                            w1gt++;
                        } catch (Exception e) {
                        }
                    }
                    if (!time2.equals("&nbsp;")) {
                        try {
                            if ((time1Org.equals(time2))) {
                                time2 = "&nbsp;";
                            } else {
                                long ltime2 = Long.parseLong(time2);
                                dt.setTime(ltime2);
                                time2 = new SimpleDateFormat("HH:mm").format(dt);
                                // if (ltime2 > cutoff3) {
                                //    lateInTime2 = true;
                                // }
                                // if (ltime2 < cutoff2) {
                                //    time2 = time2 + " *";
                                // }
                                // if (ltime2 >= cutoff2) {
                                w2t++;
                                w2gt++;
                                // }
                            }
                        } catch (Exception e) {
                        }
                    }
                    double kg1 = 0;
                    double kg2 = 0;
                    double kg3 = 0;
                    double kg4 = 0;
                    String kg1Suffix = "";
                    String kg2Suffix = "";
                    String kg3Suffix = "";
                    String kg4Suffix = "";
                    long w1Time = -1;
                    long w2Time = -1;
                    long w3Time = -1;
                    long w4Time = -1;
                    JSONObject tmp = pluckingData.optJSONObject(workers.getJSONObject(loop).optString(DatabaseHelper.WORKER_ID, ""));
                    if (tmp != null) {
                        try {
                            kg1 = tmp.getJSONObject("1").getDouble("qty");
                            w1Time = tmp.getJSONObject("1").getLong("time");
                            // if (w1Time > cutoff2) {
                            //    kg1Suffix = " *";
                            // }
                        } catch (Exception e) {
                        }
                        try {
                            kg2 = tmp.getJSONObject("2").getDouble("qty");
                            w2Time = tmp.getJSONObject("2").getLong("time");
                            if (w2Time < w1Time) {
                                kg2Suffix = " *";
                            }
                        } catch (Exception e) {
                        }
                        try {
                            kg3 = tmp.getJSONObject("3").getDouble("qty");
                            w3Time = tmp.getJSONObject("3").getLong("time");
                            // if ((w3Time < cutoff3) || (w3Time < w2Time)) {
                            //    kg3Suffix = " *";
                            // }
                        } catch (Exception e) {
                        }
                        try {
                            kg4 = tmp.getJSONObject("4").getDouble("qty");
                            w4Time = tmp.getJSONObject("4").getLong("time");
                            // if ((w4Time < cutoff3) || (w4Time < w3Time)) {
                            //    kg3Suffix = " *";
                            // }
                        } catch (Exception e) {
                        }
                    }
                    kg1t += kg1;
                    kg1gt += kg1;
                    kg2t += kg2;
                    kg2gt += kg2;
                    kg3t += kg3;
                    kg3gt += kg3;
                    kg4t += kg4;
                    kg4gt += kg4;
                    double subTotal = kg1 + kg2 + kg3 + kg4;
                    total += subTotal;
                    grandTotal += subTotal;
                    html.append("<td>");
                    html.append("<div class=\"col3 bold\">" + slno + "</div>");
                    html.append("<div class=\"col10 fontSmall\">" + bookNo + "/" + empNo + "</div>");
                    html.append("<div class=\"col10 fontSmall\">" + code + "</div>");
                    html.append("<div class=\"col20\">" + name + "</div>");
                    if (lateInTime1) {
                        html.append("<div class=\"col10 late\">" + time1 + "</div>");
                    } else {
                        html.append("<div class=\"col10\">" + time1 + "</div>");
                    }
                    html.append("<div class=\"col7\">" + kg1 + kg1Suffix + "</div>");
                    html.append("<div class=\"col7\">" + kg2 + kg2Suffix + "</div>");
                    if (lateInTime2) {
                        html.append("<div class=\"col10 late\">" + time2 + "</div>");
                    } else {
                        html.append("<div class=\"col10\">" + time2 + "</div>");
                    }
                    html.append("<div class=\"col7\">" + kg3 + kg3Suffix + "</div>");
                    html.append("<div class=\"col7\">" + kg4 + kg4Suffix + "</div>");
                    html.append("<div class=\"col7 bold\">" + subTotal + "</div>");
                    html.append("</td>");
                    if (slno % 2 == 0) {
                        html.append("</tr>");
                    }
                    slno++;
                }
                if (slno % 2 == 0) {
                    html.append("<td>");
                    html.append("<div class=\"col3 bold\">&nbsp;</div>");
                    html.append("<div class=\"col10\">&nbsp;</div>");
                    html.append("<div class=\"col10\">&nbsp;</div>");
                    html.append("<div class=\"col20\">&nbsp;</div>");
                    html.append("<div class=\"col10\">&nbsp;</div>");
                    html.append("<div class=\"col7\">&nbsp;</div>");
                    html.append("<div class=\"col7\">&nbsp;</div>");
                    html.append("<div class=\"col10\">&nbsp;</div>");
                    html.append("<div class=\"col7\">&nbsp;</div>");
                    html.append("<div class=\"col7\">&nbsp;</div>");
                    html.append("<div class=\"col7 bold\">&nbsp;</div>");
                    html.append("</td></tr>");
                    slno = 1;
                }
                if (hasMultipleGroups) {
                    html.append("<tr><td></td><td class=\"bold\"><div class=\"col43\">Subtotal </div>");
                    html.append("<div class=\"col10\"> " + w1t + " No</div>");
                    html.append("<div class=\"col7\">" + df.format(kg1t) + "</div>");
                    html.append("<div class=\"col7\">" + df.format(kg2t) + "</div>");
                    html.append("<div class=\"col10\"> " + w2t + " No</div>");
                    html.append("<div class=\"col7\">" + df.format(kg3t) + "</div>");
                    html.append("<div class=\"col7\">" + df.format(kg4t) + "</div>");
                    html.append("<div class=\"col7\">" + df.format(total) + "</div>");
                    html.append("</td></tr>");
                }
                html.append("<tr><td colspan=\"2\" class=\"right bold\">&nbsp;</td></tr>");
                html.append("<tr><td></td><td class=\"bold\"><div class=\"col43\">Total </div>");
                html.append("<div class=\"col10\">" + w1gt + "No</div>");
                html.append("<div class=\"col7\">" + df.format(kg1gt) + "</div>");
                html.append("<div class=\"col7\">" + df.format(kg2gt) + "</div>");
                html.append("<div class=\"col10\">" + w2gt + "No</div>");
                html.append("<div class=\"col7\">" + df.format(kg3gt) + "</div>");
                html.append("<div class=\"col7\">" + df.format(kg4gt) + "</div>");
                html.append("<div class=\"col7\">" + df.format(grandTotal) + "</div>");
                html.append("</td></tr>");
            } catch (Exception e) {
                e.printStackTrace();
            }
            html.append("</table>");
            html.append("<p>&nbsp;</p>");
        }
        if(nonPluckingWorkers.length()>0){
            html.append("<table class=\"table2\" cellspacing=\"0\" cellpadding=\"0\">");
            html.append("<thead><tr class=\"bold\">");
            html.append("<th class=\"col2\"></th>");
            html.append("<th class=\"col5\">ID1</th>");
            html.append("<th class=\"col5\">ID2</th>");
            html.append("<th class=\"col10\">NAME</th>");
            html.append("<th class=\"col5\">TIME1</th>");
            html.append("<th class=\"col5\">TIME2</th>");
            html.append("<th class=\"col5\">TIME3</th>");
            html.append("<th class=\"col5\">TIME4</th>");
            html.append("<th class=\"col10\">BATCH</th>");
            html.append("<th class=\"col10\">MANDAY</th>");
            html.append("<th class=\"col10\">DOUBLY</th>");
            html.append("<th class=\"col10\">SEC</th>");
            html.append("<th class=\"col15\">DEPT</th>");
            html.append("</tr></thead>");
            String bookNo = "";
            String empNo = "";
            String code = "";
            String name = "";
            String lastBookNo = "";
            String batch = "";
            String section = "";
            String kamjari = "";
            JSONArray logs = null;
            String time1, time2, time3, time4;
            int count=1;
            String prevKey = "";
            String currkey = "";
            for(int loop=0, length=nonPluckingWorkers.length(); loop<length; loop++){
                time1 = time2= time3= time4 = "";
                logs = null;
                boolean pendingTime = false;
                int timeItteration = 1;
                try{
                    bookNo = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.WORKER_BOOK_NAME, "&nbsp;");
                    empNo = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.WORKER_EMP_NUMBER, "&nbsp;");
                    code = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.WORKER_CODE, "&nbsp;");
                    name = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.WORKER_NAME, "&nbsp;");
                    batch = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.BATCH_ID, "&nbsp;");
                    section = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.SECTION_ID, "&nbsp;");
                    kamjari = nonPluckingWorkers.getJSONObject(loop).optString(DatabaseHelper.KAMJARI_ID, "&nbsp;");
                    logs = nonPluckingWorkers.getJSONObject(loop).optJSONArray("auth_logs");
                }catch (Exception e){
                    bookNo = empNo = code = name = "";
                }
                // NON PLUCKING GROUPING KEY
                // currkey = bookNo+"_"+batch+"_"+section+"_"+kamjari;
                currkey = section+"_"+kamjari;
                currkey = batch;
                if((loop!=0) && (!prevKey.equals(currkey))){
                    html.append("<tr><td colspan=\"13\">&nbsp;</td></tr>");
                    count=1;
                }
                html.append("<tr>");
                html.append("<td class=\"col2 bold\">"+count+"</td>");
                html.append("<td class=\"col5 fontSmall\">"+ bookNo + "/" + empNo +"</td>");
                html.append("<td class=\"col5 fontSmall\">"+ code +"</td>");
                html.append("<td class=\"col10\">"+ name +"</td>");
                // try{
                //    if(logs!=null){
                //        for(int inner=0, innerLength= logs.length(); inner<innerLength; inner++){
                //            try {
                //                long time = Long.parseLong(logs.getString(inner));
                //                dt.setTime(time);
                //                if(inner==0){
                //                    time1 = new SimpleDateFormat("HH:mm").format(dt);
                //                }else if(inner==1){
                //                    time2 = new SimpleDateFormat("HH:mm").format(dt);
                //                }else if(inner==2){
                //                    time3 = new SimpleDateFormat("HH:mm").format(dt);
                //                }else{
                //                    time4 = new SimpleDateFormat("HH:mm").format(dt);
                //                }
                //            } catch (Exception e) {
                //            }
                //        }
                //    }
                // }catch (Exception e){}

                try{
                    if(logs!=null) {
                        int maxlen = timeItteration *4;
                        if(maxlen>logs.length()){
                            maxlen = logs.length();
                        }
                        int localCounter = 0;
                        for(int inner=((timeItteration -1)*4), innerLength= maxlen; inner<innerLength; inner++,localCounter++) {
                            long time = Long.parseLong(logs.getString(inner));
                            dt.setTime(time);
                            if(localCounter==0) {
                                time1 = new SimpleDateFormat("HH:mm").format(dt);
                            } else if(localCounter==1) {
                                time2 = new SimpleDateFormat("HH:mm").format(dt);
                            } else if(localCounter==2) {
                                time3 = new SimpleDateFormat("HH:mm").format(dt);
                            } else if(localCounter==3) {
                                time4 = new SimpleDateFormat("HH:mm").format(dt);
                            }
                        }
                        if(logs.length()>4){
                            pendingTime = true;
                            timeItteration++;
                        }
                    }
                    html.append("<td class=\"col5\">"+time1+"</td>");
                    html.append("<td class=\"col5\">"+time2+"</td>");
                    html.append("<td class=\"col5\">"+time3+"</td>");
                    html.append("<td class=\"col5\">"+time4+"</td>");
                }catch (Exception e){
                    pendingTime = false;
                    html.append("<td class=\"col5\"></td>");
                    html.append("<td class=\"col5\"></td>");
                    html.append("<td class=\"col5\"></td>");
                    html.append("<td class=\"col5\"></td>");
                }

                // html.append("<td class=\"col5\">"+time1+"</td>");
                // html.append("<td class=\"col5\">"+time2+"</td>");
                // html.append("<td class=\"col5\">"+time3+"</td>");
                // html.append("<td class=\"col5\">"+time4+"</td>");
                html.append("<td class=\"col10\">"+batch+"</td>");
                html.append("<td class=\"col10\"></td>");
                html.append("<td class=\"col10\"></td>");
                html.append("<td class=\"col10\">"+section+"</td>");
                html.append("<td class=\"col15\">"+kamjari+"</td>");
                html.append("</tr>");
                count++;
                lastBookNo = bookNo;
                while(pendingTime) {
                    time1 = time2= time3= time4 = "";
                    html.append("<tr>");
                    html.append("<td class=\"col2\"></td>");
                    html.append("<td class=\"col5\"></td>");
                    html.append("<td class=\"col5\"></td>");
                    html.append("<td class=\"col10\"></td>");
                    int maxlen = timeItteration *4;
                    if(maxlen>logs.length()){
                        maxlen = logs.length();
                    }
                    int localCounter = 0;
                    for(int inner=((timeItteration -1)*4), innerLength= maxlen; inner<innerLength; inner++,localCounter++) {
                        long time = Long.parseLong(logs.optString(inner));
                        dt.setTime(time);
                        if(localCounter==0) {
                            time1 = new SimpleDateFormat("HH:mm").format(dt);
                        } else if(localCounter==1) {
                            time2 = new SimpleDateFormat("HH:mm").format(dt);
                        } else if(localCounter==2) {
                            time3 = new SimpleDateFormat("HH:mm").format(dt);
                        } else if(localCounter==3) {
                            time4 = new SimpleDateFormat("HH:mm").format(dt);
                        }
                    }
                    if(logs.length()>(timeItteration *4)){
                        pendingTime = true;
                        timeItteration++;
                    } else {
                        pendingTime = false;
                    }
                    html.append("<td class=\"col5\">"+time1+"</td>");
                    html.append("<td class=\"col5\">"+time2+"</td>");
                    html.append("<td class=\"col5\">"+time3+"</td>");
                    html.append("<td class=\"col5\">"+time4+"</td>");

                    html.append("<td class=\"col10\"></td>");
                    html.append("<td class=\"col10\"></td>");
                    html.append("<td class=\"col10\"></td>");
                    html.append("<td class=\"col10\"></td>");
                    html.append("<td class=\"col15\"></td>");
                    html.append("</tr>");
                }
                prevKey = currkey;
            }
            html.append("</table>");
        }
        if(workers.length()>0) {
            html.append("<br><table style=\"border:none\"><tr>");
            html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col40\">Plucking Type</td>");
            html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col40\">Task</td>");
            DecimalFormat f = new DecimalFormat("##.00");
            html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col20\">"+f.format((double) ((double)grandTotal/workers.length()))+" Kg/pl</td>");
            // html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col20\">"+f.format(2.56)+" Pl/Kg</td>");
            html.append("</tr></table>");
            html.append("<br><table style=\"border:none\"><tr>");
            html.append("<td colspan=\"4\" style=\"text-align: center;border-right: 1px solid;border-left: 1px solid;border-top: 1px solid;\"> W1 </td><td colspan=\"4\" style=\"text-align: center;border-right: 1px solid;border-top: 1px solid;\"> W2 </td><td colspan=\"4\" style=\"text-align: center;border-right: 1px solid;border-top: 1px solid;\"> W3 </td><td colspan=\"4\" style=\"text-align: center;border-right: 1px solid;border-top: 1px solid;\"> W4 </td></tr><tr>");
            html.append("<td style=\"width: 6%; border: 1px solid;padding-top:20px;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td>");
            html.append("<td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td><td style=\"width: 6%; border: 1px solid;\">&nbsp;</td>");
            html.append("</tr></table>");
        }
        // html.append("<br><br><table style=\"border:none\"><caption>Device: ");
        // html.append(deviceName);
        // html.append("</caption><tr>");
        html.append("<br><br><table style=\"border:none\"><tr>");
        // html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col40\">Operator<div style=\"width:100%; text-align:left;\">");
        // html.append(operator+ " (on "+deviceName+")");
        // html.append("</div></td>");
        html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col40\">Operator</td>");
        html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col20\">Date</td>");
        html.append("<td style=\"border:none; border-bottom: 1px solid;\" class=\"col40\">Assistant</td>");
        html.append("</tr></table>");
        html.append("<br><div> " + operator + " (on " + deviceName + ")");
        if(workers.length()>0) {
            html.append("&nbsp; &nbsp; &nbsp; Avg. Plucking recording : " + recordindStatVal);
        }
        html.append("</div>");

        // html.append("<br><div style=\"text-align:center;\">Average Plucking recording speed: "+recordindStatVal+"</div>");
        html.append("</body></html>");
        System.gc();
        return html.toString();
    }

    public static double companyRoundOffOrg(String roundOff, double value){
        if(roundOff==null){
            roundOff ="round";
        }
        if(roundOff.equals("round")){
            return (int) Math.round(value);
        }else if(roundOff.equals("floor")){
            return (int) Math.floor(value);
        }else if(roundOff.equals("ceil")){
            return (int) Math.ceil(value);
        }else if(roundOff.equals("none")){
            return value;
        }
        return (int) value;
    }


    public static double companyRoundOff(String roundOff, double value){
        if(roundOff==null){
            roundOff ="round";
        }
        double toReturn = value;
        if(roundOff.equals("round")){
            toReturn = (int) Math.round(value);
        }else if(roundOff.equals("floor")){
            toReturn = (int) Math.floor(value);
        }else if(roundOff.equals("ceil")){
            toReturn = (int) Math.ceil(value);
        }else if(roundOff.equals("none")){
            toReturn = value;
        }
        if (((int) toReturn) < 0) {
            return 0;
        }
        if ((value>0) && (toReturn==0)) {
            if (value>0.5) {
                return 0.5;
            } else {
                try {
                    return Double.parseDouble(df.format(value));
                } catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        return (int) toReturn;
    }
}
