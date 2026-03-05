import { useEffect } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import SessionGate from './components/auth/SessionGate';
import MainLayout from './components/layout/MainLayout';
import { useAppStore } from './useAppStore';

import Hist from './pages/Hist/Hist';
import SingleSend from './pages/SingleSend/SingleSend';
import ExcelSend from './pages/ExcelSend/ExcelSend'; 
import FileSend from './pages/FileSend/FileSend';
import DbSend from './pages/DbSend/DbSend';
import BulkHist from './pages/BulkHist/BulkHist';
import Wait from './pages/Wait/Wait';
import Real from './pages/Real/Real';
import Service from './pages/Service/Service';
import Stat from './pages/Stat/Stat';
import Alarm from './pages/Alarm/Alarm';
import User from './pages/User/User';

function App() {
  const setSession = useAppStore((s) => s.setSession);
  const finishSession = useAppStore((s) => s.finishSession);

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await axios.post('/api/v1/user/session');
        setSession(res.data);
      } catch (e) {
        console.error('세션 조회 실패', e);
		finishSession();
      }
    };
    
    initSession();
  }, []);

  return (
    <BrowserRouter>
      <SessionGate>
	    <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Hist />} />
            <Route path="/hist" element={<Hist />} />
            <Route path="/singleSend" element={<SingleSend />} />
            <Route path="/excelSend" element={<ExcelSend />} />
            <Route path="/fileSend" element={<FileSend />} />
            <Route path="/dbSend" element={<DbSend />} />
            <Route path="/bulkHist" element={<BulkHist />} />
            <Route path="/wait" element={<Wait />} />
            <Route path="/real" element={<Real />} />
            <Route path="/service" element={<Service />} />
            <Route path="/stat" element={<Stat />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Routes>
      </SessionGate>
    </BrowserRouter>
  );
}

export default App;
