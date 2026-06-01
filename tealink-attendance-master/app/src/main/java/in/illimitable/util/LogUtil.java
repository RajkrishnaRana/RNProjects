package in.illimitable.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import android.content.Context;
import android.os.Environment;

import es.dmoral.toasty.Toasty;

/**
 * Created by illimitable.in on 21-Mar-17.
 */

public class LogUtil {
    private static boolean displayDebugInfo = false;

    public static boolean writeLog(Context context, String msg, Storage storage) {
        if(!storage.isEnableLoging()){
            return true;
        }
        return writeLog(context, "",msg,storage);
    }

    public static boolean writeLog(Context context, String prefix, String msg, Storage storage) {
        boolean status = false;
        try {
            Date dNow = new Date();
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MMM-dd");
            String name="";
            if(prefix.length()>0){
                name = prefix+"_"+ft.format(dNow) + ".txt";
            }else{
                name = ft.format(dNow) + ".txt";
            }

            if (!Environment.getExternalStorageState().equals(
                    Environment.MEDIA_MOUNTED)) {
            } else {
                File directory = new File(context.getExternalFilesDir(null) + File.separator + storage.getLogFolderName());

                directory.mkdirs();
                File file = new File(context.getExternalFilesDir(null) + File.separator + storage.getLogFolderName() + File.separator + name);
                if (!file.exists()) {
                    file.createNewFile();
                }

                PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(file, true)));
                SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:SS");
                out.println(timeFormat.format(dNow)+" - "+msg);
                out.flush();
                out.close();
                status = true;
                if (displayDebugInfo) {
                    Toasty.success(context, "Log written").show();
                }
            }
        } catch (Exception e) {
            if (displayDebugInfo) {
                Toasty.error(context, "Error writing log").show();
            }
            e.printStackTrace();
        }
        return status;
    }

    public InputStream readLog(Context context, Date today, Storage storage) {
        return readLog(context, "",today,storage);
    }

    public InputStream readLog(Context context, String prefix, Date today, Storage storage) {
        InputStream stream = null;
        try {
            Calendar calendar = Calendar.getInstance();
            Date dNow = null;
            if(today!=null){
                dNow = today;
            }else{
                dNow = new Date();
            }
            calendar.setTime(dNow);
            SimpleDateFormat ft = new SimpleDateFormat("yyyy-MMM-dd");
            String name="";
            if(prefix.length()>0){
                name = prefix+"_"+ft.format(calendar.getTime()) + ".txt";
            }else{
                name = ft.format(calendar.getTime()) + ".txt";
            }
            if (!Environment.getExternalStorageState().equals(
                    Environment.MEDIA_MOUNTED)) {
            } else {
                File directory = new File(
                        context.getExternalFilesDir(null)
                                + File.separator + storage.getLogFolderName());
                directory.mkdirs();
                File file = new File(context.getExternalFilesDir(null)
                        + File.separator + storage.getLogFolderName() + File.separator
                        + name);
                if (file.exists()) {
                    stream = new FileInputStream(file);
                } else {
                }
            }
        } catch (Exception e) {
        }
        return stream;
    }
}
