package com.web.gmarket.common.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.web.gmarket.common.config.DynamicDataSourceProperties.HikariSettings.Hikari;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DynamicDataSourceConfig {

	@Autowired
	private DynamicDataSourceProperties properties;

    @Bean
    @Primary
    DataSource dynamicDataSource() {
		Hikari db = properties.getDatasource().get(ConstantsUtils.DB_GMAREKT).getHikari();

		if (db == null) {
			throw new IllegalStateException("기본 DB(db) 설정이 없습니다.");
		}

		HikariConfig config = new HikariConfig();
		config.setJdbcUrl(db.getJdbcUrl());
		config.setUsername(db.getUsername());
		config.setPassword(db.getPassword());
		config.setDriverClassName(db.getDriverClassName());

		if (db.getMaximumPoolSize() != null)
			config.setMaximumPoolSize(db.getMaximumPoolSize());
		if (db.getMinimumIdle() != null)
			config.setMinimumIdle(db.getMinimumIdle());
		if (db.getPoolName() != null)
			config.setPoolName(db.getPoolName());

		return new HikariDataSource(config);
	}

    @Bean
    @Primary
    SqlSessionFactory dynamicSqlSessionFactory(@Qualifier("dynamicDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        // Mapper XML 위치 등 필요하면 설정
        return factoryBean.getObject();
    }

    @Bean
    @Primary
    SqlSessionTemplate dynamicSqlSessionTemplate(@Qualifier("dynamicSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
