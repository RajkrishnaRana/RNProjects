package in.illimitable.stf.util;

import android.os.Parcel;
import android.os.Parcelable;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;

/**
 * Created by illimitable on 10/21/17.
 */

public class ParcelableJSONObject implements Parcelable {

    public static final Creator<ParcelableJSONObject> CREATOR = new Creator<ParcelableJSONObject>() {
        @Override
        public ParcelableJSONObject createFromParcel(Parcel in) {
            return new ParcelableJSONObject(in);
        }

        @Override
        public ParcelableJSONObject[] newArray(int size) {
            return new ParcelableJSONObject[size];
        }
    };

    private JSONObject json;

    public ParcelableJSONObject(Parcel in) {
        json = new JSONObject();
        int size = in.readInt();
        if(size>0){
            for(int loop=0; loop<size; loop++){
                String key = in.readString();
                String value = in.readString();
                try {
                    json.put(key,value);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public ParcelableJSONObject(JSONObject json) {
        this.json = json;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        if(json != null){
            Iterator<String> keys = json.keys();
            Hashtable<String,String> hash = new Hashtable<>();
            while (keys.hasNext()){
                String key = keys.next();
                hash.put(key, json.optString(key,""));
            }
            parcel.writeInt(hash.size());
            Set<String> values = hash.keySet();
            for(String value: values){
                parcel.writeString(value);
                parcel.writeString(hash.get(value));
            }
        }else{
            parcel.writeInt(-1);
        }
    }

    public JSONObject getJson() {
        return json;
    }

    public void setJson(JSONObject json) {
        this.json = json;
    }

    @Override
    public String toString() {
        if(json != null){
            return json.toString();
        }
        return "{}";
    }
}
