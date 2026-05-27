import style from "./GroupHeader.module.scss"
import { GROUP_HEADER_TRIP_DAYS, GROUP_HEADER_TEXT } from "@/constants/groupPageConstants";

// 날짜 객체를 'YYYY.MM.DD' 형식으로 변환해주는 헬퍼 함수
const formatDate = (dateInput) => {
    if (!dateInput) return "";
    
    const date = new Date(dateInput);
    // 올바른 날짜 데이터가 아닐 경우 빈 문자열 반환
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};

function GroupHeader({groupName, tripLength, startDate = null, endDate = null}) {
    const validDuration = startDate != "" && endDate != "";

    let duration = "";
    if (validDuration) {
        duration = `/ ${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    }

    let tripLengthLabel = "";
    switch (tripLength) {
        case GROUP_HEADER_TRIP_DAYS[0]:
            tripLengthLabel = GROUP_HEADER_TEXT.DAY_TRIP;
            break;
        case GROUP_HEADER_TRIP_DAYS[1]:
            tripLengthLabel = GROUP_HEADER_TEXT.ONE_NIGHT;
            break;
        case GROUP_HEADER_TRIP_DAYS[2]:
            tripLengthLabel = GROUP_HEADER_TEXT.TWO_NIGHTS;
            break;
        case GROUP_HEADER_TRIP_DAYS[3]:
            tripLengthLabel = GROUP_HEADER_TEXT.THREE_NIGHTS_PLUS;
            break;
        default:
            tripLengthLabel = GROUP_HEADER_TEXT.DEFAULT;
            break;
    }

    let displayGroupName = GROUP_HEADER_TEXT.DEFAULT_GROUP_NAME;
    if (groupName != null && groupName !== "" && groupName !== GROUP_HEADER_TEXT.DEFAULT_GROUP_NAME) {
        displayGroupName = groupName;
    }

    return (
        <div className={style['header-container']}>
            <p className={style['header-name']}>{displayGroupName}</p>
            <p className={style['header-duration']}>{tripLengthLabel} {duration}</p>
        </div>
    );
}

export default GroupHeader;
