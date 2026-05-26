import Button from '@/components/common/button/Button';
import styles from './FinalPage.module.scss';
import celebrateSvg from '@/assets/images/celebrate.svg';
import ResultList from './components/ResultList';

const FinalPage = () => {
  return (
    <div className={styles['final-page']}>
      <section className={styles['final-page__hero']}>
        <img src={celebrateSvg} alt="축하아이콘" />

        <h1 className={styles['final-page__title']}>
          강릉 1박 2일로
          <br />
          결정되었어요!
        </h1>
        <p className={styles['final-page__summary']}>투표 결과 3 / 4명 동의</p>
      </section>

      <main className={styles['final-page__content']}>
        <section className={styles['final-page__results']}>
          <h2 className={styles['final-page__heading']}>전체 투표 결과</h2>

          <ResultList />
        </section>

        <Button type="button" variant="surface-muted">
          새로운 그룹 생성하기
        </Button>
      </main>
    </div>
  );
};

export default FinalPage;
