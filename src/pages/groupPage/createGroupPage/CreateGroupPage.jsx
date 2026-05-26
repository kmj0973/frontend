import { useNavigate, useParams } from 'react-router-dom';
import { useCreateGroupForm } from '@/pages/groupPage/createGroupPage/hooks/useCreateGroupForm';
import { formatTravelDateRange } from '@/pages/groupPage/createGroupPage/utils/travelDate';
import Button from '@/components/common/button/Button';
import CalendarBottomSheet from '@/components/common/calendarBottomSheet/CalendarBottomSheet';
import NicknameStep from './components/NicknameStep';
import TripInfoStep from './components/TripInfoStep';
import styles from './CreateGroupPage.module.scss';

const CreateGroupPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    form,
    travelRange,
    calendarMonth,
    isCalendarOpen,
    tripPeriod,
    isNicknameValid,
    isTripNameValid,
    isLoading,
    nicknameVariant,
    tripNameVariant,
    setCalendarMonth,
    setIsCalendarOpen,
    handleChangeNickname,
    handleChangeGroupName,
    handleChangeTripPeriod,
    handleSelectDate,
    handleSubmit,
  } = useCreateGroupForm();

  const isFirstStep = params.step === '1';
  const isCurrentStepValid = isFirstStep ? isNicknameValid : isTripNameValid;

  return (
    <form onSubmit={handleSubmit} className={styles['create-group-page']}>
      <section className={styles['create-group-section']}>
        {isFirstStep ? (
          <NicknameStep
            title="어떤 이름으로 부를까요?"
            subTitle="친구들에게 보일 이름이에요"
            nickname={form.leaderNickname}
            setNickname={handleChangeNickname}
            nicknameVariant={nicknameVariant}
            nicknameMessage="2~10자 한글/영문만 입력 가능합니다."
          />
        ) : (
          <TripInfoStep
            tripName={form.name}
            setTripName={handleChangeGroupName}
            tripNameVariant={tripNameVariant}
            tripNameMessage="2~10자 한글만 입력 가능합니다."
            tripPeriod={tripPeriod}
            setTripPeriod={handleChangeTripPeriod}
            travelDate={formatTravelDateRange(travelRange)}
            onOpenCalendar={() => setIsCalendarOpen(true)}
          />
        )}
      </section>

      <div className={styles['create-group-cta']}>
        <Button
          type={isFirstStep ? 'button' : 'submit'}
          variant={isCurrentStepValid ? 'brand' : 'muted'}
          disabled={!isCurrentStepValid || isLoading}
          onClick={() => {
            if (isFirstStep) {
              navigate('/group/create/2');
            }
          }}
        >
          다음
        </Button>
      </div>

      <CalendarBottomSheet
        open={isCalendarOpen}
        month={calendarMonth}
        selectedRange={travelRange}
        onMonthChange={setCalendarMonth}
        onSelectDate={handleSelectDate}
        onClose={() => setIsCalendarOpen(false)}
        onConfirm={() => setIsCalendarOpen(false)}
      />
    </form>
  );
};

export default CreateGroupPage;
