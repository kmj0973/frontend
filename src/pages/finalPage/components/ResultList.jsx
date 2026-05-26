import styles from './ResultList.module.scss';

const RESULT_ITEMS = [
  { id: 1, label: '강릉 1박 2일', votes: 3, selected: true },
  { id: 2, label: '부산 1박 2일', votes: 1, selected: false },
  { id: 3, label: '통영 1박 2일', votes: 1, selected: false },
];

const ResultList = () => {
  return (
    <ul className={styles['final-page__result-list']}>
      {RESULT_ITEMS.map((item) => (
        <li
          key={item.id}
          className={
            item.selected
              ? `${styles['result-card']} ${styles['result-card--selected']}`
              : styles['result-card']
          }
        >
          <div className={styles['result-card__text']}>
            <span className={styles['result-card__label']}>
              <span aria-hidden="true">📍</span> {item.label}
            </span>
            <span className={styles['result-card__votes']}>
              ({item.votes}표)
            </span>
          </div>

          {item.selected ? (
            <span className={styles['result-card__badge']}>선정</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default ResultList;
