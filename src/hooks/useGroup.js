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

export function isSameMemberId(memberId, myId) {
    if (myId == null || memberId == null) {
        return false;
    }
    return Number(memberId) === Number(myId);
}

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

    const data = getStoredJson(inviteCode ?? null);
    const user = {
        memberId: data?.id ?? data?.memberId ?? null,
        role: data?.role ?? null,
    }
    const tripGroupId = data?.tripGroupId ?? null; 

    const [groupInfo, setGroupInfo] = useState(null);
    const [memberList, setMemberList] = useState(null);
    const [isToNext, setIsToNext] = useState(false);
    const [nextButtonText, setNextButtonText] = useState(GROUP_BUTTON_TEXT.NOT_READY);
    
    const [startAnalysis, setStartAnalysis] = useState(false);
    const startAnalysisRef = useRef(false);

    const memberListRef = useRef(memberList);
    memberListRef.current = memberList;

    const analysisTimersRef = useRef({ intervalId: null, timeoutId: null });

    const setAnalysisStarting = (value) => {
        startAnalysisRef.current = value;
        setStartAnalysis(value);
    };

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

        const surveySubmitted = location.state?.surveySubmitted === true;

        if (surveySubmitted) {
            setMemberList((prev) => applyMySurveyCompleted(prev, user.memberId));
            navigate(location.pathname, { replace: true, state: {} });
        }

        const loadGroupData = async () => {
            // 그룹 ID가 없는 경우 에러 처리
            if (tripGroupId == null) {
                console.error(GROUP_CONSOLE_MESSAGE.LOCAL_STORAGE_ERROR_MESSAGE);
                setNextButtonText(GROUP_BUTTON_TEXT.ERROR);
                return;
            }

            // 그룹 데이터 조회
            try {
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
                const allSurveyCompleted =
                    membersToSet.length ===
                    membersToSet.filter((member) => isMemberSurveyCompleted(member)).length;

                // 분석 시작 대기/진행 중에는 멤버·그룹 정보만 갱신 (버튼 텍스트는 유지)
                if (startAnalysisRef.current) {
                    console.log("현재 분석중입니다.");
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

                // 테스트 코드 (추후 삭제)
                console.log("그룹 데이터를 성공적으로 불러왔습니다");
                console.log("멤버 목록 조회 API 주소: ", `/api/v1/trip-groups/${tripGroupId}`);
                console.log("현재 멤버 목록:", parsedMemberListData);
                console.log("그룹 정보 조회 API 주소: ", `/api/v1/trip-groups/invite/${inviteCode}`);
                console.log("현재 그룹 정보:", parsedInvitedGroupData);
            } catch (error) {
                console.error(GROUP_CONSOLE_MESSAGE.LOAD_ERROR_MESSAGE, error);
            }
        };

        // 그룹 정보가 없거나 설문 완료 여부에 따라 그룹 데이터 조회
        if (groupInfo === null || surveySubmitted) {
            loadGroupData();
        } 
        // 백엔드 요구사항 : 그룹 정보가 있는 경우 그룹 데이터 3초마다 조회
        else if (groupInfo !== null) {
            const timer = setTimeout(loadGroupData, GROUP_POLLING_INTERVAL);
            return () => clearTimeout(timer);
        }
    }, [groupInfo, inviteCode, tripGroupId, user?.memberId, user?.role, location.pathname, navigate]);

    // 그룹 정보가 없거나 멤버 목록이 없는 경우 로딩 중
    const isLoading = !groupInfo || !Array.isArray(memberList);

    // 초대 링크 복사
    const copyLink = async () => {
        const targetUrl = GROUP_INVITE_URL(inviteCode);
        try {
            await navigator.clipboard.writeText(targetUrl);
            alert(GROUP_ALERT_MESSAGE.COPY_LINK_SUCCESS);
        } catch {
            alert(GROUP_ALERT_MESSAGE.COPY_LINK_ERROR);
        }
    }

    // 초대 링크 카카오 공유
    const shareKakao = async () => {
        if (!inviteCode) {
            console.error(GROUP_CONSOLE_MESSAGE.INVITE_CODE_ERROR_MESSAGE);
            return;
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

    const clearAnalysisTimers = () => {
        const { intervalId, timeoutId } = analysisTimersRef.current;
        if (intervalId != null) clearInterval(intervalId);
        if (timeoutId != null) clearTimeout(timeoutId);
        analysisTimersRef.current = { intervalId: null, timeoutId: null };
    };

    // AI 분석 시작
    const handleStartAnalysis = () => {
        // 멤버 목록이 없거나 분석 가능 상태가 아닌 경우 종료
        if (!Array.isArray(memberList) || !isToNext) return;

        // 방장이 아니거나 초대 코드가 없는 경우 종료
        if (user?.role !== GROUP_ROLE.LEADER || !inviteCode) return;

        // 멤버 목록 길이 조회
        const memberCountAtClick = memberList.length;

        // 모든 멤버가 설문을 완료했는지 조회
        const allSurveyCompletedAtClick =
            memberCountAtClick > 0 &&
            memberList.every((member) => isMemberSurveyCompleted(member));

        if (!allSurveyCompletedAtClick) return;

        // 분석 시작 대기 (폴링 시 버튼 텍스트 덮어쓰기 방지)
        setAnalysisStarting(true);

        // 타이머 초기화
        clearAnalysisTimers();
        setIsToNext(false);

        const waitSeconds = GROUP_POLLING_INTERVAL / 1000;
        setNextButtonText(`${waitSeconds}초 후 시작`);

        let remaining = waitSeconds;
        const intervalId = setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
                setNextButtonText(`${remaining}초 후 시작`);
            }
        }, 1000);

        const timeoutId = setTimeout(() => {
            clearAnalysisTimers();

            const currentList = memberListRef.current;
            const currentLength = Array.isArray(currentList) ? currentList.length : 0;
            const allSurveyCompletedNow =
                currentLength > 0 &&
                currentList.every((member) => isMemberSurveyCompleted(member));

            if (memberCountAtClick !== currentLength) {
                setIsToNext(allSurveyCompletedNow);
                setNextButtonText(
                    allSurveyCompletedNow
                        ? GROUP_BUTTON_TEXT.LEADER_READY
                        : GROUP_BUTTON_TEXT.NOT_READY
                );
                setAnalysisStarting(false);
                return;
            }

            if (allSurveyCompletedNow) {
                console.log(`분석 시작 상태: ${startAnalysisRef.current}`);
                setAnalysisStarting(false);
                navigate(`/analysis/${inviteCode}`);
                return;
            }

            setAnalysisStarting(false);
            setIsToNext(false);
            setNextButtonText(GROUP_BUTTON_TEXT.NOT_READY);
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
