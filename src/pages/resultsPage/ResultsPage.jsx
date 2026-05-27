import { useEffect, useState } from 'react';
import { replace, useNavigate, useParams } from 'react-router-dom';
import { getAnalysisResults } from '@/apis/analysisApi';
import { getVotes } from '@/apis/groupApi';
import { storage } from '@/utils/storage';
import { fetchGroupsData } from '@/apis/tripGroupsApi';
import styles from './ResultsPage.module.scss';
import PlanList from './components/PlanList';
import ConflictList from './components/ConflictList';
import { GROUP_HEADER_TEXT } from '@/constants/groupPageConstants';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const { tripGroupId, memberId } = storage.get(inviteCode);
  const [voteList, setVoteList] = useState([]);
  const [conflictCards, setConflictCards] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetchGroupsData(tripGroupId, inviteCode);
        console.log(response);
        setGroupInfo({
          groupName: response.groupInfo.name,
          tripLength: response.groupInfo.tripLength,
          startDate: response.groupInfo.startDate.split('-').join('.'),
          endDate: response.groupInfo.endDate.split('-').join('.'),
          memberLength: response.memberList.length,
        });
      } catch (err) {
        console.log('그룹 정보 가져오기 실패', err);
        setGroupInfo({});
      }
    };

    fetchGroupInfo();
  }, [inviteCode, tripGroupId]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAnalysisResults(tripGroupId);
        const rawResult = response?.result;
        const parsedResult =
          typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;

        setConflictCards(parsedResult?.conflictCards ?? []);
        setPlans(parsedResult?.topPlans ?? []);
        if (
          parsedResult?.conflictCards.length == 0 ||
          parsedResult?.topPlans == 0
        ) {
          navigate(`/results/e/${inviteCode}`, replace);
        }
      } catch (err) {
        console.log('결과 가져오기 실패', err);
        navigate(`/results/e/${inviteCode}`, replace);
        setConflictCards([]);
        setPlans([]);
      }
    };

    fetchResults();
  }, [tripGroupId, inviteCode, navigate]);

  useEffect(() => {
    if (!tripGroupId || !groupInfo?.memberLength) return;

    let pollingId;

    const fetchVotes = async () => {
      try {
        const response = await getVotes(tripGroupId);

        const stats = response?.result?.stats ?? [];
        const totalVoteCount =
          response?.result?.totalVoteCount ??
          stats.reduce((sum, item) => sum + (item.voteCount ?? 0), 0);

        setVoteList(stats);

        if (totalVoteCount >= groupInfo.memberLength) {
          clearInterval(pollingId);
          storage.remove('voting');
          navigate(`/final/${inviteCode}`);
        }
      } catch (err) {
        console.log('투표 결과 가져오기 실패', err);
      }
    };

    fetchVotes();
    pollingId = setInterval(fetchVotes, 3000);

    return () => clearInterval(pollingId);
  }, [tripGroupId, groupInfo?.memberLength, inviteCode, navigate]);

  return (
    <div className={styles['results-page']}>
      <div className={styles['results-phone-frame']}>
        <main className={styles['results-content']}>
          <section className={styles['results-hero']}>
            <p className={styles['results-hero-subtitle']}>AI 분석 결과</p>
            <h1>{groupInfo.groupName}</h1>
            <p className={styles['results-hero-meta']}>
              {GROUP_HEADER_TEXT[groupInfo.tripLength]}
              {groupInfo.startDate && groupInfo
                ? `${groupInfo.startDate} - ${groupInfo.endDate}`
                : ''}
              ·{groupInfo.memberLength}명
            </p>
          </section>

          <section className={styles['results-section']}>
            <h2>이번 AI가 발견한 갈등</h2>
            <ConflictList conflictCards={conflictCards} />
          </section>

          <section className={styles['results-section']}>
            <h2>추천 플랜 TOP 3</h2>
            <PlanList
              topPlans={plans}
              voteList={voteList}
              setVoteList={setVoteList}
              tripGroupId={tripGroupId}
              memberId={memberId}
              memberLength={groupInfo.memberLength}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ResultsPage;
