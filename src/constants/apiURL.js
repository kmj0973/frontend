export const API_URL = {
  GET_TRIP_GROUPS: (tripGroupId) => `/v1/trip-groups/${tripGroupId}`,
  GET_TRIP_GROUPS_INVITE: (inviteCode) =>
    `/v1/trip-groups/invite/${inviteCode}`,
  POST_SURVEYS: (tripGroupId, memberId) =>
    `/v1/trip-groups/${tripGroupId}/members/${memberId}/surveys`,
};
