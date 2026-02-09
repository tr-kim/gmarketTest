export default function HistMessage({ visible, message, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-bg">
      <div className="modal-wrap">
        <div className="modal-hd">
          <span className="font-sz-16 font-weight-600">상세 보기</span>
          <button className="close_btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
            <span className="visually-hidden">닫기</span>
          </button>
        </div>
        <div className="modal-con">
          <p className="mb-1">메시지 내용</p>
          <textarea
            className="form-control"
            readOnly
            value={message || ''}
          />
        </div>
      </div>
    </div>
  );
}
