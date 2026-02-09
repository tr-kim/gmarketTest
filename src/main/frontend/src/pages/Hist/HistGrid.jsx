import React from 'react';
import DataGrid, { Column, Toolbar, Item } from 'devextreme-react/data-grid';

const HistGrid = React.memo(
  ({ store, totalCount, onRowClick, setTotalCount }) => {
    return (
      <div className="content">
        <DataGrid
          dataSource={store}
          remoteOperations={{ paging: true, sorting: true }}
          paging={{ pageSize: 50 }}
          pager={{
            visible: true,
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            allowedPageSizes: [50, 100, 200],
          }}
          selection={{ mode: 'single' }}
          hoverStateEnabled
          headerFilter={{ visible: false }}
          searchPanel={{ visible: false }}
          columnAutoWidth
          allowColumnResizing
          columnResizingMode="widget"
          onRowClick={onRowClick}
          onContentReady={(e) => {
            setTotalCount(e.component.totalCount());
          }}
        >
          <Toolbar>
            <Item location="before">
              <div style={{ fontSize: '17px', color: '#333', padding: '0 5px' }}>
                총 {totalCount.toLocaleString()}건
              </div>
            </Item>
          </Toolbar>

          <Column dataField="TRAN_PR" caption="NO" />
          <Column dataField="TABLE_NAME" caption="중분류" />
          <Column dataField="TRAN_PHONE" caption="수신 번호" />
        </DataGrid>
      </div>
    );
  }
);

export default HistGrid;
