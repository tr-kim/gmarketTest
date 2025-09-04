package com.web.gmarket.bulk.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.DBUtils;
import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.mapper.DbSendMapper;
import com.web.gmarket.bulk.db.service.DbSendService;

@Service
//@RequiredArgsConstructor
public class DbSendServiceImpl implements DbSendService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

    @Override
    public List<DbSendDto> getDbSendList(DbSendDto dbSendDto) {

        String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());


        String tableName = "";
        if ("sms".equals(dbSendDto.getMessageType())) {
            tableName = "SMSCLI_TBL_LARGE";
        } else if ("lms".equals(dbSendDto.getMessageType())) {
            tableName = "LMSCLI_TBL_LARGE";
        } else if ("mms".equals(dbSendDto.getMessageType())) {
            tableName = "MMSCLI_TBL_LARGE";
        } else {
            tableName = "SMSCLI_TBL_LARGE";
        }
        dbSendDto.setTableName(tableName);


        return getMapper(dbName).selectDbSendList(dbSendDto);
    }

    @Override
    public int getDbSendCount(DbSendDto dbSendDto) {
        String dbName = DBUtils.getDBName(dbSendDto.getCompanyCode());
        return getMapper(dbName).selectDbSendCount(dbSendDto);
    }

    private DbSendMapper getMapper(String dbName) {
        return dynamicDataSourceService.getMapper(dbName, DbSendMapper.class);
    }
    // private final DbSendMapper dbSendMapper;

    // @Override
    // public List<DbSendDto> getDbSendList(DbSendDto dbSendDto) {
    //     String tableName = "";
    //     if ("sms".equals(dbSendDto.getMessageType())) {
    //         tableName = "SMSCLI_TBL_LARGE";
    //     } else if ("lms".equals(dbSendDto.getMessageType())) {
    //         tableName = "LMSCLI_TBL_LARGE";
    //     } else if ("mms".equals(dbSendDto.getMessageType())) {
    //         tableName = "MMSCLI_TBL_LARGE";
    //     } else {
    //         tableName = "SMSCLI_TBL_LARGE";
    //     }

    //     // MyBatis에서 사용할 수 있도록 DTO에 세팅
    //     dbSendDto.setTableName(tableName);

    //     return dbSendMapper.selectDbSendList(dbSendDto);
    // }

    // @Override
    // public int getDbSendCount(DbSendDto dbSendDto) {
    //     return dbSendMapper.selectDbSendCount(dbSendDto);
    // }

    

}
