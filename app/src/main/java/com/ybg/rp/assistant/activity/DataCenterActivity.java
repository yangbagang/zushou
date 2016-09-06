package com.ybg.rp.assistant.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import com.ybg.rp.assistant.R;
import com.ybg.rp.yabase.utils.AppUtil;

/**
 * Created by yangbagang on 16/9/5.
 */
public class DataCenterActivity extends AppCompatActivity {

    private AppUtil appUtil = AppUtil.getInstance();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.data_center);
    }

    public void ssControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, TodayDataActivity.class);
        startActivity(intent);
    }

    public void qsControl(View view) {
        appUtil.showMessage(DataCenterActivity.this, "正在开发中，请稍候。。。");
    }

    public void spControl(View view) {
        Intent intent = new Intent(DataCenterActivity.this, GoodsDataActivity.class);
        startActivity(intent);
    }

    public void yhControl(View view) {
        appUtil.showMessage(DataCenterActivity.this, "正在开发中，请稍候。。。");
    }

}
