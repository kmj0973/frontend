import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import MainPage from '@/pages/mainPage/MainPage';
import AnalysisPage from '@/pages/analysisPage/AnalysisPage';
import ResultsPage from '@/pages/resultsPage/ResultsPage';
import SurveyPage from '@/pages/surveyPage/SurveyPage';
import CreateGroupPage from '@/pages/groupPage/createGroupPage/CreateGroupPage';
import JoinGroupPage from '@/pages/groupPage/joinGroupPage/JoinGroupPage';
import FinalPage from '@/pages/finalPage/FinalPage';
import ResultFallback from '@/components/common/boundary/ResultFallback';
import GroupPage from '@/pages/groupPage/GroupPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/analysis/:inviteCode',
        element: <AnalysisPage />,
      },
      {
        path: '/results/:inviteCode',
        element: <ResultsPage />,
      },
      { path: '/results/e/:inviteCode', element: <ResultFallback /> },
      { path: '/survey/:inviteCode', element: <SurveyPage /> },
      { path: '/group/create/:step', element: <CreateGroupPage /> },
      { path: '/group/join/:inviteCode', element: <JoinGroupPage /> },
      { path: '/final/:inviteCode', element: <FinalPage /> },
      {
        path: '/group/:inviteCode',
        element: <GroupPage />
      }
    ],
  },
]);

export default router;
