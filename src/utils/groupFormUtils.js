import {
  DEFAULT_TRIP_PERIOD,
  SESSION_KEY,
  TRIP_LENGTH_BY_PERIOD,
} from '../pages/groupPage/createGroupPage/constants/createGroupFormConstants';

const NICKNAME_ALLOWED_PATTERN = /^[A-Za-z가-힣]+$/;

// 그룹 생성 폼의 기본 payload 형태를 반환합니다.
export const getDefaultFormState = () => ({
  name: '',
  tripLength: TRIP_LENGTH_BY_PERIOD[DEFAULT_TRIP_PERIOD],
  startDate: '',
  endDate: '',
  leaderNickname: '',
});

// sessionStorage에 저장된 폼이 있으면 복원하고, 없으면 기본값을 사용합니다.
export const getInitialFormState = () => {
  const defaultState = getDefaultFormState();
  const savedForm = sessionStorage.getItem(SESSION_KEY);

  if (!savedForm) {
    return defaultState;
  }

  try {
    return {
      ...defaultState,
      ...JSON.parse(savedForm),
    };
  } catch (error) {
    console.error(error);
    return defaultState;
  }
};

// 저장된 날짜 문자열을 Date 객체로 안전하게 변환합니다.
export const createDateFromValue = (value) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

// payload에 저장된 시작/종료일을 캘린더에서 쓰는 범위 형태로 바꿉니다.
export const createTravelRangeFromForm = (form) => {
  const from = createDateFromValue(form.startDate);
  const to = createDateFromValue(form.endDate);

  if (!from) {
    return undefined;
  }

  return {
    from,
    to: to ?? from,
  };
};

// 그룹 이름이 한글 2자 이상인지 검사합니다.
export const hasAtLeastTwoHangulCharacters = (value) => {
  const normalizedValue = value.trim();

  return /^[가-힣]+$/.test(normalizedValue) && normalizedValue.length >= 2;
};

// 닉네임이 2~10자이며 한글/영문만 포함하는지 검사합니다.
export const isValidNickname = (value) => {
  const normalizedValue = value.trim();

  if (normalizedValue.length < 2 || normalizedValue.length > 10) {
    return false;
  }

  return NICKNAME_ALLOWED_PATTERN.test(normalizedValue);
};

// 입력값 상태에 따라 공통 InputField variant를 결정합니다.
export const getFieldVariant = (value, isValid) => {
  if (!value.trim()) {
    return 'default';
  }

  return isValid ? 'success' : 'error';
};
