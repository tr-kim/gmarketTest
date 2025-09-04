package com.web.gmarket.bulk.db.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.bulk.db.dto.DbSendDto;

@Mapper
public interface DbSendMapper {

    List<DbSendDto> selectDbSendList(DbSendDto dbSendDto);

    int selectDbSendCount(DbSendDto dbSendDto);
}
