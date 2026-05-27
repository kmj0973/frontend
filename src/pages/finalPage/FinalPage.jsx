import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/button/Button';
import celebrateSvg from '@/assets/images/celebrate.svg';
import { getAnalysisResults } from '@/apis/analysisApi';
import { getVotes } from '@/apis/groupApi';
import { fetchGroupsData } from '@/apis/tripGroupsApi';
import { useStoredGroup } from '@/hooks/useStoredGroup';
import styles from './FinalPage.module.scss';
import ResultList from './components/ResultList';

const FinalPage = () => {
  const navigate = useNavigate();
  const { inviteCode, tripGroupId } = useStoredGroup({
    redirectOnMissing: true,
  });
  const [groupInfo, setGroupInfo] = useState({});
  const [plans, setPlans] = useState([]);
  const [voteList, setVoteList] = useState([]);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await fetchGroupsData(tripGroupId, inviteCode);
        setGroupInfo({
          groupName: response.groupInfo.name,
          startDate: response.groupInfo.startDate.split('-').join('.'),
          endDate: response.groupInfo.endDate.split('-').join('.'),
          memberLength: response.memberList.length,
        });
      } catch (err) {
        console.log('그룹 정보 가져오기 실패', err);
        setGroupInfo({});
      }
    };

    if (tripGroupId) {
      fetchGroupInfo();
    }
  }, [inviteCode, tripGroupId]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAnalysisResults(tripGroupId);
        const rawResult = response?.result;
        const parsedResult =
          typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;

        setPlans(parsedResult?.topPlans ?? []);
      } catch (err) {
        console.log('결과 가져오기 실패', err);
        setPlans([]);
      }
    };

    const fetchVotes = async () => {
      try {
        const response = await getVotes(tripGroupId);
        setVoteList(response?.result?.stats ?? []);
      } catch (err) {
        console.log('투표 결과 가져오기 실패', err);
        setVoteList([]);
      }
    };

    if (tripGroupId) {
      fetchResults();
      fetchVotes();
    }
  }, [tripGroupId]);

  const selectedPlan =
    plans.reduce((winner, plan, index) => {
      const voteCount = voteList[index]?.voteCount ?? 0;

      if (winner == null || voteCount > winner.voteCount) {
        return {
          title: plan.title,
          voteCount,
        };
      }

      return winner;
    }, null) ?? null;

  const handleNewGroup = () => {
    navigate('/');
  };

  return (
    <div className={styles['final-page']}>
      <section className={styles['final-page__hero']}>
        <img src={celebrateSvg} alt="축하아이콘" />

        <h1 className={styles['final-page__title']}>
          {selectedPlan?.title ?? '여행 계획이'}로
          <br />
          결정되었어요!
        </h1>
        <p className={styles['final-page__summary']}>
          {groupInfo.memberLength
            ? `투표 결과 ${selectedPlan?.voteCount ?? 0} / ${groupInfo.memberLength}명 동의`
            : ''}
        </p>
      </section>

      <main className={styles['final-page__content']}>
        <section className={styles['final-page__results']}>
          <h2 className={styles['final-page__heading']}>전체 투표 결과</h2>

          <ResultList plans={plans} voteList={voteList} />
        </section>

        <Button onClick={handleNewGroup} type="button" variant="surface-muted">
          새로운 그룹 생성하기
        </Button>
      </main>
    </div>
  );
};

export default FinalPage;
