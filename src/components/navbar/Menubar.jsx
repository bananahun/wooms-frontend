import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuButton from './MenuButton';
import MyInfo from './MyInfo';
import Group from '../group/Group';
import { logout } from '../../apis/LogoutApi';
import { authActions } from '../../store/authSlice'; // Redux 액션 임포트
import BgmPlayer from '../bgm/BgmPlayer'; // BGM 플레이어 컴포넌트 임포트

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyInfoOpen, setIsMyInfoOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // 음소거 상태 추가

  const location = useLocation(); // 현재 어떤 url 에 접속해있는지 확인
  const isMapPage = location.pathname.startsWith('/map/'); // 그룹공간에 있다면 true

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseMyInfo = () => {
    setIsMyInfoOpen(false);
  };

  const handleCloseGroup = () => {
    setIsGroupOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((isOpen) => !isOpen);
  };

  const handleMyInfoClick = () => {
    setIsMyInfoOpen(true);
    toggleMenu();
  };

  const handleGroupClick = () => {
    setIsGroupOpen(true);
    toggleMenu();
  };

  const handleLogoutClick = async () => {
    try {
      // API 요청을 통해 서버 측 로그아웃 처리
      const success = await logout();

      if (success) {
        // Redux 상태 초기화
        dispatch(authActions.logout());

        // 로그인 페이지로 리디렉션
        navigate('/');
      } else {
        console.error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  return (
    <header className={`${isMapPage ? 'header-hidden' : void 0}`}>
      <div className='w-full absolute top-4 right-6 flex gap-4 justify-end'>
        <button
          aria-label='BGM 음소거 토글'
          className={`bg-cover w-12 h-12 ${isMuted ? 'bg-bgm-x' : 'bg-bgm-o'}`}
          onClick={toggleMute}
        />
        <button
          aria-label='메뉴 토글'
          className='bg-cover bg-menu w-12 h-12'
          onClick={toggleMenu}
        />
      </div>
      {isMenuOpen && (
        <>
          <div
            className='fixed inset-0 opacity-50 z-10'
            onClick={toggleMenu}
          ></div>
          <nav className='absolute top-16 right-1 m-0 p-0 z-20 rounded flex flex-col space-y-1'>
            <MenuButton
              buttonText='내 정보 수정'
              onClickEventHandler={handleMyInfoClick}
            />
            <MenuButton
              buttonText='그룹 목록 '
              onClickEventHandler={handleGroupClick}
            />
            <MenuButton
              buttonText='로그 아웃'
              onClickEventHandler={handleLogoutClick}
            />
          </nav>
        </>
      )}
      <MyInfo isOpen={isMyInfoOpen} handleCloseMyInfo={handleCloseMyInfo} />
      <Group isOpen={isGroupOpen} handleCloseGroup={handleCloseGroup} />
      {/* <BgmPlayer isMuted={isMuted} />{' '} */}
      {/* BGMPlayer 컴포넌트에 음소거 상태 전달 */}
    </header>
  );
}

export default Header;
