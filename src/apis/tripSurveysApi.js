import { instance } from "@/apis/instance";
import { getStoredJson } from "@/utils/getStorage";
import { STORAGE_KEY } from "@/constants/storageKey";
import { API_URL } from "@/constants/apiURL";
import { SURVEY_API_ERROR_MESSAGE } from "@/constants/surveyApiErrorMessage";

export async function postSurveyData(surveyData, inviteCode) {
    const data = getStoredJson(inviteCode ?? null);
    const memberId = data?.id ?? data?.memberId ?? null;
    const tripGroupId = data.tripGroupId;
    
    try {
        // URL 및 설문조사 데이터 조회 (테스트 후 삭제)
        const url = API_URL.POST_SURVEYS(tripGroupId, memberId);
        console.log(url, JSON.stringify(surveyData, null, 2));
        
        // API 저장 요청
        const response = await instance.post(url, surveyData);
        return response.data;
    } catch (error) {
        console.error(SURVEY_API_ERROR_MESSAGE.SUBMIT_ERROR, error);
        console.error(SURVEY_API_ERROR_MESSAGE.SUBMIT_ERROR_REASON, error.response.data.message);
        return null;
    }
}