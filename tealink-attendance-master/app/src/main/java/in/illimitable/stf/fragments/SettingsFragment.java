package in.illimitable.stf.fragments;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import in.illimitable.stf.HomeActivity;
import in.illimitable.stf.STFApplication;
import in.illimitable.stf.databinding.FragmentSettingsBinding;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

/**
 * A simple {@link Fragment} subclass.
 */
public class SettingsFragment extends Fragment implements View.OnClickListener {

    private FragmentSettingsBinding binding;

    private DatabaseHelper dHelper;
    private Storage storage;

    public SettingsFragment() {
        // Required empty public constructor
    }

    public static SettingsFragment newInstance() {
        SettingsFragment settingsFragment = new SettingsFragment();
        return settingsFragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        dHelper = DatabaseHelper.getInstance(getContext());
        storage = new Storage(getContext());

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentSettingsBinding.inflate(inflater, container, false);
        // if(Constants.privileges==null){
        //    Constants.privileges = storage.getPrivileges();
        // }
        // JSONObject workerManagement = Constants.privileges.optJSONObject("worker_management");
        // JSONObject userManagement = Constants.privileges.optJSONObject("user_management");
        binding.saveWeighingParams.setVisibility(View.VISIBLE);
        binding.moisture.setText("" + storage.getMoistureContent());
        binding.tareWeight.setText("" + storage.getTareWeight());
        binding.standardDeduction.setText("" + storage.getStandardDeviation());
        binding.moisture.setEnabled(true);
        binding.tareWeight.setEnabled(true);
        binding.standardDeduction.setEnabled(true);
        // if (workerManagement != null) {
        //    JSONArray accessArr = workerManagement.optJSONArray("access");
        //    if (accessArr != null) {
        //        String access = accessArr.toString();
        //        if (access.indexOf("update") >= 0) {
        //            _moisture.setEnabled(true);
        //            _tareWeight.setEnabled(true);
        //            _standardDeduction.setEnabled(true);
        //            _saveWeightParams.setVisibility(View.VISIBLE);
        //        }
        //    }
        // }

        binding.saveServerUrl.setOnClickListener(this);
        binding.exportTransactionalData.setOnClickListener(this);
        binding.clearTransactionalData.setOnClickListener(this);
        binding.saveWeighingParams.setOnClickListener(this);
        binding.saveOneShotPref.setOnClickListener(this);
        binding.saveFlashSettings.setOnClickListener(this);
        binding.oneShotSwitch.setChecked(storage.isModeOneShot());
        binding.flashOnRecord.setChecked(storage.flashOnRecord());
        binding.flashDuration.setText(""+storage.getFlashDuration());
        String url = dHelper.getConfigValue(DatabaseHelper.SERVER_URL);
        if (url != null) {
            binding.serverUrl.setText(url);
        }
        binding.timeWiseSwitch.setChecked(storage.printTimeWise());
        binding.savePrintPref.setOnClickListener(this);
        return binding.getRoot();
    }

    @Override
    public void onClick(View view) {
        if (view == binding.saveServerUrl) {
            String url = binding.serverUrl.getText().toString().trim().toLowerCase();
            if (url.indexOf("http") < 0) {
                ((HomeActivity)getActivity()).showErrorMessage("Enter a proper url");
                return;
            }
            if (!url.endsWith("/")) {
                url += "/";
            }
            final String sURL = url;
            final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getContext(), url + "app/server-info.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
            wrapper.addParam("timezoneOffset", (""+(Utility.getTimezoneOffset() * -1)));
            new Thread() {
                @Override
                public void run() {
                    try {
                        JSONObject jResponse = null;
                        JSONArray supportedVersions = null;
                        String response = wrapper.execute();
                        if (response==null) {
                            response = "{\"status\":1, \"msg\":\"Unable to reach server, please check connectivity\"}";
                        }
                        jResponse = new JSONObject(response);
                        final int status = jResponse.optInt("status", 1);
                        final String errMsg = jResponse.optString("msg", "We have encountered an unexpected error");
                        supportedVersions = jResponse.optJSONArray("supportedVersion");
                        long now = jResponse.optLong("now", -1);
                        if (now != -1) {
                            storage.setLastVerifiedTime(now);
                            storage.setLastVerifiedTimeZone(Utility.getTimezoneOffset());
                        }
                        final JSONArray pResponse = supportedVersions;
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                try {
                                    if (status != 0) {
                                        ((HomeActivity)getActivity()).showErrorMessage(errMsg);
                                        return;
                                    }
                                    String currentVersion = getActivity().getPackageManager().getPackageInfo(getActivity().getPackageName(), 0).versionName;
                                    if (pResponse != null && pResponse.join(",").indexOf(currentVersion) >= 0) {
                                        dHelper.insertToConfigMaster(DatabaseHelper.SERVER_URL, sURL);
                                        ((HomeActivity)getActivity()).showSuccessMessage("URL updated");
                                        Constants.BASE_URL = sURL;
                                        STFApplication application = (STFApplication) getActivity().getApplication();
                                        application.disconnectSocket();
                                        application.initSocket();
                                        application.connectSocket();
                                    } else {
                                        ((HomeActivity)getActivity()).showErrorMessage("Invalid/Unsupported url");
                                    }
                                } catch (Exception e) {
                                }
                            }
                        });
                    } catch (Exception e) {
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).showErrorMessage("Encountered an unexpected error");
                            }
                        });
                    }
                }
            }.start();
        } else if (view == binding.saveWeighingParams) {
            try {
                String moisture = binding.moisture.getText().toString().trim();
                String tareWeight = binding.tareWeight.getText().toString().trim();
                String standardDeduction = binding.standardDeduction.getText().toString().trim();
                if (moisture.length() == 0 || tareWeight.length() == 0 || standardDeduction.length() == 0) {
                    ((HomeActivity)getActivity()).showErrorMessage("Enter proper values");
                    return;
                }
                float moistureF = Float.parseFloat(moisture);
                float tareWeightF = Float.parseFloat(tareWeight);
                float standardDeductionF = Float.parseFloat(standardDeduction);
                storage.setMoistureContent(moistureF);
                storage.setTareWeight(tareWeightF);
                storage.setStandardDeviation(standardDeductionF);
                ((HomeActivity)getActivity()).showSuccessMessage("Values Saved");
            } catch (Exception e) {
                ((HomeActivity)getActivity()).showErrorMessage("Enter proper values");
            }
        } else if (view == binding.exportTransactionalData) {
            final JSONArray requests = dHelper.getOfflineRecord();
            if (requests.length() == 0) {
                ((HomeActivity)getActivity()).showInfoMessage("No pending data to export");
                return;
            }
            ((HomeActivity)getActivity()).showProgressLoader("Exporting Data");
            new Thread() {
                @Override
                public void run() {
                    try {
                        int BUFFER = 20 * 1024;
                        final String logFolder = getActivity().getExternalFilesDir(null)+ File.separator + storage.getLogFolderName();
                        final String dirName = logFolder + File.separator + "exportData";

                        File directory = new File(dirName);
                        directory.mkdirs();
                        for (int loop = 0; loop < requests.length(); loop++) {
                            try {
                                String requestId = requests.getJSONObject(loop).getString(DatabaseHelper.REQUEST_ID);
                                JSONArray headers = dHelper.getHeadersForRequest(requestId);
                                JSONArray parameters = dHelper.getParametersForRequest(requestId);
                                requests.getJSONObject(loop).put("headers", headers);
                                requests.getJSONObject(loop).put("parameters", parameters);
                                String filePath = dHelper.getFilePathForRequest(requestId);
                                if (filePath != null && filePath.trim().length() > 0) {
                                    Utility.copyFile(filePath, dirName+ File.separator+ "file_"+requestId);
                                    requests.getJSONObject(loop).put("_file", "file_"+requestId);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        File exportFile = new File(dirName+ File.separator+ "data.json");
                        FileOutputStream fos = new FileOutputStream(exportFile);
                        fos.write(requests.toString().getBytes());
                        fos.flush();
                        fos.close();
                        File[] files = directory.listFiles();
                        File dest = new File(logFolder + File.separator + "export.data");
                        if(dest.exists()){
                            dest.delete();
                        }
                        BufferedInputStream origin = null;
                        ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(dest)));
                        byte data[] = new byte[BUFFER];
                        for (int i = 0; i < files.length; i++) {
                            FileInputStream fi = new FileInputStream(files[i]);
                            origin = new BufferedInputStream(fi, BUFFER);
                            ZipEntry entry = new ZipEntry(files[i].getName());
                            out.putNextEntry(entry);
                            int count;
                            while ((count = origin.read(data, 0, BUFFER)) != -1) {
                                out.write(data, 0, count);
                            }
                            origin.close();
                            out.flush();
                        }
                        Utility.deleteRecursive(directory);
                        out.flush();
                        out.close();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).hideProgressLoader();
                                ((HomeActivity)getActivity()).showSuccessMessage("All data exported in "+ logFolder + File.separator + "export.data");
                                storage.setExportedDate(Utility.getDateFromNow(0));
                            }
                        });
                    }catch (Exception e){
                        e.printStackTrace();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).hideProgressLoader();
                                ((HomeActivity)getActivity()).showErrorMessage("Failed to export data");
                            }
                        });
                    }
                }
            }.start();
        }else if(view==binding.saveOneShotPref){
            storage.setOneShotMode(binding.oneShotSwitch.isChecked());
            ((HomeActivity)getActivity()).showSuccessMessage("Preference saved");
        }else if(view==binding.saveFlashSettings){
            if(binding.flashOnRecord.isChecked()){
                int duration = 0;
                try {
                    duration = Integer.parseInt(binding.flashDuration.getText().toString());
                }catch (Exception e){}
                if(duration<1 || duration>3){
                    ((HomeActivity)getActivity()).showErrorMessage("Invalid flash duration");
                    return;
                }
                storage.setFlashOnRecord(true);
                storage.setFlashDuration(duration);
            }else{
                storage.setFlashOnRecord(false);
                storage.setFlashDuration(0);
            }
            ((HomeActivity)getActivity()).showSuccessMessage("Screen flash preference saved.");
        } else if (view==binding.clearTransactionalData) {
            long today = Utility.getDateFromNow(0);
            long lastExportedDate = storage.getExportedDate();
            if (today != lastExportedDate) {
                ((HomeActivity)getActivity()).showErrorMessage("Data can't be cleared unless exported");
                return;
            }
            final JSONArray requests = dHelper.getOfflineRecord();
            if (requests.length() == 0) {
                ((HomeActivity)getActivity()).showErrorMessage("No pending data to clear");
                return;
            }
            ((HomeActivity)getActivity()).showProgressLoader("Clearing Data");
            new Thread() {
                @Override
                public void run() {
                    try {
                        for (int loop = 0; loop < requests.length(); loop++) {
                            try {
                                String requestId = requests.getJSONObject(loop).getString(DatabaseHelper.REQUEST_ID);
                                dHelper.deleteRequest(requestId);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).hideProgressLoader();
                                ((HomeActivity)getActivity()).showSuccessMessage("All transactions cleared");
                            }
                        });
                    }catch (Exception e){
                        e.printStackTrace();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).hideProgressLoader();
                                ((HomeActivity)getActivity()).showErrorMessage("Failed to clear data");
                            }
                        });
                    }
                }
            }.start();

        } else if(view==binding.savePrintPref){
            storage.setPrintTimeWise(binding.timeWiseSwitch.isChecked());
            ((HomeActivity)getActivity()).showSuccessMessage("Print Preference saved.");
        }
    }
}
