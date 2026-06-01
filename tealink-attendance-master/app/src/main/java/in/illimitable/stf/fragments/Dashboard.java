package in.illimitable.stf.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;

import org.json.JSONObject;

import in.illimitable.stf.HomeActivity;
import in.illimitable.stf.R;
import in.illimitable.stf.databinding.FragmentDashboardBinding;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.Storage;

public class Dashboard extends Fragment implements View.OnClickListener, CompoundButton.OnCheckedChangeListener{
    private NavController navController;
    private DatabaseHelper dHelper;

    private FragmentDashboardBinding binding;
    private JSONObject gardenConfig;
    private Storage storage;

    private String currentView=null;
    private static final String VIEW_ATTENDANCE = "ATTENDANCE";
    private static final String VIEW_PLUCKING = "PLUCKING";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        storage = new Storage(getActivity());
        gardenConfig = storage.getGardenConfig();
        dHelper = DatabaseHelper.getInstance(getActivity());
        currentView = VIEW_ATTENDANCE;
        navController = NavHostFragment.findNavController(this);
    }

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        setData();
        binding.viewWorkers.setOnClickListener(this);
        binding.markTime.setOnClickListener(this);
        binding.printRecords.setOnClickListener(this);
        binding.pluckingDetails.setOnClickListener(this);
        binding.nonpluckingDetails.setOnClickListener(this);
        binding.syncRecords.setOnClickListener(this);
        binding.toggleView.setOnCheckedChangeListener(this);
        binding.markOutTime.setOnClickListener(this);
        String renameMarkTime = gardenConfig.optString("renameMarkTime", "Mark Time");
        boolean showMarkOut = gardenConfig.optBoolean("showMarkOut", false);
        if (showMarkOut) {
            renameMarkTime = "Mark In Time";
        } else{
            binding.markOutTime.setVisibility(View.GONE);
        }
        binding.markTime.setText(renameMarkTime);
        updateLastSyncTime();
        return root;
    }

    public void updateLastSyncTime(){
        String syncTime = dHelper.getSyncDate(1);
        if(syncTime==null){
            syncTime="n/a";
        }
        binding.lastSyncTime.setText("Last synced at - "+syncTime);
    }

    @Override
    public void onResume() {
        super.onResume();
        currentView = VIEW_ATTENDANCE;
    }

    @Override
    public void onClick(View v) {
        if(v==binding.viewWorkers){
            navController.navigate(R.id.nav_workers);
        }else if(v==binding.markTime){
            navController.navigate(R.id.nav_mark_time);
        }else if(v==binding.printRecords){
            ((HomeActivity)getActivity()).printRecordsForToday();
        }else if(v==binding.pluckingDetails){
            navController.navigate(R.id.nav_record_plucking);
        }else if(v==binding.nonpluckingDetails){
            navController.navigate(R.id.nav_record_non_plucking);
        }else if(v==binding.syncRecords){
            binding.syncRecords.setEnabled(false);
            binding.syncRecords.setAlpha(0.5f);
            ((HomeActivity)getActivity()).doSync(v);
        } else if (v==binding.markOutTime) {
            navController.navigate(R.id.nav_mark_out_time);
        }
    }

    public void enableSyncBtn() {
        try {
            binding.syncRecords.setEnabled(true);
            binding.syncRecords.setAlpha(1.0f);
        } catch (Exception e){
        }
    }

    private void setData() {
        if(currentView.equals(VIEW_ATTENDANCE)){
            binding.todayCount.setText(""+dHelper.presentToday());
        }else if(currentView.equals(VIEW_PLUCKING)){
            binding.todayCount.setText(""+dHelper.pluckedQuantityToday());
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        navController = null;
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if(isChecked){
            binding.todayCountAddon.setText(R.string.attendance_taken_today);
            currentView = VIEW_ATTENDANCE;
        }else{
            binding.todayCountAddon.setText(R.string.gl_plucked_today);
            currentView = VIEW_PLUCKING;
        }
        setData();
    }
}
