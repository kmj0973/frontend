import { instance } from './instance';

export const createGroup = async (form) => {
  const response = await instance.post('/v1/trip-groups', form);
  return response.data;
};

export const joinGroup = async (invieCode, nickname) => {
  const response = await instance.post(
    `/v1/trip-groups/invite/${invieCode}/join`,
    { nickname },
  );
  return response.data;
};

export const postVotes = async (planId, tripGroupId, userId) => {
  const response = await instance.post(`/v1/recommend-plans/${planId}/votes`, {
    tripGroupId,
    userId,
  });
  return response.data;
};

export const getVotes = async (tripGroupId) => {
  const response = await instance.get(
    `v1/recommend-plans/api/v1/trip-groups/${tripGroupId}/votes`,
  );
  return response.data;
};

export const getInviteGroupInfo = async (inviteCode) => {
  const response = await instance.get(`/v1/trip-groups/invite/${inviteCode}`);
  return response.data;
};
