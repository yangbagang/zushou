package com.ybg.rp.assistant.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;

import com.ybg.rp.assistant.R;
import com.ybg.rp.assistant.app.YApp;
import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.utils.AppUtil;

/**
 * Created by yangbagang on 16/9/5.
 */
public class DataCenterActivity extends AppCompatActivity {

    //private AppUtil appUtil = AppUtil.getInstance();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.data_center);

        YApp app = (YApp) getApplication();
        if (app.hasRight(Constants.MANAGE_ROLE)) {
            ActionBar actionBar = getSupportActionBar();
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle("数据分析");
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
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

}
