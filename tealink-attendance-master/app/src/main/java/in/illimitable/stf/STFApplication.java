package in.illimitable.stf;

import android.app.Application;

import in.illimitable.stf.util.SyncUtil;
import in.illimitable.util.Constants;
import in.illimitable.util.Storage;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by illimitable on 11/6/17.
 */

public class STFApplication extends Application {
    private Socket mSocket;
    private Storage storage = null;

    public void initSocket(){
        try {
            mSocket = IO.socket(Constants.BASE_URL);
            mSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    /*System.out.println("######################################################");
                    System.out.println("socket connected..");
                    System.out.println("######################################################");*/
                    if(storage==null){
                        storage = new Storage(getApplicationContext());
                    }
                    if(storage.isLoggedIn()){
                        new Thread(){
                            @Override
                            public void run() {
                                SyncUtil syncUtil = new SyncUtil(STFApplication.this);
                                //syncUtil.setFetchStatus(false);
                                syncUtil.initSync();
                            }
                        }.start();
                    }

                }
            }).on(Socket.EVENT_MESSAGE, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                }
            }).on(Socket.EVENT_ERROR, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                }
            }).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void connectSocket(){
        if(mSocket!= null){
            if(storage==null){
                storage = new Storage(getApplicationContext());
            }
            mSocket.connect();
        }
    }

    public void disconnectSocket(){
        if(mSocket!= null){
            mSocket.disconnect();
            mSocket = null;
        }
    }
}
