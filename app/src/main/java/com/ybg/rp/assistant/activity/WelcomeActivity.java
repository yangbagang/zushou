package com.ybg.rp.assistant.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Window;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.utils.Constants;

/**
 * Created by yangbagang on 16/8/9.
 */
public class WelcomeActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.welcome_layout);

        YApp app = (YApp) getApplication();
        if (app.hasLogin()) {
            if (app.hasRight(Constants.MANAGE_ROLE)) {
                //有管理权限进入主页
                startActivity(new Intent(this, HomeActivity.class));
            } else {
                //没有则直接进入数据中心看数据
                startActivity(new Intent(this, DataCenterActivity.class));
            }
            finish();
        } else {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            finish();
        }
    }

}
