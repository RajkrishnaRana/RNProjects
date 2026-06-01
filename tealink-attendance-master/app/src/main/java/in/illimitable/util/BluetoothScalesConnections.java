package in.illimitable.util;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothClass;
import android.bluetooth.BluetoothDevice;

import androidx.annotation.Nullable;

import java.util.Arrays;
import java.util.List;

public class BluetoothScalesConnections  extends BluetoothConnections {

    /*final String[] ALT_TESTED_DEVICES_ARRAY = {"LSPL"};
    final List<String> ALT_TESTED_DEVICES = Arrays.asList(ALT_TESTED_DEVICES_ARRAY);*/

    /**
     * Get a list of bluetooth printers.
     *
     * @return an array of EscPosPrinterCommands
     */
    @SuppressLint("MissingPermission")
    @Nullable
    public BluetoothConnection[] getList() {
        BluetoothConnection[] bluetoothDevicesList = super.getList();

        if (bluetoothDevicesList == null) {
            return null;
        }

        int i = 0;
        BluetoothConnection[] printersTmp = new BluetoothConnection[bluetoothDevicesList.length];
        for (BluetoothConnection bluetoothConnection : bluetoothDevicesList) {
            BluetoothDevice device = bluetoothConnection.getDevice();

            /*int majDeviceCl = device.getBluetoothClass().getMajorDeviceClass(),
                    deviceCl = device.getBluetoothClass().getDeviceClass();
            String deviceName = device.getName();*/

            /*System.out.println("###################################");
            System.out.println("majDeviceCl: "+majDeviceCl+", deviceCl: "+deviceCl+", device.getName(): "+ device.getName()+", device.toString(): "+ device.toString());
            System.out.println("###################################");*/

            /*if (majDeviceCl == BluetoothClass.Device.Major.IMAGING && (deviceCl == 1664 || deviceCl == BluetoothClass.Device.Major.IMAGING)) {
                printersTmp[i++] = new BluetoothConnection(device);
            } else if (ALT_TESTED_DEVICES.contains(deviceName)) {
                printersTmp[i++] = new BluetoothConnection(device);
            }*/
            printersTmp[i++] = new BluetoothConnection(device);
        }
        BluetoothConnection[] bluetoothPrinters = new BluetoothConnection[i];
        System.arraycopy(printersTmp, 0, bluetoothPrinters, 0, i);
        return bluetoothPrinters;
    }

}