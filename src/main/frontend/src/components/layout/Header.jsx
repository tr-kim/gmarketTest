import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const menus = [
  { path: '/hist', label: '이력 조회', icon: 'bi-list-ul' },
  { path: '/singleSend', label: '개별 발송', icon: 'bi-send' },
  { path: '/', label: '대량 발송', icon: 'bi-envelope' , hasSub: true},
  { path: '/wait', label: '대기 메시지 조회', icon: 'bi-hourglass' },
  { path: '/real', label: '실시간 발송 현황', icon: 'bi-graph-up' },
  { path: '/service', label: '서비스 관리', icon: 'bi-check2-square' },
  { path: '/stat', label: '정산/통계 조회', icon: 'bi-search' },
  { path: '/alarm', label: '알림 이력 조회', icon: 'bi-exclamation-circle' },
  { path: '/user', label: '사용자 관리', icon: 'bi-people' },
];

const subMenus = [
  { path: '/excelSend', label: '엑셀 발송' },
  { path: '/fileSend', label: '파일 발송' },
  { path: '/dbSend', label: 'DB 발송' },
  { path: '/bulkHist', label: '대량 발송 이력' },
];

export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(); // 드롭다운 메뉴에 대한 참조

  useEffect(() => {
    //메뉴 클릭
		const lis = document.querySelectorAll('header li');

		lis.forEach(li => {
			li.addEventListener('click', function() {
				lis.forEach(item => {
					item.classList.remove('active');
				});
				li.classList.add('active');
			});
		});

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <div className="container d-flex justify-content-between align-items-center position-relative">
          <div className="logo">
            <NavLink to="/">
              <img src={logo} alt="G마켓로고" />
            </NavLink>
          </div>
          <button className="user_profile d-flex align-items-center">
              <div className="user_img">
                  <img src='/images/user.png' alt="사용자 이미지"/>
              </div>
              <div className="ms-2">
                  <div className="user_nm font-weight-500">
                    <span>슈퍼관리자</span>
                    (<span>super</span>)
                  </div>
                  <div className="user_grade">
                    <span>슈퍼관리자</span>
                  </div>
              </div>
          </button>
        </div>
      </header>
      <header>
        <div className="container d-flex justify-content-between align-items-center">
          <ul className="gnb d-flex justify-content-between align-items-center">
            {menus.map(menu => (
              <li key={menu.path} className={menu.hasSub ? 'sendmenu' : ''} ref={menuRef}>
                {menu.hasSub ? (
                  <>
                    <button
                      type="button"
                      className="menuhover"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(prev => !prev);
                      }}
                    >
                      <i className={`bi ${menu.icon} me-2`} />
                      {menu.label}
                      <i className="bi bi-chevron-down font-sz-12 ms-1"></i>
                    </button>

                    {isMenuOpen && (
                      <ul className="flex-column align-items-center" onClick={(e) => e.stopPropagation()}>
                        {subMenus.map(subMenu => (
                          <li key={subMenu.path}>
                            <NavLink to={subMenu.path}>{subMenu.label}</NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink to={menu.path} className="menuhover">
                    <i className={`bi ${menu.icon} me-2`} />
                    {menu.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>    
  );
}
