package in.illimitable.stf.fragments.holders;

import android.view.View;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import in.illimitable.stf.R;

/**
 * Created by illimitable on 10/21/17.
 */

public class SectionViewHolder extends RecyclerView.ViewHolder{
    public final View mView;
    public TextView _sectionName;
    public SectionViewHolder(View view) {
        super(view);
        mView = view;
        _sectionName = view.findViewById(R.id.section_name);
    }
}
