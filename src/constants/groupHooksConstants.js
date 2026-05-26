// 추후 삭제 필요
export const GROUP_TEST_INVITE_CODE = "test1234abcd";

export const GROUP_POLLING_INTERVAL = 3000;

export const GROUP_INVITE_URL = (inviteCode) => `${window.location.origin}/invite/${inviteCode}`;

export const GROUP_BUTTON_TEXT = {
    NOT_READY: "모든 친구가 입력해야 시작할 수 있어요",
    MEMBER_READY: "방장만 AI 분석을 시작할 수 있어요",
    LEADER_READY: "AI 분석 시작하기",
    ERROR: "에러가 발생하였습니다. 관리자에게 문의해주세요.",
};

export const GROUP_CONSOLE_MESSAGE = {
    VOTING_STOP_MESSAGE: "그룹 상태가 VOTING이 되어 폴링을 중단합니다.",
    LOAD_ERROR_MESSAGE: "데이터를 실시간으로 갱신하는데 실패했습니다.",
    LOCAL_STORAGE_ERROR_MESSAGE: "로컬 스토리지에 그룹 ID 정보가 존재하지 않습니다.",
    INVITE_CODE_ERROR_MESSAGE: "초대 코드가 없습니다.",
}

export const GROUP_ALERT_MESSAGE = {
    COPY_LINK_SUCCESS: "링크가 복사되었습니다.",
    COPY_LINK_ERROR: "링크 복사에 실패했습니다.",
}