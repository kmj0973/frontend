import InputField from '@/components/common/inputField/InputField';
import { CalendarSvg, PreviousStepSvg } from '@/assets/svg/CreateGroupSvgs';
import styles from './TripInfoStep.module.scss';
import { PERIODS_NIGHTS } from '@/constants/periodNights';

const TripInfoStep = ({
  tripName,
  setTripName,
  tripNameVariant = 'default',
  tripNameMessage = '',
  tripPeriod,
  setTripPeriod,
  travelDate,
  onOpenCalendar,
}) => {
  return (
    <>
      <div className={styles['create-group-back']}>
        <div onClick={() => window.history.back()}>
          <PreviousStepSvg />
        </div>
      </div>

      <h1 className={styles['create-group-title']}>Trip Truth</h1>

      <div className={styles['create-group-text']}>
        <h2>새 여행 그룹 만들기</h2>
      </div>

      <div className={styles['create-group-input']}>
        <InputField
          value={tripName}
          onChange={(event) => setTripName(event.target.value)}
          placeholder="그룹 이름을 입력해 주세요"
          variant={tripNameVariant}
          message={tripNameMessage}
        />
      </div>

      <div className={styles['create-group-period']}>
        <div className={styles['create-group-period-text']}>
          <h3>여행 기간</h3>
          <p>현재는 최대 3박 4일 여행까지만 추천을 지원하고 있어요</p>
        </div>

        <div className={styles['create-group-period-options']}>
          {PERIODS_NIGHTS.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles['period-option']} ${
                tripPeriod === option ? styles['period-option--selected'] : ''
              }`}
              onClick={() => setTripPeriod(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['create-group-period-input']}>
        <h4>
          여행 기간 <span>(선택)</span>
        </h4>
        <InputField
          value={travelDate}
          placeholder="YYYY-MM-DD"
          variant="default"
          icon={<CalendarSvg />}
          readOnly
          onClick={onOpenCalendar}
        />
      </div>
    </>
  );
};

export default TripInfoStep;
