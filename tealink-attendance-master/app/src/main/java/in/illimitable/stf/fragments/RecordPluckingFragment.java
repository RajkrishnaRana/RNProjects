package in.illimitable.stf.fragments;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Location;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.LinearInterpolator;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import id.zelory.compressor.Compressor;
import in.illimitable.stf.HomeActivity;
import in.illimitable.stf.R;
import in.illimitable.stf.databinding.FragmentRecordPluckingBinding;
import in.illimitable.stf.util.OnFragmentInteractionListener;
import in.illimitable.util.BluetoothConnection;
import in.illimitable.util.BluetoothScalesConnections;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.ImageUriToFilePath;
import in.illimitable.util.LogUtil;
import in.illimitable.util.Storage;
import in.illimitable.util.Utility;
import in.illimitable.util.WeighingScaleListener;
import in.illimitable.view.SimpleRecyclerViewAdapter;

public class RecordPluckingFragment extends Fragment implements View.OnClickListener, SimpleRecyclerViewAdapter.ItemClickListener, AdapterView.OnItemSelectedListener, WeighingScaleListener {
    // public static final int WORKER_IMAGE = 86;
    private Compressor compressor;
    private static boolean displayDebugInfo = false;
    public JSONObject worker;
    public boolean isIdentifyingView = false;
    long pluckingStartTime = -1;
    long pluckingEndTime = -1;
    boolean isSectionSelected = false;
    boolean connectedToWeighingScale = false;
    String[] possibleWeighments = new String[]{"1st Weighment", "2nd Weighment", "3rd Weighment", "4th Weighment"};
    int weighment = 0;
    int prevWeighment = -1;
    private JSONObject section;
    private JSONObject batch;
    private JSONObject shift;
    private JSONObject kamjari;
    private String sectionCode = "";
    // private String weighingScaleName = null;
    private Vibrator vibrator;
    private MediaPlayer mp;
    private double moisture;
    private double standardDeviation;
    private double tareWeight;
    private double calculatedWeight;
    private double weightInKg;
    private double calculatedWeightSummation;
    private boolean flashOnRecord = false;
    private int flashDuration = 0;
    private Handler flashHandler;
    private boolean modeOneShot = false;
    private boolean imageMandatory = false;
    private String mCurrentPhotoPath;
    private String workerImagePath = null;
    private ArrayAdapter weighmentAdapter;
    private ArrayAdapter sectionAdapter;
    private ArrayAdapter batchAdapter;
    private ArrayAdapter shiftAdapter;
    private ArrayAdapter kamjariAdapter;
    private SimpleRecyclerViewAdapter adapter;
    private LinearLayoutManager linearLayoutManager;

    private String currentVersion = "";
    private DatabaseHelper dHelper;
    private Storage storage;
    private JSONArray sections;
    private String[] sectionArr;
    private JSONArray batches;
    private String[] batchArr;
    private JSONArray shifts;
    private String[] shiftArr;
    private JSONArray kamjaris;
    private String[] kamjariArr;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationRequest locationRequest;
    private double latitude;
    private double longitude;
    private int locationResultCount = 0;
    private boolean requestedLocation = false;
    private long authenticationTime;
    // private String kamjariId;
    private String roundOff;
    private JSONArray pluckingRecords = new JSONArray();
    private HashSet<String> workersWithRecord = new HashSet<>();
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothConnection[] bluetoothDevicesList;
    private BluetoothConnection selectedDevice;
    private FragmentRecordPluckingBinding binding;
    private boolean dryRun = false;
    private final String mockDeviceName = "MOCK SCALE";
    private boolean startMockReading = false;
    public boolean connectingToBluetoothScale = false;
    boolean disableManualEntry = false;
    boolean batchSameAsDevice;
    private String deviceName = "";

    private int _batchIdPos = -1;

    private JSONObject gardenConfig;

    private Handler scaleReadingUpdater;// = new Handler();

    double scaleReading = 0;

    private boolean isDefaultPluckingKamjari = false;
    int kamjariSelectedPos = -1;

    private boolean allowWorkerAssign;

    private LocationCallback locationCallback = new LocationCallback() {
        @Override
        public void onLocationResult(LocationResult locationResult) {
            Location location = locationResult.getLastLocation();
            if (location != null) {
                latitude = location.getLatitude();
                longitude = location.getLongitude();
            }
            locationResultCount++;
            if (locationResultCount > 1) {
                requestedLocation = false;
                mFusedLocationClient.removeLocationUpdates(locationCallback);
            }
        }
    };

    public void gotoRecordingView() {

        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (worker != null) {
                    loadWorkerProfile();
                }
                hideIdentifyingView();
                showRecordingView();
            }
        });
    }

    Runnable scaleReadingRunnable;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        dHelper = DatabaseHelper.getInstance(getContext());
        storage = new Storage(getContext());
        roundOff = storage.getRoundOff();
        modeOneShot = storage.isModeOneShot();
        compressor = ImageUriToFilePath.getCompressor(getActivity());
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        String logFolderName = new Storage(getActivity()).getLogFolderName();
        String basePath = getActivity().getExternalFilesDir(null) + File.separator + logFolderName + File.separator + "transactionImage";
        File baseDir = new File(basePath);
        baseDir.mkdirs();
        compressor.setDestinationDirectoryPath(basePath);
        moisture = storage.getMoistureContent();
        standardDeviation = storage.getStandardDeviation();
        tareWeight = storage.getTareWeight();
        allowWorkerAssign = storage.isWorkerAssignAllowed();
        moisture = Math.round(moisture * 100.0) / 100.0;
        standardDeviation = Math.round(standardDeviation * 100.0) / 100.0;
        tareWeight = Math.round(tareWeight * 100.0) / 100.0;
        authenticationTime = new Date().getTime();
        weighment = Utility.getWeighmentCountBasedOnTime(storage.getLastWeighmentNumber(), storage.getLastWeighmentTime());
        sections = dHelper.getAllSections();
        String[] tmp = Utility.getArrayForKey(sections, DatabaseHelper.SECTION_NAME);
        sectionArr = new String[tmp.length + 1];
        sectionArr[0] = "Select Section";
        for (int loop = 0; loop < tmp.length; loop++) {
            sectionArr[loop + 1] = tmp[loop];
        }
        batches = dHelper.getAllPluckingBatches();
        tmp = Utility.getArrayForKey(batches, DatabaseHelper.BATCH_NAME);
        batchArr = new String[tmp.length + 1];
        batchArr[0] = "Select Batch";
        for (int loop = 0; loop < tmp.length; loop++) {
            batchArr[loop + 1] = tmp[loop];
            if (batchSameAsDevice) {
                String batchName = tmp[loop];
                if (deviceName.equalsIgnoreCase(batchName)) {
                    _batchIdPos = loop + 1;
                }
            }
        }
        shifts = dHelper.getAllPluckingShifts();
        tmp = Utility.getArrayForKey(shifts, DatabaseHelper.SHIFT_CODE);
        shiftArr = new String[tmp.length + 1];
        shiftArr[0] = "Select Shift";
        for (int loop = 0; loop < tmp.length; loop++) {
            shiftArr[loop + 1] = tmp[loop];
        }
        kamjaris = dHelper.getAllPluckingKamjaris();
        if (kamjaris.length() == 1) {
            kamjari = kamjaris.optJSONObject(0);
            isDefaultPluckingKamjari = true;
            kamjariSelectedPos = 1;
        }
        /*tmp = Utility.getArrayForKey(kamjaris, DatabaseHelper.KAMJARI_NAME);
        kamjariArr = new String[tmp.length + 1];
        kamjariArr[0] = "Select Kamjari";
        for (int loop = 0; loop < tmp.length; loop++) {
            kamjariArr[loop + 1] = tmp[loop];
        }*/
        int kamjarisLen = kamjaris.length();
        kamjariArr = new String[kamjarisLen + 1];
        kamjariArr[0] = "Select Kamjari";
        for (int loop = 0; loop < kamjarisLen; loop++) {
            JSONObject localKamjari = kamjaris.optJSONObject(loop);
            kamjariArr[loop +1] = localKamjari.optString(DatabaseHelper.KAMJARI_NAME);
            String isDefault = localKamjari.optString(DatabaseHelper.KAMJARI_IS_DEFAULT, "false");
            if (isDefault.equals("true")) {
                kamjari = localKamjari;
                isDefaultPluckingKamjari = true;
                kamjariSelectedPos = loop + 1;
            }
        }
        if ((kamjari==null) && (kamjaris.length() > 1)) {
            kamjari = kamjaris.optJSONObject(0);
            kamjariSelectedPos = 1;
        }
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getActivity());
        locationRequest = LocationRequest.create();
        locationRequest.setInterval(60 * 1000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        checkForLocationSettings();
        try {
            vibrator = (Vibrator) getActivity().getSystemService(android.content.Context.VIBRATOR_SERVICE);
        } catch (Exception e) {
        }
        flashHandler = new Handler();
        flashOnRecord = storage.flashOnRecord();
        flashDuration = storage.getFlashDuration();
        // imageMandatory = storage.isImageMadatory();
        try {
            currentVersion = getActivity().getPackageManager().getPackageInfo(getActivity().getPackageName(), 0).versionName;
        } catch (Exception e) {
        }
        gardenConfig = storage.getGardenConfig();
        deviceName = storage.getDeviceName();
        batchSameAsDevice = gardenConfig.optBoolean("batchSameAsDevice", false);
        disableManualEntry = gardenConfig.optBoolean("disableManualEntry", false);
        imageMandatory = gardenConfig.optBoolean("imageMandatory", false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            Utility.checkBluetoothPermissions(getActivity());
        }
        scaleReadingUpdater = new Handler(Looper.getMainLooper());
        scaleReadingRunnable = new Runnable() {
            @Override
            public void run() {
                binding.weightedQuantity.setText(String.format("%.2f KG", scaleReading));
            }
        };
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentRecordPluckingBinding.inflate(inflater, container, false);
        if (modeOneShot) {
            binding.identifyWorker.setText("Manual Entry");
        }
        if (weighmentAdapter == null) {
            weighmentAdapter = new ArrayAdapter(getContext(), R.layout.spinner_item, possibleWeighments);
        }
        linearLayoutManager = new LinearLayoutManager(getActivity());
        binding.deviceList.setLayoutManager(linearLayoutManager);
        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(binding.deviceList.getContext(), linearLayoutManager.getOrientation());
        binding.deviceList.addItemDecoration(dividerItemDecoration);
        binding.deviceList.setVisibility(View.GONE);
        binding.weighment.setAdapter(weighmentAdapter);
        binding.weighment.setSelection(weighment - 1);
        binding.weighment.setOnItemSelectedListener(this);

        if (sectionAdapter == null) {
            sectionAdapter = new ArrayAdapter(getContext(), R.layout.spinner_item, sectionArr);
        }
        binding.sectionSpinner.setAdapter(sectionAdapter);
        binding.sectionSpinner.setOnItemSelectedListener(this);

        if (batchAdapter == null) {
            batchAdapter = new ArrayAdapter(getContext(), R.layout.spinner_item, batchArr);
        }
        binding.batchSpinner.setAdapter(batchAdapter);
        binding.batchSpinner.setOnItemSelectedListener(this);

        if (shiftAdapter == null) {
            shiftAdapter = new ArrayAdapter(getContext(), R.layout.spinner_item, shiftArr);
        }
        binding.shiftSpinner.setAdapter(shiftAdapter);
        binding.shiftSpinner.setOnItemSelectedListener(this);

        if (kamjaris.length() > 1) {
            if (kamjariAdapter == null) {
                kamjariAdapter = new ArrayAdapter(getContext(), R.layout.spinner_item, kamjariArr);
            }
            binding.kamjariSpinner.setAdapter(kamjariAdapter);
            if (kamjariSelectedPos>0) {
                binding.kamjariSpinner.setSelection(kamjariSelectedPos);
            }
            binding.kamjariSpinner.setOnItemSelectedListener(this);
        }

        showSectionView();
        hideWeighingScaleView();
        hideRecordingView();
        hideIdentifyingView();
        binding.selectSection.setOnClickListener(this);
        binding.connectDisconnectScale.setOnClickListener(this);
        binding.identifyWorker.setOnClickListener(this);
        binding.workerImgCapture.setOnClickListener(this);
        binding.selectWorker.setOnClickListener(this);
        binding.deviceNameInput.setText(storage.getWeighingScaleName());
        if (batchSameAsDevice && (_batchIdPos > 0)) {
            binding.batchSpinner.setSelection(_batchIdPos);
        }
        return binding.getRoot();
    }

    private void showSectionView() {
        binding.weighment.setVisibility(View.VISIBLE);
        binding.sectionSpinner.setVisibility(View.VISIBLE);
        binding.batchSpinner.setVisibility(View.VISIBLE);
        binding.shiftSpinner.setVisibility(View.VISIBLE);
        if (kamjaris.length() > 1) {
            if (allowWorkerAssign) {
                binding.kamjariSpinner.setVisibility(View.VISIBLE);
            } else {
                binding.kamjariSpinner.setVisibility(View.GONE);
            }
        } else {
            binding.kamjariSpinner.setVisibility(View.GONE);
        }
        binding.selectSection.setVisibility(View.VISIBLE);
    }

    private void hideSectionView() {
        binding.weighment.setVisibility(View.GONE);
        binding.sectionSpinner.setVisibility(View.GONE);
        binding.batchSpinner.setVisibility(View.GONE);
        binding.shiftSpinner.setVisibility(View.GONE);
        binding.kamjariSpinner.setVisibility(View.GONE);
        binding.selectSection.setVisibility(View.GONE);
    }

    private void showWeighingScaleView() {
        binding.connectDisconnectScale.setVisibility(View.VISIBLE);
    }

    private void hideWeighingScaleView() {
        binding.deviceNameInputContainer.setVisibility(View.GONE);
        binding.deviceNameInput.setVisibility(View.GONE);
        binding.connectDisconnectScale.setVisibility(View.GONE);
    }

    private void showRecordingView() {
        binding.workerImage.setVisibility(View.VISIBLE);
        binding.workerName.setVisibility(View.VISIBLE);
        binding.workerCode.setVisibility(View.VISIBLE);
        binding.weightedQuantity.setVisibility(View.VISIBLE);
        binding.identifyWorker.setVisibility(View.VISIBLE);
        binding.workerImgCapture.setVisibility(View.VISIBLE);
        binding.totalWeighment.setVisibility(View.VISIBLE);
        binding.totalWeighmentBreakup.setVisibility(View.VISIBLE);
        if (workersWithRecord.size() > 0) {
            binding.processedWorkerCount.setText("" + workersWithRecord.size());
            binding.processedWorkerCount.setVisibility(View.VISIBLE);
            binding.processedWorkerText.setVisibility(View.VISIBLE);
            // animateCount();
        }
        if (disableManualEntry) {
            if (modeOneShot) {
                binding.identifyWorker.setVisibility(View.GONE);
            } else {
                binding.workerCodeInputContainer.setVisibility(View.GONE);
                binding.selectWorker.setVisibility(View.GONE);
            }
        }
        try {
            binding.workerName.setText(worker.getString(DatabaseHelper.WORKER_NAME));
            binding.workerCode.setText(worker.optString(DatabaseHelper.WORKER_BOOK_EMP_NUMBER, ""));
            binding.totalWeighment.setText("" + Utility.companyRoundOff(roundOff, calculatedWeight) + " of " + worker.optString("PLUCKED_QUANTITY"));
            binding.totalWeighmentBreakup.setText(worker.optString("PLUCKED_QUANTITY_BREAKUP", ""));
            final String workerImage = worker.optString(DatabaseHelper.WORKER_IMAGE_PATH, null);
            if (workerImage != null && workerImage.length() > 0) {
                new Thread() {
                    @Override
                    public void run() {
                        final Bitmap bitmapImage = ImageUriToFilePath.getDrawable(200, 200, workerImage);
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (bitmapImage != null) {
                                    binding.workerImage.setImageBitmap(bitmapImage);
                                }
                            }
                        });
                    }
                }.start();
            }
        } catch (Exception e) {
        }
    }

    private void hideRecordingView() {
        binding.processedWorkerCount.setVisibility(View.GONE);
        binding.processedWorkerText.setVisibility(View.GONE);
        binding.workerImage.setVisibility(View.GONE);
        binding.workerName.setVisibility(View.GONE);
        binding.workerCode.setVisibility(View.GONE);
        binding.totalWeighment.setVisibility(View.GONE);
        binding.totalWeighmentBreakup.setVisibility(View.GONE);
        binding.weightedQuantity.setVisibility(View.GONE);
        binding.identifyWorker.setVisibility(View.GONE);
        binding.workerImgCapture.setVisibility(View.GONE);
    }

    private void showIdentifyingView() {
        worker = null;
        binding.workerCodeInputContainer.setVisibility(View.VISIBLE);
        binding.selectWorker.setVisibility(View.VISIBLE);
        binding.workerCodeInput.setVisibility(View.VISIBLE);
        binding.nfcCardImage.setVisibility(View.VISIBLE);
        binding.selectedScaleValue.setVisibility(View.VISIBLE);
        binding.selectedScaleValue.setText(weightInKg + " KG");
        if (disableManualEntry) {
            if (modeOneShot) {
                binding.identifyWorker.setVisibility(View.GONE);
            } else {
                binding.workerCodeInputContainer.setVisibility(View.GONE);
                binding.selectWorker.setVisibility(View.GONE);
            }
        }
        isIdentifyingView = true;
    }

    private void hideIdentifyingView() {
        isIdentifyingView = false;
        binding.workerCodeInputContainer.setVisibility(View.GONE);
        binding.selectWorker.setVisibility(View.GONE);
        binding.workerCodeInput.setVisibility(View.GONE);
        binding.selectedScaleValue.setVisibility(View.GONE);
        binding.nfcCardImage.setVisibility(View.GONE);
    }

    @Override
    public void onDetach() {
        try {
            startMockReading = false;
            StringBuilder logInfo = new StringBuilder();
            if ((selectedDevice != null) && (selectedDevice.doDebug)) {
                logInfo.append("selectedDevice exists\n");
                ByteArrayOutputStream debugStream = selectedDevice.getDebugStream();
                if (debugStream != null) {
                    logInfo.append("debug stream exists\n");
                    byte[] debugData = debugStream.toByteArray();
                    if (debugData.length > 0) {
                        LogUtil.writeLog(getActivity(), new String(debugData), storage);
                        logInfo.append("log should be generated\n");
                    } else {
                        logInfo.append("debug data does not exists\n");
                    }
                } else {
                    logInfo.append("debug stream does not exists\n");
                }
            } else {
                logInfo.append("selectedDevice does not exists\n");
            }
            if (displayDebugInfo) {
                ((HomeActivity)getActivity()).showInfoMessage(logInfo.toString());
            }
        } catch (Exception e1) {
            e1.printStackTrace();
        }

        super.onDetach();
        _disconnectScale();
        if (pluckingRecords.length() > 0) {
            try {
                if (isDefaultPluckingKamjari) {
                    dHelper.insertPluckingRecordingStat(pluckingRecords.length(), (pluckingEndTime - pluckingStartTime));
                }

            } catch (Exception e) {
            }
            final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getActivity(), Constants.BASE_URL + "app/log-plucking-location.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
            JSONObject requestBody = new JSONObject();
            try {
                requestBody.put("companyId", storage.getCompanyId());
                requestBody.put("latitude", latitude);
                requestBody.put("longitude", longitude);
                requestBody.put("recordTime", System.currentTimeMillis());
                requestBody.put("managerId", storage.getUserId());
                requestBody.put("weighment", weighment);
                requestBody.put("transactions", pluckingRecords);
                requestBody.put("workers", Utility.hashSetToArray(workersWithRecord));
                requestBody.put("calculatedWeightSummation", calculatedWeightSummation);
                requestBody.put("appVersionName", currentVersion);
                requestBody.put("recordedTimezoneOffset", ("" + (Utility.getTimezoneOffset() * -1)));
            } catch (Exception e) {
            }
            wrapper.setBodyJSON(requestBody);
            wrapper.setOfflineSupported(true);
            new Thread() {
                @Override
                public void run() {
                    wrapper.execute();
                }
            }.start();
        }
        if (requestedLocation && mFusedLocationClient != null) {
            requestedLocation = false;
            mFusedLocationClient.removeLocationUpdates(locationCallback);
        }
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
                    RecordPluckingFragment.this.mp = null;
                }
            });
            flashScreen(getView());
        } catch (Exception e) {
        }
    }

    private void loadWorkerProfile() {
        binding.workerName.setText(worker.optString(DatabaseHelper.WORKER_NAME));
        binding.workerCode.setText(worker.optString(DatabaseHelper.WORKER_BOOK_EMP_NUMBER, ""));
        final String workerImage = worker.optString(DatabaseHelper.WORKER_IMAGE_PATH, null);
        if (workerImage != null && workerImage.length() > 0) {
            new Thread() {
                @Override
                public void run() {
                    final Bitmap bitmapImage = ImageUriToFilePath.getDrawable(200, 200, workerImage);
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (bitmapImage != null) {
                                binding.workerImage.setImageBitmap(bitmapImage);
                            }
                            ((HomeActivity) getActivity()).hideProgressLoader();
                        }
                    });
                }
            }.start();
        } else {
            binding.workerImage.setImageResource(R.drawable.person_placeholder);
        }
    }

    private void resetWorkerProfile() {
        binding.workerName.setText("");
        binding.workerCode.setText("");
        binding.workerImage.setImageResource(R.drawable.person_placeholder);
    }

    @Override
    public void onClick(View view) {
        if (view == binding.selectSection) {
            if (kamjari == null) {
                ((HomeActivity) getActivity()).showErrorMessage("Plucking Kamjari must be selected.");
                return;
            }
            isSectionSelected = true;
            hideSectionView();
            showWeighingScaleView();
            binding.connectDisconnectScale.callOnClick();
        } else if (view == binding.connectDisconnectScale) {
            if (connectedToWeighingScale) {
                _disconnectScale();
            } else {
                ((HomeActivity) getActivity()).hideKeyboardInFragment();
                if (bluetoothAdapter == null) {
                    ((HomeActivity) getActivity()).showErrorMessage("Device does not have bluetooth connectivity");
                    return;
                }
                if (!bluetoothAdapter.isEnabled()) {
                    ((HomeActivity) getActivity()).showInfoMessage("Please enable bluetooth.");
                    return;
                }
                if (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    ((HomeActivity) getActivity()).showInfoMessage("Please enable Location.");
                    return;
                }
                locationResultCount = 0;
                requestedLocation = true;
                mFusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.myLooper());
                binding.connectDisconnectScale.setEnabled(false);
                _connectScale();
            }
        } else if (view == binding.identifyWorker) {
            calculateWeight();
            if (calculatedWeight < 0.05) {
                ((HomeActivity) getActivity()).showErrorMessage("Invalid plucked quantity.");
                return;
            }
            worker = null;
            resetWorkerProfile();
            hideRecordingView();
            ((HomeActivity) getActivity()).hideKeyboardInFragment();
            showIdentifyingView();
        } else if (view == binding.workerImgCapture) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            // if (takePictureIntent.resolveActivity(getContext().getPackageManager()) != null) {
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
            // }
        } else if (view == binding.selectWorker) {
            ((HomeActivity) getActivity()).hideKeyboardInFragment();
            String workerCode = binding.workerCodeInput.getText().toString();
            if (workerCode.length() < 2) {
                ((HomeActivity) getActivity()).showErrorMessage("Invalid worker code.");
                return;
            }
            workerCode = workerCode.toUpperCase();
            JSONObject tmp = dHelper.getWorkerDetailsByWorkerCodeOrEmpNo(workerCode);
            if (!tmp.optString(DatabaseHelper.WORKER_ID).equals("")) {
                try {
                    confirmManualSelection(tmp);
                } catch (Exception e) {
                }
            } else {
                ((HomeActivity) getActivity()).showErrorMessage("Invalid worker code.");
            }
            ((HomeActivity) getActivity()).hideKeyboardInFragment();
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == OnFragmentInteractionListener.REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {
            new Thread() {
                @Override
                public void run() {
                    try {
                        if (mCurrentPhotoPath == null) {
                            return;
                        }
                        File originalImage = new File(mCurrentPhotoPath);
                        File compressed = compressor.compressToFile(originalImage);
                        workerImagePath = compressed.getAbsolutePath();
                        originalImage.delete();
                        mCurrentPhotoPath = null;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }.start();
        }
    }

    private void _connectScale() {
        binding.deviceList.setVisibility(View.GONE);
        bluetoothDevicesList = (new BluetoothScalesConnections()).getList();

        if ((bluetoothDevicesList == null) || (bluetoothDevicesList.length == 0)) {
            if (!dryRun) {
                ((HomeActivity) getActivity()).showErrorMessage("No paired bluetooth device found.");
                return;
            }
        }
        List<String> deviceNames = new ArrayList<String>();
        int i = 0;
        if (bluetoothDevicesList != null) {
            if ((Build.VERSION.SDK_INT < Build.VERSION_CODES.S) || (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED)) {
                for (BluetoothConnection device : bluetoothDevicesList) {
                    deviceNames.add(device.getDevice().getName());
                }
            } else {
                ((HomeActivity) getActivity()).showErrorMessage("'Connect Nearby Devices' permission is not available.");
                return;
            }
        }
        if (dryRun) {
            deviceNames.add(mockDeviceName);
        }
        adapter = new SimpleRecyclerViewAdapter(getActivity(), deviceNames);
        adapter.setClickListener(RecordPluckingFragment.this);
        binding.deviceList.setAdapter(adapter);
        binding.deviceList.setVisibility(View.VISIBLE);
    }

    private void _disconnectScale() {
        startMockReading = false;
        try {
            if (selectedDevice != null) {
                selectedDevice.disconnect();
            }
        } catch (Exception e){}
        scaleReading = 0;
    }

    private void animateCount() {
        Animation a = AnimationUtils.loadAnimation(getActivity(), R.anim.highlight);
        a.setRepeatMode(Animation.REVERSE);
        a.setRepeatCount(-1);
        binding.processedWorkerCount.clearAnimation();
        binding.processedWorkerCount.startAnimation(a);
    }

    public boolean workerIdentified(JSONObject worker, String mode) {
        if ((workerImagePath == null) && imageMandatory) {
            ((HomeActivity)getActivity()).showErrorMessage("Worker Image must be captured.");
            return false;
        }
        if (pluckingStartTime==-1) {
            pluckingStartTime = System.currentTimeMillis();
        }
        pluckingEndTime = System.currentTimeMillis();
        if (modeOneShot && (mode != null)) {
            calculateWeight();
        }
        if (isIdentifyingView || modeOneShot) {
            double finalWeight = Utility.companyRoundOff(roundOff, calculatedWeight);
            if (finalWeight <= 0) {
                ((HomeActivity)getActivity()).showErrorMessage("Invalid plucked quantity.");
                return false;
            }
            binding.workerCodeInput.setText("");
            this.worker = worker;
            String workerId = worker.optString(DatabaseHelper.WORKER_ID);
            String bookId = worker.optString(DatabaseHelper.BOOK_ID);
            // String divId = worker.optString(DatabaseHelper.WORKER_DIVISION);
            //dHelper.insertToAttendanceMaster(workerId);
            if (isDefaultPluckingKamjari) {
                dHelper.insertToPluckedQuantityMaster(workerId, finalWeight, "" + weighment, "" + sectionCode);
            }
            // dHelper.insertToPluckedQuantityMaster(workerId, weightInKg, "" + weighment, "" + sectionCode);
            if (prevWeighment != weighment) {
                storage.setLastWeighmentNumber(weighment);
            }
            try{
                // LogUtil.writeLog("weighmentLog", workerId+","+finalWeight+","+weighment+","+System.currentTimeMillis(), storage);
            } catch (Exception e){}
            this.worker = dHelper.getWorkerDetails(workerId);
            submitHTTPRequest(workerId, bookId, mode, workerImagePath!=null?""+workerImagePath:null);
            workerImagePath = null;
            notifyRecorded();
            gotoRecordingView();
        }
        return false;
    }

    private void submitHTTPRequest(String workerId, String bookId, String mode, String workerImagePath) {
        String transactionId = storage.getDeviceId() + UUID.randomUUID().toString() + System.currentTimeMillis();
        pluckingRecords.put(transactionId);
        workersWithRecord.add(workerId);
        calculatedWeightSummation += calculatedWeight;
        final HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getActivity(), Constants.BASE_URL + "app/log-worker-plucking.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
        wrapper.addParam("workerId", workerId);
        wrapper.addParam("companyId", storage.getCompanyId());
        wrapper.addParam("deviceId", storage.getDeviceId());
        wrapper.addParam("transactionId", transactionId);
        wrapper.addParam("recordTime", "" + System.currentTimeMillis());
        wrapper.addParam("authenticationTime", "" + authenticationTime);
        wrapper.addParam("pluckingQuantity", "" + calculatedWeight);
        wrapper.addParam("qtyCalculated", ""+Utility.companyRoundOff(roundOff, calculatedWeight));
        wrapper.addParam("bookId", bookId);
        wrapper.addParam("originalPluckingQuantity", "" + weightInKg);
        wrapper.addParam("moisturePercentage", "" + moisture);
        wrapper.addParam("standardDeviation", "" + standardDeviation);
        wrapper.addParam("tareWeight", "" + tareWeight);
        wrapper.addParam("v", "2");
        wrapper.addParam("recordedTimezoneOffset", (""+(Utility.getTimezoneOffset() * -1)));
        if (section != null) {
            wrapper.addParam("sectionId", section.optString(DatabaseHelper.SECTION_ID));
        }
        wrapper.addParam("kamjariId", kamjari.optString(DatabaseHelper.KAMJARI_ID));
        if (batch != null) {
            wrapper.addParam("div", batch.optString(DatabaseHelper.DIV_ID));
            wrapper.addParam("batch", batch.optString(DatabaseHelper.BATCH_ID));
            if(shift==null) {
                wrapper.addParam("shift", batch.optString(DatabaseHelper.SHIFT_ID));
            }
        }
        if(shift != null) {
            wrapper.addParam("shift", shift.optString(DatabaseHelper.SHIFT_ID));
        }
        wrapper.addParam("managerId", storage.getUserId());
        wrapper.addParam("weighment", "" + weighment);
        if (mode != null) {
            wrapper.addParam("manualEntry", "false");
            wrapper.addParam("identificationMode", mode);
        } else {
            wrapper.addParam("manualEntry", "true");
        }
        if (workerImagePath != null) {
            wrapper.addParam("hasImage", "true");
            wrapper.setFile(workerImagePath, "workerImage");
            wrapper.setDeleteFile(true);
        }
        wrapper.addParam("appVersionName", currentVersion);
        wrapper.setOfflineSupported(true);
        dHelper.insertRequest(wrapper);

        // new Thread() {
        //    @Override
        //    public void run() {
        //        wrapper.execute();
        //    }
        // }.start();
    }

    @Override
    public void onItemClick(View view, int position) {
        if (dryRun) {
            selectedDevice = null;
            startMockReading = true;
            new Thread(mockScaleReadingRunnable).start();
            onScaleConnected();
            return;
        }
        connectingToBluetoothScale = true;
        selectedDevice = bluetoothDevicesList[position];
        // System.out.println("##########################################");
        // System.out.println(selectedDevice.getDevice().getAddress());
        // System.out.println("##########################################");
        selectedDevice.setScaleListener(this);
        ((HomeActivity)getActivity()).showProgressLoader("Connecting..");
        new Thread(){
            @Override
            public void run() {
                try {
                    selectedDevice.connect();
                } catch (Exception e) {
                    connectingToBluetoothScale = false;
                    e.printStackTrace();
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            ((HomeActivity)getActivity()).showErrorMessageLong("Failed to connect to scale, ensure that the device is close-by and charged properly.");
                            ((HomeActivity)getActivity()).hideProgressLoader();
                        }
                    });
                }
            }
        }.start();
    }

    public void checkForLocationSettings() {
        try {
            LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder().addLocationRequest(locationRequest);
            builder.addLocationRequest(locationRequest);
            SettingsClient settingsClient = LocationServices.getSettingsClient(getActivity());

            settingsClient.checkLocationSettings(builder.build())
                    .addOnSuccessListener(getActivity(), new OnSuccessListener<LocationSettingsResponse>() {
                        @Override
                        public void onSuccess(LocationSettingsResponse locationSettingsResponse) {
                            //Setting is success...
                        }
                    })
                    .addOnFailureListener(getActivity(), new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {


                            int statusCode = ((ApiException) e).getStatusCode();
                            switch (statusCode) {
                                case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:

                                    try {
                                        // Show the dialog by calling startResolutionForResult(), and check the
                                        // result in onActivityResult().
                                        ResolvableApiException rae = (ResolvableApiException) e;
                                        rae.startResolutionForResult(getActivity(), HomeActivity.REQUEST_PERMISSIONS_LOCATION_SETTINGS_REQUEST_CODE);
                                    } catch (IntentSender.SendIntentException sie) {
                                    }
                                    break;
                                case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                                    ((HomeActivity)getActivity()).showInfoMessage("Location settings is not available.Try in another device.");
                            }

                        }
                    });

        } catch (Exception ex) {
        }
    }

    private void calculateWeight() {
        try {
            // String weight = _weightedQuantity.getText().toString();
            // weight = weight.trim();
            // weight = weight.substring(0, (weight.length() - 2));
            // weightInKg = Double.parseDouble(weight);
            weightInKg = scaleReading;
            // calculatedWeight = (weightInKg - tareWeight) - (((moisture + standardDeviation) / 100) * (weightInKg - tareWeight));
            calculatedWeight = (weightInKg - tareWeight) - (((standardDeviation) / 100) * (weightInKg - tareWeight));
            calculatedWeight = Math.round(calculatedWeight * 100.0) / 100.0;
        } catch (Exception e) {
        }
    }

    private void confirmManualSelection(final JSONObject worker) throws Exception {
        final AlertDialog.Builder builder =
                new AlertDialog.Builder(getActivity(), R.style.AppCompatAlertDialogStyle);
        builder.setTitle("Entry for " + worker.getString(DatabaseHelper.WORKER_NAME));
        builder.setMessage("Are you sure you want to log data for " + worker.getString(DatabaseHelper.WORKER_NAME) + " ?");
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

    private void flashScreen(final View view) {
        if (!flashOnRecord) {
            return;
        }
        Animation animation = new AlphaAnimation(1, 0);
        animation.setDuration(500);
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

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        try{
            if(parent==binding.weighment) {
                weighment = position + 1;
            } else if(parent==binding.sectionSpinner) {
                if (position > 0) {
                    section = sections.getJSONObject(position - 1);
                    sectionCode = section.optString(DatabaseHelper.SECTION_CODE, "");
                    isSectionSelected = true;
                } else {
                    section = null;
                    sectionCode = "";
                    isSectionSelected = false;
                }
            } else if(parent==binding.batchSpinner) {
                if (position > 0) {
                    batch = batches.getJSONObject(position - 1);
                } else {
                    batch = null;
                }
            } else if(parent==binding.shiftSpinner) {
                if (position > 0) {
                    shift = shifts.getJSONObject(position - 1);
                } else {
                    shift = null;
                }
            } else if(parent==binding.kamjariSpinner) {
                if (position > 0) {
                    kamjari = kamjaris.getJSONObject(position - 1);
                    String isDefault = kamjari.optString(DatabaseHelper.KAMJARI_IS_DEFAULT, "false");
                    if (isDefault.equals("true")) {
                        isDefaultPluckingKamjari = true;
                    }
                } else {
                    kamjari = null;
                }
            }
        } catch (Exception e){

        }
    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    @Override
    public void onScaleConnected() {
        connectingToBluetoothScale = false;
        connectedToWeighingScale = true;
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ((HomeActivity)getActivity()).hideProgressLoader();
                binding.deviceList.setVisibility(View.GONE);
                hideWeighingScaleView();
                showRecordingView();
            }
        });
    }

    @Override
    public void onScaleDisconnected() {
        if ((selectedDevice != null) && (selectedDevice.doDebug)) {
            ByteArrayOutputStream debugStream = selectedDevice.getDebugStream();
            if (debugStream != null) {
                byte[] debugData = debugStream.toByteArray();
                if (debugData.length > 0) {
                    LogUtil.writeLog(getActivity(), new String(debugData), storage);
                }
            }
        }
        connectingToBluetoothScale = false;
        connectedToWeighingScale = false;
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                binding.weightedQuantity.setVisibility(View.GONE);
                binding.deviceList.setVisibility(View.GONE);
                showSectionView();
                hideWeighingScaleView();
                hideRecordingView();
                hideIdentifyingView();
            }
        });
    }

    @Override
    public void onReadScale(double kg) {
        /*if (kg>100) {
            kg = 0;
        }*/
        scaleReading = kg;
        scaleReadingUpdater.post(scaleReadingRunnable);
        // binding.weightedQuantity.setText(String.format("%.2f KG", kg));
        // lastUpdate = System.currentTimeMillis();
    }

    private Runnable mockScaleReadingRunnable = new Runnable() {
        @Override
        public void run() {
            try {
                while (startMockReading) {
                    double qty = Math.random() * 20;
                    qty = qty * 100;
                    qty = Math.round(qty);
                    qty = qty /100;
                    if (qty<1) {
                        qty += 1;
                    }
                    onReadScale(qty);
                    Thread.sleep(500);
                }
            } catch (Exception e) {}
        }
    };
}
