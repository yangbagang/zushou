package com.ybg.rp.assistant.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.view.menu.MenuBuilder;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.scan.ScanQRActivity;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.utils.AppUtil;
import com.ybg.rp.yabase.utils.LogUtil;

import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;
import org.xutils.http.RequestParams;
import org.xutils.x;

import java.lang.reflect.Method;

public class HomeActivity extends AppCompatActivity {

    private AppUtil appUtil = AppUtil.getInstance();

    private TextView money;
    private TextView count;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.home_layout);

        initView();
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
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_scan, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_scan) {
            Intent intent = new Intent(this, ScanQRActivity.class);
            startActivity(intent);
            return true;
        } else if (id == R.id.action_exit) {
            logout();
            return true;
        } else if (id == R.id.action_about) {
            startActivity(new Intent(this, AboutActivity.class));
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void bhControl(View view) {
        Intent intent = new Intent(HomeActivity.this, GoodsManagerActivity.class);
        startActivity(intent);
    }

    public void gzControl(View view) {
        Intent intent = new Intent(HomeActivity.this, DeviceActivity.class);
        startActivity(intent);
    }

    public void qhControl(View view) {
        Intent intent = new Intent(HomeActivity.this, QueHuoActivity.class);
        startActivity(intent);
    }

    public void xsControl(View view) {
        Intent intent = new Intent(HomeActivity.this, SaleDetailActivity.class);
        startActivity(intent);
    }

    public void fxControl(View view) {
        Intent intent = new Intent(HomeActivity.this, DataCenterActivity.class);
        startActivity(intent);
    }

    public void fqControl(View view) {
        appUtil.showMessage(HomeActivity.this, "正在开发中，请稍候。。。");
    }

    private void initView() {
        money = (TextView) findViewById(R.id.moneyNotice);
        count = (TextView) findViewById(R.id.countNotice);

        //查询数据
        String url = Constants.HOST + "/dataAnalysis/queryCompareData";
        RequestParams params = new RequestParams(url);
        params.addBodyParameter("token", ((YApp) getApplication()).getToken());
        params.addBodyParameter("themeIds", "");//统计全部主题店
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                LogUtil.i("#HomeActivity:", s);
                try {
                    JSONObject json = new JSONObject(s);
                    if (json.getString("success").equals("true")) {
                        String zt = json.getString("zt");
                        String qt = json.getString("qt");
                        double ztMoney = json.getDouble("ztMoney");
                        double qtMoney = json.getDouble("qtMoney");
                        int ztCount = json.getInt("ztCount");
                        int qtCount = json.getInt("qtCount");
                        double moneyCompare = json.getDouble("moneyCompare");
                        double countCompare = json.getDouble("countCompare");
                        String moneyText = zt + " " + ztMoney + "元，比" + qt + " " + qtMoney +
                                "元提升" + moneyCompare + "%。";
                        money.setText(moneyText);
                        String countText = zt + " " + ztCount + "次，比" + qt + " " + qtCount +
                                "次提升" + countCompare + "%。";
                        count.setText(countText);
                    } else {
                        String message = json.getString("message");
                        appUtil.showMessage(HomeActivity.this, json.getString("message"));
                        if (message != null && message.contains("重新登陆")) {
                            Intent intent = new Intent(HomeActivity.this, LoginActivity.class);
                            startActivity(intent);
                            finish();
                        }
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                LogUtil.i("#HomeActivity:", throwable.getMessage());
                appUtil.showMessage(HomeActivity.this, "获取数据异常,请稍后重试。");
            }

            @Override
            public void onCancelled(CancelledException e) {

            }

            @Override
            public void onFinished() {

            }
        });
    }

    private void logout() {
        String url = Constants.HOST + "/partnerUserInfo/logout";
        RequestParams params = new RequestParams(url);
        params.addBodyParameter("token", ((YApp) getApplication()).getToken());
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                LogUtil.i("#HomeActivity:", s);
                try {
                    JSONObject json = new JSONObject(s);
                    if (json.getString("success").equals("true")) {
                        appUtil.showMessage(HomeActivity.this, "您己安全退出。");
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                YApp app = (YApp) getApplication();
                app.setToken("");
                app.setRoles("");
                startActivity(new Intent(HomeActivity.this, LoginActivity.class));
                finish();
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                LogUtil.i("#HomeActivity:", throwable.getMessage());
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
