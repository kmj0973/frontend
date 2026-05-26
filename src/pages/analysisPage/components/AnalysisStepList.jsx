import { useEffect, useState } from 'react';
import styles from './AnalysisStepList.module.scss';
import { ANALYSIS_STEPS } from '@/constants/analysisSteps';
import AnalysisStepItem from './AnalysisStepItem';
import { useParams, useNavigate } from 'react-router-dom';

const AnalysisStepList = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  // 2초마다 step이 변경되도록 설정
  // if문에 결과페이지로 이동하는 기능 추가 예정
  useEffect(() => {
    if (currentStep > ANALYSIS_STEPS.length) {
      navigate(`/results/${inviteCode}`);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 2400);

    return () => clearTimeout(timer);
  }, [currentStep, navigate]);

  return (
    <div className={styles['analysis-step-list']}>
      {ANALYSIS_STEPS.map((step) => {
        // 현재 step과 비교하여 status 결정
        const status =
          step.id === currentStep
            ? 'active'
            : step.id < currentStep
              ? 'done'
              : 'pending';

        return <AnalysisStepItem key={step.id} step={step} status={status} />;
      })}
    </div>
  );
};

export default AnalysisStepList;
