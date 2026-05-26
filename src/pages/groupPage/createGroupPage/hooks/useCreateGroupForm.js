import { useEffect, useState } from 'react';
import {
  formatDateValue,
  getCurrentMonthStart,
  getTravelRange,
} from '@/pages/groupPage/createGroupPage/utils/travelDate';
import {
  DEFAULT_TRIP_PERIOD,
  PERIOD_BY_TRIP_LENGTH,
  SESSION_KEY,
  TRIP_LENGTH_BY_PERIOD,
} from '../constants/createGroupFormConstants';
import {
  createDateFromValue,
  createTravelRangeFromForm,
  getFieldVariant,
  getInitialFormState,
  hasAtLeastTwoHangulCharacters,
  isValidNickname,
} from '@/utils/groupFormUtils.js';
import { createGroup } from '@/apis/groupApi';
import { storage } from '@/utils/storage';
import { replace, useNavigate } from 'react-router-dom';

export const useCreateGroupForm = () => {
  const navigate = useNavigate();
  // 폼 payload 전체를 단일 상태로 관리합니다.
  const [form, setForm] = useState(getInitialFormState);
  // 저장된 날짜가 있으면 해당 월부터 캘린더를 열 수 있게 초기 월을 맞춥니다.
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialTravelRange = createTravelRangeFromForm(getInitialFormState());

    if (initialTravelRange?.from) {
      return new Date(
        initialTravelRange.from.getFullYear(),
        initialTravelRange.from.getMonth(),
        1,
      );
    }

    return getCurrentMonthStart();
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 입력값이 바뀔 때마다 sessionStorage에 동기화합니다.
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(form));
  }, [form]);

  // 서버에 보내는 tripLength 값을 화면용 기간 문자열로 되돌립니다.
  const tripPeriod =
    PERIOD_BY_TRIP_LENGTH[form.tripLength] ?? DEFAULT_TRIP_PERIOD;
  // 캘린더와 입력창에서 사용할 날짜 범위는 form 값으로부터 계산합니다.
  const travelRange = createTravelRangeFromForm(form);

  // 1단계 닉네임 입력을 payload에 반영합니다.
  const handleChangeNickname = (value) => {
    setForm((currentForm) => ({
      ...currentForm,
      leaderNickname: value,
    }));
  };

  // 2단계 그룹 이름 입력을 payload에 반영합니다.
  const handleChangeGroupName = (value) => {
    setForm((currentForm) => ({
      ...currentForm,
      name: value,
    }));
  };

  // 선택한 기간 버튼에 맞춰 tripLength와 종료일을 함께 갱신합니다.
  const handleChangeTripPeriod = (nextTripPeriod) => {
    const nextTripLength =
      TRIP_LENGTH_BY_PERIOD[nextTripPeriod] ??
      TRIP_LENGTH_BY_PERIOD[DEFAULT_TRIP_PERIOD];

    setForm((currentForm) => {
      const nextRange = getTravelRange(
        createDateFromValue(currentForm.startDate),
        nextTripPeriod,
      );

      return {
        ...currentForm,
        tripLength: nextTripLength,
        startDate: formatDateValue(nextRange?.from),
        endDate: formatDateValue(nextRange?.to ?? nextRange?.from),
      };
    });
  };

  // 캘린더에서 선택한 날짜를 payload와 화면 상태에 동시에 반영합니다.
  const handleSelectDate = (date) => {
    const nextRange = getTravelRange(date, tripPeriod);

    setForm((currentForm) => ({
      ...currentForm,
      startDate: formatDateValue(nextRange?.from),
      endDate: formatDateValue(nextRange?.to ?? nextRange?.from),
    }));
  };

  // 최종 payload를 서버로 전송하고 성공 시 세션 데이터를 정리합니다.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; //버튼 연속 입력 방지

    try {
      setIsLoading(true);

      const response = await createGroup(form);
      console.log(response);

      if (!response.isSuccess) throw Error;

      const result = response.result;
      //로컬스토리지 값 저장
      storage.set(result.inviteCode, {
        tripGroupId: result.tripGroupId,
        memberId: result.leaderMemberId,
        nickname: result.leaderNickname,
        role: 'LEADER',
      });

      //세션스토리지 값 삭제
      sessionStorage.removeItem(SESSION_KEY);

      //여기에 진행현황 페이지 라우팅 코드
      navigate(`/group/${result.inviteCode}`, replace);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 단계별 입력 스타일과 버튼 활성화에 쓰는 유효성 결과입니다.
  const isNicknameValid = isValidNickname(form.leaderNickname);
  const isTripNameValid = hasAtLeastTwoHangulCharacters(form.name);

  return {
    form,
    travelRange,
    calendarMonth,
    isCalendarOpen,
    tripPeriod,
    isNicknameValid,
    isTripNameValid,
    isLoading,
    nicknameVariant: getFieldVariant(form.leaderNickname, isNicknameValid),
    tripNameVariant: getFieldVariant(form.name, isTripNameValid),
    setCalendarMonth,
    setIsCalendarOpen,
    handleChangeNickname,
    handleChangeGroupName,
    handleChangeTripPeriod,
    handleSelectDate,
    handleSubmit,
  };
};
