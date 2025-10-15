package com.web.gmarket.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.alarm.mapper.AlarmMapper;
import com.web.gmarket.bulk.broad.mapper.BroadcastMsgMapper;
import com.web.gmarket.bulk.db.mapper.DbSendMapper;
import com.web.gmarket.bulk.excel.mapper.ExcelSendMapper;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.mapper.CommonSendMapper;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.hist.mapper.HistMapper;
import com.web.gmarket.real.mapper.RealMapper;
import com.web.gmarket.stat.mapper.StatCodeMapper;
import com.web.gmarket.stat.mapper.StatMapper;
import com.web.gmarket.user.mapper.UserMapper;
import com.web.gmarket.wait.mapper.WaitMapper;

@Service
public class CommonService {

	@Autowired
    private DynamicDataSourceService dynamicDataSourceService;

    public DbSendMapper getDbSendMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, DbSendMapper.class);
    }

    public BroadcastMsgMapper getBroadcastMsgMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, BroadcastMsgMapper.class);
    }

    public CommonSendMapper getCommonSendMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, CommonSendMapper.class);
    }
    
    public UserMapper getUserMapper() {
        return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMARKET, UserMapper.class);
    }
    
    public WaitMapper getWaitMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, WaitMapper.class);
    }
    
    public StatMapper getStatMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, StatMapper.class);
    }
    
    public StatCodeMapper getStatCodeMapper() {
        return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMARKET, StatCodeMapper.class);
    }
    
    public RealMapper getRealMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, RealMapper.class);
    }
    
    public HistMapper getHistMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, HistMapper.class);
    }
    
    public ExcelSendMapper getExcelSendMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, ExcelSendMapper.class);
    }
    
    public AlarmMapper getAlarmMapper() {
        return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMARKET, AlarmMapper.class);
    }
}
