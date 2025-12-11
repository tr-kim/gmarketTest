$(function(){    
    const auctionTasks = [
        { id: 1, text: 'Prepare 2016 Financial' },
        { id: 2, text: 'Prepare 2016 Marketing Plan' },
        { id: 3, text: 'Update Personnel Files' },
        { id: 4, text: 'Review Health Insurance Options Under the Affordable Care Act' },
        { id: 5, text: 'New Brochures' },
        { id: 6, text: '2016 Brochure Designs' },
        { id: 7, text: 'Brochure Design Review' },
        { id: 8, text: 'Website Re-Design Plan' },
        { id: 9, text: 'Rollout of New Website and Marketing Brochures' },
        { id: 10, text: 'Create 2012 Sales Report' },
        { id: 11, text: 'Direct vs Online Sales Comparison Report' },
        { id: 12, text: 'Review 2012 Sales Report and Approve 2016 Plans' },
        { id: 13, text: 'Submit Signed NDA' },
        { id: 14, text: 'Update Revenue Projections' },
        { id: 15, text: 'Review Revenue Projections' },
        { id: 16, text: 'Comment on Revenue Projections' },
        { id: 17, text: 'Scan Health Insurance Forms' },
        { id: 18, text: 'Sign Health Insurance Forms' },
        { id: 19, text: 'Follow up with West Coast Stores' },
        { id: 20, text: 'Follow up with East Coast Stores' },
        { id: 21, text: 'Submit Refund Report for 2016 Recall' },
        { id: 22, text: 'Give Final Approval for Refunds' }
    ];
            
    $('#serviceListAuction').dxTreeList({
        dataSource: auctionTasks,
        keyExpr: 'id',
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
        // onRowClick: function(e) {
        //     if (e.rowType === 'data') {
        //         var component = e.component;
        //         var key = e.key;

        //         if (component.isRowSelected(key)) {
        //             component.deselectRows([key]);
        //         } else {
        //             component.selectRows([key], true); 
        //         }
        //     }
        // },
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
                        onClick() {
                            alert('1');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'text' }
        ]
    });


    const gmarketTasks = [
        { id: 1, text: 'Prepare 2016 Financial' },
        { id: 2, text: 'Prepare 2016 Marketing Plan' },
        { id: 3, text: 'Update Personnel Files' },
        { id: 4, text: 'Review Health Insurance Options Under the Affordable Care Act' },
        { id: 5, text: 'New Brochures' },
        { id: 6, text: '2016 Brochure Designs' },
        { id: 7, text: 'Brochure Design Review' },
        { id: 8, text: 'Website Re-Design Plan' },
        { id: 9, text: 'Rollout of New Website and Marketing Brochures' },
        { id: 10, text: 'Create 2012 Sales Report' },
        { id: 11, text: 'Direct vs Online Sales Comparison Report' },
        { id: 12, text: 'Review 2012 Sales Report and Approve 2016 Plans' },
        { id: 13, text: 'Submit Signed NDA' },
        { id: 14, text: 'Update Revenue Projections' },
        { id: 15, text: 'Review Revenue Projections' },
        { id: 16, text: 'Comment on Revenue Projections' },
        { id: 17, text: 'Scan Health Insurance Forms' },
        { id: 18, text: 'Sign Health Insurance Forms' },
        { id: 19, text: 'Follow up with West Coast Stores' },
        { id: 20, text: 'Follow up with East Coast Stores' },
        { id: 21, text: 'Submit Refund Report for 2016 Recall' },
        { id: 22, text: 'Give Final Approval for Refunds' },
        { id: 23, text: 'Prepare Product Recall Report' },
        { id: 24, text: 'Review Product Recall Report by Engineering Team' },
        { id: 25, text: 'Review Training Course for any Omissions' },
        { id: 26, text: 'Review Overtime Report' },
        { id: 27, text: 'Submit Overtime Request Forms' }
    ];
            
    $('#serviceListGmarket').dxTreeList({
        dataSource: gmarketTasks,
        keyExpr: 'id',
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
                            alert('1');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'text' }
        ]
    });

    const smilecashTasks = [
        { id: 1, text: 'Prepare 2016 Financial' },
        { id: 2, text: 'Prepare 2016 Marketing Plan' },
        { id: 3, text: 'Update Personnel Files' },
        { id: 4, text: 'Review Health Insurance Options Under the Affordable Care Act' }
    ];
            
    $('#serviceListSmilecash').dxTreeList({
        dataSource: smilecashTasks,
        keyExpr: 'id',
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
                            alert('1');
                        }
                    }
                }                
            ]
        },
        columns: [
            { dataField: 'text' }
        ]
    });
})