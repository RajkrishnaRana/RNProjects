package in.illimitable.stf.util;

import org.json.JSONObject;

/**
 * Created by illimitable on 10/5/17.
 */

public class FragmentInteractionObject {
    private String action;
    private String subAction;
    private JSONObject data;

    public static final String ACTION_LOAD_FRAGMENT = "load_fragment";
    public static final String TYPE_SEED = "seed";
    public static final String SCAN_MODE = "scan_mode";
    public static final String DETAILS_MODE = "details_mode";
    public static final String INPUT_TEMPLATE = "input_template";


    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getSubAction() {
        return subAction;
    }

    public void setSubAction(String subAction) {
        this.subAction = subAction;
    }

    public JSONObject getData() {
        return data;
    }

    public void setData(JSONObject data) {
        this.data = data;
    }
}
