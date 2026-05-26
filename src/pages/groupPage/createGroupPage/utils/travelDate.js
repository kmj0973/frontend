import { PERIOD_NIGHT_COUNT } from '@/constants/periodNights';

// Date 객체를 YYYY-MM-DD 형식의 문자열로 변환합니다.
export const formatDateValue = (date) => {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 기준 날짜에서 지정한 일수만큼 더한 새 Date 객체를 반환합니다.
export const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

// 시작일과 여행 기간 옵션을 받아 캘린더에서 표시할 여행 날짜 범위를 계산합니다.
export const getTravelRange = (startDate, tripPeriod) => {
  if (!startDate) {
    return undefined;
  }

  const nights = PERIOD_NIGHT_COUNT[tripPeriod] ?? 0;

  return {
    from: startDate,
    to: addDays(startDate, nights),
  };
};

// 여행 날짜 범위를 입력창에 보여줄 문자열로 변환합니다.
export const formatTravelDateRange = (travelRange) => {
  if (!travelRange?.from) {
    return '';
  }

  if (!travelRange.to || travelRange.from.getTime() === travelRange.to.getTime()) {
    return formatDateValue(travelRange.from);
  }

  return `${formatDateValue(travelRange.from)} ~ ${formatDateValue(travelRange.to)}`;
};

// 현재 날짜가 속한 달의 첫날을 반환해 캘린더 초기 월로 사용합니다.
export const getCurrentMonthStart = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};
