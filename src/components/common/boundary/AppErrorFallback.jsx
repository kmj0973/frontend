import Button from '@/components/common/button/Button';
import styles from './AppErrorFallback.module.scss';

const AppErrorFallback = ({
  title = '잠시 길을 잃었어요',
  subtitle = (
    <>
      화면을 불러오는 중 문제가 생겼어요.
      <br />
      잠시 후 다시 시도하거나 홈으로 돌아가 주세요.
    </>
  ),
  cardTitle = '서비스 연결이 잠시 불안정해요',
  cardCopy = '입력 중인 정보는 남아 있을 수 있으니, 다시 시도한 뒤에도 같은 문제가 계속되면 홈으로 이동해 흐름을 다시 시작해 주세요.',
  primaryLabel = '홈으로 돌아가기',
  secondaryLabel = '다시 시도',
  onPrimaryAction,
  onSecondaryAction,
  hideSecondaryAction = false,
}) => {
  const handleRetry = () => {
    if (typeof onSecondaryAction === 'function') {
      onSecondaryAction();
      return;
    }

    window.location.reload();
  };

  const handleGoHome = () => {
    if (typeof onPrimaryAction === 'function') {
      onPrimaryAction();
      return;
    }

    window.location.assign('/');
  };

  return (
    <section className={styles['error-page']}>
      <div className={styles['error-page__hero']}>
        <p className={styles['error-page__eyebrow']}>Trip Truth</p>
        <h1 className={styles['error-page__title']}>{title}</h1>
        <p className={styles['error-page__subtitle']}>{subtitle}</p>
      </div>

      <div className={styles['error-page__card']}>
        <div className={styles['error-page__badge']} aria-hidden="true">
          !
        </div>
        <h2 className={styles['error-page__card-title']}>{cardTitle}</h2>
        <p className={styles['error-page__card-copy']}>{cardCopy}</p>
      </div>

      <div className={styles['error-page__actions']}>
        {hideSecondaryAction ? null : (
          <Button type="button" variant="muted" onClick={handleRetry}>
            {secondaryLabel}
          </Button>
        )}
        <Button type="button" variant="brand" onClick={handleGoHome}>
          {primaryLabel}
        </Button>
      </div>
    </section>
  );
};

export default AppErrorFallback;
