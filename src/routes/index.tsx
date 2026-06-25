import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import AdminPage from '@/features/admin/AdminPage';
import LoginPage from '@/features/auth/LoginPage';
import CampusPage from '@/features/campus/CampusPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import InterviewsPage from '@/features/interviews/InterviewsPage';
import JobsPage from '@/features/jobs/JobsPage';
import NotificationsPage from '@/features/notifications/NotificationsPage';
import PipelinePage from '@/features/pipeline/PipelinePage';
import RequirementBuilder from '@/features/requirements/RequirementBuilder';
import OfferManagementPage from '@/features/offers/OfferManagementPage';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'requirements', element: <RequirementBuilder /> },
      { path: 'pipeline', element: <PipelinePage /> },
      { path: 'interviews', element: <InterviewsPage /> },
      { path: 'campus', element: <CampusPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'offers', element: <OfferManagementPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
