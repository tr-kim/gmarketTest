import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';
import { formatTranDate } from '@/utils/dateFormat';
import { switchTranRslt } from '@/utils/histTran';
import { useHistStore } from './useHistStore';

const HistGrid = React.memo(() => {
  const store = useHistStore((s) => s.gridStore);
  const totalCount = useHistStore((s) => s.totalCount);
  const setTotalCount = useHistStore((s) => s.setTotalCount);
  const openMessage = useHistStore((s) => s.openMessage);

  const companyOptions = React.useMemo(
    () => [
      { code: 0, name: '옥션' },
      { code: 1, name: 'G마켓' },
    ],
    []
  );

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
        onContentReady={(e) =>
          setTotalCount(e.component.totalCount())
        }
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

        <Column dataField="TRAN_PR" caption="NO" alignment="center" />

        <Column
          dataField="COMPANY_CODE"
          caption="대분류"
          alignment="center"
          customizeText={(e) =>
            companyOptions.find((c) => c.code === e.value)?.name ?? ''
          }
        />

        <Column
          dataField="TABLE_NAME"
          caption="중분류"
          alignment="center"
        />

        <Column
          dataField="TRAN_PHONE"
          caption="수신 번호"
          alignment="center"
        />

        <Column
          dataField="TRAN_CALLBACK"
          caption="발신 번호"
          alignment="center"
        />

        <Column
          dataField="TRAN_DATE"
          caption="발송 일시"
          alignment="center"
          customizeText={(e) => formatTranDate(e.value)}
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
          customizeText={(e) => switchTranRslt(e.value)}
        />

        <Column
          dataField="CORP_RESERVED2"
          caption="Flow #"
          alignment="center"
        />
      </DataGrid>
    </div>
  );
});

export default HistGrid;
