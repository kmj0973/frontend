import { useEffect, useState } from 'react';
import styles from './AnalysisStepList.module.scss';
import { ANALYSIS_STEPS } from '@/constants/analysisSteps';
import AnalysisStepItem from './AnalysisStepItem';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { getAnalysisStatus, postAnalysis } from '@/apis/analysisApi';
import { GROUP_STATUS } from '@/constants/groupStatus';

const AnalysisStepList = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { inviteCode } = useParams();
  const { tripGroupId } = storage.get(inviteCode);

  //초기 분석 시작
  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const response = await postAnalysis(tripGroupId);
        console.log(response);
      } catch (err) {
        console.log('초기 분석 실패', err);
      }
    };

    startAnalysis();
  }, [tripGroupId]);

  //분석 상태 체크
  useEffect(() => {
    if (!inviteCode || !tripGroupId) return;

    let timeoutId;
    let intervalId;

    // 1 -> 2 -> 3 -> 4 까지는 step만 진행
    if (currentStep < 4) {
      timeoutId = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2400);
    }

    // 4에 도달하면 status를 계속 polling
    if (currentStep === 4) {
      intervalId = setInterval(async () => {
        try {
          const response = await getAnalysisStatus(tripGroupId);
          const status = response?.result;

          console.log(status);

          if (status === GROUP_STATUS.VOTING) {
            clearInterval(intervalId);
            navigate(`/results/${inviteCode}`, { replace: true });
          } else if (status === GROUP_STATUS.FAILED) {
            //분석 실패 다이얼로그 보여주기
            throw Error('분석 오류');
          }
        } catch (error) {
          console.error('분석 상태 조회 실패', error);
        }
      }, 2400);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentStep, inviteCode, tripGroupId, navigate]);

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
