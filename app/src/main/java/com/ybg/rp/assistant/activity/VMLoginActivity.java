package com.ybg.rp.assistant.activity;

import android.app.Activity;
import android.app.ProgressDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

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

/**
 * Created by yangbagang on 16/8/10.
 */
public class VMLoginActivity extends Activity implements View.OnClickListener {

    private AppUtil appUtil = AppUtil.getInstance();
    private Button mVmLoginBtnLogin;//登录
    private Button btn_cancel_login;//返回扫码页面
    private LinearLayout mVmLoginClose;
    private String vmCode;
    private ProgressDialog dialog;    //登录弹窗提示

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.vm_login_layout);
        initView();

        dialog = appUtil.getProgressDialog(VMLoginActivity.this, "授权中");
        dialog.setMessage("授权中");
        dialog.setCanceledOnTouchOutside(false);

        Bundle extras = getIntent().getExtras();
        vmCode = extras.getString("result");
        LogUtil.i("--------机器编号:" + vmCode);

        mVmLoginBtnLogin.setOnClickListener(this);
        btn_cancel_login.setOnClickListener(this);
        mVmLoginClose.setOnClickListener(this);

        if (vmCode != null) {
            scanSuccess();
        }
    }

    private void initView() {
        mVmLoginBtnLogin = (Button) findViewById(R.id.vmLogin_btn_login);
        btn_cancel_login = (Button) findViewById(R.id.vmLogin_btn_cancel_login);
        mVmLoginClose = (LinearLayout) findViewById(R.id.vmLogin_ll_close);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            /**登录*/
            case R.id.vmLogin_btn_login:
                if (vmCode != null) {
                    login(vmCode);
                }
                break;

            /**返回扫码页面*/
            case R.id.vmLogin_btn_cancel_login:
                finish();
                break;

            case R.id.vmLogin_ll_close:
                finish();
                break;
        }
    }

    private void login(String vmCode) {
        String url = Constants.HOST + "vendMachineInfo/authQRCode";
        RequestParams params = new RequestParams(url);
        YApp app = (YApp) getApplication();
        params.addBodyParameter("token", app.getToken());
        params.addBodyParameter("vmCode", vmCode);
        LogUtil.i("---token="+ app.getToken() + "---&vmCode=" + vmCode);
        dialog.show();
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                dialog.dismiss();
                LogUtil.i("---VMLoginActivity:", s);
                try {
                    JSONObject json = new JSONObject(s);
                    if ("true".equals(json.getString("success"))) {
                        appUtil.showMessage(VMLoginActivity.this, "授权成功");
                        finish();
                    } else {
                        appUtil.showMessage(VMLoginActivity.this, json.getString("msg"));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                dialog.dismiss();
                appUtil.showMessage(VMLoginActivity.this, "服务异常");
                LogUtil.i("---VMLoginActivity:", throwable.getMessage());
            }

            @Override
            public void onCancelled(CancelledException e) {
            }

            @Override
            public void onFinished() {
            }
        });
    }

    /**
     * 扫码成功调用
     */
    private void scanSuccess() {
        String url = Constants.HOST + "vendMachineInfo/checkQRCode";
        RequestParams params = new RequestParams(url);
        YApp app = (YApp) getApplication();
        params.addBodyParameter("token", app.getToken());
        params.addBodyParameter("vmCode", vmCode);
        dialog.show();
        x.http().post(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String s) {
                dialog.dismiss();
                LogUtil.i("-----VMLogin/qcodeYs : " + s);
                try {
                    JSONObject json = new JSONObject(s);
                    if ("true".equals(json.getString("success"))) {
                        appUtil.showMessage(VMLoginActivity.this, "扫描成功");
                    } else {
                        appUtil.showMessage(VMLoginActivity.this, json.getString("msg"));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Throwable throwable, boolean b) {
                dialog.dismiss();
                appUtil.showMessage(VMLoginActivity.this, "服务异常");
                LogUtil.i("-----VMLogin/qcodeYs : " + throwable.getMessage());
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
