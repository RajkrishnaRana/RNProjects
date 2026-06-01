package in.illimitable.util;

import android.os.Parcel;
import android.os.Parcelable;

import org.json.JSONObject;

public class ParcelableJsonObject implements Parcelable {
    private JSONObject json;

    public ParcelableJsonObject(JSONObject json) {
        this.json = json;
    }

    public JSONObject getJson() {
        return json;
    }

    protected ParcelableJsonObject(Parcel in) {
        String[] data = new String[1];
        in.readStringArray(data);
        try {
            json = new JSONObject(data[0]);
        } catch (Exception e){}
    }

    public static final Creator<ParcelableJsonObject> CREATOR = new Creator<ParcelableJsonObject>() {
        @Override
        public ParcelableJsonObject createFromParcel(Parcel in) {
            return new ParcelableJsonObject(in);
        }

        @Override
        public ParcelableJsonObject[] newArray(int size) {
            return new ParcelableJsonObject[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeStringArray(new String[] {json.toString()});
    }
}
