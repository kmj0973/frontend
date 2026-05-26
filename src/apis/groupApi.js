import { instance } from './instance';

export const createGroup = async (form) => {
  const response = await instance.post('/api/v1/trip-groups', form);
  return response.data;
};

export const joinGroup = async (invieCode, nickname) => {
  const response = await instance.post(
    `/api/v1/trip-groups/invite/${invieCode}/join`,
    { nickname },
  );
  return response.data;
};
