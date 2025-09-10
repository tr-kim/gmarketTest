package com.web.gmarket.common.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadProgress {
    public int progress;
    public int current;
    public int total;
    public String message;
    public boolean complete;
    
    public UploadProgress(int progress, int current, int total, String message) {
        this.progress = progress;
        this.current = current;
        this.total = total;
        this.message = message;
        this.complete = progress >= 100;
    }
    
}
