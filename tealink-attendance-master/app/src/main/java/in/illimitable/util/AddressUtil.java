package in.illimitable.util;

import java.util.List;
import java.util.Locale;

import android.content.Context;
import android.location.Address;
import android.location.Geocoder;

/**
 * Created by illimitable.in on 21-Mar-17.
 */

public class AddressUtil {
	public String getAddres(double latitude, double longitude, Context context){
		String address = "";
		try {
			if(latitude!=-1 && longitude != 0){
				Geocoder gcd = new Geocoder(context, Locale.getDefault());
				List<Address> addresses = gcd.getFromLocation(latitude, longitude, 1);
				if(addresses.size()>0){
					StringBuilder sb = new StringBuilder();
					for (int i = 0; i < addresses.get(0).getMaxAddressLineIndex(); i++) {
						sb.append(addresses.get(0).getAddressLine(i));
						sb.append(" ");
					}
					//sb.append(addresses.get(0).getLocality());
					//sb.append(addresses.get(0).getPostalCode());
					sb.append(",");
					sb.append(addresses.get(0).getCountryName());
					address = sb.toString();
				}
			}
		} catch (Exception e) {
		}
		return address;
	}
}