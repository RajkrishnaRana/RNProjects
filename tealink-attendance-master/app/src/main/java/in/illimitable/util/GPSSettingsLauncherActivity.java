package in.illimitable.util;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

/**
 * Created by illimitable.in on 21-Mar-17.
 */

public class GPSSettingsLauncherActivity extends Activity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		Intent gpsOptionsIntent = new Intent(
				android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
		startActivity(gpsOptionsIntent);
		finish();
	}
}