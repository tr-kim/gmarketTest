package com.web.gmarket.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.web.gmarket.common.utils.ConstantsUtils;

import lombok.Data;

@ConfigurationProperties(prefix = "ftp")
@Data
@Component
public class FtpProperties {
	
	// window path
	private String windowPath;
	
	// Connection Timeout
	private Integer connectionTimeout;
	
	// Gmarkt Active
    private String gmarketActiveHost;
    private Integer gmarketActivePort;
    private String gmarketActiveUsername;
    private String gmarketActivePassword;
    private String gmarketActivePath;
    
    // Gmarkt Stanby
    private String gmarketStanbyHost;
    private Integer gmarketStanbyePort;
    private String gmarketStanbyUsername;
    private String gmarketStanbyPassword;
    private String gmarketStanbyPath;
    
    // Auction Active
    private String auctionActiveHost;
    private Integer auctionActivePort;
    private String auctionActiveUsername;
    private String auctionActivePassword;
    private String auctionActivePath;
    
    // Gmarkt Stanby
    private String auctionStanbyHost;
    private Integer auctionStanbyePort;
    private String auctionStanbyUsername;
    private String auctionStanbyPassword;
    private String auctionStanbyPath;
    
    // Getter
    private String host;
    private Integer port;
    private String username;
    private String password;
    private String path;
    
    public FtpProperties getProperties(Integer code, String type) {
    	FtpProperties properties = new FtpProperties();
    	
    	if(ConstantsUtils.GMARKET_CODE == code && ConstantsUtils.ACTIVE.equals(type)) {
    		properties.setHost(this.gmarketActiveHost);
    		properties.setPort(this.gmarketActivePort);
    		properties.setUsername(this.gmarketActiveUsername);
    		properties.setPassword(this.gmarketActivePassword);
    		properties.setPath(this.gmarketActivePath);
    	} else if(ConstantsUtils.GMARKET_CODE == code && ConstantsUtils.STANBY.equals(type)) {
    		properties.setHost(this.gmarketStanbyHost);
    		properties.setPort(this.gmarketStanbyePort);
    		properties.setUsername(this.gmarketStanbyUsername);
    		properties.setPassword(this.gmarketStanbyPassword);
    		properties.setPath(this.gmarketStanbyPath);
    	} else if(ConstantsUtils.AUCTION_CODE == code && ConstantsUtils.ACTIVE.equals(type)) {
    		properties.setHost(this.auctionActiveHost);
    		properties.setPort(this.auctionActivePort);
    		properties.setUsername(this.auctionActiveUsername);
    		properties.setPassword(this.auctionActivePassword);
    		properties.setPath(this.auctionActivePath);
    	} else if(ConstantsUtils.AUCTION_CODE == code && ConstantsUtils.STANBY.equals(type)) {
    		properties.setHost(this.auctionStanbyHost);
    		properties.setPort(this.auctionStanbyePort);
    		properties.setUsername(this.auctionStanbyUsername);
    		properties.setPassword(this.auctionStanbyPassword);
    		properties.setPath(this.auctionStanbyPath);
    	}
    	
		return properties;
    }
}