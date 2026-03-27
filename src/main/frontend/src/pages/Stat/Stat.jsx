import React, { useCallback, useEffect, useState } from 'react';

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
  { id: 0, text: '시간' },
  { id: 1, text: '일' },
  { id: 2, text: '월' },
  { id: 3, text: '년' },
];
const tasks = [{
  priority: 0,
  displayFormat: 'yyyy-MM-dd',
}, {
  priority: 1,
  displayFormat: 'yyyy-MM-dd',
}, {
  priority: 2,
  displayFormat: 'yyyy-MM',
}, {
  priority: 3,
  displayFormat: 'yyyy',
}];

export default function Stat() {
  const session = useAppStore((s) => s.session);

  const userGrade = session?.userGrade ?? 0;
  const companyCode = session?.companyCode ?? 0;

  const today = new Date();

  /* --------------------
   * 조회 조건 state
   * -------------------- */
  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    company: companyCode,
    table: 0,
    // timeType: selectionPriority
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
   * -------------------- 
  const tableOptions = {
    0: [defaultOption, { code: 0, name: '전체' }],
    1: [defaultOption, { code: 0, name: '전체' }],
  };

  codeList.forEach(({ companyCode, code, name }) => {
    tableOptions[companyCode]?.push({ code, name });
  });*/

  /* --------------------
   * 중분류 옵션 조회
   * 대분류 변경 시 중분류 재조회
   * -------------------- 
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
  }, [form.company]);*/

  /* --------------------
   * 조회 기간 구분 state
   * -------------------- */
  const [selectionPriority, setSelectionPriority] = useState(priorityEntities[0].id);

  const changeSelectionPriority = useCallback((e) => {
    setSelectionPriority(e.value);
  }, [setSelectionPriority]);

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
                value={selectionPriority}
                valueExpr="id"
                displayExpr="text"
                onValueChanged={changeSelectionPriority}
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
                value={form.table}
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, table: e.value }))
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
                .filter((task) => task.priority === selectionPriority)
                .map((task) => (
                  <div className="col d-flex align-items-center">
                    <DateBox
                      value={form.startDate}
                      displayFormat={task.displayFormat}
                      type="date"
                      onValueChanged={(e) =>
                        setForm((p) => ({ ...p, startDate: e.value }))
                      }
                    />
                    {selectionPriority === 0 && (
                      <DateBox 
                        type="time" 
                        className='ms-1'
                        width={120}
                        displayFormat= "HH시"
                        interval={60}
                        value={ new Date(2025, 0, 1, 0, 0) }
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
                    {selectionPriority === 0 && (
                      <DateBox 
                        type="time" 
                        className='ms-1'
                        width={120}
                        displayFormat= "HH시"
                        interval={60}
                        value={ new Date(2025, 0, 1, 23, 0) }
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
                // dataSource={tableOptions[form.company]}
                // valueExpr="code"
                // displayExpr="name"
                // value={form.table}
                // onValueChanged={(e) =>
                //   setForm((p) => ({ ...p, table: e.value }))
                // }
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
                  // onClick={onSearch}
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