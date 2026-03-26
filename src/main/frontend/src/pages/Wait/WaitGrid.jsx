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

  
  const onDeleteSelected = async () => {
    
    const grid = useWaitStore.getState().gridInstance;
    if (!grid) return;

    const selectedRowsData = grid.getSelectedRowsData();

    if (selectedRowsData.length === 0) {
      alert('삭제할 메시지를 선택하세요.');
      return;
    }

    if (confirm(`${selectedRowsData.length}건을 삭제하시겠습니까?`)) {
      // [확인] 클릭 시 실행
      const param = selectedRowsData.map(row => ({
        bulkMsgKey: row.B_MSG_KEY,
        svcType: row.SVC_TYPE,
        companyCode: row.COMPANY_CODE,
      }));

      try {
        const response = await fetch("/api/v1/wait/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(param),
        });

        if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");

        const data = await response.json();
        const { code, result } = data;

        if (code === 1000) {
          // 성공 시 알림 후 그리드 리로드
          alert(result); 
          
        if (grid) {

          grid.beginUpdate();       // API 호출 일시 정지
          grid.clearSelection(); 
          grid.getDataSource().pageIndex(0);           
          grid.getDataSource().reload().done(() => {
            grid.endUpdate();       // 모든 설정 변경 후 한 번만 호출하도록 허용
          });
        }
        } else {
          alert(result);
        }
      } catch (error) {
        console.error("삭제 요청 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
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
                onClick={onDeleteSelected}
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
