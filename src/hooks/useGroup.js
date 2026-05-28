import { useEffect, useRef, useState } from "react";
import { fetchGroupsData } from "@/apis/tripGroupsApi";
import { shareInviteLink } from "@/utils/kakaoShare";
import { getStoredJson } from "@/utils/getStorage";
import { GROUP_BUTTON_TEXT, GROUP_POLLING_INTERVAL, GROUP_INVITE_URL, GROUP_CONSOLE_MESSAGE, GROUP_ALERT_MESSAGE } from "@/constants/groupHooksConstants";
import { GROUP_STATUS, GROUP_ROLE } from "@/constants/groupStatus";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function isMemberSurveyCompleted(member) {
    return member.surveyCompleted === true || member.surveyCompleted === 1;
}

export function isAllMembersSurveyCompleted(memberList) {
    if (!Array.isArray(memberList) || memberList.length === 0) return false;

    return memberList.every((member) => isMemberSurveyCompleted(member));
}

export function isSameMemberId(memberId, myId) {
    if (myId == null || memberId == null) {
        return false;
    }
    return Number(memberId) === Number(myId);
}

// 본인 설문 완료 여부를 미리 적용
function applyMySurveyCompleted(memberList, memberId) {
    if (!Array.isArray(memberList)) return memberList;
    return memberList.map((member) =>
        isSameMemberId(member.memberId, memberId)
            ? { ...member, surveyCompleted: true }
            : member
    );
}

export function useGroup() {
    // 초대 코드가 없는 경우 주소창의 초대 코드 사용, 없으면 로컬 스토리지의 초대 코드 사용
    // 현재는 테스트 초대코드 사용 (추후 삭제)
    const { inviteCode } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();

    // 로컬 스토리지에서 초대 코드 및 사용자 데이터 조회
    const data = getStoredJson(inviteCode ?? null);
    const user = {
        memberId: data?.id ?? data?.memberId ?? null,
        role: data?.role ?? null,
    }
    const tripGroupId = data?.tripGroupId ?? null; 
    
    // 그룹 데이터 상태
    const [groupInfo, setGroupInfo] = useState(null);
    const [memberList, setMemberList] = useState(null);
    const [isToNext, setIsToNext] = useState(false);
    const [nextButtonText, setNextButtonText] = useState(GROUP_BUTTON_TEXT.NOT_READY);
    
    const [startAnalysis, setStartAnalysis] = useState(false);
    const startAnalysisRef = useRef(false);

    // 그룹 정보가 없거나 멤버 목록이 없는 경우 로딩 중
    const isLoading = groupInfo === null || memberList === null;

    const memberListRef = useRef(memberList);
    memberListRef.current = memberList;

    const analysisTimersRef = useRef({ intervalId: null, timeoutId: null });

    const setAnalysisStarting = (value) => {
        startAnalysisRef.current = value;
        setStartAnalysis(value);
    };

    // 실행 구조
    // 1. 그룹 진행 정보 상태에 따라 타 페이지로 라우팅
    // 2. 그룹 데이터 API 요청 및 그룹 데이터 설정
    // 3. 모든 멤버의 설문 완료 여부 확인
    // 4. 분석 시작 대기/진행 중에는 멤버·그룹 정보만 갱신 (버튼 텍스트는 유지)
    // 5. 모든 멤버의 설문 완료 여부 확인 결과에 따른 버튼 텍스트 설정 (본인 최우선 적용)
    // 6. 그룹 정보가 없으면 즉시 조회, 있으면 3초마다 조회
    useEffect(() => {
        // 그룹 진행 정보 상태에 따라 타 페이지로 라우팅
        if (groupInfo?.status) {
            if (groupInfo.status === GROUP_STATUS.ANALYZING) {
                navigate(`/analysis/${inviteCode}`);
                return;
            } else if (groupInfo.status === GROUP_STATUS.VOTING) {
                navigate(`/results/${inviteCode}`);
                return;
            }  else if (groupInfo.status === GROUP_STATUS.FAILED) {
                navigate(`/results/e/${inviteCode}`);
                return;
            } else if (groupInfo.status === GROUP_STATUS.COMPLETED) {
                navigate(`/final/${inviteCode}`);
                return;
            }
        }

        // 설문 완료 직후 본인 설문 완료 여부를 즉시 반영
        const surveySubmitted = location.state?.surveySubmitted === true;
        if (surveySubmitted) {
            setMemberList((prev) => applyMySurveyCompleted(prev, user.memberId));
            navigate(location.pathname, { replace: true, state: {} });
        }

        // 3초마다 그룹 데이터 폴링 조회
        const loadGroupData = async () => {
            // 그룹 ID가 없는 경우 에러 처리
            if (tripGroupId == null) {
                console.error(GROUP_CONSOLE_MESSAGE.LOCAL_STORAGE_ERROR_MESSAGE);
                setNextButtonText(GROUP_BUTTON_TEXT.ERROR);
                return;
            }

            // 그룹 데이터 조회
            try {
                // API 요청
                const result = await fetchGroupsData(tripGroupId, inviteCode);

                // 그룹 데이터 조회 실패 시 에러 처리
                if (!result) {
                    setNextButtonText(GROUP_BUTTON_TEXT.ERROR);
                    return;
                }

                // 정규화된 그룹 데이터 설정
                const { memberList: parsedMemberListData, groupInfo: parsedInvitedGroupData } = result;
                const membersToSet = surveySubmitted
                    ? applyMySurveyCompleted(parsedMemberListData, user.memberId)
                    : parsedMemberListData;

                // 그룹 정보 설정
                setGroupInfo(parsedInvitedGroupData);

                // 멤버 목록 설정
                setMemberList(membersToSet);

                // 모든 멤버의 설문 완료 여부 확인
                const allSurveyCompleted = isAllMembersSurveyCompleted(membersToSet);

                // 분석 시작 대기/진행 중에는 멤버·그룹 정보만 갱신
                if (startAnalysisRef.current) {
                    return;
                }

                // 모든 멤버의 설문 완료 여부 확인 결과에 따른 버튼 텍스트 설정
                if (!allSurveyCompleted) {
                    setIsToNext(false);
                    setNextButtonText(GROUP_BUTTON_TEXT.NOT_READY);
                } else if (user?.role === GROUP_ROLE.LEADER) {
                    setIsToNext(true);
                    setNextButtonText(GROUP_BUTTON_TEXT.LEADER_READY);
                } else {
                    setIsToNext(false);
                    setNextButtonText(GROUP_BUTTON_TEXT.MEMBER_READY);
                }
            } catch (error) {
                console.error(GROUP_CONSOLE_MESSAGE.LOAD_ERROR_MESSAGE, error);
            }
        };

        // 데이터가 없는 경우 그룹 데이터 API 요청 및 그룹 데이터 설정
        if (groupInfo === null || memberList === null) {
            loadGroupData();
        } 

        // 백엔드 요구사항 : 그룹 정보가 있는 경우 그룹 데이터 3초마다 조회
        else if (groupInfo !== null) {
            const timer = setTimeout(loadGroupData, GROUP_POLLING_INTERVAL);
            return () => clearTimeout(timer);
        }
    }, [groupInfo, inviteCode, tripGroupId, user?.memberId, user?.role, location.pathname, location.state, navigate]);

    // 초대 링크 복사
    const copyLink = async () => {
        const targetUrl = GROUP_INVITE_URL(inviteCode);
        try {
            await navigator.clipboard.writeText(targetUrl);
            alert(GROUP_ALERT_MESSAGE.COPY_LINK_SUCCESS);
        } catch (error) {
            console.error(GROUP_CONSOLE_MESSAGE.COPY_LINK_ERROR_MESSAGE, error);
            alert(GROUP_ALERT_MESSAGE.COPY_LINK_ERROR);
        }
    }

    // 초대 링크 카카오 공유
    const shareKakao = async () => {
        if (!inviteCode) {
            console.error(GROUP_CONSOLE_MESSAGE.INVITE_CODE_ERROR_MESSAGE);
            alert(GROUP_ALERT_MESSAGE.INVITE_CODE_ERROR);
        }

        shareInviteLink({
            inviteCode,
            groupName: groupInfo?.name,
        });
    }

    // 설문조사 페이지로 이동 (미완료 본인만)
    const handleMoveSurveyPage = () => {
        const me = memberList?.find(
            (member) => isSameMemberId(member.memberId, user?.memberId)
        );
        
        if (inviteCode && me && !isMemberSurveyCompleted(me)) {
            navigate(`/survey/${inviteCode}`);
        }
    }

    // useRef 타이머 초기화
    const clearAnalysisTimers = () => {
        const { intervalId, timeoutId } = analysisTimersRef.current;
        if (intervalId != null) clearInterval(intervalId);
        if (timeoutId != null) clearTimeout(timeoutId);
        analysisTimersRef.current = { intervalId: null, timeoutId: null };
    };

    // 버튼 상태 리셋
    const resetLeaderButtonState = (allSurveyCompleted) => {
        setIsToNext(allSurveyCompleted);
        setNextButtonText(
            allSurveyCompleted
                ? GROUP_BUTTON_TEXT.LEADER_READY
                : GROUP_BUTTON_TEXT.NOT_READY
        );
    };

    // AI 분석 시작
    // 실행 구조
    // 1. 분석 가능 상태 유효성 검증
    // 3. 멤버 목록 길이 조회
    // 4. 모든 멤버가 설문을 완료했는지 조회
    // 5. 분석 시작 대기 (폴링 시 버튼 텍스트 덮어쓰기 방지)
    // 6. 타이머 초기화 (새로운 인원이 들어오면 다시 실행해야함)
    const handleStartAnalysis = () => {
        // 멤버 목록이 없거나 분석 가능 상태가 아닌 경우 종료
        if (!Array.isArray(memberList) || !isToNext) return;

        // 방장이 아니거나 초대 코드가 없는 경우 종료
        if (user?.role !== GROUP_ROLE.LEADER || !inviteCode) return;

        // 멤버 목록 길이 조회
        const memberCount = memberList.length;

        // 모든 멤버가 설문을 완료했는지 조회
        const allSurveyCompleted =
            memberCount > 0 && isAllMembersSurveyCompleted(memberList);

        if (!allSurveyCompleted) return;

        // 분석 시작 대기 (폴링 시 버튼 텍스트 덮어쓰기 방지)
        setAnalysisStarting(true);

        // 타이머 초기화
        clearAnalysisTimers();
        setIsToNext(false);

        const waitSeconds = GROUP_POLLING_INTERVAL / 1000;
        setNextButtonText(`${waitSeconds}초 후 시작`);

        // 1초마다 버튼 텍스트 업데이트
        let remaining = waitSeconds;
        const intervalId = setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
                setNextButtonText(`${remaining}초 후 시작`);
            }
        }, 1000);

        // 3초 후 분석 시작
        const timeoutId = setTimeout(() => {
            clearAnalysisTimers();

            const currentList = memberListRef.current;
            const currentLength = Array.isArray(currentList) ? currentList.length : 0;
            const allSurveyCompletedNow = isAllMembersSurveyCompleted(currentList);
            const hasMemberCountChanged = memberCount !== currentLength;

            // 새로운 인원 입장 : 분석 시작 대기 종료
            if (hasMemberCountChanged) {
                setAnalysisStarting(false);
                resetLeaderButtonState(allSurveyCompletedNow);
                return;
            }

            // 분석 페이지로 이동
            if (allSurveyCompletedNow) {
                setAnalysisStarting(false);
                navigate(`/analysis/${inviteCode}`);
                return;
            }

            // 대기 중 설문 미완료 멤버가 생긴 경우: 분석 시작 대기 종료
            setAnalysisStarting(false);
            resetLeaderButtonState(false);
        }, GROUP_POLLING_INTERVAL);

        analysisTimersRef.current = { intervalId, timeoutId };
    };

    return {
        user,
        inviteCode,
        groupInfo,
        memberList,
        isToNext,
        nextButtonText,
        isLoading,
        copyLink,
        shareKakao,
        handleMoveSurveyPage,
        handleStartAnalysis,
    };
}
