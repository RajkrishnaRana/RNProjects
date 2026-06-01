package in.illimitable.util;

public interface WeighingScaleListener {
    void onScaleConnected();
    void onScaleDisconnected();
    void onReadScale(double kg);
}
