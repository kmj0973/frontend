export const API_URL = {
    GET_TRIP_GROUPS: (tripGroupId) => `/api/v1/trip-groups/${tripGroupId}`,
    GET_TRIP_GROUPS_INVITE: (inviteCode) => `/api/v1/trip-groups/invite/${inviteCode}`,
    POST_SURVEYS: (tripGroupId, memberId) => `/api/v1/trip-groups/${tripGroupId}/members/${memberId}/surveys`
};