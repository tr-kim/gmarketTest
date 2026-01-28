import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

import Hist from './pages/Hist';
import SingleSend from './pages/SingleSend';
import ExcelSend from './pages/ExcelSend'; 
import FileSend from './pages/FileSend';
import DbSend from './pages/DbSend';
import BulkHist from './pages/BulkHist';
import Wait from './pages/Wait';
import Real from './pages/Real';
import Service from './pages/Service';
import Stat from './pages/Stat';
import Alarm from './pages/Alarm';
import User from './pages/User';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
