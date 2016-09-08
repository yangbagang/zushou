package com.ybg.rp.assistant.app;

import com.ybg.rp.yabase.app.YbgAPP;

import org.xutils.x;

/**
 * Created by yangbagang on 16/8/9.
 */
public class YApp extends YbgAPP {

    private Integer role;

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public boolean hasRight(Integer right) {
        //return (role & right) != 0;
        return true;//暂时屏蔽权限控制
    }

    @Override
    public void onCreate() {
        super.onCreate();
        x.Ext.init(this);
        //x.Ext.setDebug(BuildConfig.DEBUG); // 是否输出debug日志, 开启debug会影响性能.
    }
}
