import Button from '@/components/common/button/Button';
import styles from './MainPage.module.scss';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <main className={styles['main-page']}>
      <section className={styles['main-hero']}>
        <h1 className={styles['main-title']}>Trip Truth</h1>
        <p className={styles['main-subtitle']}>
          각자의 취향을, 하나의 여행으로
        </p>
      </section>
      <div className={styles['main-cta']}>
        <Button variant="light" onClick={() => navigate('/group/create/1')}>
          시작하기
        </Button>
      </div>
    </main>
  );
};

export default MainPage;
