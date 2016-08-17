package com.ybg.rp.yabase.js;

import android.webkit.JavascriptInterface;

import com.ybg.rp.yabase.app.YbgAPP;

/**
 * Created by yangbagang on 16/7/17.
 */
public class JavascriptObject {

    private YbgAPP app;

    public JavascriptObject(YbgAPP app) {
        this.app = app;
    }

    @JavascriptInterface
    public String getToken() {
        return app.getToken();
    }

    @JavascriptInterface
    public void setToken(String token) {
        app.setToken(token);
    }

    @JavascriptInterface
    public double getLongitude() {
        return app.getLongitude();
    }

    @JavascriptInterface
    public double getLatitude() {
        return app.getLatitude();
    }

    @JavascriptInterface
    public boolean hasLogin() {
        return app.hasLogin();
    }

}
