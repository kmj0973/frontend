import { instance } from './instance';

export const postAnalysis = async (tripGroupId) => {
  const response = await instance.post(
    `/v1/trip-groups/${tripGroupId}/analyze`,
  );
  return response.data;
};

export const getAnalysisStatus = async (tripGroupId) => {
  const response = await instance.get(`/v1/trip-groups/${tripGroupId}/status`);
  return response.data;
};

export const getAnalysisResults = async (tripGroupId) => {
  const response = await instance.get(`/v1/trip-groups/${tripGroupId}/results`);
  return response.data;
};
