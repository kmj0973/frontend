import style from './SurveyInfo.module.scss';
import LockImg from '@/assets/Lock.svg';
import PeopleImg from '@/assets/People.svg';
import WarningImg from '@/assets/Warning.svg';
import {
    SURVEY_IMAGE_DESCRIPTIONS,
    SURVEY_PUBLIC_QUESTION_TYPES,
    SURVEY_QUESTION_DESCRIPTIONS,
    SURVEY_SUB_DESCRIPTIONS,
} from '@/constants/surveyInfo';

function SurveyInfo({ type, isError = false }) {
    let imgSrc = '';
    let imgDescription = '';

    if (isError) {
        imgSrc = WarningImg;
        imgDescription = SURVEY_IMAGE_DESCRIPTIONS[2];
    } else if (SURVEY_PUBLIC_QUESTION_TYPES.includes(type)) {
        imgSrc = PeopleImg;
        imgDescription = SURVEY_IMAGE_DESCRIPTIONS[0];
    } else {
        imgSrc = LockImg;
        imgDescription = SURVEY_IMAGE_DESCRIPTIONS[1];
    }

    const questionDescription = SURVEY_QUESTION_DESCRIPTIONS[type] || '';
    const subDescription = SURVEY_SUB_DESCRIPTIONS[type] || '';

    return (
        <div className={style['info-container']}>
            <div className={style['info-image-block']}>
                <img src={imgSrc} alt={type} className={style['img-icon']} />
                <p className={[
                    style['img-description'],
                    isError ? style['error'] : '',
                ].filter(Boolean).join(' ')}>{imgDescription}</p>
            </div>
            <div className={style['info-question-block']}>
                <p className={style['question-description']}>{questionDescription}</p>
                {subDescription && <p className={style['sub-description']}>{subDescription}</p>}
            </div>
        </div>
    );
}

export default SurveyInfo;
