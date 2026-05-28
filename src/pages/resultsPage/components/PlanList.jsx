import { useState } from 'react';
import { topPlans as fallbackPlans } from '@/constants/topPlans';
import { postVotes } from '@/apis/groupApi';
import { getStoredVote, saveStoredVote } from '@/utils/voteState';
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
  inviteCode,
  tripGroupId,
  memberId,
  memberLength,
}) => {
  const storedVote = getStoredVote(inviteCode, tripGroupId, memberId);
  const votedPlanId = storedVote?.planId ?? null;
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
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
    if (votedPlanId != null) {
      alert('이미 투표했어요.');
      return;
    }

    try {
      setIsSubmittingVote(true);

      const response = await postVotes(planId, tripGroupId, memberId);
      console.log(response);

      if (typeof setVoteList === 'function') {
        setVoteList((prev) => {
          const hasMatchingPlan = prev.some((vote) => vote.planId === planId);

          if (!hasMatchingPlan) {
            return [...prev, { planId, voteCount: 1 }];
          }

          return prev.map((vote) =>
            vote.planId === planId
              ? { ...vote, voteCount: (vote.voteCount ?? 0) + 1 }
              : vote,
          );
        });
      }

      saveStoredVote(inviteCode, tripGroupId, memberId, planId);
    } catch (err) {
      if (err?.response?.status === 409) {
        saveStoredVote(inviteCode, tripGroupId, memberId, planId);
        alert('이미 투표가 반영된 상태예요.');
        return;
      } else if (err?.response?.status === 500) {
        alert('투표 멤버가 아니에요.');
      }

      console.log('투표 요청 실패', err);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  return (
    <div className={styles['collapsed-plan-list']}>
      {topPlans.map((plan, index) => {
        const isOpen = openPlans[plan.title];
        const voteCount = voteList[index]?.voteCount ?? 0;
        const isSelectedPlan = votedPlanId === index + 1;

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
                    disabled={isSubmittingVote || votedPlanId != null}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    {isSelectedPlan ? '투표 완료' : '이 플랜에 투표하기'}
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
