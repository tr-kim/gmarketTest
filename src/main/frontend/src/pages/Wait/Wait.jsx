import React, { useEffect, useState } from 'react';

import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import CustomStore from 'devextreme/data/custom_store';
import dayjs from 'dayjs';
import axios from 'axios';

import WaitGrid from './WaitGrid';
import WaitMessage from './WaitMessage';
import { useAppStore } from '@/useAppStore';
import { useWaitStore } from './useWaitStore';

export default function Wait() {
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
    waitTitle: '',
  });

  /* --------------------
   * Zustand actions
   * -------------------- */
  const setGridStore = useWaitStore((s) => s.setGridStore);

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
   * 조회 검증
   * -------------------- */
  const validateSearch = (cond) => {
    const { startDate, endDate, company } = cond;

    if (company === -1) {
      alert('대분류를 선택하세요.');
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
  const buildWaitParams = (cond, extra = {}) => {

    return {
      companyCode: cond.company,
      waitTitle: cond.waitTitle,

      // Java YearMonth
      startDate: dayjs(cond.startDate).format('YYYYMM'),
      endDate: dayjs(cond.endDate).format('YYYYMM'),

      // Java LocalDate
      startTime: dayjs(cond.startDate).format('YYYYMMDD'),
      endTime: dayjs(cond.endDate).format('YYYYMMDD'),
    
    // 추가 옵션 (grid용 skip/take/sort 등)
    ...extra,
    };
  };

  /* --------------------
   * CustomStore 생성
   * -------------------- */
  const createStore = (cond) =>
    new CustomStore({
      key: 'B_MSG_KEY',
      load: (loadOptions) => {
		
        const params = buildWaitParams(cond, {
          // DevExtreme Options
          skip: loadOptions.skip ?? 0, // 페이지 시작 위치(offset)
          take: loadOptions.take ?? 50, // 페이지 크기(limit)
          sort: loadOptions.sort || [], // 정렬
        });
        
        return axios.post('/api/v1/wait/list', params).then((res) => ({
          data: res.data.data,
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

  /* --------------------
   * Render
   * -------------------- */
  return (
    <div id='waitGrid' className="container pb-3">
      <p className="font-sz-20 font-weight-600 pt-3 text-666">
        대기 메시지 조회
      </p>

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

        <div className="row d-flex">
          <div className="col-6 d-flex align-items-center">
            <div className="col-3">제목</div>
            <div className="col">
              <TextBox
                value={form.waitTitle}
                placeholder="제목을 입력하세요."
                onValueChanged={(e) =>
                  setForm((p) => ({ ...p, waitTitle: e.value }))
                }
              />
            </div>
          </div>

          <div className="col-6 d-flex align-items-center justify-content-end">
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

      {/* 그리드 */}
      <WaitGrid />

      {/* 메시지 상세 팝업 */}
      <WaitMessage />
    </div>

  )
}