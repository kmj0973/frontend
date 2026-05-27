import { useMemo, useState } from 'react';
import { topPlans as fallbackPlans } from '@/constants/topPlans';
import styles from './ResultList.module.scss';
import PlanTimeline from './PlanTimeline';

const ChevronIcon = ({ open = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="10"
    viewBox="0 0 22 10"
    fill="none"
    className={open ? styles['chevron-open'] : ''}
    aria-hidden="true"
  >
    <path
      d="M21.0001 8.38462L10.796 1L1.00006 9"
      stroke="#848B9C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ResultList = ({ plans = fallbackPlans, voteList = [] }) => {
  const resultItems = useMemo(() => {
    const maxVoteCount = voteList.reduce(
      (max, vote) => Math.max(max, vote?.voteCount ?? 0),
      0,
    );

    return plans.map((plan, index) => ({
      id: plan.title,
      label: plan.title,
      votes: voteList[index]?.voteCount ?? 0,
      selected:
        (voteList[index]?.voteCount ?? 0) === maxVoteCount && maxVoteCount > 0,
      sections: plan.sections,
    }));
  }, [plans, voteList]);

  const [openCardId, setOpenCardId] = useState(resultItems[0]?.id ?? null);

  const toggleCard = (cardId) => {
    setOpenCardId((current) => (current === cardId ? null : cardId));
  };

  return (
    <ul className={styles['final-page__result-list']}>
      {resultItems.map((item) => {
        const isOpen = openCardId === item.id;

        return (
          <li
            key={item.id}
            className={`${styles['result-card']} ${
              item.selected ? styles['result-card--selected'] : ''
            } ${isOpen ? styles['result-card--open'] : ''}`}
          >
            <button
              type="button"
              className={styles['result-card__button']}
              aria-expanded={isOpen}
              aria-label={item.label}
              onClick={() => toggleCard(item.id)}
            >
              <div className={styles['result-card__text']}>
                <span className={styles['result-card__label']}>
                  📍{item.label}
                </span>
                <span
                  className={styles['result-card__votes']}
                >{`(${item.votes}표)`}</span>
              </div>

              <div className={styles['result-card__side']}>
                {item.selected ? (
                  <span className={styles['result-card__badge']}>선점</span>
                ) : null}
                <span className={styles['result-card__toggle']}>
                  <ChevronIcon open={isOpen} />
                </span>
              </div>
            </button>

            <div
              className={`${styles['result-card__body']} ${
                isOpen ? styles['result-card__body--open'] : ''
              }`}
              aria-hidden={!isOpen}
            >
              <div className={styles['result-card__body-inner']}>
                <PlanTimeline sections={item.sections} isOpen={isOpen} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ResultList;
