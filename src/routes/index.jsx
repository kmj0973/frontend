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
import AppErrorFallback from '@/components/common/boundary/AppErrorFallback';

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
        element: <GroupPage />,
      },
      {
        path: '*',
        element: (
          <AppErrorFallback
            title="찾으시는 페이지가 없어요"
            subtitle={
              <>
                주소가 바뀌었거나 잘못 입력되었을 수 있어요.
                <br />
                홈으로 돌아가 다시 이동해 주세요.
              </>
            }
            cardTitle="요청한 경로를 찾지 못했어요"
            cardCopy="특히 초대 코드가 필요한 페이지는 주소 뒤에 코드가 함께 들어가야 해요. 링크를 다시 확인한 뒤 홈에서 새로 시작해 주세요."
            hideSecondaryAction
          />
        ),
      },
    ],
  },
]);

export default router;
