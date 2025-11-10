package com.web.gmarket.common.ftp;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.web.gmarket.common.utils.ConstantsUtils;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "ftp")
@Data
public class FtpProperties {

    private String windowPath;
    private Integer connectionTimeout;
    private Map<String, FtpTargetGroup> servers = new HashMap<>();

    /**
     * 서버 정보 가져오기 (예: getProperties("gmarket", "active"))
     */
    public FtpServerInfo getProperties(String type, String mode) {
        FtpTargetGroup group = servers.get(type.toLowerCase());
        if (group == null) {
            throw new IllegalArgumentException("FTP 서버 설정을 찾을 수 없습니다: " + type);
        }

        return switch (mode.toLowerCase()) {
            case ConstantsUtils.ACTIVE -> group.getActive();
            case ConstantsUtils.STANBY -> group.getStandby();
            default -> throw new IllegalArgumentException("잘못된 서버 모드입니다: " + mode);
        };
    }
}