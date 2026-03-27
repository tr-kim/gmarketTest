import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';
import { formatTranDate } from '@/utils/dateFormat';
// import { switchTranRslt } from '@/utils/statTran';
import { useStatStore } from './useStatStore';

const StatGrid = React.memo(() => {
  const store = useStatStore((s) => s.gridStore);
  const totalCount = useStatStore((s) => s.totalCount);
  const setTotalCount = useStatStore((s) => s.setTotalCount);
  const setGridInstance = useStatStore((s) => s.setGridInstance);
  const openMessage = useStatStore((s) => s.openMessage);

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
          dataField="RESULT_DATE"
          caption="시간/일자"
          alignment="center"
        />

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
          dataField="TRY_CNT"
          caption="전체"
          alignment="center"
        />

        <Column
          dataField="SUCC_CNT"
          caption="성공"
          alignment="center"
        />

        <Column
          dataField="FAIL_CNT"
          caption="실패"
          alignment="center"
          customizeText={(e) => formatTranDate(e.value)}
        />

      </DataGrid>
    </div>
  );
});

export default StatGrid;
