package in.illimitable.stf.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;

import org.json.JSONArray;

import in.illimitable.stf.R;
import in.illimitable.stf.databinding.FragmentWorkersBinding;
import in.illimitable.stf.fragments.adapters.WorkersRecyclerViewAdapter;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.Utility;

public class WorkersFragment extends Fragment implements View.OnClickListener {
    private DatabaseHelper dHelper;
    private NavController navController;

    JSONArray books = null;
    JSONArray workers = null;
    private WorkersRecyclerViewAdapter adapter;
    private ArrayAdapter spinnerArrayAdapter;

    private FragmentWorkersBinding binding;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        dHelper = DatabaseHelper.getInstance(getContext());
        navController = Navigation.findNavController(getActivity(), R.id.nav_host_fragment);
    }

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWorkersBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        workers = dHelper.getWorkerDetailsWithAttendance(null);
        binding.searchBtn.setOnClickListener(this);
        books = dHelper.getAllBooks();
        binding.workerList.setLayoutManager(new LinearLayoutManager(root.getContext()));
        binding.workerList.setItemAnimator(new DefaultItemAnimator());
        if(adapter == null){
            adapter = new WorkersRecyclerViewAdapter(workers, navController);
        }
        binding.workerList.setAdapter(adapter);
        if(spinnerArrayAdapter == null){
            String[] tmp = Utility.getArrayForKey(books, DatabaseHelper.BOOK_NAME);
            String[] bookArr = new String[tmp.length+1];
            bookArr[0] = "All Books";
            for(int loop=0; loop<tmp.length; loop++){
                bookArr[loop+1] = tmp[loop];
            }
            spinnerArrayAdapter = new ArrayAdapter(getContext(),R.layout.spinner_item, bookArr);
        }
        binding.workerBooks.setAdapter(spinnerArrayAdapter);
        binding.workerBooks.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int position, long id) {
                try {
                    if(position >0) {
                        workers = dHelper.getWorkerDetailsWithAttendance(books.getJSONObject(position-1).getString(DatabaseHelper.BOOK_ID));
                    }else{
                        workers = dHelper.getWorkerDetailsWithAttendance(null);
                    }
                    adapter.setWorkers(workers);
                    adapter.notifyDataSetChanged();
                }catch (Exception e){}
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        return root;
    }

    @Override
    public void onClick(View v) {
        if (v==binding.searchBtn) {
            String text = binding.searchText.getText().toString();
            if(adapter != null) {
                adapter.getFilter().filter(text);
            }
        }
    }
}
