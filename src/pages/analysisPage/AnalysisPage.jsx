import { useState } from 'react';
import AnalysisFallbackDialog from '@/components/common/boundary/AnalysisFallbackDialog';
import styles from './AnalysisPage.module.scss';
import AnalysisHero from './components/AnalysisHero';
import AnalysisStepList from './components/AnalysisStepList';

const AnalysisPage = () => {
  const [hasAnalysisError, setHasAnalysisError] = useState(false);

  return (
    <div className={styles['analysis-page']}>
      <AnalysisHero />
      <AnalysisStepList onError={() => setHasAnalysisError(true)} />
      {hasAnalysisError ? <AnalysisFallbackDialog /> : null}
    </div>
  );
};

export default AnalysisPage;
