import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';
// import { formatTranDate } from '@/utils/dateFormat';
// import { switchTranRslt } from '@/utils/alarmTran';
import { useAlarmStore } from './useAlarmStore';

const AlarmGrid = React.memo(() => {
  const store = useAlarmStore((s) => s.gridStore);
  const totalCount = useAlarmStore((s) => s.totalCount);
  const setTotalCount = useAlarmStore((s) => s.setTotalCount);
  const setGridInstance = useAlarmStore((s) => s.setGridInstance);
  const openMessage = useAlarmStore((s) => s.openMessage);

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
          dataField="COMPANY_CODE"
          caption="대분류"
          alignment="center"
          customizeText={(e) =>
            companyOptions.find((c) => c.code === e.value)?.name ?? ''
          }
        />

        <Column
          dataField="SERVER_ID"
          caption="서버"
          alignment="center"
          customizeText={(e) => 
            e.value === 1 ? '1번' : e.value === 2 ? '2번' : ''
          }
        />

        <Column
          dataField="SVC_NAME"
          caption="서비스"
          alignment="center"
        />

        <Column
          dataField="PROC_NAME"
          caption="프로세스"
          alignment="center"
        />

        <Column
          dataField="MON_COMMENT"
          caption="오류"
          alignment="center"          
        />

        <Column
          dataField="ALM_COMMENT"
          caption="알림"
          alignment="center"
        />

        <Column
          dataField="ALM_INFO"
          caption="상세"
          alignment="center"
          // customizeText={(e) => switchTranRslt(e.value)}
        />

        <Column
          dataField="ALM_DATE"
          caption="알림 발생 시간"
          alignment="center"
        />
      </DataGrid>
    </div>
  );
});

export default AlarmGrid;
