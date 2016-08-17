package com.ybg.rp.yabase.app;

import android.app.Activity;
import android.app.Application;

import com.ybg.rp.yabase.utils.AppConstat;
import com.ybg.rp.yabase.utils.AppPreferences;

/**
 * Created by yangbagang on 16/8/3.
 */
public class YbgAPP extends Application {

    private AppPreferences preference = AppPreferences.getInstance();

    private double longitude = 0;

    private double latitude = 0;

    public boolean hasLogin() {
        return !"".equals(getToken());
    }

    public String getToken() {
        return preference.getString("token", "");
    }

    public void setToken(String token) {
        preference.setString("token", token);
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        if (!preference.hasInit()) {
            preference.init(getSharedPreferences(
                    AppConstat.PREFERENCE_FILE_NAME, Activity.MODE_PRIVATE));
        }
    }
}
