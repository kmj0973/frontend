import { useEffect, useState } from "react";
import { fetchGroupsData } from "@/apis/tripGroupsApi";
import { shareInviteLink } from "@/utils/kakaoShare";
import { getStoredJson } from "@/utils/getStorage";
import { STORAGE_KEY } from "@/constants/storageKey";
import { URL_PARAM } from "@/constants/urlParam";
import { GROUP_BUTTON_TEXT, GROUP_POLLING_INTERVAL, GROUP_INVITE_URL, GROUP_CONSOLE_MESSAGE, GROUP_ALERT_MESSAGE } from "@/constants/groupHooksConstants";
import { GROUP_STATUS, GROUP_ROLE } from "@/constants/groupStatus";

// 테스트 완료 후 삭제
import { GROUP_TEST_INVITE_CODE } from "@/constants/groupHooksConstants";

function isMemberSurveyCompleted(member) {
    if (member.surveyCompleted === true) return true;
    return false;
}

export function useGroup() {
    const user = getStoredJson(STORAGE_KEY.MEMBER);
    const group = getStoredJson(STORAGE_KEY.TRIP_GROUP);
    // 초대 코드가 없는 경우 주소창의 초대 코드 사용, 없으면 로컬 스토리지의 초대 코드 사용
    // 현재는 테스트 초대코드 사용 (추후 삭제)
    const inviteCode = new URLSearchParams(window.location.search).get(URL_PARAM.INVITE_CODE) ?? GROUP_TEST_INVITE_CODE; 
    const tripGroupId = group?.tripGroupId ?? group?.id ?? null; 

    const [groupInfo, setGroupInfo] = useState(null);
    const [memberList, setMemberList] = useState(null);
    const [isToNext, setIsToNext] = useState(false);
    const [nextButtonText, setNextButtonText] = useState(GROUP_BUTTON_TEXT.NOT_READY);

    useEffect(() => {
        // 백엔드 요구사항 : 그룹 상태가 VOTING인 경우 데이터 조회 불가능
        if (groupInfo && groupInfo.status === GROUP_STATUS.VOTING) {
            console.log(GROUP_CONSOLE_MESSAGE.VOTING_STOP_MESSAGE);
            return;
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

                // 그룹 정보 설정
                setGroupInfo(parsedInvitedGroupData);
                // 멤버 목록 설정
                setMemberList(parsedMemberListData);

                // 모든 멤버의 설문 완료 여부 확인
                const allSurveyCompleted =
                    parsedMemberListData.length ===
                    parsedMemberListData.filter((member) => isMemberSurveyCompleted(member)).length;

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

        // 그룹 정보가 없는 경우 그룹 데이터 조회
        if (groupInfo === null) {
            loadGroupData();
        } 
        // 백엔드 요구사항 : 그룹 정보가 있는 경우 그룹 데이터 3초마다 조회
        else {
            const timer = setTimeout(loadGroupData, GROUP_POLLING_INTERVAL);
            return () => clearTimeout(timer);
        }
    }, [groupInfo, inviteCode, tripGroupId, user?.role]);

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

    // AI 분석 시작 (다음 버튼 클릭 시 실행 / 아직 미구현)
    const handleStartAnalysis = () => {
        if (!isToNext) return;
        console.log("AI 분석 시작");
    }


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
        handleStartAnalysis,
    };
}
