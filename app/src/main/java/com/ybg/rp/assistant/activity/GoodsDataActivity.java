package com.ybg.rp.assistant.activity;

import android.os.Bundle;
import android.webkit.WebView;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.activity.ActivityWebViewExtra;

/**
 * Created by yangbagang on 16/9/5.
 */
public class GoodsDataActivity extends ActivityWebViewExtra {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview_layout);
        webView = (WebView) findViewById(R.id.webView);
        initWebSetting(webView);
        YApp app = (YApp) getApplication();
        String url = "file:///android_asset/html/goods/index.html?server=" +
                Constants.HOST + "&token=" + app.getToken() + "&orientationChanged=" + orientationChanged;
        loadUrl(webView, url);
    }

}
