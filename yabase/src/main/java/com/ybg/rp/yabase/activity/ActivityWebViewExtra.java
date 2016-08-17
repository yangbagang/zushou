package com.ybg.rp.yabase.activity;

import android.app.Activity;
import android.graphics.Bitmap;
import android.view.KeyEvent;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.ybg.rp.yabase.js.JavascriptObject;

/**
 * Created by yangbagang on 16/8/3.
 */
public class ActivityWebViewExtra extends Activity {

    /**
     * 网页内容设置
     */
    protected void initWebSetting(WebView webView) {
        if (webView == null) {
            return;
        }
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);//设置WebView属性，能够执行Javascript脚本
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setAllowFileAccess(true);//设置可以访问文件
        webSettings.setBuiltInZoomControls(false);//禁止缩放
        webSettings.setSavePassword(true);//是否保存网页密码
        webSettings.setSaveFormData(true);//是否保存表单form
        webSettings.setPluginState(WebSettings.PluginState.ON);//允许插件
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);//启用地理定位
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        webSettings.setUseWideViewPort(true);// 调整到适合webview大小
        webSettings.setLoadWithOverviewMode(true);// 调整到适合webview大小
        webSettings.setDefaultZoom(WebSettings.ZoomDensity.FAR);// 屏幕自适应网页,如果没有这个，在低分辨率的手机上显示可能会异常

        //设置缓存
        webSettings.setAppCacheEnabled(true);       //开启 Application Caches 功能
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);     //设置缓存模式
        //webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK); //只要本地有，无论是否过期，或者no-cache，都使用缓存中的数据。
        webSettings.setDomStorageEnabled(true);     //开启 DOM storage API 功能
        webSettings.setDatabaseEnabled(true);       //开启
        String cacheDirPath = getCacheDir().getPath();
        webSettings.setDatabasePath(cacheDirPath);  //设置数据库缓存路径
        webSettings.setAppCachePath(cacheDirPath);  //设置  Application Caches 缓存目录
    }

    protected void loadUrl(WebView webView, String url) {
        if (webView == null || url == null) {
            return;
        }
        webView.loadUrl(url);
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);

        webView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (url.endsWith("close.html")) {
                    finish();
                } else if (url.endsWith("back.html")) {
                    onBackPressed();
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);

            }

            @Override
            public boolean onJsAlert(WebView view, String url, final String message, final JsResult result) {
                return super.onJsAlert(view, url, message, result);
            }
        });
    }

}
