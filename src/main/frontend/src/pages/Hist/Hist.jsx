import React, { useState, useCallback, useEffect } from 'react';

import DateBox from 'devextreme-react/date-box';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import CustomStore from 'devextreme/data/custom_store';
import dayjs from 'dayjs';
import axios from 'axios';

import HistGrid from "./HistGrid";
import HistMessage from "./HistMessage";

// --------------------
// 임시 전역 데이터
// --------------------
const userGrade = window.userGrade ?? 0;
const companyCode = window.companyCode ?? 0;
const codeList = window.codeList ?? [];

// --------------------
// 메인 컴포넌트
// --------------------
export default function Hist() {
  const today = new Date();

  /* --------------------
   * 조회 조건 state
   * -------------------- */
  const [form, setForm] = useState({
    startDate: today,
    endDate: today,
    phoneNum: '',
    company: companyCode,
    table: 0,
  });

  /* --------------------
   * 조회 결과 state
   * -------------------- */
  const [store, setStore] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  /* --------------------
   * 메시지 팝업 state
   * -------------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  /* --------------------
   * 메시지 팝업 제어
   * -------------------- */
  const openHistMessageInquiry = useCallback((e) => {
    if (!e?.data) return;

    setModalMessage(e.data.TRAN_MSG ?? '');
    setIsModalOpen(true);
  }, []);

  const closeHistMessageInquiry = useCallback(() => {
    setIsModalOpen(false);
    setModalMessage('');
  }, []);

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
   * 조회 버튼 클릭
   * -------------------- */
  const createStore = (cond) =>
    new CustomStore({
      load: (loadOptions) => {
        const tableItem = tableOptions[cond.company]?.find(
          (t) => t.code === cond.table
        );

        return axios
          .post('/api/v1/hist/list', {
            phoneNum: cond.phoneNum,
            companyCode: cond.company,
            tableName:
              tableItem?.name === '전체' ? '' : tableItem?.name,

            startDate: dayjs(cond.startDate).format('YYYYMM'),
            endDate: dayjs(cond.endDate).format('YYYYMM'),
            startTime: dayjs(cond.startDate).format('YYYYMMDD'),
            endTime: dayjs(cond.endDate).format('YYYYMMDD'),

            skip: loadOptions.skip ?? 0,
            take: loadOptions.take ?? 50,
            sort: loadOptions.sort || [],
          })
          .then((res) => ({
            data: res.data.data,
            totalCount: res.data.totalCount,
          }));
      },
    });
	
  const onSearch = () => {
    if (!validateSearch(form)) return;

    setStore(createStore({ ...form }));
  };
  
  
  useEffect(() => {
	// 최초 진입 시 초기 조건으로 조회
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore(createStore(form));
  }, []);
  
  /* --------------------
   * Render
   * -------------------- */
  return (
    <div id='histGrid' className="container pb-3">
      <p className="font-sz-20 font-weight-600 pt-3 text-666">이력 조회</p>

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
                  setForm((prev) => ({ ...prev, startDate: e.value }))
                }
              />        
              <span className='px-1 flex-fill text-center'>~</span>            
              <DateBox
                value={form.endDate}
                displayFormat="yyyy-MM-dd"
                onValueChanged={(e) =>
                  setForm((prev) => ({ ...prev, endDate: e.value }))
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
                  setForm((prev) => ({
                    ...prev,
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
            <div className="col-3">수신 번호</div>
            <div className="col">
              <TextBox
                value={form.phoneNum}
                placeholder="수신 번호를 입력하세요."
                maxLength={16}
                onValueChanged={(e) =>
                  setForm((prev) => ({ ...prev, phoneNum: e.value }))
                }
              />
            </div>            
          </div>
          <div className="col-6 d-flex align-items-center">  
            <div className="col-3">중분류</div>
            <div className="col">
              <SelectBox
                dataSource={tableOptions[form.company]}
                valueExpr="code"
                displayExpr="name"
                value={form.table}
                onValueChanged={(e) =>
                  setForm((prev) => ({ ...prev, table: e.value }))
                }
              />
            </div>
          </div>
        </div>
        <div className="row d-flex">
          <div className="col-6"></div>
          <div className="col-6 d-flex">
            <div className="col-3"></div>
            <div className="col-9 d-flex justify-content-between">
              <div style={{ color: '#e70808' }}>※ 전체 조회는 조회 기간의 시작 달만 조회</div>
              <div className="d-flex">
                <Button
                  text="엑셀 다운로드"
                  type="success"
                  width={120}
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
      </div>

      {/* 그리드 (조회 후에만 렌더링) */}
      {store && (
        <HistGrid
          store={store}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
          onRowClick={openHistMessageInquiry}
        />
      )}

      {/* 메시지 팝업 */}
      <HistMessage
        visible={isModalOpen}
        message={modalMessage}
        onClose={closeHistMessageInquiry}
      />
    </div>
  );
}
