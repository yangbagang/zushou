package com.ybg.rp.assistant.app;

import android.text.TextUtils;

import com.ybg.rp.yabase.app.YbgAPP;

import org.xutils.x;

import java.util.Arrays;

/**
 * Created by yangbagang on 16/8/9.
 */
public class YApp extends YbgAPP {

    private String roles;

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public boolean hasRole(String role) {
        if (TextUtils.isEmpty(roles) || TextUtils.isEmpty(role)) {
            return false;
        }
        return Arrays.asList(roles.split(",")).contains(role);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        x.Ext.init(this);
    }
}
