import { useBulkHistStore } from './useBulkHistStore';
import { formatTranDate } from '@/utils/dateFormat';

export default function BulkHistMessage() {
  const visible = useBulkHistStore((s) => s.isModalOpen);
  const title = useBulkHistStore((s) => s.selectedTitle);
  const inTime = useBulkHistStore((s) => s.selectedInTime);
  const reqTime = useBulkHistStore((s) => s.selectedReqTime);
  const userID = useBulkHistStore((s) => s.selectedUserID);
  const sendInfo = useBulkHistStore((s) => s.selectedSendInfo);
  const count = useBulkHistStore((s) => s.selectedCount);
  const succCount = useBulkHistStore((s) => s.selectedSuccCount);
  const failCount = useBulkHistStore((s) => s.selectedFailCount);
  const standbyCount = useBulkHistStore((s) => s.selectedStandbyCount);
  const tranCount = useBulkHistStore((s) => s.selectedTranCount);
  const succFailCount = useBulkHistStore((s) => s.selectedSuccFailCount);
  const message = useBulkHistStore((s) => s.selectedMessage);
  const close = useBulkHistStore((s) => s.closeMessage);

  if (!visible) return null;

  return (
    <div className="modal-bg">
      <div className="modal-wrap">
        <div className="modal-hd">
          <span className="font-sz-16 font-weight-600">상세 보기</span>
          <button className="close_btn" onClick={close}>
            <i className="bi bi-x-lg"></i>
            <span className="visually-hidden">닫기</span>
          </button>
        </div>
        <div className="modal-con">
          <div className="row">
            <div className="col-12 mb-3">
              <p className="d-block mb-1">제목</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={title || ''}
              />
            </div>
            <div className="col-6 mb-3">
              <p className="d-block mb-1">등록 일시</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={formatTranDate(inTime) || ''}
              />
            </div>
            <div className="col-6 mb-3">
              <p className="d-block mb-1">전송 일시</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={formatTranDate(reqTime) || ''}
              />
            </div>
            <div className="col-6 mb-3">
              <p className="d-block mb-1">발송 ID</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={userID || ''}
              />
            </div>
            <div className="col-6 mb-3">
              <p className="d-block mb-1">전송 대상</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={sendInfo || ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">전체</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={count ?? ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">등록 성공</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={succCount ?? ''}
              />
            </div>					
            <div className="col-4 mb-3">
              <p className="d-block mb-1">미등록</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={failCount ?? ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">대기 건수</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={standbyCount ?? ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">전송중</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={tranCount ?? ''  }
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">성공/실패</p>
              <input 
                type="text" 
                className="form-control" 
                readOnly
                value={succFailCount ?? ''  }
              />
            </div>
            <div className="col-12">
              <p className="d-block mb-1">메시지 내용</p>
              <textarea
                className="form-control"
                style={{height: '200px'}}
                readOnly
                value={message || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
