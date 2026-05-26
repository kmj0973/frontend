import { instance } from '@/apis/instance';
import { normalizeGroupInfo, normalizeMemberList, normalizeTripInfo } from '@/utils/tripGroupsApiUtil';
import { API_URL } from '@/constants/apiURL';
import { GROUP_API_ERROR_MESSAGE } from '@/constants/groupApiErrorMessage';

// 응답 데이터 형식 변환 (result 반환)
function convertResult(response) {
    const { isSuccess, result } = response.data ?? {};
    if (!isSuccess || result == null) {
        console.error(GROUP_API_ERROR_MESSAGE.RESPONSE_DATA_EMPTY);
        return null;
    }
    return result;
}

// 그룹 정보 조회
export async function fetchGroupsData(tripGroupId, inviteCode) {
    // tripGroupId나 inviteCode가 없는 경우 그룹 정보 및 멤버 목록 반환 불가
    if (tripGroupId === null) {
        console.error(GROUP_API_ERROR_MESSAGE.GROUP_ID_REQUIRED);
        return null;
    } else if (inviteCode === null) {
        console.error(GROUP_API_ERROR_MESSAGE.INVITE_CODE_REQUIRED);
        return null;
    }

    // URL 조회
    const url = API_URL.GET_TRIP_GROUPS(tripGroupId);

    // 그룹 상세 정보 조회
    const groupResponse = await instance.get(url);
    const groupResult = convertResult(groupResponse);

    // 문자열 포맷팅에 따른 정규화 (그룹 정보)
    const groupInformation = normalizeGroupInfo(groupResult);

    // 그룹 정보 데이터 유효성 검증 (현재는 테스트 중으로 추후 추가 필요)
    // if (groupInformation.tripGroupId !== tripGroupId) {
    //     console.error(GROUP_API_ERROR_MESSAGE.GROUP_ID_MISMATCH, groupInformation);
    //     return null;
    // } else if (groupInformation.inviteCode !== inviteCode) {
    //     console.error(GROUP_API_ERROR_MESSAGE.INVITE_CODE_MISMATCH, groupInformation);
    //     return null;
    // } 

    // 문자열 포맷팅에 따른 정규화 (멤버 목록 정보)
    const memberList = normalizeMemberList(groupResult.members);

    // 그룹 정보 정규화
    const groupInfo = normalizeTripInfo(groupInformation);

    // 객체 반환
    return { memberList, groupInfo };
}
