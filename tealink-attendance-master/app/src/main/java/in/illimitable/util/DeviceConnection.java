package in.illimitable.util;

import java.io.IOException;
import java.io.InputStream;

public abstract class DeviceConnection {
    protected InputStream inputStream;
    protected WeighingScaleListener scaleListener;
    // protected byte[] data;

    public DeviceConnection() {
        this.inputStream = null;
        // this.data = new byte[0];
    }

    public void setScaleListener(WeighingScaleListener scaleListener) {
        this.scaleListener = scaleListener;
    }

    public abstract DeviceConnection connect() throws Exception;
    public abstract DeviceConnection disconnect();

    /**
     * Check if InputStream is open.
     *
     * @return true if is connected
     */
    public boolean isConnected() {
        return this.inputStream != null;
    }
}