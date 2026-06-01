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
import in.illimitable.stf.databinding.FragmentMarkTimeBinding;
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
public class MarkTimeFragment extends Fragment implements View.OnClickListener {
    private Compressor compressor;

    private DatabaseHelper dHelper;
    private Storage storage;
    private JSONObject worker;

    private boolean flashOnRecord = false;
    private int flashDuration = 0;
    private Handler flashHandler;

    private Vibrator vibrator;
    private MediaPlayer mp;

    private String mCurrentPhotoPath;
    private String workerImagePath = null;

    private FragmentMarkTimeBinding binding;

    private JSONObject gardenConfig;
    boolean batchSameAsDevice;
    boolean disableManualEntry = false;
    boolean imageMandatory = false;
    private JSONArray batches = new JSONArray();
    private String batchId = null;
    private String deviceName = "";

    private HashSet<String> workersWithRecord = new HashSet<>();

    private String currentVersion = "";

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
        try {
            currentVersion = getActivity().getPackageManager().getPackageInfo(getActivity().getPackageName(), 0).versionName;
        } catch (Exception e){}
        if (batchSameAsDevice) {
            batches = dHelper.getAllBatches();
            try {
                for (int loop=0, length = batches.length(); loop<length; loop++) {
                    JSONObject row = batches.getJSONObject(loop);
                    String batchName = row.getString(DatabaseHelper.BATCH_NAME);
                    if (deviceName.equalsIgnoreCase(batchName)) {
                        batchId = row.getString(DatabaseHelper.BATCH_ID);
                    }
                }
            } catch ( Exception e) {}
        }
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
        // imageMandatory = storage.isImageMadatory();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentMarkTimeBinding.inflate(inflater, container, false);
        binding.selectWorker.setOnClickListener(this);
        binding.workerImgCapture.setOnClickListener(this);
        String _title = null;
        try {
            Bundle arg = getArguments();
            if (arg != null) {
                _title =  arg.getString("title");
            }
        } catch (Exception e){}
        if (_title==null) {
            _title = gardenConfig.optString("renameMarkTime", "Mark Time");
            boolean showMarkOut = gardenConfig.optBoolean("showMarkOut", false);
            if (showMarkOut) {
                _title = "Mark In Time";
            }
        }
        ((HomeActivity)getActivity()).setTitle("", _title);
        if (disableManualEntry) {
            binding.workerCodeInputContainer.setVisibility(View.GONE);
            // binding.selectWorker.setEnabled(false);
            // binding.selectWorker.setAlpha(0.5f);
            // binding.selectWorker.setText("");
            binding.selectWorker.setVisibility(View.INVISIBLE);
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
                    MarkTimeFragment.this.mp = null;
                }
            });
            flashScreen(getView());
        } catch (Exception e) {
        }
    }

    public boolean workerIdentified(JSONObject worker, String mode) {
        if ((workerImagePath == null) && imageMandatory) {
            ((HomeActivity)getActivity()).showErrorMessage("Worker Image must be captured.");
            return false;
        }
        binding.workerCodeInput.setText("");
        this.worker = worker;
        String workerId = worker.optString(DatabaseHelper.WORKER_ID);
        String bookId = worker.optString(DatabaseHelper.BOOK_ID);
        String divId = worker.optString(DatabaseHelper.WORKER_DIVISION);
        if (!workersWithRecord.contains(workerId)) {
            workersWithRecord.add(workerId);
            dHelper.insertToAttendanceMaster(workerId, batchId, null, null);
            submitHTTPRequest(workerId, bookId, divId, mode, workerImagePath!=null?""+workerImagePath:null);
            workerImagePath = null;
        }
        notifyRecorded();
        binding.processedWorkerCount.setText("" + workersWithRecord.size());
        return false;
    }

    private void submitHTTPRequest(String workerId, String bookId, String divId, String mode, String workerImagePath) {
        String transactionId = storage.getDeviceId() + UUID.randomUUID().toString() + System.currentTimeMillis();
        workersWithRecord.add(workerId);
        final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getActivity(), Constants.BASE_URL + "app/log-worker-authentication.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
        wrapper.addParam("workerId", workerId);
        wrapper.addParam("companyId", storage.getCompanyId());
        wrapper.addParam("transactionId", transactionId);
        wrapper.addParam("authenticationTime", "" + System.currentTimeMillis());
        wrapper.addParam("recordedTimezoneOffset", (""+(Utility.getTimezoneOffset() * -1)));
        wrapper.addParam("managerId", storage.getUserId());
        wrapper.addParam("deviceId", storage.getDeviceId());
        wrapper.addParam("bookId", bookId);
        wrapper.addParam("divId", divId);
        if (mode != null) {
            wrapper.addParam("manualEntry", "false");
            wrapper.addParam("identificationMode", mode);
        } else {
            wrapper.addParam("manualEntry", "true");
        }
        if (batchId != null) {
            wrapper.addParam("batch", batchId);
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
    public void onClick(View v) {
        if (v == binding.selectWorker) {
            ((HomeActivity)getActivity()).hideKeyboardInFragment();
            String workerCode = binding.workerCodeInput.getText().toString();
            if (workerCode.length() < 2) {
                ((HomeActivity)getActivity()).showErrorMessage("Invalid worker code.");
                return;
            }
            workerCode = workerCode.toUpperCase();
            JSONObject tmp = dHelper.getWorkerDetailsByWorkerCodeOrEmpNo(workerCode);
            if (!tmp.optString(DatabaseHelper.WORKER_ID).equals("")) {
                try{
                    confirmManualSelection(tmp);
                }catch (Exception e){}
            } else {
                ((HomeActivity)getActivity()).showErrorMessage("Invalid worker code.");
            }
            ((HomeActivity)getActivity()).hideKeyboardInFragment();
        } else if (v == binding.workerImgCapture) {
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
                ((HomeActivity)getActivity()).showErrorMessage("Error in capturing Image.");
                e.printStackTrace();
            }
            if (takePictureIntent.resolveActivity(getContext().getPackageManager()) != null) {
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
