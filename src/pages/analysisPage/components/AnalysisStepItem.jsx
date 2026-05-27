import styles from './AnalysisStepItem.module.scss';
import { memo } from 'react';
import { ANALYSIS_STEP_STATUS_META } from '@/constants/analysisStepStatus';

const AnalysisStepItem = ({ step, status }) => {
  const { label, connector: ConnectorIcon } = ANALYSIS_STEP_STATUS_META[status];
  const isFinalActiveStep = step.id === 4 && status === 'active';

  return (
    <div
      className={`${styles['analysis-step-item']} ${styles[`status-${status}`]} ${
        isFinalActiveStep ? styles['final-step-active'] : ''
      }`}
    >
      <p className={styles['analysis-step-number']}>{step.id}</p>
      {step.id !== 4 && (
        <div className={styles['analysis-step-connector']}>
          <ConnectorIcon />
        </div>
      )}
      <div className={styles['analysis-step-item-text']}>
        <span>{step.title}</span>
        <span>{step.description}</span>
      </div>
      <div className={styles['analysis-step-item-status']}>{label}</div>
    </div>
  );
};

export default memo(AnalysisStepItem);
