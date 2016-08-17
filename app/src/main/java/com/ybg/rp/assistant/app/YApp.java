package com.ybg.rp.assistant.app;

import com.ybg.rp.yabase.app.YbgAPP;

import org.xutils.x;

/**
 * Created by yangbagang on 16/8/9.
 */
public class YApp extends YbgAPP {
    @Override
    public void onCreate() {
        super.onCreate();
        x.Ext.init(this);
        //x.Ext.setDebug(BuildConfig.DEBUG); // 是否输出debug日志, 开启debug会影响性能.
    }
}
