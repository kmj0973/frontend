import { useState } from 'react';
import { topPlans as fallbackPlans } from '@/constants/topPlans';
import { storage } from '@/utils/storage';
import { postVotes } from '@/apis/groupApi';
import styles from './PlanList.module.scss';

const ChevronIcon = ({ open = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="10"
    viewBox="0 0 22 10"
    fill="none"
    className={open ? styles['chevron-open'] : ''}
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

const Tag = ({ tone, children }) => (
  <span className={`${styles.tag} ${styles[`tag-${tone}`]}`}>{children}</span>
);

const PlanTimeline = ({ sections }) => (
  <div className={styles.timeline}>
    {sections.map((section) => (
      <section key={section.label} className={styles['timeline-day']}>
        <p className={styles['timeline-day-label']}>{section.label}</p>
        <div className={styles['timeline-list']}>
          {section.items.map((item, index) => (
            <div
              key={`${section.label}-${item.time}-${item.title}`}
              className={styles['timeline-item']}
            >
              {index !== section.items.length - 1 ? (
                <span className={styles['timeline-line']} />
              ) : null}
              <span className={styles['timeline-dot']} />
              <span className={styles['timeline-time']}>{item.time}</span>
              <div className={styles['timeline-copy']}>
                <p>{item.title}</p>
                {item.note ? (
                  <span className={styles['timeline-note']}>{item.note}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

const PlanList = ({
  topPlans = fallbackPlans,
  voteList = [],
  setVoteList,
  tripGroupId,
  memberId,
  memberLength,
}) => {
  const voting = storage.get('voting') || false;
  const [openPlans, setOpenPlans] = useState(() =>
    topPlans.reduce((acc, plan, index) => {
      acc[plan.title] = index === 0 || Boolean(plan.expanded);
      return acc;
    }, {}),
  );

  const togglePlan = (title) => {
    setOpenPlans((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  const handleVoting = async (planId) => {
    if (voting) {
      alert('이미 투표하셨습니다.');
      return;
    }

    const response = await postVotes(planId, tripGroupId, memberId);
    console.log(response);

    if (typeof setVoteList === 'function') {
      setVoteList((prev) =>
        prev.map((vote) =>
          vote.planId === planId
            ? { ...vote, voteCount: vote.voteCount + 1 }
            : vote,
        ),
      );
    }

    storage.set('voting', true);
  };

  return (
    <div className={styles['collapsed-plan-list']}>
      {topPlans.map((plan, index) => {
        const isOpen = openPlans[plan.title];
        const voteCount = voteList[index]?.voteCount ?? 0;

        return (
          <article
            key={plan.title}
            className={`${isOpen ? styles['opened-plan'] : ''} ${
              index === 0 ? styles['featured-plan'] : styles['collapsed-plan']
            }`}
          >
            {index === 0 ? (
              <div className={styles['featured-rank']}>{plan.rank}</div>
            ) : null}

            <div className={styles['plan-head']}>
              <div>
                <div className={styles['plan-title-wrap']}>
                  <h3>📍 {plan.title}</h3>
                </div>
                <div className={styles['plan-tags']}>
                  <Tag tone={plan.budgetTag.tone}>{plan.budgetTag.label}</Tag>
                  <Tag tone={plan.satisfactionTag.tone}>
                    {plan.satisfactionTag.label}
                  </Tag>
                </div>
              </div>

              <button
                type="button"
                className={styles['plan-toggle']}
                aria-expanded={isOpen}
                aria-label={
                  isOpen ? `${plan.title} 접기` : `${plan.title} 펼치기`
                }
                onClick={() => togglePlan(plan.title)}
              >
                <ChevronIcon open={isOpen} />
              </button>
            </div>

            <div
              className={`${styles['plan-body']} ${
                isOpen ? styles['plan-body-open'] : ''
              }`}
              aria-hidden={!isOpen}
            >
              <div className={styles['plan-body-inner']}>
                <PlanTimeline sections={plan.sections} />
                <div className={styles['plan-actions']}>
                  <button
                    type="button"
                    onClick={() => handleVoting(index + 1)}
                    className={styles['vote-button']}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    이 플랜 투표하기
                  </button>
                  <p className={styles['vote-meta']}>
                    현재 {voteCount}표 · 총 {memberLength}명 중
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PlanList;
