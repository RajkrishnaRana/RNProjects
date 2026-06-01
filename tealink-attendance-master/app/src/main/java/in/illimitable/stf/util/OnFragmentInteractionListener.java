package in.illimitable.stf.util;

import android.app.Activity;
import android.content.Intent;

/**
 * Created by illimitable on 10/5/17.
 */

public interface OnFragmentInteractionListener {
    public static final int REQUEST_TAKE_PHOTO = 101;
    public static final int REQUEST_ENABLE_BT = 701;
    public void onFragmentInteraction(String tag, FragmentInteractionObject interactionObj);
    public void setTitle(String tag, String title);
    //public void updateCartCounter();
    public Activity getActivity();
    public void enableDisableFloatingActionButton(boolean flag);
    public float getHeightinDp();
    public float getWidthDp();
    public float getDensity();
    public void startActivityForResult(Intent intent, int requestCode, int requesterCode);
    public void showProgressLoader(String msg, boolean isCancelable);
    public void hideProgressLoader();
    public void hideKeyboardInFragment();
}
