package com.web.gmarket.common.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.config.DynamicDataSourceProperties.HikariSettings.Hikari;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class DynamicDataSourceService {

	@Autowired
	private ApplicationContext applicationContext;

	@Autowired
	private DynamicDataSourceProperties properties;

	private final Map<String, DataSource> dataSourceCache = new ConcurrentHashMap<>();
	private final Map<String, SqlSessionFactory> sqlSessionFactoryCache = new ConcurrentHashMap<>();
	private final Map<String, SqlSessionTemplate> sqlSessionTemplateCache = new ConcurrentHashMap<>();
	
	public <T> T getMapper(String dbName, Class<T> mapperClass) {
        SqlSessionTemplate sqlSession = getSqlSessionTemplate(dbName);
        return sqlSession.getMapper(mapperClass);
    }

	public SqlSessionTemplate getSqlSessionTemplate(String dbName) {
		return sqlSessionTemplateCache.computeIfAbsent(dbName, this::createSqlSessionTemplate);
	}

	private SqlSessionTemplate createSqlSessionTemplate(String dbName) {
		DataSource ds = dataSourceCache.computeIfAbsent(dbName, this::createDataSource);
		SqlSessionFactory factory = sqlSessionFactoryCache.computeIfAbsent(dbName, key -> createSqlSessionFactory(ds));
		return new SqlSessionTemplate(factory);
	}

	public DataSource getDataSource(String dbName) {
		return dataSourceCache.computeIfAbsent(dbName, this::createDataSource);
	}

	private DataSource createDataSource(String dbName) {
		Hikari setting = properties.getDatasource().get(dbName).getHikari();

		// log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> dbName : " + dbName);

		if (setting == null) {
			throw new IllegalArgumentException("알 수 없는 DB 설정: " + dbName);
		}

		HikariConfig config = new HikariConfig();
		config.setJdbcUrl(setting.getJdbcUrl());
		config.setUsername(setting.getUsername());
		config.setPassword(setting.getPassword());
		config.setDriverClassName(setting.getDriverClassName());

		if (setting.getMaximumPoolSize() != null)
			config.setMaximumPoolSize(setting.getMaximumPoolSize());
		if (setting.getMinimumIdle() != null)
			config.setMinimumIdle(setting.getMinimumIdle());
		if (setting.getPoolName() != null)
			config.setPoolName(setting.getPoolName());

		return new HikariDataSource(config);
	}

	private SqlSessionFactory createSqlSessionFactory(DataSource dataSource) {
		try {
			SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();

			factoryBean.setDataSource(dataSource);
			// Mapper XML 위치 등록
			factoryBean.setMapperLocations(applicationContext.getResources("classpath:mapper/*.xml"));

			// MyBatis 설정 파일 등록 (예: aliases, typeHandlers 등)
			factoryBean.setConfigLocation(applicationContext.getResource("classpath:mybatis-config.xml"));

			return factoryBean.getObject();
		} catch (Exception e) {
			throw new RuntimeException("SqlSessionFactory 생성 실패", e);
		}
	}
}
