import Button from '@/components/common/button/Button';
import NicknameStep from '../createGroupPage/components/NicknameStep';
import styles from './JoinGroupPage.module.scss';
import { useJoinGroupForm } from './hooks/useJoinGroupForm';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { fetchGroupsData } from '@/apis/tripGroupsApi';

const JoinGroupPage = () => {
  const {
    nickname,
    setNickname,
    isLoading,
    isNicknameValid,
    nicknameVariant,
    handleSubmit,
  } = useJoinGroupForm();
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const isMember = storage.get(inviteCode) ? true : false;

  useEffect(() => {
    if (!isMember) return;

    const fetchGroupStatus = async () => {
      const { tripGroupId } = storage.get(inviteCode);
      const response = await fetchGroupsData(tripGroupId);
      const status = response.groupInfo.status;

      if (status == 'GATHERING') {
        navigate(`/group/${inviteCode}`);
      } else if (status == 'ANALYZING') {
        navigate(`/analysis/${inviteCode}`);
      } else if (status == 'VOTING') {
        navigate(`/reuslts/${inviteCode}`);
      } else if (status == 'COMPLETED') {
        navigate(`/final/${inviteCode}`);
      } else {
        navigate('/');
      }
    };

    fetchGroupStatus();
  }, [inviteCode, isMember, navigate]);

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
