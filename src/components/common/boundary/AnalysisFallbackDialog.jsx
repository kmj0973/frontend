import { useNavigate, useParams } from 'react-router-dom';
import styles from './AnalysisFallbackDialog.module.scss';

const AnalysisFallbackDialog = ({ onRetry, onBackToGroup }) => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();

  const handleBackToGroup = () => {
    if (typeof onBackToGroup === 'function') {
      onBackToGroup();
      return;
    }

    navigate(`/group/${inviteCode}`, { replace: true });
  };

  const handleRetry = () => {
    if (typeof onRetry === 'function') {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <div className={styles['dialog-container']}>
      <section className={styles.dialog} role="dialog" aria-modal="true">
        <div className={styles['dialog-body']}>
          <div className={styles['warning-icon']} aria-hidden="true">
            <span className={styles['warning-icon-mark']}>!</span>
          </div>

          <h2 className={styles['dialog-title']}>AI 분석 실패</h2>

          <p className={styles['dialog-description']}>
            일시적인 오류가 발생했습니다
            <br />
            잠시 후 다시 시도해 주세요
          </p>
        </div>

        <div className={styles['dialog-actions']}>
          <button
            type="button"
            className={`${styles['dialog-action']} ${styles['dialog-action-muted']}`}
            onClick={handleBackToGroup}
          >
            그룹으로
            <br />
            돌아가기
          </button>
          <button
            type="button"
            className={`${styles['dialog-action']} ${styles['dialog-action-brand']}`}
            onClick={handleRetry}
          >
            다시 시도
          </button>
        </div>
      </section>
    </div>
  );
};

export default AnalysisFallbackDialog;
