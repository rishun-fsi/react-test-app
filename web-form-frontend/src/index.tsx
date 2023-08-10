import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import FormManagementTopPage from './components/FormManagementTopPage';
import QuestionnairForm from './components/QuestionnairForm';
import FormCreatePage from './components/FormCreatePage';
import FormEditPage from './components/FormEditPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App component={<QuestionnairForm />} />
  },
  {
    path: 'form-management',
    element: <App component={<FormManagementTopPage />} />
  },
  {
    path: 'form-management/new',
    element: <App component={<FormCreatePage />} />
  },
  {
    path: 'form-edit/:questionnairId',
    element: <App component={<FormEditPage />} />
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
