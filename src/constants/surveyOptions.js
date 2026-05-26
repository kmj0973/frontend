export const SURVEY_SELECT_OPTIONS = [
    { id: 'Q1_1', content: '🏃 엑티비티' },
    { id: 'Q1_2', content: '🌴 휴양' },
    { id: 'Q1_3', content: '🏛 문화/관광' },
    { id: 'Q1_4', content: '🍽️ 맛집' },
    { id: 'Q1_5', content: '📸 감성/사진' },
    { id: 'Q1_6', content: '🎡 놀거리' },
    { id: 'Q2_1', content: '🌊 바다' },
    { id: 'Q2_2', content: '⛰️ 산/자연' },
    { id: 'Q2_3', content: '🏙️ 도시 탐험' },
    { id: 'Q2_4', content: '☕ 카페 투어' },
    { id: 'Q2_5', content: '🛍️ 쇼핑' },
    { id: 'Q2_6', content: '🌃 야경' },
];

export const SURVEY_TAGS = [
    '새벽 출발',
    '비행기',
    '등산',
    '과음',
    '멀미',
    '매운 음식',
    '벌레',
    '장거리 이동',
];

// 반복 유틸리티 함수로 활용 (Q1, Q2 선택 옵션 조회)
export const getSurveySelectOptionsByQuestion = (questionId) =>
    SURVEY_SELECT_OPTIONS.filter((item) => item.id.startsWith(questionId));

// Q1 옵션 ID 매핑
export const MOOD_TYPE_BY_OPTION_ID = {
    Q1_1: 'ACTIVITY',
    Q1_2: 'RELAXATION',
    Q1_3: 'CULTURE_TOURISM',
    Q1_4: 'FOOD',
    Q1_5: 'AESTHETIC_PHOTO',
    Q1_6: 'ENTERTAINMENT',
};

// Q2 옵션 ID 매핑
export const ACTIVITY_TYPE_BY_OPTION_ID = {
    Q2_1: 'OCEAN',
    Q2_2: 'MOUNTAIN_NATURE',
    Q2_3: 'CITY_EXPLORATION',
    Q2_4: 'CAFE_TOUR',
    Q2_5: 'SHOPPING',
    Q2_6: 'NIGHT_VIEW',
};
