import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Walkers from './pages/Walkers';
import LiveTracking from './pages/LiveTracking';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Planes from './pages/Planes';
import Tienda from './pages/Tienda';
import MessagesPage from './pages/MessagesPage';
import AdminDashboard from './pages/AdminDashboard';
import WalkerDashboard from './pages/WalkerDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { PetProvider } from './context/PetContext';
import { BookingProvider } from './context/BookingContext';

import { WalkerProvider } from './context/WalkerContext';
import { StoreProvider } from './context/StoreContext';
import { ConfigProvider } from './context/ConfigContext';
import WalkerRegistration from './pages/WalkerRegistration';

import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <PetProvider>
          <WalkerProvider>
            <StoreProvider>
              <ConfigProvider>
                <ChatProvider>
                  <Router>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/paseadores" element={<Walkers />} />
                        <Route path="/planes" element={<Planes />} />
                        <Route path="/tienda" element={<Tienda />} />
                        <Route path="/live-demo" element={<LiveTracking />} />
                        <Route path="/registro-paseador" element={<WalkerRegistration />} />
                        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/walker" element={<ProtectedRoute><WalkerDashboard /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/reservar" element={<Booking />} />
                        </Route>
                      </Routes>
                    </Layout>
                  </Router>
                </ChatProvider>
              </ConfigProvider>
            </StoreProvider>
          </WalkerProvider>
        </PetProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
