package com.web.gmarket.common.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring")
public class DynamicDataSourceProperties {

	private Map<String, HikariSettings> datasource = new HashMap<>();

	public Map<String, HikariSettings> getDatasource() {
		return datasource;
	}

	public void setDatasource(Map<String, HikariSettings> datasource) {
		this.datasource = datasource;
	}

	public static class HikariSettings {
		private Hikari hikari = new Hikari();

		public Hikari getHikari() {
			return hikari;
		}

		public void setHikari(Hikari hikari) {
			this.hikari = hikari;
		}

		public static class Hikari {
			private String jdbcUrl;
			private String username;
			private String password;
			private String driverClassName;
			private Integer maximumPoolSize;
			private Integer minimumIdle;
			private String poolName;

			// Getters and Setters
			public String getJdbcUrl() {
				return jdbcUrl;
			}

			public void setJdbcUrl(String jdbcUrl) {
				this.jdbcUrl = jdbcUrl;
			}

			public String getUsername() {
				return username;
			}

			public void setUsername(String username) {
				this.username = username;
			}

			public String getPassword() {
				return password;
			}

			public void setPassword(String password) {
				this.password = password;
			}

			public String getDriverClassName() {
				return driverClassName;
			}

			public void setDriverClassName(String driverClassName) {
				this.driverClassName = driverClassName;
			}

			public Integer getMaximumPoolSize() {
				return maximumPoolSize;
			}

			public void setMaximumPoolSize(Integer maximumPoolSize) {
				this.maximumPoolSize = maximumPoolSize;
			}

			public Integer getMinimumIdle() {
				return minimumIdle;
			}

			public void setMinimumIdle(Integer minimumIdle) {
				this.minimumIdle = minimumIdle;
			}

			public String getPoolName() {
				return poolName;
			}

			public void setPoolName(String poolName) {
				this.poolName = poolName;
			}
		}
	}

}
