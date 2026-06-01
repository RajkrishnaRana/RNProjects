package in.illimitable.stf.fragments.adapters;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.navigation.NavController;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONObject;

import in.illimitable.stf.R;
import in.illimitable.util.DatabaseHelper;
import in.illimitable.util.ParcelableJsonObject;

/**
 * Created by illimitable on 10/10/17.
 */

public class WorkersRecyclerViewAdapter extends RecyclerView.Adapter<WorkersRecyclerViewAdapter.ViewHolder> implements Filterable {
    private JSONArray workers;
    private JSONArray originalWorkers;
    private NavController navController;

    public WorkersRecyclerViewAdapter(JSONArray workers, NavController navController) {
        this.workers = workers;
        originalWorkers = workers;
        this.navController = navController;
    }

    public void setWorkers(JSONArray workers){
        this.workers = workers;
        originalWorkers = workers;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.worker_list_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        try {
            holder.worker = workers.getJSONObject(position);
            holder._workerName.setText(holder.worker.getString(DatabaseHelper.WORKER_NAME));
            holder._workerCode.setText(holder.worker.getString(DatabaseHelper.WORKER_CODE));
            holder._workerBook.setText(holder.worker.getString(DatabaseHelper.WORKER_BOOK_NAME));
            holder._workerType.setText(holder.worker.getString(DatabaseHelper.WORKER_TYPE_NAME));

            holder.mView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (navController != null) {
                        ParcelableJsonObject workerParcelable = new ParcelableJsonObject(holder.worker);
                        Bundle bundle = new Bundle();
                        bundle.putParcelable("workerData", workerParcelable);
                        navController.navigate(R.id.nav_worker_details, bundle);
                    }
                }
            });
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return workers.length();
    }

    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                String charString = charSequence.toString();
                if(charString.isEmpty()) {
                    workers = originalWorkers;
                } else {
                    workers = new JSONArray();
                    for(int loop=0, length = originalWorkers.length(); loop<length; loop++) {
                        String name = originalWorkers.optJSONObject(loop).optString(DatabaseHelper.WORKER_NAME, "");
                        if(name.toLowerCase().contains(charString.toLowerCase())) {
                            workers.put(originalWorkers.optJSONObject(loop));
                        }
                    }
                }
                FilterResults filterResults = new FilterResults();
                filterResults.values = workers;
                return filterResults;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                notifyDataSetChanged();
            }
        };
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public final View mView;
        public JSONObject worker;

        public ImageView _workerStatus;
        public TextView _workerName;
        public TextView _workerCode;
        public TextView _workerBook;
        public TextView _workerType;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            _workerStatus = view.findViewById(R.id.worker_status);
            _workerName = view.findViewById(R.id.worker_name);
            _workerCode = view.findViewById(R.id.worker_code);
            _workerBook = view.findViewById(R.id.worker_book);
            _workerType = view.findViewById(R.id.worker_type);
        }

        @Override
        public String toString() {
            return super.toString() + " '" + _workerName.getText() + "'";
        }
    }
}
