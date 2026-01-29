import React, { useRef, useState } from 'react';
import { switchTranRslt } from '@/utils/histTran';
import { formatTranDate } from '@/utils/dateFormat';
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { Toolbar, Item } from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import axios from 'axios';
import dayjs from 'dayjs';

// --------------------
// 임시 전역 데이터 (나중에 API / props로 교체)
// --------------------
const userGrade = window.userGrade ?? 0;
const companyCode = window.companyCode ?? 0;
const codeList = window.codeList ?? [];

// --------------------
// 메인 컴포넌트
// --------------------
export default function Hist() {
  const gridRef = useRef(null);

  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [phoneNum, setPhoneNum] = useState('');
  const [company, setCompany] = useState(companyCode);
  const [table, setTable] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchCond, setSearchCond] = useState(null); // 조회 조건용

  // --------------------
  // SelectBox 옵션 구성
  // --------------------
  const defaultOption = { code: -1, name: '선택하세요' };

  const companyOptions = [
    defaultOption,
    ...(userGrade === 0
      ? [
          { code: 0, name: '옥션' },
          { code: 1, name: 'G마켓' },
        ]
      : [{ code: companyCode, name: companyCode === 0 ? '옥션' : 'G마켓' }]
    ),
  ];
    
  const tableOptions = {
    0: [defaultOption, { code: 0, name: '전체' }],
    1: [defaultOption, { code: 0, name: '전체' }]
  };

  codeList.forEach(({ companyCode, code, name }) => {
    tableOptions[companyCode]?.push({ code, name });
  });

  // --------------------
  // 조회 파라미터
  // --------------------
  const buildSearchParams = (cond, loadOptions = {}) => {
    const tableItem = tableOptions[cond.company]?.find(
      t => t.code === cond.table
    );

    return {
      startDate: cond.startDate
        ? dayjs(cond.startDate).format('YYYYMM')
        : '',
      endDate: cond.endDate
        ? dayjs(cond.endDate).format('YYYYMM')
        : '',
      startTime: cond.startDate
        ? dayjs(cond.startDate).format('YYYYMMDD')
        : '',
      endTime: cond.endDate
        ? dayjs(cond.endDate).format('YYYYMMDD')
        : '',
      phoneNum: cond.phoneNum,
      companyCode: cond.company,
      tableName: tableItem?.name === '전체' ? '' : tableItem?.name ?? '',
      skip: loadOptions.skip ?? 0, // 페이지 시작 위치(offset)
      take: loadOptions.take ?? 50, // 페이지 크기(limit)
      sort: loadOptions.sort ?? [] // 정렬
    };
  };
  
  const onSearch = () => {
    setSearchCond({
      startDate,
      endDate,
      phoneNum,
      company,
      table
    });

    gridRef.current.instance.refresh();
  };
  
  // --------------------
  // DataGrid Store
  // --------------------
  const store = new CustomStore({
    key: ['TRAN_PR', 'TABLE_NAME', 'TRAN_PHONE', 'TRAN_CALLBACK'],
    load: async (loadOptions) => {
      if (!searchCond) {
        return { data: [], totalCount: 0 };
      }

      const param = buildSearchParams(searchCond, loadOptions);
      const res = await axios.post('/api/v1/hist/list', param);

      return {
        data: res.data.data,
        totalCount: res.data.totalCount
      };
    }
  });
  
  // --------------------
  // Render
  // --------------------
  return (
    <div className='container pb-3'>
      <p className="font-sz-20 font-weight-600 pt-3 text-666">이력 조회</p>
      {/* 조회 조건 */}
      <div className="content mx-0 mb-2 search-area">
        <div className="row d-flex mb-2">
          <div className="col-6 d-flex align-items-center">  
            <div className="col-3">조회 기간</div>
            <div className="col d-flex align-items-center">
              <DateBox value={startDate} onValueChanged={e => setStartDate(e.value)} className='flex-fill'/>            
              <span className='px-1 flex-fill text-center'>~</span>            
              <DateBox value={endDate} onValueChanged={e => setEndDate(e.value)} className='flex-fill'/>  
            </div>                                 
          </div>
          <div className="col-6 d-flex align-items-center">
            <div className="col-3">대분류</div>
            <div className="col">
              <SelectBox
                dataSource={companyOptions}
                displayExpr="name"
                valueExpr="code"
                value={company}
                onValueChanged={e => {
                  setCompany(e.value);
                  setTable(-1);
                }}
              />
            </div>
          </div>        
        </div>
        <div className="row d-flex mb-2">
          <div className="col-6 d-flex align-items-center">  
            <div className="col-3">수신 번호</div>
            <div className="col">
              <TextBox
                value={phoneNum}
                placeholder="수신 번호"
                onValueChanged={e => setPhoneNum(e.value)}
              />
            </div>            
          </div>
          <div className="col-6 d-flex align-items-center">  
            <div className="col-3">중분류</div>
            <div className="col">
              <SelectBox
                dataSource={tableOptions[company]}
                displayExpr="name"
                valueExpr="code"
                value={table}
                onValueChanged={e => setTable(e.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-end">
           <Button
            text="조회"
            onClick={onSearch}
          />
        </div>
      </div>
      {/* 조회 그리드 */}
      <div className="content">
        <DataGrid
        ref={gridRef}
        dataSource={store}
        remoteOperations={{ paging: true, sorting: true }}
        paging={{ pageSize: 50 }}
        pager={{
          visible: true,
          showInfo: true,
          showNavigationButtons: true,
          showPageSizeSelector: true,
          allowedPageSizes: [50, 100, 200]
        }}
        selection={{ mode: 'single' }}
        hoverStateEnabled
        headerFilter={{ visible: false }}
        searchPanel={{ visible: false, width: 300 }}
        columnAutoWidth
        allowColumnResizing
        columnResizingMode="widget"
        //onRowClick={e => {
          //  openHistMessageInquiry(e.data);
      //}}
        onContentReady={e => {
            setTotalCount(e.component.totalCount());
        }}
      >
      
        <Toolbar>
          <Item location="before">
            <div style={{ fontSize: '17px', color: '#333', padding: '0 5px' }}>
              총 {totalCount.toLocaleString()}건
            </div>
          </Item>
          <Item name="searchPanel" />
        </Toolbar>
      
          <Column dataField="TRAN_PR" caption="NO" alignment="center" />
      <Column
        caption="대분류"
        alignment="center"
        customizeText={() =>
          companyOptions.find(c => c.code === searchCond?.company)?.name
        }
      />
          <Column dataField="TABLE_NAME" caption="중분류" alignment="center" />
      <Column dataField="TRAN_PHONE" caption="수신 번호" alignment="center" />
      <Column dataField="TRAN_CALLBACK" caption="발신 번호" alignment="center" />
      <Column
        dataField="TRAN_DATE"
        caption="발송 일시"
        alignment="center"
        customizeText={e => formatTranDate(e.value)}
      />
      <Column
        dataField="TRAN_MSG"
        caption="메시지 내용"
        alignment="left"
        width={350}
      />
      <Column
        dataField="TRAN_RSLT"
        caption="결과"
        alignment="center"
        customizeText={e => switchTranRslt(e.value)}
      />
      <Column
        dataField="CORP_RESERVED2"
        caption="Flow #"
        alignment="center"
      />
        </DataGrid>
      </div>
    </div>
  );
}