import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import TopPage from './components/top/TopPage';
import FormManagementTopPage from './components/form-management/FormManagementTopPage';
import FormCreatePage from './components/form-management/FormCreatePage';
import FormEditPage from './components/form-management/FormEditPage';
import AnswersTableTopPage from './components/answers-table/AnswersTableTopPage';
import AnswersTable from './components/answers-table/AnswersTable';
import AnswerPage from './components/form-answer/AnswerPage';
import AnswerEditPage from './components/form-answer/AnswerEditPage';
import FileIOTopPage from './components/file-io/FileIOTopPage';
import CSVUploadPage from './components/file-io/CSVUploadPage';
import NotificationRegisterPage from './components/notification-register/NotificationRegisterPage';
import NotificationEditorPage from './components/notification-editor/NotificationEditorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App component={<TopPage />} />
  },
  {
    path: 'form-management',
    element: <App component={<FormManagementTopPage />} />
  },
  {
    path: 'form-answer/:questionnairId',
    element: <App component={<AnswerPage />} />
  },
  {
    path: 'form-answer-edit/:questionnairId/:metadataId',
    element: <App component={<AnswerEditPage />} />
  },
  {
    path: 'form-management/new',
    element: <App component={<FormCreatePage />} />
  },
  {
    path: 'form-edit/:questionnairId',
    element: <App component={<FormEditPage />} />
  },
  {
    path: 'form-answers-table',
    element: <App component={<AnswersTableTopPage />} />
  },
  {
    path: 'form-answers-table/:questionnairId',
    element: <App component={<AnswersTable />} />
  },
  { path: 'file-io', element: <App component={<FileIOTopPage />} /> },
  { path: 'csv-upload', element: <App component={<CSVUploadPage />} /> },
  {
    path: 'notification-register',
    element: <App component={<NotificationRegisterPage />} />
  },
  {
    path: 'notification-editor',
    element: <App component={<NotificationEditorPage />} />
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
