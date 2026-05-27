import { conflictCards as fallbackConflictCards } from '@/constants/conflictCards';
import wallet from '@/assets/images/wallet.svg';
import clock from '@/assets/images/clock.svg';
import memo from '@/assets/images/memo.svg';
import styles from './ConflictList.module.scss';

const ConflictIcon = ({ type }) => {
  if (type === 'wallet') return <img src={wallet} alt="예산 아이콘" />;
  if (type === 'pulse') return <img src={clock} alt="스타일 아이콘" />;
  return <img src={memo} alt="갈등 아이콘" />;
};

const ConflictList = ({ conflictCards = fallbackConflictCards }) => {
  return (
    <div className={styles['results-conflict-list']}>
      {conflictCards.map((card) => (
        <article
          key={card.id}
          className={`${styles['conflict-card']} ${
            card.compact ? styles['conflict-card-compact'] : ''
          }`}
        >
          <div className={styles['conflict-icon']}>
            <ConflictIcon type={card.icon} />
          </div>
          <div className={styles['conflict-copy']}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {card.bullets ? (
              <div className={styles['conflict-bullets']}>
                {card.bullets.map((bullet) => (
                  <p key={bullet}>{bullet}</p>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
};

export default ConflictList;
