$(function() {
	// 공통 데이터 조회 함수
	function getInitialData(companyCode) {
		return fetchGridList(companyCode).then(data => {
			
			const gridData = data.data || data;
			
			const initialSelectedKeys = gridData
				.filter(item => item.CHECK_BIT === 'T')
				.map(item => item.SERVICE_NAME);
				
			return {
				gridData: gridData,
				selectedKeys: initialSelectedKeys 
			};
		});
	}
	// 옥션
	getInitialData('AU').then(({ gridData, selectedKeys }) => {
		$('#serviceListAuction').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SERVICE_NAME",
				data: gridData 
			}),
			keyExpr: 'SERVICE_NAME',
			selectedRowKeys: selectedKeys,
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
								saveService('#serviceListAuction', 'AU');
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SERVICE_NAME' }
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
	});

	
	// G마켓
	getInitialData('GM').then(({ gridData, selectedKeys }) => {
		$('#serviceListGmarket').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SERVICE_NAME",
				data: gridData 
			}),
			keyExpr: 'SERVICE_NAME',
			selectedRowKeys: selectedKeys,
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
								saveService('#serviceListGmarket', 'GM');
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SERVICE_NAME' }
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
	});
	
	// 스마일캐시
	getInitialData('SC').then(({ gridData, selectedKeys }) => {
		$('#serviceListSmilecash').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SERVICE_NAME",
				data: gridData 
			}),
			keyExpr: 'SERVICE_NAME',
			selectedRowKeys: selectedKeys,
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
								saveService('#serviceListSmilecash', 'SC');
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SERVICE_NAME' }
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
	});

	
	function saveService(service, companyCode) {

		const selectedRows = $(service).dxTreeList('instance').getSelectedRowsData();

		console.log(selectedRows);
		// const serviceList = selectedRows.map(row => ({
		// 	serviceName: row.SERVICE_NAME,
		// 	checkBit: 'T'
		// }));

		const param = {
			companyCode1: `${companyCode}01`,
			companyCode2: `${companyCode}02`,
			serviceList: serviceList
		};
		
		return $.ajax({
			url: "/api/v1/service/update",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(result => ({
			data: result.data,
			totalCount: result.totalCount
		}))
		.catch(() => {
			showDialogCustom("error");
			return { data: [], totalCount: 0 };
		});

	}

	// 데이터 조회 함수
	function fetchGridList(companyCode) {

		const param = {
			companyCode1: `${companyCode}01`,
			companyCode2: `${companyCode}02`,
		};
		
		return $.ajax({
			url: "/api/v1/service/list",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(result => ({
			data: result.data,
			totalCount: result.totalCount
		}))
		.catch(() => {
			showDialogCustom("error");
			return { data: [], totalCount: 0 };
		});
	}

})
