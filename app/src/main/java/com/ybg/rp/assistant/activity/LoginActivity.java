package com.ybg.rp.assistant.activity;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.EditText;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.entity.PartnerUser;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.utils.AppPreferences;
import com.ybg.rp.yabase.utils.AppUtil;
import com.ybg.rp.yabase.utils.GsonUtil;
import com.ybg.rp.yabase.utils.LogUtil;

import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;
import org.xutils.http.RequestParams;
import org.xutils.x;

/**
 * Created by yangbagang on 16/8/9.
 */
public class LoginActivity extends Activity {

    private AppUtil appUtil = AppUtil.getInstance();

    private EditText user;
    private EditText passwd;
    private ProgressDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.login_layout);

        initViews();
    }

    private void initViews() {
        user = (EditText) findViewById(R.id.login_user_name);
        passwd = (EditText) findViewById(R.id.login_user_pwd);
        dialog = appUtil.getProgressDialog(LoginActivity.this, "正在登录。。。");
    }

    public void login(View view) {
        if ("".equals(user.getText().toString())) {
            appUtil.showMessage(LoginActivity.this, "用户名不能为空。");
            return;
        }
        if ("".equals(passwd.getText().toString())) {
            appUtil.showMessage(LoginActivity.this, "密码不能为空。");
            return;
        }
        String url = Constants.HOST + "/partnerUserInfo/login";

        RequestParams params = new RequestParams(url);

        String loginDevice = appUtil.getModelInfo();
        params.addBodyParameter("userName", user.getText().toString());
        params.addBodyParameter("password", passwd.getText().toString());
        params.addBodyParameter("loginDevice", loginDevice);
        dialog.show();
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                LogUtil.i("#LoginActivity:", s);
                dialog.dismiss();

                try {
                    JSONObject json = new JSONObject(s);
                    if(json.getString("success").equals("true")) {
                        String token = json.getString("token");
                        YApp yApp = (YApp) getApplication();
                        yApp.setToken(token);      //保存token

                        String userInfo = json.getString("userInfo");
                        PartnerUser user = GsonUtil.createGson().fromJson(userInfo, PartnerUser.class);
                        saveUserInfo(user);//保存用户信息
                        if (token != null) {
                            startActivity(new Intent(LoginActivity.this, HomeActivity.class));  //进入主页
                            appUtil.showMessage(LoginActivity.this, "登录成功!");
                            finish();
                        } else {
                            appUtil.showMessage(LoginActivity.this, "用户名或密码错误");
                        }
                    } else {
                        appUtil.showMessage(LoginActivity.this, json.getString("msg"));
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                LogUtil.i("#LoginActivity:", throwable.getMessage());
                dialog.dismiss();
                appUtil.showMessage(LoginActivity.this, "登录异常,请稍后重试。");
            }

            @Override
            public void onCancelled(CancelledException e) {

            }

            @Override
            public void onFinished() {

            }
        });
    }

    //保存用户参数
    public void saveUserInfo(PartnerUser user) {
        AppPreferences preferences = AppPreferences.getInstance();
        preferences.setString("operatorId", user.getId() + "");
        preferences.setString("username", user.getUsername());
        preferences.setString("realName", user.getRealName());
        preferences.setString("email", user.getEmail());
        preferences.setString("avatar", user.getAvatarUrl());
        LogUtil.i("登录", "用户数据保存成功");
    }
}
