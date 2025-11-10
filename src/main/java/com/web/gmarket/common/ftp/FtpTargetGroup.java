package com.web.gmarket.common.ftp;

import lombok.Data;

@Data
public class FtpTargetGroup {
    private FtpServerInfo active;
    private FtpServerInfo standby;
}
