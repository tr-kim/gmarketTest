import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';
import { formatTranDate } from '@/utils/dateFormat';
// import { switchTranRslt } from '@/utils/bulkhistTran';
import { useBulkHistStore } from './useBulkHistStore';

const BulkHistGrid = React.memo(({ companyCode }) => {
  const store = useBulkHistStore((s) => s.gridStore);
  const totalCount = useBulkHistStore((s) => s.totalCount);
  const setTotalCount = useBulkHistStore((s) => s.setTotalCount);
  const setGridInstance = useBulkHistStore((s) => s.setGridInstance);
  const openMessage = useBulkHistStore((s) => s.openMessage);

  return (
    <div className="content">
      <DataGrid
        dataSource={store}
        remoteOperations={true}
        paging={{ pageSize: 50 }}
        pager={{
          visible: true,
          showInfo: true,
          showNavigationButtons: true,
          showPageSizeSelector: true,
          allowedPageSizes: [50, 100, 200],
        }}
        hoverStateEnabled
        focusedRowEnabled={true}
        headerFilter={{ visible: false }}
        searchPanel={{ visible: false }}
        columnAutoWidth
        allowColumnResizing
        columnResizingMode="widget"
        onRowClick={(e) => openMessage(e.data?.TRAN_MSG)}
		    onInitialized={(e) => setGridInstance(e.component)}
        onContentReady={(e) => setTotalCount(e.component.totalCount())}
      >
        <Toolbar>
          <Item location="before">
            <div
              style={{
                fontSize: '17px',
                color: '#333',
                padding: '0 5px',
              }}
            >
              총 {totalCount.toLocaleString()}건
            </div>
          </Item>
        </Toolbar>        

        <Column
          caption="대분류"
          alignment="center"
          customizeText={() => {
            if (companyCode === 0) return "옥션";
            if (companyCode === 1) return "G마켓";
            return ""; 
          }}
        />

        <Column dataField="TITLE" caption="제목" alignment="left" />

        <Column
          dataField="REQ_TIME"
          caption="전송 일시"
          alignment="center"
          customizeText={(e) => formatTranDate(e.value)}
        />

        <Column
          dataField="MSG"
          caption="메시지 내용"
          alignment="left"
          width={300}
        />

        <Column
          dataField="CNT"
          caption="전체"
          alignment="center"
        />

        <Column
          dataField="USER_ID"
          caption="발송ID"
          alignment="center"
        />

        <Column
          dataField="SVC_TYPE"
          caption="TYPE"
          alignment="center"          
        />

        <Column
          caption="성공/실패"
          alignment="center"
          calculateCellValue={function(rowData) {
					  return `${rowData.CNT_SUCC}/${rowData.CNT_DUP + rowData.CNT_SENDFAIL}`;
				  }}
        />

        <Column
          name="textBtn"
          caption="text파일"
          type="buttons"
          buttons={[
            { icon: "download",
            // onClick: function(e) {
            //   bulkHistTxt(e.row.data);
            // }
            }
          ]}
        />

      </DataGrid>
    </div>
  );
});

export default BulkHistGrid;
