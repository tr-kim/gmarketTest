import React, { useEffect, useState } from 'react';

import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import RadioGroup from 'devextreme-react/radio-group';
import CustomStore from 'devextreme/data/custom_store';
import dayjs from 'dayjs';
import axios from 'axios';

import StatGrid from './StatGrid';
import { useAppStore } from '@/useAppStore';
import { useStatStore } from './useStatStore';

const priorityEntities = [
  { id: 1, text: '시간' },
  { id: 2, text: '일' },
  { id: 3, text: '월' },
  { id: 4, text: '년' },
];
const tasks = [{
  priority: 1,
  displayFormat: 'yyyy-MM-dd',
}, {
  priority: 2,
  displayFormat: 'yyyy-MM-dd',
}, {
  priority: 3,
  displayFormat: 'yyyy-MM',
}, {
  priority: 4,
  displayFormat: 'yyyy',
}];

export default function Stat() {
  const session = useAppStore((s) => s.session);

  const userGrade = session?.userGrade ?? 0;
  const companyCode = session?.companyCode ?? 0;
  const timetype = session?.timeType ?? 1;

  const today = new Date();

  const startHour =  new Date(2025, 0, 1, 0, 0);
  const endHour =  new Date(2025, 0, 1, 23, 0);

  /* --------------------
   * 조회 조건 state
   * -------------------- */
  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    company: companyCode,
    table: 0,
    timeType: timetype,
    startHour: startHour,
    endHour: endHour,
  });
  
  /* --------------------
   * Zustand actions
   * -------------------- */
  const codeList = useStatStore((s) => s.codeList);
  const setCodeList = useStatStore((s) => s.setCodeList);
  const setGridStore = useStatStore((s) => s.setGridStore);

  /* --------------------
   * 대분류 옵션
   * -------------------- */
  const defaultOption = { code: -1, name: '선택하세요' };

  const companyOptions = [
    defaultOption,
    ...(userGrade === 0
      ? [
          { code: 0, name: '옥션' },
          { code: 1, name: 'G마켓' },
        ]
      : [
          {
            code: companyCode,
            name: companyCode === 0 ? '옥션' : 'G마켓',
          },
        ]),
  ];

  /* --------------------
   * 중분류 옵션
   * -------------------- */
  const tableOptions = {
    0: [defaultOption, { code: 0, name: '전체' }],
    1: [defaultOption, { code: 0, name: '전체' }],
  };

  codeList.forEach(({ companyCode, code, name }) => {
    tableOptions[companyCode]?.push({ code, name });
  });

  /* --------------------
   * 중분류 옵션 조회
   * 대분류 변경 시 중분류 재조회
   * --------------------*/
  useEffect(() => {
    const fetchCodeList = async () => {
      try {
        const res = await axios.post('/api/v1/stat/codeList', {
          companyCode: form.company,
        });

        setCodeList(res.data ?? []);
      } catch (err) {
        console.error('codeList 조회 실패', err);
        setCodeList([]);
      }
    };

    if (form.company === -1) {
      setCodeList([]);
      return;
    }

    fetchCodeList();
  }, [form.company]); 

  /* --------------------
   * 조회 검증
   * -------------------- */
  const validateSearch = (cond) => {
    const { startDate, endDate, company, table } = cond;

    if (company === -1) {
      alert('대분류를 선택하세요.');
      return false;
    }

    if (table === -1) {
      alert('중분류를 선택하세요.');
      return false;
    }

    if (startDate > endDate) {
      alert('조회 기간을 다시 입력하세요.');
      return false;
    }

    return true;
  };

  /* --------------------
   * 공통 파라미터 생성
   * -------------------- */
  const buildStatParams = (cond, tableOptions, extra = {}) => {
    const tableItem = tableOptions[cond.company]?.find(
      (t) => t.code === cond.tableCode
    );

    let dateFormat = 'YYYY-MM-DD';
    if (cond.timeType === 3) dateFormat = 'YYYY-MM';
    if (cond.timeType === 4) dateFormat = 'YYYY';

    const params = {
      companyCode: cond.company,
      timeType: cond.timeType,
      tableCode: tableItem?.name === '전체' ? '' : tableItem?.name,
      startDate: dayjs(cond.startDate).format(dateFormat),
      endDate: dayjs(cond.endDate).format(dateFormat),
      ...extra,
    };

    if (cond.timeType === 1) {
      params.startHour = String(cond.startHour.getHours()).padStart(2, "0");
      params.endHour = String(cond.endHour.getHours()).padStart(2, "0");
    }

    return params;

  }; 
    
  /* --------------------
   * CustomStore 생성
   * -------------------- */
  const createStore = (cond) =>
    new CustomStore({
      key: ["RESULT_DATE", "COMPANY_CODE", "TABLE_CODE"],
      load: (loadOptions) => {
		
		const params = buildStatParams(cond, tableOptions, {
		  // DevExtreme Options
		  skip: loadOptions.skip ?? 0, // 페이지 시작 위치(offset)
		  take: loadOptions.take ?? 50, // 페이지 크기(limit)
		  sort: loadOptions.sort || [], // 정렬
		});
		
		return axios.post('/api/v1/stat/list', params).then((res) => ({
		  data: res.data.list,
		  totalCount: res.data.totalCount,
		}));
      },
    });
  
    /* --------------------
     * 페이지 최초 진입 시 조회
     * -------------------- */
    useEffect(() => {
      if (!validateSearch(form)) return;
      setGridStore(createStore({ ...form }));
    }, []);
  
    /* --------------------
     * 조회 버튼
     * -------------------- */
    const onSearch = () => {
      if (!validateSearch(form)) return;
      setGridStore(createStore({ ...form }));
    }; 
    
  return (
    <div id='statGrid' className="container pb-3">
      <p className="font-sz-20 font-weight-600 pt-3 text-666">
        정산/통계 조회
      </p>

      {/* 조회 조건 */}
      <div className="content mx-0 mb-2 search-area">
        <div className="row d-flex mb-2">
          <div className="col-7 d-flex align-items-center">
            <div className="col-2">구분</div>
            <div className="col">
              <RadioGroup
                id="radio-group-with-selection"
                items={priorityEntities}
                value={form.timeType}
                valueExpr="id"
                displayExpr="text"
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, timeType: e.value }))
                }
                layout="horizontal"
                className='stat-radio'
              />
            </div>
          </div>

          <div className="col-5 d-flex align-items-center">
            <div className="col-3">대분류</div>
            <div className="col">
              <SelectBox
                dataSource={companyOptions}
                valueExpr="code"
                displayExpr="name"
                value={form.company}
                onValueChanged={(e) =>
                  setForm((p) => ({
                    ...p,
                    company: e.value,
                    table: -1,
                  }))
                }
              />
            </div>
            
          </div>
        </div>

        <div className="row d-flex mb-2">
          <div className="col-7 d-flex align-items-center">
            <div className="col-2">조회 기간</div>
            <div id="tasks-list" className="col d-flex align-items-center">
              {tasks
                .filter((task) => task.priority === form.timeType)
                .map((task) => (
                  <div key={task.priority} className="col d-flex align-items-center">
                    <DateBox
                      value={form.startDate}
                      displayFormat={task.displayFormat}
                      type="date"
                      onValueChanged={(e) =>
                        setForm((p) => ({ ...p, startDate: e.value }))
                      }
                    />
                    {form.timeType === 1 && (
                      <DateBox 
                        type="time" 
                        className='ms-1'
                        width={120}
                        displayFormat= "HH시"
                        interval={60}
                        value={form.startHour}
                        pickerType="list"
                        visible={true}
                        onValueChanged={(e) =>
                          setForm((p) => ({ ...p, startHour: e.value }))
                        }
                      />
                    )}
                    <span className="px-1 flex-fill text-center">~</span>
                    <DateBox
                      value={form.endDate}
                      displayFormat={task.displayFormat}
                      type="date"                      
                      onValueChanged={(e) =>
                        setForm((p) => ({ ...p, endDate: e.value }))
                      }
                    />
                    {form.timeType === 1 && (
                      <DateBox 
                        type="time" 
                        className='ms-1'
                        width={120}
                        displayFormat= "HH시"
                        interval={60}
                        value={form.endHour}
                        pickerType="list"
                        visible={true}
                        onValueChanged={(e) =>
                          setForm((p) => ({ ...p, endHour: e.value }))
                        }
                      />
                    )}
                    <div style={{ width: '18%' }}></div>
                  </div>
                ))}
            </div>
          </div>

          <div className="col-5 d-flex align-items-center">
            <div className="col-3">중분류</div>
            <div className="col">
              <SelectBox
                dataSource={tableOptions[form.company]}
                valueExpr="code"
                displayExpr="name"
                value={form.table}
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, table: e.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="row d-flex">
          <div className="col-6"></div>
          <div className="col-6 d-flex">
            <div className="col-3"></div>
            <div className="col-9 d-flex justify-content-end">
                <Button
                  text="엑셀 다운로드"
                  type="success"
                  width={120}
                  // useSubmitBehavior={false}
                  // onClick={onExportExcel}
                />
                <Button
                  text="조회"
                  type="default"
                  width={60}
                  onClick={onSearch}
                  className="ms-2"
                />
            </div>
          </div>
        </div>
      </div>

      {/* 그리드 */}
      <StatGrid />

      {/* 메시지 상세 팝업 */}
      {/* <StatMessage /> */}
    </div>
  )
}