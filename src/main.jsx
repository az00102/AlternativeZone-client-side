import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Root from './components/Root';
import Error from './components/Error';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';
import ViewDetail from './components/ViewDetail';
import MyQueries from './components/MyQueries';
import AddQuery from './components/AddQuery';
import Queries from './components/Queries';
import MyRecommendations from './components/MyRecommendations';
import RecommendationsForMe from './components/RecommendationsForMe';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/addquery',
        element: <ProtectedRoute><AddQuery /></ProtectedRoute>,
      },
      {
        path: '/viewdetail/:queryId',
        element: <ProtectedRoute><ViewDetail /></ProtectedRoute>,
      },
      {
        path: '/myqueries',
        element: <ProtectedRoute><MyQueries /></ProtectedRoute>,
      },
      {
        path: '/myrecommendations',
        element: <ProtectedRoute><MyRecommendations /></ProtectedRoute>,
      },
      {
        path: '/recommendationsforme',
        element: <ProtectedRoute><RecommendationsForMe /></ProtectedRoute>,
      },
      {
        path: '/queries',
        element: <Queries />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
