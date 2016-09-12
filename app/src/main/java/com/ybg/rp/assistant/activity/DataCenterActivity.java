package com.ybg.rp.assistant.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.view.menu.MenuBuilder;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.utils.AppUtil;
import com.ybg.rp.yabase.utils.LogUtil;

import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;
import org.xutils.http.RequestParams;
import org.xutils.x;

import java.lang.reflect.Method;

/**
 * Created by yangbagang on 16/9/5.
 */
public class DataCenterActivity extends AppCompatActivity {

    private AppUtil appUtil = AppUtil.getInstance();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.data_center);

        YApp app = (YApp) getApplication();
        if (app.hasRole(Constants.MANAGE_ROLE)) {
            ActionBar actionBar = getSupportActionBar();
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("数据分析");
        }
    }

    @Override
    protected boolean onPrepareOptionsPanel(View view, Menu menu) {
        if (menu != null) {
            if (menu.getClass() == MenuBuilder.class) {
                try {
                    Method m = menu.getClass().getDeclaredMethod("setOptionalIconsVisible", Boolean.TYPE);
                    m.setAccessible(true);
                    m.invoke(menu, true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return super.onPrepareOptionsPanel(view, menu);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        YApp yApp = (YApp) getApplication();
        if (!yApp.hasRole(Constants.MANAGE_ROLE)) {
            getMenuInflater().inflate(R.menu.menu_exit, menu);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
            case R.id.action_exit:
                logout();
                return true;
            case R.id.action_detail:
                startActivity(new Intent(DataCenterActivity.this, SaleDetailActivity.class));
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public void ssControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, TodayDataActivity.class);
        startActivity(intent);
    }

    public void qsControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, DataChartActivity.class);
        startActivity(intent);
    }

    public void spControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, GoodsDataActivity.class);
        startActivity(intent);
    }

    public void yhControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, UserDataActivity.class);
        startActivity(intent);
    }

    private void logout() {
        String url = Constants.HOST + "/partnerUserInfo/logout";
        RequestParams params = new RequestParams(url);
        params.addBodyParameter("token", ((YApp) getApplication()).getToken());
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                LogUtil.i("#DataCenterActivity:", s);
                try {
                    JSONObject json = new JSONObject(s);
                    if (json.getString("success").equals("true")) {
                        appUtil.showMessage(DataCenterActivity.this, "您己安全退出。");
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                YApp app = (YApp) getApplication();
                app.setToken("");
                app.setRoles("");
                startActivity(new Intent(DataCenterActivity.this, LoginActivity.class));
                finish();
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                LogUtil.i("#DataCenterActivity:", throwable.getMessage());
                appUtil.showMessage(DataCenterActivity.this, "退出异常,请稍后重试。");
            }

            @Override
            public void onCancelled(CancelledException e) {

            }

            @Override
            public void onFinished() {

            }
        });
    }

}
