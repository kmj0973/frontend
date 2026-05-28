import Button from '@/components/common/button/Button';
import NicknameStep from '../createGroupPage/components/NicknameStep';
import styles from './JoinGroupPage.module.scss';
import { useJoinGroupForm } from './hooks/useJoinGroupForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroupsData } from '@/apis/tripGroupsApi';
import { useStoredGroup } from '@/hooks/useStoredGroup';
import { getInviteGroupInfo } from '@/apis/groupApi';
import { storage } from '@/utils/storage';

const JoinGroupPage = () => {
  const {
    nickname,
    setNickname,
    isLoading,
    isNicknameValid,
    nicknameVariant,
    handleSubmit,
  } = useJoinGroupForm();
  const navigate = useNavigate();
  const { inviteCode, tripGroupId, memberId } = useStoredGroup();

  useEffect(() => {
    const fetchGroupStatus = async () => {
      if (!memberId) {
        try {
          const tripGroupId = await getInviteGroupInfo(inviteCode).then(
            (res) => res.result.tripGroupId,
          );
          const status = await fetchGroupsData(tripGroupId).then(
            (res) => res.groupInfo.status,
          );

          storage.set(inviteCode, { tripGroupId: tripGroupId });

          if (status === 'ANALYZING') {
            navigate(`/analysis/${inviteCode}`, { replace: true });
          } else if (status === 'VOTING') {
            navigate(`/results/${inviteCode}`, { replace: true });
          } else if (status === 'COMPLETED') {
            navigate(`/final/${inviteCode}`, { replace: true });
          } else {
            navigate(`/group/join/${inviteCode}`, { replace: true });
          }

          console.log(tripGroupId, status);
        } catch (err) {
          console.log(err);
        }
        return;
      }

      const response = await fetchGroupsData(tripGroupId);
      const status = response.groupInfo.status;

      if (status === 'GATHERING') {
        navigate(`/group/${inviteCode}`, { replace: true });
      } else if (status === 'ANALYZING') {
        navigate(`/analysis/${inviteCode}`, { replace: true });
      } else if (status === 'VOTING') {
        navigate(`/results/${inviteCode}`, { replace: true });
      } else if (status === 'COMPLETED') {
        navigate(`/final/${inviteCode}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    };

    fetchGroupStatus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles['create-group-page']}>
      <section className={styles['create-group-section']}>
        <NicknameStep
          title={
            <>
              ‘여름여행’
              <br />
              그룹에 초대됐어요
            </>
          }
          subTitle="1박 2일 / 6월 첫째 주"
          nickname={nickname}
          setNickname={setNickname}
          nicknameVariant={nicknameVariant}
          nicknameMessage="2~10자 한글/영문만 입력 가능합니다."
        />
      </section>

      <div className={styles['create-group-cta']}>
        <Button
          type="submit"
          variant={isNicknameValid ? 'brand' : 'muted'}
          disabled={!isNicknameValid || isLoading}
        >
          다음
        </Button>
      </div>
    </form>
  );
};

export default JoinGroupPage;
