package in.illimitable.util;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.ParcelUuid;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.UUID;

public class BluetoothConnection extends DeviceConnection {

    private BluetoothDevice device;
    private BluetoothSocket socket = null;
    private boolean continueRead = false;
    private byte[] buffer = new byte[1024];
    private int bytes;
    public final boolean doDebug = false;
    private ByteArrayOutputStream debugStream = new ByteArrayOutputStream();
    private int lastAvailable = -1;
    private long availableLastChanged = -1;
    private final long waitTimeForDisconnect = 60 * 1000;

    /**
     * Create un instance of BluetoothConnection.
     *
     * @param device an instance of BluetoothDevice
     */
    public BluetoothConnection(BluetoothDevice device) {
        super();
        this.device = device;
    }

    /**
     * Get the instance BluetoothDevice connected.
     *
     * @return an instance of BluetoothDevice
     */
    public BluetoothDevice getDevice() {
        return this.device;
    }

    /**
     * Check if InputStream is open.
     *
     * @return true if is connected
     */
    @Override
    public boolean isConnected() {
        return this.socket != null && this.socket.isConnected() && super.isConnected();
    }

    /**
     * Start socket connection with the bluetooth device.
     */
    @SuppressLint("MissingPermission")
    public BluetoothConnection connect() throws Exception {
        if (this.scaleListener==null) {
            throw new Exception("WeighingScaleListener is not set.");
        }
        if (this.isConnected()) {
            return this;
        }

        if (this.device == null) {
            throw new Exception("Bluetooth device is not connected.");
        }

        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        ParcelUuid[] uuids = this.device.getUuids();
        UUID uuid = (uuids != null && uuids.length > 0) ? uuids[0].getUuid() : UUID.randomUUID();

        try {
            // System.out.println("#################");
            // System.out.println(uuid.toString());
            // System.out.println("#################");
            this.socket = this.device.createRfcommSocketToServiceRecord(uuid);
            bluetoothAdapter.cancelDiscovery();
            try {
                this.socket.connect();
            } catch (Exception e) {
                this.socket = this.device.createRfcommSocketToServiceRecord(UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"));
                this.socket.connect();
            }
            this.inputStream = this.socket.getInputStream();
            continueRead = true;
            this.scaleListener.onScaleConnected();
            new Thread(){
                @Override
                public void run() {
                    try {
                        while (continueRead) {
                            int available = inputStream.available();
                            if (available == lastAvailable) {
                                long timeSinceSame = System.currentTimeMillis() - availableLastChanged;
                                if (timeSinceSame>waitTimeForDisconnect) {
                                    disconnect();
                                    break;
                                }
                            } else {
                                availableLastChanged = System.currentTimeMillis();
                            }
                            lastAvailable = available;
                            if (available >= 24) {
                                bytes = inputStream.read(buffer);
                                String weightDump = new String(buffer, 0, bytes, "US-ASCII");
                                if(doDebug){
                                    debugStream.write(("\n\n"+weightDump).getBytes());
                                    debugStream.write("\n######\n".getBytes());
                                    char[] ch = weightDump.toCharArray();
                                    for (char c : ch) {
                                        debugStream.write(((""+(int) c)+",").getBytes());

                                    }
                                    debugStream.write("\n".getBytes());
                                }
                                String[] tokens = null;
                                if(weightDump.indexOf(" kg")>0) {
                                    tokens = weightDump.split(" kg");
                                    if(doDebug){
                                        debugStream.write(("\nTokens: "+tokens.length+"\n---\n").getBytes());
                                    }
                                    // if(tokens.length>3){
                                    if(tokens.length>=3){
                                        String selectedToken = tokens[tokens.length -2];
                                        // System.out.println("###########: "+selectedToken +" :###########");
                                        if (selectedToken.indexOf(".")<0) {
                                            selectedToken = tokens[tokens.length -1];
                                        }
                                        if (selectedToken.indexOf(".")<0) {
                                            selectedToken = "0.0";
                                        }
                                        scaleListener.onReadScale(Double.parseDouble(selectedToken));
                                    }
                                } else if (weightDump.indexOf("\n")>0) {
                                    if (weightDump.indexOf("Kg")>=0) {
                                        tokens = weightDump.split("Kg\\r?\\n");
                                    } else {
                                        tokens = weightDump.split("\\r?\\n");
                                    }
                                    if(doDebug){
                                        debugStream.write(("\nTokens: "+tokens.length+"\n---\n").getBytes());
                                    }
                                    if (tokens.length > 1) {
                                        try {
                                            scaleListener.onReadScale(Double.parseDouble(tokens[1]));
                                        } catch (Exception e) {
                                            // e.printStackTrace();
                                        }
                                    }
                                } else if (weightDump.indexOf("@")>0) {
                                    tokens = weightDump.split("@");
                                    if(doDebug){
                                        debugStream.write(("\nTokens: "+tokens.length+"\n---\n").getBytes());
                                    }
                                    if(tokens.length>=3){
                                        String _value = tokens[tokens.length -2];
                                        _value = _value.replace((char)65533, (char)32);
                                        _value = _value.trim();
                                        try {
                                            scaleListener.onReadScale(Double.parseDouble(_value));
                                        } catch (Exception e) {
                                            // e.printStackTrace();
                                        }
                                    }

                                } else if (weightDump.indexOf((char)65533)>0) {
                                    tokens = weightDump.split((""+(char)65533));
                                    if(doDebug){
                                        debugStream.write(("\nTokens: "+tokens.length+"\n---\n").getBytes());
                                    }
                                    if(tokens.length>=3){
                                        String _value = tokens[tokens.length -2];
                                        StringBuilder __value = new StringBuilder();
                                        for (int inner=0, innerLen = _value.length(); inner<innerLen; inner++) {
                                            char ch = _value.charAt(inner);
                                            if (ch>=46 && ch <=57) {
                                                __value.append(ch);
                                            }
                                        }
                                        try {
                                            scaleListener.onReadScale(Double.parseDouble(__value.toString()));
                                        } catch (Exception e) {
                                            // e.printStackTrace();
                                        }
                                    }

                                } else {
                                    scaleListener.onReadScale(0.0);
                                }
                            }
                        }
                    } catch (Exception e) {
                        if(doDebug) {
                            StringWriter writer = new StringWriter();
                            e.printStackTrace(new PrintWriter(writer));
                            String stackTrace = writer.toString();
                            try {
                                debugStream.write(stackTrace.getBytes());
                            } catch (Exception e1){}
                        }
                        e.printStackTrace();
                        disconnect();
                    }
                }
            }.start();
        } catch (IOException e) {
            e.printStackTrace();
            this.disconnect();
            throw new Exception("Unable to connect to bluetooth device.");
        }
        return this;
    }

    /**
     * Close the socket connection with the bluetooth device.
     */
    public BluetoothConnection disconnect() {
        if (!continueRead) {
            return this;
        }
        continueRead = false;
        if (this.inputStream != null) {
            try {
                this.inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            this.inputStream = null;
        }
        if (this.socket != null) {
            try {
                this.socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            this.socket = null;
        }
        this.scaleListener.onScaleDisconnected();
        return this;
    }

    public ByteArrayOutputStream getDebugStream() {
        return debugStream;
    }

}