import React, { useEffect, useState } from 'react';

import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import CustomStore from 'devextreme/data/custom_store';
import dayjs from 'dayjs';
import axios from 'axios';

import AlarmGrid from './AlarmGrid';
import { useAlarmStore } from './useAlarmStore';

// --------------------
// 임시 전역 데이터
// --------------------
const userGrade = window.userGrade ?? 0;
const companyCode = window.companyCode ?? 0;
const codeList = window.codeList ?? [];

// --------------------
// 메인 컴포넌트
// --------------------
export default function Alarm() {
  const today = new Date();

  /* --------------------
   * 조회 조건 state
   * -------------------- */
  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    company: companyCode,
    service: 0,
    serverId: -1,
  });

  /* --------------------
   * Zustand actions
   * -------------------- */
  const setGridStore = useAlarmStore((s) => s.setGridStore);

  /* --------------------
   * 옵션 데이터
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

  const tableOptions = {
    0: [defaultOption, { code: 0, name: '전체' }],
    1: [defaultOption, { code: 0, name: '전체' }],
  };

  codeList.forEach(({ companyCode, code, name }) => {
    tableOptions[companyCode]?.push({ code, name });
  });

  const serverIdDefaultOption = { code: -1, name: '전체' };
  
  const serverIdOptions = [
    serverIdDefaultOption, 
    { code: 1, name: '1번' },
    { code: 2, name: '2번' }
  ];
  
  /* --------------------
   * 조회 검증
   * -------------------- */
  const validateSearch = (cond) => {
    const { startDate, endDate, company, service } = cond;

    if (company === -1) {
      alert('대분류를 선택하세요.');
      return false;
    }

    if (service === -1) {
      alert('서비스를 선택하세요.');
      return false;
    }

    if (startDate > endDate) {
      alert('조회 기간을 다시 입력하세요.');
      return false;
    }

    return true;
  };

  /* --------------------
   * CustomStore 생성
   * -------------------- */
  const createStore = (cond) =>
    new CustomStore({
      key: 'ALM_SEQ',
      load: (loadOptions) => {
        // const tableItem = tableOptions[cond.company]?.find(
        //   (t) => t.code === cond.table
        // );

        return axios
          .post('/api/v1/alarm/list', {
            companyCode: cond.company,
            svcName: "", // cond.service,
            serverId: cond.serverId,
            // tableName: tableItem?.name === '전체' ? '' : tableItem?.name,

            // Java YearMonth
            startDate: dayjs(cond.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(cond.endDate).format('YYYY-MM-DD'),

            // Java LocalDate
            // startTime: dayjs(cond.startDate).format('YYYYMMDD'),
            // endTime: dayjs(cond.endDate).format('YYYYMMDD'),

            // DevExtreme Options
            skip: loadOptions.skip ?? 0,
            take: loadOptions.take ?? 50,
            sort: loadOptions.sort || [],
          })
          .then((res) => ({
            data: res.data.list,
            totalCount: res.data.totalCount,
            console: console.log(res.data),
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

  /* --------------------
   * 엑셀 다운로드 버튼
   * -------------------- */
  // const onExportExcel = () => {};

  /* --------------------
   * Render
   * -------------------- */
  return (
    <div id='alarmGrid' className="container pb-3">
      <p className="font-sz-20 font-weight-600 pt-3 text-666">알림 이력 조회</p>
      {/* 조회 조건 */}
      <div className="content mx-0 mb-2 search-area">
        <div className="row d-flex mb-2">
          <div className="col-6 d-flex align-items-center">
            <div className="col-3">조회 기간</div>
            <div className="col d-flex align-items-center">
              <DateBox
                value={form.startDate}
                displayFormat="yyyy-MM-dd"
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, startDate: e.value }))
                }
              />
              <span className="px-1 flex-fill text-center">~</span>
              <DateBox
                value={form.endDate}
                displayFormat="yyyy-MM-dd"
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, endDate: e.value }))
                }
              />
            </div>
          </div>

          <div className="col-6 d-flex align-items-center">
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
          <div className="col-6 d-flex align-items-center">
            <div className="col-3">서비스</div>
            <div className="col">
              <SelectBox
                dataSource={tableOptions[form.service]}
                valueExpr="code"
                displayExpr="name"
                value={form.service}
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, table: e.value }))
                }
              />
            </div>
          </div>

          <div className="col-6 d-flex align-items-center">
            <div className="col-3">서버</div>
            <div className="col">
              <SelectBox
                dataSource={serverIdOptions}
                valueExpr="code"
                displayExpr="name"
                value={form.serverId}
                onValueChanged={(e) =>
                  setForm((p) => ({
                    ...p,
                    serverId: e.value,
                  }))
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
                useSubmitBehavior={false}
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
      <AlarmGrid />

    </div>
  )   
}