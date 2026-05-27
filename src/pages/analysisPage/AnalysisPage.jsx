import styles from './AnalysisPage.module.scss';
import AnalysisHero from './components/AnalysisHero';
import AnalysisStepList from './components/AnalysisStepList';

const AnalysisPage = () => {
  return (
    <div className={styles['analysis-page']}>
      <AnalysisHero />
      <AnalysisStepList />
      {/* <AnalysisFallbackDialog /> */}
    </div>
  );
};

export default AnalysisPage;
