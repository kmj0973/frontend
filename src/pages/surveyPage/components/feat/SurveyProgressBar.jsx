import style from './SurveyProgressBar.module.scss';

function SurveyProgressBar({ step }) {
    // step: "Q1" ~ "Q5"
    const stepNumber = parseInt(step.replace("Q", ""));
    const totalSteps = 5;

    return (
        <div className={style['progress-container']}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                    key={index} 
                    className={`${style['progress-segment']} ${index + 1 === stepNumber ? style['active'] : ''}`}
                />
            ))}
        </div>
    );
}

export default SurveyProgressBar;
