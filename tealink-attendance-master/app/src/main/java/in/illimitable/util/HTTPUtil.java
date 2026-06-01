package in.illimitable.util;

import android.annotation.SuppressLint;
import android.graphics.drawable.Drawable;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.GZIPInputStream;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/**
 * Created by illimitable.in on 29-Jun-17.
 */

public class HTTPUtil {
    private static final String TIMEZONE_OFFSET_KEY = "timezoneOffset";
    private static final String SYSTEM_TIME_KEY = "currentTime";
    private HTTPUtil util;
    private final static String PROXY_HOST = "192.168.8.1";
    private final static int PROXY_PORT = 800;
    private final static boolean PROXY_REQUIRED = false;
    private boolean securedConnection;
    private URL url;
    private Proxy proxy;
    private HttpURLConnection conn;
    private Map<String, List<String>> headers;
    private boolean isGzipped = false;
    private static final String LINE_FEED = "\r\n";

    private final TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                @Override
                public void checkClientTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }

                @Override
                public void checkServerTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }
            }
    };

    public HTTPUtil() {
    }

    public HTTPUtil getHTTPUtil() {
        if (util == null) {
            util = new HTTPUtil();
        }
        return util;
    }

    @SuppressLint({"TrulyRandom", "DefaultLocale"})
    private void preapareHostForUrl(String url) {
        try {
            String protocol = url.substring(0, 5).toLowerCase();
            if (protocol.startsWith("https")) {
                securedConnection = true;
            } else {
                securedConnection = false;
            }
            if (securedConnection) {
                try {
                    SSLContext sc = SSLContext.getInstance("SSL");
                    sc.init(null, trustAllCerts, new java.security.SecureRandom());
                    HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
                } catch (Exception e) {
                }
            }
            this.url = new URL(url);
            if (PROXY_REQUIRED) {
                proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(PROXY_HOST, PROXY_PORT));
                conn = (HttpURLConnection) this.url.openConnection(proxy);
            } else {
                conn = (HttpURLConnection) this.url.openConnection();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getQuery(Hashtable<String, String> params) throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();
        boolean timezoneOffsetAdded = false;
        if (params != null) {
            boolean first = true;
            Set<String> keys = params.keySet();
            for (String key : keys) {
                if (first) {
                    first = false;
                } else {
                    result.append("&");
                }
                if (key.equals(TIMEZONE_OFFSET_KEY)) {
                    timezoneOffsetAdded = true;
                }
                result.append(URLEncoder.encode(key, "UTF-8"));
                result.append("=");
                result.append(URLEncoder.encode(params.get(key), "UTF-8"));
            }
            if (!timezoneOffsetAdded) {
                result.append("&");
                result.append(URLEncoder.encode(TIMEZONE_OFFSET_KEY, "UTF-8"));
                result.append("=");
                result.append(URLEncoder.encode("" + (Utility.getTimezoneOffset() * -1), "UTF-8"));
            }
        }

        return result.toString();
    }

    public void setGzipped(boolean flag) {
        isGzipped = flag;
    }

    public String postResponse(String url, Hashtable<String, String> params) {
        try {
            InputStream readStream = postResponseToStream(url, params, null);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            return new String(bos.toByteArray());
        } catch (Exception e) {
        }
        return null;
    }

    public InputStream postResponseToStream(String url, Hashtable<String, String> params, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(url);
            conn.setReadTimeout(60000);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("POST");
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            conn.setDoInput(true);
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            writer.write(getQuery(params));
            writer.flush();
            writer.close();
            os.close();
            InputStream readStream = null;
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            if(this.headers.containsKey("Content-Encoding")){
                List<String> headerValue = this.headers.get("Content-Encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if(this.headers.containsKey("content-encoding")){
                List<String> headerValue = this.headers.get("content-encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if (isGzipped) {
                @SuppressWarnings("resource")
                GZIPInputStream zis = new GZIPInputStream(in);
                readStream = zis;
            } else {
                readStream = in;
            }
            return readStream;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String postResponse(String url, Hashtable<String, String> params, Hashtable<String, String> headers) {
        try {
            InputStream readStream = postResponseToStream(url, params, headers);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            return new String(bos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public InputStream uploadFileAsStream(String url, String fieldName, File uploadFile, Hashtable<String, String> params, Hashtable<String, String> headers) {
        try {
            String boundary = "----WebKitFormBoundary" + System.currentTimeMillis() + "";
            preapareHostForUrl(url);
            conn.setReadTimeout(60000);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("POST");

            if (headers != null) {
                if (headers.contains("Content-Type")) {
                    headers.remove("Content-Type");
                }
                headers.put("Content-Type", "multipart/form-data; boundary=" + boundary);
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    conn.setRequestProperty(key, headers.get(key));
                }
            } else {
                conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            }
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            conn.setUseCaches(false);
            conn.setDoInput(true);
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, "UTF-8"), true);
            if (params != null && params.size() > 0) {
                Set<String> keys = params.keySet();
                boolean timezoneOffsetAdded = false;
                for (String key : keys) {
                    writer.append("--" + boundary).append(LINE_FEED);
                    writer.append("Content-Disposition: form-data; name=\"" + key + "\"").append(LINE_FEED);
                    //writer.append("Content-Type: text/plain; charset=" + "UTF-8").append(LINE_FEED);
                    writer.append(LINE_FEED);
                    writer.append(params.get(key)).append(LINE_FEED);
                    writer.flush();
                    if (key.equals(TIMEZONE_OFFSET_KEY)) {
                        timezoneOffsetAdded = true;
                    }
                }
                if (!timezoneOffsetAdded) {
                    writer.append("--" + boundary).append(LINE_FEED);
                    writer.append("Content-Disposition: form-data; name=\"" + TIMEZONE_OFFSET_KEY + "\"").append(LINE_FEED);
                    writer.append(LINE_FEED);
                    writer.append(("" + (Utility.getTimezoneOffset() * -1))).append(LINE_FEED);
                    writer.flush();
                }
            }

            String fileName = uploadFile.getName();
            writer.append("--" + boundary).append(LINE_FEED);
            writer.append("Content-Disposition: form-data; name=\"" + fieldName + "\"; filename=\"" + fileName + "\"").append(LINE_FEED);
            writer.append("Content-Type: "+ URLConnection.guessContentTypeFromName(fileName)).append(LINE_FEED);
            writer.append("Content-Transfer-Encoding: binary").append(LINE_FEED);
            writer.append(LINE_FEED);
            writer.flush();

            FileInputStream inputStream = new FileInputStream(uploadFile);
            byte[] fbuffer = new byte[4096];
            int bytesRead = -1;
            while ((bytesRead = inputStream.read(fbuffer)) != -1) {
                os.write(fbuffer, 0, bytesRead);
            }
            os.flush();
            inputStream.close();
            writer.append(LINE_FEED);
            writer.flush();
            writer.append(LINE_FEED).flush();
            writer.append("--" + boundary + "--").append(LINE_FEED);
            writer.close();
            os.close();
            InputStream readStream = null;
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            if (this.headers.containsKey("Content-Encoding")) {
                List<String> headerValue = this.headers.get("Content-Encoding");
                if (headerValue.contains("gzip")) {
                    isGzipped = true;
                }
            }
            if (this.headers.containsKey("content-encoding")) {
                List<String> headerValue = this.headers.get("content-encoding");
                if (headerValue.contains("gzip")) {
                    isGzipped = true;
                }
            }
            if (isGzipped) {
                @SuppressWarnings("resource")
                GZIPInputStream zis = new GZIPInputStream(in);
                readStream = zis;
            } else {
                readStream = in;
            }
            return readStream;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    public String uploadFile(String url, String fieldName, File uploadFile, Hashtable<String, String> params, Hashtable<String, String> headers) {
        try {
            if(!uploadFile.exists()){
                JSONObject fakeResponse = new JSONObject();
                fakeResponse.put("status", 0);
                fakeResponse.put("msg", "");
                return fakeResponse.toString();
            }
            InputStream readStream = uploadFileAsStream(url, fieldName, uploadFile, params, headers);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            return new String(bos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public InputStream postInBodyToStream(String url, String body, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(url);
            conn.setReadTimeout(60000);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("POST");
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(TIMEZONE_OFFSET_KEY, ("" + (Utility.getTimezoneOffset() * -1)));
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            conn.setDoInput(true);
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            if (body == null) {
                body = "";
            }
            writer.write(body);
            writer.flush();
            writer.close();
            os.close();
            InputStream readStream = null;
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            if(this.headers.containsKey("Content-Encoding")){
                List<String> headerValue = this.headers.get("Content-Encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if(this.headers.containsKey("content-encoding")){
                List<String> headerValue = this.headers.get("content-encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if (isGzipped) {
                @SuppressWarnings("resource")
                GZIPInputStream zis = new GZIPInputStream(in);
                readStream = zis;
            } else {
                readStream = in;
            }
            return readStream;

        } catch (Exception e) {
        }
        return null;
    }

    public String postInBody(String url, String body, Hashtable<String, String> params) {
        try {
            InputStream readStream = postInBodyToStream(url, body, params);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            return new String(bos.toByteArray());

        } catch (Exception e) {
        }
        return null;
    }

    public Hashtable<String, String> getAllResponseHeaders() {
        Hashtable<String, String> responseHeaders = new Hashtable<String, String>();
        if (headers != null) {
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                String listString = "";
                List<String> list = entry.getValue();
                for (String s : list) {
                    listString += s + ",";
                }
                if (entry.getKey() != null) {
                    responseHeaders.put(entry.getKey(), listString);
                }
            }
        }
        return responseHeaders;
    }

    public String postInBodyBinary(String url, byte[] body, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(url);
            conn.setReadTimeout(60000);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("POST");
            boolean foundAcceptEncoding = false;
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    if (isGzipped) {
                        if (key.equalsIgnoreCase("Accept-Encoding")) {
                            foundAcceptEncoding = true;
                        }
                    }
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(TIMEZONE_OFFSET_KEY, ("" + (Utility.getTimezoneOffset() * -1)));
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            if (isGzipped && !foundAcceptEncoding) {
                conn.setRequestProperty("Accept-Encoding", "application/gzip");
            }
            conn.setDoInput(true);
            conn.setDoOutput(true);

            DataOutputStream request = new DataOutputStream(conn.getOutputStream());
            request.write(body);
            request.close();
            InputStream readStream = null;
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            if (isGzipped) {
                @SuppressWarnings("resource")
                GZIPInputStream zis = new GZIPInputStream(in);
                readStream = zis;
            } else {
                readStream = in;
            }
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            if (isGzipped) {
                in.close();
            }
            return new String(bos.toByteArray());

        } catch (Exception e) {
        }
        return null;
    }

    public InputStream getResponseToStream(String url, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(url);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("GET");
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(TIMEZONE_OFFSET_KEY, ("" + (Utility.getTimezoneOffset() * -1)));
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            InputStream readStream = null;
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            if(this.headers.containsKey("Content-Encoding")){
                List<String> headerValue = this.headers.get("Content-Encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if(this.headers.containsKey("content-encoding")){
                List<String> headerValue = this.headers.get("content-encoding");
                if(headerValue.contains("gzip")){
                    isGzipped = true;
                }
            }
            if (isGzipped) {
                @SuppressWarnings("resource")
                GZIPInputStream zis = new GZIPInputStream(in);
                readStream = zis;
            } else {
                readStream = in;
            }
            return readStream;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getResponse(String url, Hashtable<String, String> headers) {
        try {
            InputStream readStream = getResponseToStream(url, headers);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buffer = new byte[5 * 1024];
            int read = readStream.read(buffer);
            while (read > 0) {
                bos.write(buffer, 0, read);
                read = readStream.read(buffer);
            }
            readStream.close();
            bos.flush();
            bos.close();
            return new String(bos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Drawable getDrawableFromUrl(String url) {
        try {
            InputStream in = null;
            in = openHttpConnection(url, null);
            return Drawable.createFromStream(in, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public InputStream openHttpConnection(String urlStr, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(urlStr);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("GET");
            boolean foundAcceptEncoding = false;
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    if (isGzipped) {
                        if (key.equalsIgnoreCase("Accept-Encoding")) {
                            foundAcceptEncoding = true;
                        }
                    }
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(TIMEZONE_OFFSET_KEY, ("" + (Utility.getTimezoneOffset() * -1)));
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            if (isGzipped && !foundAcceptEncoding) {
                conn.setRequestProperty("Accept-Encoding", "application/gzip");
            }
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            return in;
        } catch (Exception e) {
        }
        return null;
    }

    public InputStream postResponseAsStream(String url, Hashtable<String, String> params, Hashtable<String, String> headers) {
        try {
            preapareHostForUrl(url);
            conn.setReadTimeout(60000);
            conn.setConnectTimeout(180000);
            conn.setRequestMethod("POST");
            boolean foundAcceptEncoding = false;
            if (headers != null) {
                Set<String> keys = headers.keySet();
                for (String key : keys) {
                    if (isGzipped) {
                        if (key.equalsIgnoreCase("Accept-Encoding")) {
                            foundAcceptEncoding = true;
                        }
                    }
                    conn.setRequestProperty(key, headers.get(key));
                }
            }
            conn.setRequestProperty(TIMEZONE_OFFSET_KEY, ("" + (Utility.getTimezoneOffset() * -1)));
            conn.setRequestProperty(SYSTEM_TIME_KEY, ""+System.currentTimeMillis());
            if (isGzipped && !foundAcceptEncoding) {
                conn.setRequestProperty("Accept-Encoding", "application/gzip");
            }
            conn.setDoInput(true);
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            writer.write(getQuery(params));
            writer.flush();
            writer.close();
            os.close();
            InputStream in = new BufferedInputStream(conn.getInputStream());
            this.headers = conn.getHeaderFields();
            return in;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getCookieValue(String keyName){
        List<String> cookiesHeader = headers.get("set-cookie");
        if(cookiesHeader == null){
            cookiesHeader = headers.get("Set-Cookie");
        }
        if (cookiesHeader != null) {
            for (String cookie : cookiesHeader) {
                if(cookie.startsWith(keyName)){
                    return cookie;
                }
            }
        }
        return null;
    }
}
