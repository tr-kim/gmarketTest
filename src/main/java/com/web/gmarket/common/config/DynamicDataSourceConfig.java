package com.web.gmarket.common.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.web.gmarket.common.config.DynamicDataSourceProperties.HikariSettings.Hikari;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DynamicDataSourceConfig {

	private final DynamicDataSourceProperties properties;	
	public final ApplicationContext applicationContext;

    public DynamicDataSourceConfig (ApplicationContext ac, DynamicDataSourceProperties properties) {
        this.applicationContext = ac;
        this.properties = properties;
    }

    @Bean
    @Primary
    DataSource dynamicDataSource() {
		Hikari hikari = properties.getDatasource().get(ConstantsUtils.DB_GMAREKT).getHikari();

		if (hikari == null) {
			throw new IllegalStateException("기본 DB(db) 설정이 없습니다.");
		}

		HikariConfig config = new HikariConfig();
		config.setJdbcUrl(hikari.getJdbcUrl());
		config.setUsername(hikari.getUsername());
		config.setPassword(hikari.getPassword());
		config.setDriverClassName(hikari.getDriverClassName());

		if (hikari.getMaximumPoolSize() != null)
			config.setMaximumPoolSize(hikari.getMaximumPoolSize());
		if (hikari.getMinimumIdle() != null)
			config.setMinimumIdle(hikari.getMinimumIdle());
		if (hikari.getPoolName() != null)
			config.setPoolName(hikari.getPoolName());

		return new HikariDataSource(config);
	}

    @Bean
    @Primary
    SqlSessionFactory dynamicSqlSessionFactory(@Qualifier("dynamicDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setMapperLocations(applicationContext.getResources("classpath:mapper/*.xml"));
        factoryBean.setConfigLocation(applicationContext.getResource("classpath:mybatis-config.xml"));
        return factoryBean.getObject();
    }

    @Bean
    @Primary
    SqlSessionTemplate dynamicSqlSessionTemplate(@Qualifier("dynamicSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
