package com.web.gmarket.common.ftp;

import lombok.Data;

@Data
public class FtpServerInfo {
    private String host;
    private Integer port;
    private String username;
    private String password;
    private String path;
}
