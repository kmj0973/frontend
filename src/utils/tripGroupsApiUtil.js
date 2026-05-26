// 문자열 포맷팅에 따른 정규화 (그룹 정보)
export function normalizeGroupInfo(result) {
    const tripLength = result.tripLength ?? result.trip_length;
    if (result.name == null || tripLength == null || result.status == null) {
        return null;
    }

    return {
        tripGroupId: result.tripGroupId ?? result.id ?? 0,
        name: result.name ?? "",
        tripLength: result.tripLength ?? tripLength ?? "",
        startDate: result.startDate ?? result.start_date ?? "",
        endDate: result.endDate ?? result.end_date ?? "",
        inviteCode: result.inviteCode ?? result.invite_code ?? "",
        status: result.status ?? "",
        totalMembers: result.totalMembers ?? result.total_members ?? 0,
        completedMembers: result.completedMembers ?? result.completed_members ?? 0,
    };
}

// (모듈 함수) 문자열 포맷팅에 따른 정규화
export function normalizeMember(member) {
    const memberId = member.memberId ?? member.id;
    if (memberId == null) return null;

    return {
        memberId,
        nickname: member.nickname,
        role: member.role,
        surveyCompleted:
            member.surveyCompleted ??
            member.is_survey_completed ??
            member.isSurveyCompleted ??
            false,
    };
}

// 문자열 포맷팅에 따른 정규화 (멤버 목록 정보)
export function normalizeMemberList(members) {
    if (!Array.isArray(members)) return null;
    return members.map(normalizeMember).filter(Boolean);
}

// 여행 그룹 정보 정규화
export function normalizeTripInfo(groupInformation) {
    return {
        name: groupInformation.name,
        tripLength: groupInformation.tripLength,
        startDate: groupInformation.startDate,
        endDate: groupInformation.endDate,
        status: groupInformation.status,
    }
}