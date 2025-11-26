package com.web.gmarket.common.service;

import java.io.IOException;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.alarm.mapper.AlarmMapper;
import com.web.gmarket.bulk.broad.mapper.BroadcastMsgMapper;
import com.web.gmarket.bulk.db.mapper.DbSendMapper;
import com.web.gmarket.bulk.excel.mapper.ExcelSendMapper;
import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.config.FilePathConfig;
import com.web.gmarket.common.ftp.FtpClientManager;
import com.web.gmarket.common.mapper.CommonSendMapper;
import com.web.gmarket.common.mapper.ServiceInfoMapper;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.vo.FtpDto;
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
	
	@Autowired
	private FtpClientManager FtpClientManager;
	
	private final FilePathConfig filePathConfig;

    public CommonService(FilePathConfig filePathConfig) {
        this.filePathConfig = filePathConfig;
    }

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
    
    public ServiceInfoMapper getServiceInfoMapper() {
        return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMARKET, ServiceInfoMapper.class);
    }
    
    public FTPClient createConnection(Integer code, String type) throws IOException {
    	return FtpClientManager.createConnection(code, type);
    }
    
    public void uploadFile(FTPClient ftpClient, FtpDto dto) throws IOException, IllegalArgumentException {
    	FtpClientManager.uploadFile(ftpClient, dto);
    }
    
    public void uploadFile(FtpDto dto) throws IOException, IllegalArgumentException {
    	FtpClientManager.uploadFile(dto);
    }
    
    public String getFilePath(String type) {
    	switch(type) {
    		case ConstantsUtils.EXCEL: return filePathConfig.getExcel();
    		case ConstantsUtils.TXT: return filePathConfig.getTxt();
    		default: throw new IllegalArgumentException("File Path Unknown type: " + type);
    	}
    }
    
    public String getImageFilePath(String type) {
    	switch(type) {
    		case ConstantsUtils.SEND_TYPE_SINGLE: return filePathConfig.getImageSingle();
    		case ConstantsUtils.SEND_TYPE_EXCEL: return filePathConfig.getImageExcel();
    		case ConstantsUtils.SEND_TYPE_FILE: return filePathConfig.getImageFile();
    		case ConstantsUtils.SEND_TYPE_DB: return filePathConfig.getImageDb();
    		default: throw new IllegalArgumentException("Image File Path Unknown type: " + type);
    	}
    }
}
