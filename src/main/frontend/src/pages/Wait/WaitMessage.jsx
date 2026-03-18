import { useWaitStore } from './useWaitStore';
import { formatTranDate } from '@/utils/dateFormat';

export default function WaitMessage() {
  const visible = useWaitStore((s) => s.isModalOpen);
  const title = useWaitStore((s) => s.selectedTitle);
  const inTime = useWaitStore((s) => s.selectedInTime);
  const reqTime = useWaitStore((s) => s.selectedReqTime);
  const userID = useWaitStore((s) => s.selectedUserID);
  const message = useWaitStore((s) => s.selectedMessage);
  const close = useWaitStore((s) => s.closeMessage);

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
            <div className="col-4 mb-3">
              <p className="d-block mb-1">등록 일시</p>
              <input
                type="text"
                className="form-control"
                readOnly
                value={formatTranDate(inTime) || ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">전송 일시</p>
              <input
                type="text"
                className="form-control"
                readOnly
                value={formatTranDate(reqTime) || ''}
              />
            </div>
            <div className="col-4 mb-3">
              <p className="d-block mb-1">발송 ID</p>
              <input
                type="text"
                className="form-control"
                readOnly
                value={userID || ''}
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
