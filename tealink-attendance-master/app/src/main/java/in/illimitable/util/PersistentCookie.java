package in.illimitable.util;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.net.HttpCookie;

/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class PersistentCookie implements Serializable {
    private static final long serialVersionUID = 1330392955980419481L;
    private HttpCookie mHttpCookie;

    /**
     *
     */
    public PersistentCookie(HttpCookie cookie) {
        this.mHttpCookie = cookie;
    }

    public HttpCookie getCookie() {
        return mHttpCookie;
    }

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeObject(mHttpCookie.getName());
        out.writeObject(mHttpCookie.getValue());
        out.writeObject(mHttpCookie.getComment());
        out.writeObject(mHttpCookie.getCommentURL());
        out.writeBoolean(mHttpCookie.getDiscard());
        out.writeObject(mHttpCookie.getDomain());
        out.writeLong(mHttpCookie.getMaxAge());
        out.writeObject(mHttpCookie.getPath());
        out.writeObject(mHttpCookie.getPortlist());
        out.writeBoolean(mHttpCookie.getSecure());
        out.writeInt(mHttpCookie.getVersion());
    }

    private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
        String name = (String) in.readObject();
        String value = (String) in.readObject();
        mHttpCookie = new HttpCookie(name, value);
        mHttpCookie.setComment((String) in.readObject());
        mHttpCookie.setCommentURL((String) in.readObject());
        mHttpCookie.setDiscard(in.readBoolean());
        mHttpCookie.setDomain((String) in.readObject());
        mHttpCookie.setMaxAge(in.readLong());
        mHttpCookie.setPath((String) in.readObject());
        mHttpCookie.setPortlist((String) in.readObject());
        mHttpCookie.setSecure(in.readBoolean());
        mHttpCookie.setVersion(in.readInt());
    }
}