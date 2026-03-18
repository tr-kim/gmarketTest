import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { formatTranDate } from '@/utils/dateFormat';
// import { switchTranRslt } from '@/utils/waitTran';
import { useWaitStore } from './useWaitStore';

const WaitGrid = React.memo(() => {
  const store = useWaitStore((s) => s.gridStore);
  const totalCount = useWaitStore((s) => s.totalCount);
  const setTotalCount = useWaitStore((s) => s.setTotalCount);
  const setGridInstance = useWaitStore((s) => s.setGridInstance);
  const openMessage = useWaitStore((s) => s.openMessage);

  const companyOptions = React.useMemo(
    () => [
      { code: 0, name: '옥션' },
      { code: 1, name: 'G마켓' },
    ],
    []
  );

  function getAfterTime(minute) {
		const now = new Date();
		now.setMinutes(now.getMinutes() + minute);
		
		const yyyy = now.getFullYear();
		const MM = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		const HH = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		const ss = String(now.getSeconds()).padStart(2, '0');
		
		return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
	}

  const handleToggleSelectAll = () => {
    const grid = useWaitStore.getState().gridInstance; 
    if (!grid) return;

    const nowPlus30 = getAfterTime(30); 

    const allItems = grid.getDataSource().items();
    const allowedKeys = allItems
      .filter(row => row.REQ_TIME > nowPlus30)
      .map(row => row.B_MSG_KEY);

    const selectedKeys = grid.getSelectedRowKeys();

    const isAlreadySelected = 
      allowedKeys.length > 0 && 
      allowedKeys.length === selectedKeys.length && 
      allowedKeys.every(key => selectedKeys.includes(key));

    if (isAlreadySelected) {
      grid.clearSelection();
    } else {
      grid.selectRows(allowedKeys, false);
    }
  };

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
        selection={{
          mode: "multiple",
          allowSelectAll: false,
        }}
        hoverStateEnabled
        focusedRowEnabled={true}
        headerFilter={{ visible: false }}
        searchPanel={{ visible: false }}
        columnAutoWidth
        allowColumnResizing
        columnResizingMode="widget"
        onRowClick={(e) => openMessage(e.data)}
		    onInitialized={(e) => setGridInstance(e.component)}
        onContentReady={(e) => setTotalCount(e.component.totalCount())}
        onSelectionChanged={(e)=> {
          const grid = e.component;
          const nowPlus30 = getAfterTime(30); 
          const selectedRowsData = e.selectedRowsData;

          const allowedKeys = selectedRowsData
            .filter(row => row.REQ_TIME > nowPlus30)
            .map(row => row.B_MSG_KEY);

          const hasForbiddenRows = selectedRowsData.some(row => row.REQ_TIME <= nowPlus30);

          if (hasForbiddenRows) {
            alert('전송 임박 항목은 선택되지 않습니다.');
            grid.selectRows(allowedKeys, false);
          }
        }}
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
          <Item location="after">
            <div className="dx-toolbar-button-container">
              <Button
                text="전체 선택/해제"
                stylingMode= "outlined"
                type="danger"
                className="ms-2"
                onClick={handleToggleSelectAll}
              />
              <Button
                text="선택 삭제"
                stylingMode= "contained"
                type="danger"
                className="ms-2"
              />
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
          dataField="TITLE"
          caption="제목"
          alignment="left"
          width={200}
        />

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
          width={350}
        />

        <Column
          dataField="CNT"
          caption="전체"
          alignment="center"
        />

        <Column
          dataField="SVC_TYPE"
          caption="상세"
          alignment="center"
        />

        <Column
          dataField="USER_ID"
          caption="발송ID"
          alignment="center"
        />

      </DataGrid>
    </div>
  );
});

export default WaitGrid;
