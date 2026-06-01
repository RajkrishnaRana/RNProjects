package in.illimitable.stf.fragments;


import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.UUID;

import id.zelory.compressor.Compressor;
import in.illimitable.stf.HomeActivity;
import in.illimitable.stf.R;
import in.illimitable.stf.databinding.FragmentRecordNonpluckingBinding;
import in.illimitable.stf.util.OnFragmentInteractionListener;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.ImageUriToFilePath;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;

/**
 * A simple {@link Fragment} subclass.
 */
public class RecordNonpluckingFragment extends Fragment implements View.OnClickListener, AdapterView.OnItemSelectedListener {

    public static final int WORKER_IMAGE = 88;
    private Compressor compressor;

    private DatabaseHelper dHelper;
    private Storage storage;
    private JSONObject worker;
    private JSONArray proxyKamjaris = new JSONArray();
    private JSONArray proxySections = new JSONArray();
    private JSONArray proxyBatches = new JSONArray();
    private JSONArray proxyShifts = new JSONArray();
    private String[] sSections;
    private String[] sKamjaris;
    private String[] sBatches;
    private String[] sShifts;
    private String sectionId = "-1";
    private String kamjariId = "-1";
    private String batchId = "";
    private String divId = "";
    private String shiftId = "";
    private String shiftId2 = "";

    private boolean flashOnRecord = false;
    private boolean imageMandatory = false;
    private boolean defaultKamjariFlowEnabled = false;
    private int flashDuration = 0;
    private Handler flashHandler;

    private Vibrator vibrator;
    private MediaPlayer mp;

    private String mCurrentPhotoPath;
    private String workerImagePath = null;

    private JSONObject gardenConfig;
    boolean batchSameAsDevice;
    boolean disableManualEntry = false;
    private String deviceName = "";
    private int _batchIdPos = -1;

    private String currentVersion = "";

    private FragmentRecordNonpluckingBinding binding;

    private HashSet<String> workersWithRecord = new HashSet<>();

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        dHelper = DatabaseHelper.getInstance(getContext());
        storage = new Storage(getContext());
        deviceName = storage.getDeviceName();
        gardenConfig = storage.getGardenConfig();
        batchSameAsDevice = gardenConfig.optBoolean("batchSameAsDevice", false);
        disableManualEntry = gardenConfig.optBoolean("disableManualEntry", false);
        imageMandatory = gardenConfig.optBoolean("imageMandatory", false);
        defaultKamjariFlowEnabled = gardenConfig.optBoolean("defaultKamjariFlowEnabled", false);
        compressor = ImageUriToFilePath.getCompressor(getActivity());
        String logFolderName = new Storage(getActivity()).getLogFolderName();
        String basePath = getActivity().getExternalFilesDir(null)+ File.separator + logFolderName  + File.separator + "transactionImage";
        File baseDir = new File(basePath);
        baseDir.mkdirs();
        compressor.setDestinationDirectoryPath(basePath);
        try {
            vibrator = (Vibrator) getActivity().getSystemService(android.content.Context.VIBRATOR_SERVICE);
        } catch (Exception e) {
        }
        flashHandler = new Handler();
        flashOnRecord = storage.flashOnRecord();
        flashDuration = storage.getFlashDuration();
        JSONArray sections = dHelper.getAllSections();
        JSONArray kamjaris = dHelper.getAllKamjaris();
        JSONArray batches = dHelper.getAllNonPluckingBatches();
        JSONArray shifts = dHelper.getAllNonPluckingShifts();
        JSONObject selectKamjari = new JSONObject();
        JSONObject selectSection = new JSONObject();
        JSONObject selectBatch = new JSONObject();
        JSONObject selectShift = new JSONObject();
        try{
            selectKamjari.put(DatabaseHelper.KAMJARI_ID, "-1");
            selectKamjari.put(DatabaseHelper.KAMJARI_NAME, "Select Kamjari");
            selectSection.put(DatabaseHelper.SECTION_ID, "-1");
            selectSection.put(DatabaseHelper.SECTION_NAME, "Select Section");
            selectBatch.put(DatabaseHelper.BATCH_ID, "");
            selectBatch.put(DatabaseHelper.DIV_ID, "");
            selectBatch.put(DatabaseHelper.SHIFT_ID, "");
            selectBatch.put(DatabaseHelper.BATCH_NAME, "Select Batch");
            selectShift.put(DatabaseHelper.SHIFT_ID, "");
            selectShift.put(DatabaseHelper.SHIFT_CODE, "Select Shift");
            proxyKamjaris.put(selectKamjari);
            proxySections.put(selectSection);
            proxyBatches.put(selectBatch);
            proxyShifts.put(selectShift);
            for (int loop = 0, length = kamjaris.length(); loop < length; loop++) {
                String type = kamjaris.getJSONObject(loop).getString(DatabaseHelper.KAMJARI_TYPE);
                type = type.toUpperCase();
                if (!type.equals("PLUCKING")) {
                    proxyKamjaris.put(kamjaris.getJSONObject(loop));
                }
            }
            for (int loop = 0, length = sections.length(); loop < length; loop++) {
                proxySections.put(sections.getJSONObject(loop));
            }
            for (int loop = 0, length = batches.length(); loop < length; loop++) {
                JSONObject row = batches.getJSONObject(loop);
                proxyBatches.put(row);
                if (batchSameAsDevice) {
                    String batchName = row.getString(DatabaseHelper.BATCH_NAME);
                    if (deviceName.equalsIgnoreCase(batchName)) {
                        _batchIdPos = loop +1;
                    }
                }
            }
            for (int loop = 0, length = shifts.length(); loop < length; loop++) {
                proxyShifts.put(shifts.getJSONObject(loop));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        try {
            currentVersion = getActivity().getPackageManager().getPackageInfo(getActivity().getPackageName(), 0).versionName;
        } catch (Exception e){}
        sKamjaris = Utility.getArrayForKey(proxyKamjaris, DatabaseHelper.KAMJARI_NAME);
        sSections = Utility.getArrayForKey(proxySections, DatabaseHelper.SECTION_NAME);
        sBatches = Utility.getArrayForKey(proxyBatches, DatabaseHelper.BATCH_NAME);
        sShifts = Utility.getArrayForKey(proxyShifts, DatabaseHelper.SHIFT_CODE);
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentRecordNonpluckingBinding.inflate(inflater, container, false);
        ArrayAdapter sectionAdapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, sSections);
        sectionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.section.setAdapter(sectionAdapter);
        ArrayAdapter kamjariAdapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, sKamjaris);
        kamjariAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.kamjari.setAdapter(kamjariAdapter);
        ArrayAdapter batchAdapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, sBatches);
        batchAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.batch.setAdapter(batchAdapter);
        ArrayAdapter shiftAdapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, sShifts);
        shiftAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.shift.setAdapter(shiftAdapter);
        if (batchSameAsDevice && (_batchIdPos != -1)) {
            binding.batch.setSelection(_batchIdPos);
            binding.batch.setEnabled(false);
        }
        binding.section.setOnItemSelectedListener(this);
        binding.kamjari.setOnItemSelectedListener(this);
        binding.batch.setOnItemSelectedListener(this);
        binding.shift.setOnItemSelectedListener(this);
        binding.selectWorker.setOnClickListener(this);
        binding.workerImgCapture.setOnClickListener(this);
        binding.workerImgCaptureCopy.setOnClickListener(this);
        if (disableManualEntry) {
            binding.container.setVisibility(View.GONE);
            binding.workerImgCaptureCopy.setVisibility(View.VISIBLE);
        }
        return binding.getRoot();
    }

    private void notifyRecorded() {
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                vibrator.vibrate(VibrationEffect.createOneShot(150, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                vibrator.vibrate(150);
            }
            mp = MediaPlayer.create(getActivity(), R.raw.success);
            mp.start();
            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                public void onCompletion(MediaPlayer mp) {
                    mp.release();
                    RecordNonpluckingFragment.this.mp = null;
                }
            });
            flashScreen(getView());
        } catch (Exception e) {
        }
    }

    public boolean workerIdentified(JSONObject worker, String mode) {
        this.worker = worker;
        String workerId = worker.optString(DatabaseHelper.WORKER_ID);
        String defaultKamjari = worker.optString(DatabaseHelper.WORKER_DEFAULT_KAMJARI, "");
        if (kamjariId.equals("-1")) {
            if ((!defaultKamjariFlowEnabled) || defaultKamjari.isEmpty()) {
                ((HomeActivity)getActivity()).showErrorMessage("Kamjari must be selected");
                return  false;
            }
        }
        if (batchId.equals("")) {
            ((HomeActivity)getActivity()).showErrorMessage("Batch must be selected");
            return  false;
        }
        if ((workerImagePath == null) && imageMandatory) {
            ((HomeActivity)getActivity()).showErrorMessage("Worker Image must be captured");
            return false;
        }
        binding.workerCodeInput.setText("");
        String bookId = worker.optString(DatabaseHelper.BOOK_ID);
        // String divId = worker.optString(DatabaseHelper.WORKER_DIVISION);
        String currShiftId = shiftId;
        if(currShiftId.length()==0) {
            currShiftId = shiftId2;
        }
        if (!workersWithRecord.contains(workerId)) {
            workersWithRecord.add(workerId);
            dHelper.insertToAttendanceMaster(workerId, batchId, sectionId, kamjariId.equals("-1")?defaultKamjari:kamjariId);
            submitHTTPRequest(workerId, bookId, divId, batchId, currShiftId, mode, workerImagePath!=null?""+workerImagePath:null, defaultKamjari);
            workerImagePath = null;
        }
        notifyRecorded();
        binding.processedWorkerCount.setText("" + workersWithRecord.size());
        return false;
    }

    private void submitHTTPRequest(String workerId, String bookId, String divId, String batchId, String shiftId, String mode, String workerImagePath, String defaultKamjari) {
        String transactionId = storage.getDeviceId() + UUID.randomUUID().toString() + System.currentTimeMillis();
        workersWithRecord.add(workerId);
        final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getActivity(), Constants.BASE_URL + "app/log-worker-nonplucking.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
        wrapper.addParam("workerId", workerId);
        wrapper.addParam("companyId", storage.getCompanyId());
        wrapper.addParam("transactionId", transactionId);
        wrapper.addParam("recordTime", "" + System.currentTimeMillis());
        wrapper.addParam("recordedTimezoneOffset", (""+(Utility.getTimezoneOffset() * -1)));
        // wrapper.addParam("authenticationTime", "" + authenticationTime);
        wrapper.addParam("sectionId", sectionId);
        if (kamjariId.equals("-1")) {
            wrapper.addParam("kamjariId", defaultKamjari);
        } else {
            wrapper.addParam("kamjariId", kamjariId);
        }
        wrapper.addParam("managerId", storage.getUserId());
        wrapper.addParam("deviceId", storage.getDeviceId());
        wrapper.addParam("bookId", bookId);
        wrapper.addParam("div", divId);
        wrapper.addParam("batch", batchId);
        wrapper.addParam("shift", shiftId);
        if (mode != null) {
            wrapper.addParam("manualEntry", "false");
            wrapper.addParam("identificationMode", mode);
        } else {
            wrapper.addParam("manualEntry", "true");
        }
        wrapper.addParam("appVersionName", currentVersion);
        if (workerImagePath != null) {
            wrapper.addParam("hasImage", "true");
            wrapper.setFile(workerImagePath, "workerImage");
            wrapper.setDeleteFile(true);
        }
        wrapper.setOfflineSupported(true);
        dHelper.insertRequest(wrapper);
        /*new Thread() {
            @Override
            public void run() {
                wrapper.execute();
            }
        }.start();*/
    }

    @Override
    public void onClick(View view) {
        if (view == binding.selectWorker) {
            ((HomeActivity)getActivity()).hideKeyboardInFragment();
            String workerCode = binding.workerCodeInput.getText().toString();
            if (workerCode.length() < 2) {
                ((HomeActivity)getActivity()).showErrorMessage("Invalid worker code");
                return;
            }
            workerCode = workerCode.toUpperCase();
            JSONObject tmp = dHelper.getWorkerDetailsByWorkerCodeOrEmpNo(workerCode);
            if (!tmp.optString(DatabaseHelper.WORKER_ID).equals("")) {
                try{
                    confirmManualSelection(tmp);
                }catch (Exception e){}
            } else {
                ((HomeActivity)getActivity()).showErrorMessage("Invalid worker code");
            }
            ((HomeActivity)getActivity()).hideKeyboardInFragment();
        } else if ((view == binding.workerImgCapture) || (view == binding.workerImgCaptureCopy)) {
            workerImagePath = null;
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            try {
                File photoFile = null;
                try {
                    photoFile = ImageUriToFilePath.createImageFile(getActivity());
                    mCurrentPhotoPath = photoFile.getAbsolutePath();
                } catch (IOException ex) {
                }
                if (photoFile != null) {
                    Uri photoURI = FileProvider.getUriForFile(getContext(), "in.illimitable.stf.fileprovider", photoFile);
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                    takePictureIntent.putExtra("return-data", true);
                    startActivityForResult(takePictureIntent, OnFragmentInteractionListener.REQUEST_TAKE_PHOTO);
                }
            } catch (Exception e) {
                ((HomeActivity)getActivity()).showErrorMessage("Error in capturing Image");
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == OnFragmentInteractionListener.REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {
            new Thread() {
                @Override
                public void run() {
                    try {
                        if (mCurrentPhotoPath==null) {
                            return;
                        }
                        File originalImage = new File(mCurrentPhotoPath);
                        File compressed = compressor.compressToFile(originalImage);
                        if (compressed.length()>0) {
                            workerImagePath = compressed.getAbsolutePath();
                        }
                        originalImage.delete();
                        mCurrentPhotoPath = null;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }
            }.start();
        }
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        try {
            if (parent == binding.kamjari) {
                kamjariId = proxyKamjaris.getJSONObject(position).getString(DatabaseHelper.KAMJARI_ID);
            } else if (parent == binding.section) {
                sectionId = proxySections.getJSONObject(position).getString(DatabaseHelper.SECTION_ID);
            } else if (parent == binding.batch) {
                batchId = proxyBatches.getJSONObject(position).getString(DatabaseHelper.BATCH_ID);
                divId = proxyBatches.getJSONObject(position).getString(DatabaseHelper.DIV_ID);
                shiftId2 = proxyBatches.getJSONObject(position).getString(DatabaseHelper.SHIFT_ID);
            } else if (parent == binding.shift) {
                shiftId = proxyShifts.getJSONObject(position).getString(DatabaseHelper.SHIFT_ID);
            }
        }catch (Exception e){}
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    private void confirmManualSelection(final JSONObject worker) throws Exception{
        final AlertDialog.Builder builder =
                new AlertDialog.Builder(getActivity(), R.style.AppCompatAlertDialogStyle);
        builder.setTitle("Entry for "+ worker.getString(DatabaseHelper.WORKER_NAME));
        builder.setMessage("Are you sure you want to log data for "+ worker.getString(DatabaseHelper.WORKER_NAME)+" ?");
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
                workerIdentified(worker, null);
            }
        });
        builder.setNegativeButton("Cancel", null);
        builder.show();
    }

    private void flashScreen(final View view){
        if(!flashOnRecord){
            return;
        }
        Animation animation = new AlphaAnimation(1, 0);
        animation.setDuration(250);
        animation.setInterpolator(new LinearInterpolator());
        animation.setRepeatCount(Animation.INFINITE);
        animation.setRepeatMode(Animation.REVERSE);
        view.startAnimation(animation);
        flashHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                view.clearAnimation();
            }
        }, flashDuration * 1000);
    }
}
