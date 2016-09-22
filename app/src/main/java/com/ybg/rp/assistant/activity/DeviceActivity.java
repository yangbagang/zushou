package com.ybg.rp.assistant.activity;

import android.os.Bundle;
import android.webkit.WebView;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.activity.ActivityWebViewExtra;

/**
 * Created by yangbagang on 2016/9/22.
 */

public class DeviceActivity extends ActivityWebViewExtra {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview_layout);
        webView = (WebView) findViewById(R.id.webView);
        initWebSetting(webView);
        YApp app = (YApp) getApplication();
        String url = "file:///android_asset/html/device/index.html?server=" +
                Constants.HOST + "&token=" + app.getToken();
        loadUrl(webView, url);
    }

}
