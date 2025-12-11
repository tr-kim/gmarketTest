$(function(){    
            
    $('#serviceListAuction').dxTreeList({
        dataSource: auctionList,
        keyExpr: 'svcName',
        showSelectionControls: true,
        selection: {
            mode: 'multiple'
        },
        headerFilter: {
            visible: false
        },
        showColumnHeaders: false,
        columnChooser: {
            enabled: false 
        },
        onRowClick: function(e) {
            if (e.rowType === 'data') {
                var component = e.component;
                var key = e.key;

                if (component.isRowSelected(key)) {
                    component.deselectRows([key]);
                } else {
                    component.selectRows([key], true); 
                }
            }
        },
        toolbar: {
            items: [
                {
                    location: "before",
                    template: function() {
                        return $("<span>")
                            .text("옥션")
                            .css({
                                "font-size": "16px",
                                "font-weight": "600",
                                "padding-left": "5px",
                            });
                    }
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    type: 'default',
                    options: {
                        stylingMode: 'contained',
						type: 'default',
                        text: '저장',
                        onClick: function(e) {                            
                            saveService('#serviceListAuction');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'svcName' }
        ]
    });
            
    $('#serviceListGmarket').dxTreeList({
        dataSource: gmarketList,
        keyExpr: 'svcName',
        showSelectionControls: true,
        selection: {
            mode: 'multiple'
        },
        headerFilter: {
            visible: false
        },
        showColumnHeaders: false,
        columnChooser: {
            enabled: false 
        },
        onRowClick: function(e) {
            if (e.rowType === 'data') {
                var component = e.component;
                var key = e.key;

                if (component.isRowSelected(key)) {
                    component.deselectRows([key]);
                } else {
                    component.selectRows([key], true); 
                }
            }
        },
        toolbar: {
            items: [
                {
                    location: "before",
                    template: function() {
                        return $("<span>")
                            .text("G마켓")
                            .css({
                                "font-size": "16px",
                                "font-weight": "600",
                                "padding-left": "5px",
                            });
                    }
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    type: 'default',
                    options: {
                        stylingMode: 'contained',
						type: 'default',
                        text: '저장',
                        onClick() {
                            saveService('#serviceListGmarket');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'svcName' }
        ]
    });
            
    $('#serviceListSmilecash').dxTreeList({
        dataSource: smileCashList,
        keyExpr: 'svcName',
        showSelectionControls: true,
        selection: {
            mode: 'multiple'
        },
        headerFilter: {
            visible: false
        },
        showColumnHeaders: false,
        columnChooser: {
            enabled: false 
        },
        onRowClick: function(e) {
            if (e.rowType === 'data') {
                var component = e.component;
                var key = e.key;

                if (component.isRowSelected(key)) {
                    component.deselectRows([key]);
                } else {
                    component.selectRows([key], true); 
                }
            }
        },
        toolbar: {
            items: [
                {
                    location: "before",
                    template: function() {
                        return $("<span>")
                            .text("스마일캐시")
                            .css({
                                "font-size": "16px",
                                "font-weight": "600",
                                "padding-left": "5px",
                            });
                    }
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    type: 'default',
                    options: {
                        stylingMode: 'contained',
						type: 'default',
                        text: '저장',
                        onClick() {
                            saveService('#serviceListSmilecash');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'svcName' }
        ]
    });
})
function saveService(service){
    let treeList = $(service).dxTreeList('instance');

    console.log(treeList.getSelectedRowKeys());
}