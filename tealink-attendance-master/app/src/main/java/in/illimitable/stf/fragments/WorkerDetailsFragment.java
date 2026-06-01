package in.illimitable.stf.fragments;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;

import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

import id.zelory.compressor.Compressor;
import in.illimitable.stf.HomeActivity;
import in.illimitable.stf.R;
import in.illimitable.stf.databinding.FragmentWorkerDetailsBinding;
import in.illimitable.stf.util.OnFragmentInteractionListener;
import in.illimitable.util.Constants;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.HTTPRequestWrapper;
import in.illimitable.util.ImageUriToFilePath;
import in.illimitable.util.ParcelableJsonObject;
import in.illimitable.util.Storage;

public class WorkerDetailsFragment extends Fragment implements View.OnClickListener{

    public JSONObject worker;
    private Compressor compressor;

    public static final int WORKER_IMAGE = 9;

    private DatabaseHelper dHelper;
    private Storage storage;

    private String mCurrentPhotoPath;

    public static JSONObject updatedWorker;

    private FragmentWorkerDetailsBinding binding;
    private boolean allowWorkerUpdate;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        storage = new Storage(getActivity());
        dHelper = DatabaseHelper.getInstance(getContext());
        compressor = ImageUriToFilePath.getCompressor(getActivity());
        allowWorkerUpdate = storage.isWorkerUpdateAllowed();
        String logFolderName = new Storage(getActivity()).getLogFolderName();
        String basePath = getActivity().getExternalFilesDir(null)+ File.separator + logFolderName  + File.separator + "profileImage";
        File baseDir = new File(basePath);
        baseDir.mkdirs();
        compressor.setDestinationDirectoryPath(basePath);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWorkerDetailsBinding.inflate(inflater, container, false);
        if (updatedWorker != null) {
            worker = updatedWorker;
            updatedWorker = null;
        } else {
            worker = ((ParcelableJsonObject)getArguments().getParcelable("workerData")).getJson();
        }
        binding.workerType.setVisibility(View.VISIBLE);
        binding.workerSubtype.setVisibility(View.VISIBLE);
        setWorkerData(true);
        binding.workerImage.setOnClickListener(this);
        return binding.getRoot();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == OnFragmentInteractionListener.REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {

            ((HomeActivity)getActivity()).showProgressLoader("Loading..");
            new Thread() {
                @Override
                public void run() {
                    try {
                        File originalImage = new File(mCurrentPhotoPath);
                        File compressed = compressor.compressToFile(originalImage);
                        mCurrentPhotoPath = compressed.getAbsolutePath();
                        final Bitmap bitmapImage = ImageUriToFilePath.getDrawable(200, 200, mCurrentPhotoPath);
                        originalImage.delete();
                        if (bitmapImage != null) {
                            dHelper.updateWorkerImage(worker.optString(DatabaseHelper.WORKER_ID), mCurrentPhotoPath);
                            uploadWorkerProfileImage(mCurrentPhotoPath + "");
                        }
                        mCurrentPhotoPath = null;
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                if (bitmapImage != null) {
                                    binding.workerImage.setImageBitmap(bitmapImage);
                                }
                                ((HomeActivity)getActivity()).hideProgressLoader();
                            }
                        });
                    } catch (Exception e) {
                        e.printStackTrace();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                ((HomeActivity)getActivity()).hideProgressLoader();
                            }
                        });
                    }

                }
            }.start();
        }
    }

    /*public void onReceivedResult(int requestCode, int resultCode, final int requester, Intent data) {
        if (WORKER_IMAGE == requester) {
            if (requestCode == OnFragmentInteractionListener.REQUEST_TAKE_PHOTO && resultCode == Activity.RESULT_OK) {

                ((HomeActivity)getActivity()).updateLoader(true);
                new Thread() {
                    @Override
                    public void run() {
                        try {
                            File originalImage = new File(mCurrentPhotoPath);
                            File compressed = compressor.compressToFile(originalImage);
                            mCurrentPhotoPath = compressed.getAbsolutePath();
                            final Bitmap bitmapImage = ImageUriToFilePath.getDrawable(200, 200, mCurrentPhotoPath);
                            originalImage.delete();
                            if (bitmapImage != null) {
                                dHelper.updateWorkerImage(worker.optString(DatabaseHelper.WORKER_ID), mCurrentPhotoPath);
                                uploadWorkerProfileImage(mCurrentPhotoPath + "");
                            }
                            mCurrentPhotoPath = null;
                            getActivity().runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    if (bitmapImage != null) {
                                        _workerImage.setImageBitmap(bitmapImage);
                                    }
                                    ((HomeActivity)getActivity()).updateLoader(false);
                                }
                            });
                        } catch (Exception e) {
                            e.printStackTrace();
                            getActivity().runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    ((HomeActivity)getActivity()).updateLoader(false);
                                }
                            });
                        }

                    }
                }.start();
            }
        }
    }*/

    private void uploadWorkerProfileImage(final String profileImagePath) {
        new Thread() {
            @Override
            public void run() {
                try {
                    HTTPRequestWrapper wrapper = new HTTPRequestWrapper(getActivity(), Constants.BASE_URL + "app/upload-image.json", HTTPRequestWrapper.HTTP_POST_REQUEST);
                    wrapper.addParam("workerId", worker.getString(DatabaseHelper.WORKER_ID));
                    wrapper.setFile(profileImagePath, "profile.jpg");
                    wrapper.setOfflineSupported(true);
                    wrapper.execute();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    @Override
    public void onClick(View view) {
        if (view == binding.workerImage) {
            if (allowWorkerUpdate) {
                final AlertDialog.Builder builder = new AlertDialog.Builder(getContext(), R.style.AppCompatAlertDialogStyle);
                builder.setTitle("Info");
                builder.setMessage("Do you want to update worker image?");
                builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
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
                            dialogInterface.dismiss();
                        }
                        // }
                    }
                });
                builder.setNegativeButton("No", null);
                builder.show();
            } else {
                ((HomeActivity)getActivity()).showErrorMessage("You do not have access to update worker image");
            }
        }
    }

    final Runnable viewUpdator = new Runnable() {
        @Override
        public void run() {
            setWorkerData(false);
        }
    };

    public void setWorkerData(boolean isFullSetup) {
        try {
            binding.workerName.setText(worker.getString(DatabaseHelper.WORKER_NAME));
            binding.workerEmpNo.setText(worker.getString(DatabaseHelper.WORKER_BOOK_EMP_NUMBER));
            binding.workerCode.setText("Code - " + worker.getString(DatabaseHelper.WORKER_CODE));
            binding.workerWeighments.setText(worker.optString("PLUCKED_QUANTITY_BREAKUP", ""));
            binding.workerBook.setText(worker.getString(DatabaseHelper.WORKER_BOOK_NAME));
            binding.workerType.setText(worker.getString(DatabaseHelper.WORKER_TYPE_NAME));
            binding.workerSubtype.setText(worker.getString(DatabaseHelper.WORKER_SUBTYPE_NAME));

        } catch (Exception e) {
            e.printStackTrace();
        }
        if (!isFullSetup) {
            return;
        }
        final String workerImage = worker.optString(DatabaseHelper.WORKER_IMAGE_PATH, null);
        if (workerImage != null && workerImage.length() > 0) {
            new Thread() {
                @Override
                public void run() {
                    final Bitmap bitmapImage = ImageUriToFilePath.getDrawable(200, 200, workerImage);
                    mCurrentPhotoPath = null;
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (bitmapImage != null) {
                                binding.workerImage.setImageBitmap(bitmapImage);
                            }
                            ((HomeActivity)getActivity()).hideProgressLoader();
                        }
                    });
                }
            }.start();
        }
    }
}
