package com.ybg.rp.assistant.js;

import com.ybg.rp.assistant.utils.Constants;
import com.ybg.rp.yabase.app.YbgAPP;
import com.ybg.rp.yabase.js.JavascriptObject;

/**
 * Created by yangbagang on 16/8/9.
 */
public class JavaForWebview extends JavascriptObject {

    public JavaForWebview(YbgAPP app) {
        super(app);
    }

    public String getServerAddress() {
        return Constants.HOST;
    }
}
