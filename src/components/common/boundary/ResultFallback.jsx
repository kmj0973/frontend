import { useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import styles from './ResultFallback.module.scss';
import { useStoredGroup } from '@/hooks/useStoredGroup';
import { resetSurveyData } from '@/apis/tripSurveysApi';

const CONFLICT_ITEMS = [
  '15만 원 예산으로는 항공 이동이 부담될 수 있어요',
  '한쪽은 액티비티를 원하고, 한쪽은 휴양을 선호해요',
  '당일치기를 원하지만 새벽 출발은 어려워요',
];

const ResultFallback = () => {
  const navigate = useNavigate();
  const { inviteCode, tripGroupId } = useStoredGroup({
    redirectOnMissing: true,
  });

  const handleReset = async () => {
    try {
      await resetSurveyData(tripGroupId);
      navigate(`/group/${inviteCode}`, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={styles['result-fallback']}>
      <div className={styles['result-fallback__content']}>
        <div className={styles['result-fallback__icon']} aria-hidden="true">
          <span className={styles['result-fallback__icon-mark']}>!</span>
        </div>

        <h2 className={styles['result-fallback__title']}>
          조건이 너무 까다로워요
        </h2>
        <p className={styles['result-fallback__description']}>
          모든 조건을 만족하는 플랜을 찾지 못했어요
        </p>

        <section className={styles['result-fallback__panel']}>
          <h3 className={styles['result-fallback__panel-title']}>충돌 항목</h3>
          <ul className={styles['result-fallback__list']}>
            {CONFLICT_ITEMS.map((item) => (
              <li key={item} className={styles['result-fallback__list-item']}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={styles['result-fallback__actions']}>
        <Button type="button" variant="muted" onClick={handleReset}>
          멤버 응답 다시 받기
        </Button>
        <Button type="button" variant="brand" onClick={() => navigate('/')}>
          조건 완화해서 추천 받기
        </Button>
      </div>
    </section>
  );
};

export default ResultFallback;
