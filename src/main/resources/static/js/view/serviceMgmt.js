$(function() {
	// 공통 데이터 조회 함수
	function getInitialData(companyCode) {
		return fetchGridList(companyCode).then(data => {
			
			const gridData = data.data || data;
			
			const initialSelectedKeys = gridData
				.filter(item => item.CHECK_BIT === 'T')
				.map(item => item.SVC_NAME);
				
			return {
				gridData: gridData,
				selectedKeys: initialSelectedKeys 
			};
		});
	}
	
	// 옥션
	getInitialData(0).then(({ gridData, selectedKeys }) => {
		$('#serviceListAuction').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SVC_NAME",
				data: gridData 
			}),
			keyExpr: 'SVC_NAME',			
			selection: {
				mode: 'multiple'
			},
			selectedRowKeys: selectedKeys,
			columnAutoWidth: true,
			hoverStateEnabled: true,
			columnChooser: {
				enabled: false,
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
								saveService('#serviceListAuction', 0);
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SVC_NAME', caption: '전체 선택'}
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
	getInitialData(1).then(({ gridData, selectedKeys }) => {
		$('#serviceListGmarket').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SVC_NAME",
				data: gridData 
			}),
			keyExpr: 'SVC_NAME',			
			selection: {
				mode: 'multiple'
			},
			selectedRowKeys: selectedKeys,
			columnAutoWidth: true,
			hoverStateEnabled: true,
			columnChooser: {
				enabled: false,
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
								saveService('#serviceListGmarket', 1);
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SVC_NAME', caption: '전체 선택'}
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
	getInitialData(2).then(({ gridData, selectedKeys }) => {
		$('#serviceListSmilecash').dxTreeList({
			dataSource: new DevExpress.data.ArrayStore({
				key: "SVC_NAME",
				data: gridData 
			}),
			keyExpr: 'SVC_NAME',			
			selection: {
				mode: 'multiple'
			},
			selectedRowKeys: selectedKeys,
			columnAutoWidth: true,
			hoverStateEnabled: true,
			columnChooser: {
				enabled: false,
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
								saveService('#serviceListSmilecash', 2);
							}
						}
					}
				]
			},
			columns: [
				{ dataField: 'SVC_NAME', caption: '전체 선택'}
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
	
	// 서비스 저장 함수
	function saveService(service, companyCode) {
		const instance = $(service).dxTreeList('instance');
		const selectedRows = instance.getSelectedRowsData();
		
		let param;
		
		if (selectedRows.length === 0) {
			// 전체 F
			param = [{
				companyCode: companyCode
			}];
		} else {
			// 선택 대상만 T
			param = selectedRows.map(row => ({
				companyCode: companyCode,
				svcName: row.SVC_NAME,
			}));
		}
		
		return $.ajax({
			url: "/api/v1/service/update",
			method: "PUT",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(() => {
			return getInitialData(companyCode); // 재조회
		})
		.then(data => {
			showDialogCustom("저장되었습니다.");
		})
		.catch(() => {
			showDialogCustom("error");
			return { data: [] };
		});
	}
	
	// 서비스 조회 함수
	function fetchGridList(companyCode) {
		const param = {
			companyCode: companyCode
		};
		
		return $.ajax({
			url: "/api/v1/service/list",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(result => ({
			data: result.data
		}))
		.catch(() => {
			showDialogCustom("error");
			return { data: [] };
		});
	}
	
})
