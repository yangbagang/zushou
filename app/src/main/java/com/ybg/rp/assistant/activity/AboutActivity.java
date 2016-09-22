package com.ybg.rp.assistant.activity;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.TextView;

import com.ybg.rp.assistant.R;
import com.ybg.rp.yabase.utils.AppUtil;

/**
 * Created by yangbagang on 2016/9/21.
 */

public class AboutActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.about_layout);

        TextView version = (TextView) findViewById(R.id.version);
        AppUtil appUtil = AppUtil.getInstance();
        version.setText("Version " + appUtil.getAppVersion(AboutActivity.this,
                getPackageName()));

        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);
        actionBar.setTitle("关于");
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
}
