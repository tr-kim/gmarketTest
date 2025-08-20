package com.web.gmarket.common.config;

// @Configuration
//public class DataSourceConfig  {
//	
//	final ApplicationContext applicationContext;
//
//    public DataSourceConfig (ApplicationContext ac) {
//        this.applicationContext = ac;
//    }
//
//    @Bean
//    @ConfigurationProperties(prefix = "spring.datasource.hikari")
//    HikariConfig hikariConfig() {
//        return new HikariConfig();
//    }
//
//    @Bean
//    DataSource dataSource() {
//        return new HikariDataSource(hikariConfig());
//    }
//
//    @Bean
//    SqlSessionFactory sqlSessionFactory(DataSource dataSource, ApplicationContext applicationContext) throws Exception {
//        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
//        factoryBean.setDataSource(dataSource);
//        // 매퍼 xml 위치 지정
//        factoryBean.setMapperLocations(applicationContext.getResources("classpath:mapper/*.xml"));
//        // mybatis 설정 xml (있으면)
//        factoryBean.setConfigLocation(applicationContext.getResource("classpath:mybatis-config.xml"));
//        return factoryBean.getObject();
//    }
//
//    @Bean
//    SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
//        return new SqlSessionTemplate(sqlSessionFactory);
//    }
//    
//}
