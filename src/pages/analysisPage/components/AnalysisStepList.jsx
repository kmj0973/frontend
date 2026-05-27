import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AnalysisStepList.module.scss';
import { ANALYSIS_STEPS } from '@/constants/analysisSteps';
import { GROUP_STATUS } from '@/constants/groupStatus';
import { getAnalysisStatus, postAnalysis } from '@/apis/analysisApi';
import { useStoredGroup } from '@/hooks/useStoredGroup';
import AnalysisStepItem from './AnalysisStepItem';

const AnalysisStepList = ({ onError }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { inviteCode } = useParams();
  const { tripGroupId, role } = useStoredGroup({ redirectOnMissing: true });
  const hasStartedAnalysisRef = useRef(false);

  useEffect(() => {
    if (!tripGroupId || hasStartedAnalysisRef.current || role !== 'LEADER')
      return;

    hasStartedAnalysisRef.current = true;

    const startAnalysis = async () => {
      try {
        const response = await postAnalysis(tripGroupId);
        console.log(response);
      } catch (err) {
        console.log('초기 분석 실패', err);
        if (typeof onError === 'function') {
          onError();
        }
      }
    };

    startAnalysis();
  }, [tripGroupId, role, onError]);

  useEffect(() => {
    if (!inviteCode || !tripGroupId) return;

    let timeoutId;
    let intervalId;

    if (currentStep < 4) {
      timeoutId = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2400);
    }

    if (currentStep === 4) {
      intervalId = setInterval(async () => {
        try {
          const response = await getAnalysisStatus(tripGroupId);
          const status = response?.result;

          if (status === GROUP_STATUS.VOTING) {
            clearInterval(intervalId);
            navigate(`/results/${inviteCode}`, { replace: true });
          } else if (status === GROUP_STATUS.FAILED) {
            clearInterval(intervalId);
            if (typeof onError === 'function') {
              onError();
            }
          }
        } catch (error) {
          clearInterval(intervalId);
          console.error('분석 상태 조회 실패', error);
          if (typeof onError === 'function') {
            onError();
          }
        }
      }, 2400);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentStep, inviteCode, tripGroupId, navigate, onError]);

  return (
    <div className={styles['analysis-step-list']}>
      {ANALYSIS_STEPS.map((step) => {
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
