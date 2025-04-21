import Cookies from 'js-cookie';  // นำเข้า js-cookie

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivateRoute from './components/PrivateRoute';
import AdminNotificationPage from './pages/AdminNotificationPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import FinanceManagementPage from './pages/FinanceManagementPage';
import WorkCalendarPage from './pages/WorkCalendarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import UploadWorkRecordPage from './pages/UploadWorkRecordPage';
import SupervisorExplanationPage from './pages/Supervisor/SupervisorExplanationPage';




// ✅ นำเข้าหน้าฝั่งพนักงาน
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeCalendarPage from './pages/employee/EmployeeCalendarPage';
import EmployeeTimeLogPage from './pages/employee/EmployeeTimeLogPage';
import EmployeeLeavePage from './pages/employee/EmployeeLeavePage';
import EmployeeDocumentsPage from './pages/employee/EmployeeDocumentsPage';

export default function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 App loaded');
  
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
          credentials: 'include',
        });
  
        if (!res.ok) throw new Error('Not authenticated');
  
        const data = await res.json();
        console.log('✅ /api/me result:', data);
        setRole(data.role);
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/upload-work-records" element={<UploadWorkRecordPage />} />
      <Route path="/login" element={<LoginPage setRole={setRole} />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['ADMIN']} role={role}>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/work-calendar"
        element={
          <PrivateRoute allowedRoles={['ADMIN']} role={role}>
            <WorkCalendarPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/employee-management"
        element={
          <PrivateRoute allowedRoles={['ADMIN']} role={role}>
            <EmployeeManagementPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/reminders"
        element={
          <PrivateRoute allowedRoles={['ADMIN']} role={role}>
            <AdminNotificationPage />
          </PrivateRoute>
        }
      />

      {/* ✅ ฝั่งพนักงาน */}
      <Route
        path="/employee"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']} role={role}>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee/calendar"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']} role={role}>
            <EmployeeCalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee/time-log"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']} role={role}>
            <EmployeeTimeLogPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee/leave-request"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']} role={role}>
            <EmployeeLeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee/documents"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']} role={role}>
            <EmployeeDocumentsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={
              role === 'ADMIN'
                ? '/admin'
                : role === 'EMPLOYEE'
                ? '/employee'
                : '/login'
            }
          />
        }
      />

      <Route
        path="/admin/finance"
        element={
          <PrivateRoute allowedRoles={['ADMIN']} role={role}>
            <FinanceManagementPage />
          </PrivateRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
  path="/supervisor/explanations"
  element={
    <PrivateRoute allowedRoles={['SUPERVISOR']} role={role}>
      <SupervisorExplanationPage />
    </PrivateRoute>
  }
/>

      <Route
  path="/employee-management/:id"
  element={
    <PrivateRoute allowedRoles={['ADMIN']} role={role}>
      <EmployeeDetailPage />
    </PrivateRoute>
  }
/>
    </Routes>
  );
}