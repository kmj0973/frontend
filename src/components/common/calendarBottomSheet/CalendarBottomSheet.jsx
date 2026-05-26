import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';
import Button from '@/components/common/button/Button';
import styles from './CalendarBottomSheet.module.scss';

const WEEK_DAYS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
];

const ArrowLeftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 1L1 9L9 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ArrowRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="18"
      viewBox="0 0 10 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1L9 9L1 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const formatMonthLabel = (month) => {
  return `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
};

const formatWeekdayName = (date) => {
  return WEEK_DAYS[date.getDay()];
};

const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getTodayStart = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const isSameDate = (leftDate, rightDate) => {
  if (!leftDate || !rightDate) {
    return false;
  }

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
};

const isDateInRange = (date, range) => {
  if (!range?.from || !range?.to) {
    return false;
  }

  return date >= range.from && date <= range.to;
};

const CalendarBottomSheet = ({
  open = false,
  month,
  selectedRange,
  onMonthChange,
  onSelectDate,
  onClose,
  onConfirm,
}) => {
  const today = getTodayStart();
  const currentMonthStart = getMonthStart(today);
  const visibleMonthStart = getMonthStart(month);
  const canGoToPreviousMonth = visibleMonthStart > currentMonthStart;
  const selectedFrom = selectedRange?.from;
  const selectedTo = selectedRange?.to;

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section
        className={styles.sheet}
        onClick={(event) => event.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        <div className={styles.header}>
          <p className={styles.title}>
            여행 기간을 선택해 주세요
          </p>

          <div className={styles['month-row']}>
            <h3 className={styles.month}>{formatMonthLabel(month)}</h3>

            <div className={styles.controls}>
              <button
                type="button"
                className={`${styles['arrow-button']} ${
                  canGoToPreviousMonth
                    ? styles['arrow-button--active']
                    : styles['arrow-button--disabled']
                }`}
                onClick={() => {
                  if (!canGoToPreviousMonth) {
                    return;
                  }

                  onMonthChange?.(
                    new Date(month.getFullYear(), month.getMonth() - 1, 1),
                  );
                }}
                aria-label="이전 달"
                disabled={!canGoToPreviousMonth}
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                className={`${styles['arrow-button']} ${styles['arrow-button--active']}`}
                onClick={() =>
                  onMonthChange?.(
                    new Date(month.getFullYear(), month.getMonth() + 1, 1),
                  )
                }
                aria-label="다음 달"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.calendar}>
          <DayPicker
            month={month}
            onMonthChange={onMonthChange}
            onDayClick={(date, modifiers) => {
              if (modifiers.disabled) {
                return;
              }

              onSelectDate?.(date);
            }}
            disabled={{ before: today }}
            hideNavigation
            showOutsideDays={false}
            formatters={{ formatWeekdayName }}
            modifiers={{
              sunday: (date) => date.getDay() === 0,
              saturday: (date) => date.getDay() === 6,
              rangeStart: (date) => isSameDate(date, selectedFrom),
              rangeEnd: (date) => isSameDate(date, selectedTo),
              rangeMiddle: (date) =>
                isDateInRange(date, selectedRange) &&
                !isSameDate(date, selectedFrom) &&
                !isSameDate(date, selectedTo),
            }}
            modifiersClassNames={{
              sunday: 'calendar-sunday',
              saturday: 'calendar-saturday',
              rangeStart: 'calendar-range-start',
              rangeEnd: 'calendar-range-end',
              rangeMiddle: 'calendar-range-middle',
            }}
          />
        </div>

        <div className={styles.cta}>
          <Button
            variant={selectedRange?.from ? 'brand' : 'muted'}
            disabled={!selectedRange?.from}
            onClick={onConfirm}
          >
            다음
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CalendarBottomSheet;
