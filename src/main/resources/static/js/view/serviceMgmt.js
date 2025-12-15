$(function() {
	// 옥션
	$('#serviceListAuction').dxTreeList({
		dataSource: auctionList,
		keyExpr: 'svcName',
		selection: {
			mode: 'multiple'
		},
		headerFilter: {
			visible: false
		},
		showColumnHeaders: false,
		showSelectionControls: true,
		hoverStateEnabled: true,
		columnChooser: {
			enabled: false
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
		],
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
		}
	}).dxTreeList('instance');
	
	// G마켓
	$('#serviceListGmarket').dxTreeList({
		dataSource: gmarketList,
		keyExpr: 'svcName',
		selection: {
			mode: 'multiple'
		},
		headerFilter: {
			visible: false
		},
		showColumnHeaders: false,
		showSelectionControls: true,
		hoverStateEnabled: true,
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
							saveService('#serviceListGmarket');
						}
					}
				}
			]
		},
		columns: [
			{ dataField: 'svcName' }
		],
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
		}
	}).dxTreeList('instance');
	
	// 스마일캐시
	$('#serviceListSmilecash').dxTreeList({
		dataSource: smileCashList,
		keyExpr: 'svcName',
		selection: {
			mode: 'multiple'
		},
		headerFilter: {
			visible: false
		},
		showColumnHeaders: false,
		showSelectionControls: true,
		hoverStateEnabled: true,
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
							saveService('#serviceListSmilecash');
						}
					}
				}
			]
		},
		columns: [
			{ dataField: 'svcName' }
		],
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
		}
	}).dxTreeList('instance');
	
	function saveService(service) {
		let treeList = $(service).dxTreeList('instance');
		
		console.log(treeList.getSelectedRowKeys());
	}
})
