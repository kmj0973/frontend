import { joinGroup } from '@/apis/groupApi';
import { getFieldVariant, isValidNickname } from '@/utils/groupFormUtils';
import { storage } from '@/utils/storage';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const useJoinGroupForm = () => {
  const { inviteCode } = useParams();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isNicknameValid = isValidNickname(nickname);
  const nicknameVariant = getFieldVariant(nickname, isNicknameValid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      const response = await joinGroup(inviteCode, nickname);
      console.log(response);

      if (!response.isSuccess) throw Error;

      const result = response.result;
      //로컬스토리지 값 저장
      storage.set(inviteCode, {
        tripGroupId: result.tripGroupId,
        memberId: result.memberId,
        nickname: result.nickname,
      });

      //여기에 진행현황 페이지 라우팅 코드
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nickname,
    setNickname,
    isLoading,
    isNicknameValid,
    nicknameVariant,
    handleSubmit,
  };
};
