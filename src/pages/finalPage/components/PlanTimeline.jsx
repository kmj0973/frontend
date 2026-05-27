import styles from './PlanTimeline.module.scss';

const PlanTimeline = ({ sections, isOpen = false }) => (
  <div className={`${styles.timeline} ${isOpen ? styles['timeline--open'] : ''}`}>
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

export default PlanTimeline;
