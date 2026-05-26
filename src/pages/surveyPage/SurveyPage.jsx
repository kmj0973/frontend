// 리액트, 스타일
import style from './SurveyPage.module.scss';

// 컴포넌트
import SurveyProgressBar from '@/pages/surveyPage/components/feat/SurveyProgressBar';
import Q1Form from '@/pages/surveyPage/components/form/Q1Form';
import Q2Form from '@/pages/surveyPage/components/form/Q2Form';
import Q3Form from '@/pages/surveyPage/components/form/Q3Form';
import Q4Form from '@/pages/surveyPage/components/form/Q4Form';
import Q5Form from '@/pages/surveyPage/components/form/Q5Form';

// 커스텀 훅
import { useSurvey } from '@/hooks/useSurvey';

// 정적 데이터
import { SURVEY_TAGS, getSurveySelectOptionsByQuestion } from '@/constants/surveyOptions';

// 상수
import { SURVEY_FORM_NAME } from '@/constants/surveyFormName';

function SurveyPage() {
    const {
        nowForm,
        isError,
        isToNext,
        q3Text, setQ3Text,
        q5Text, setQ5Text,
        currentCharge, setCurrentCharge,
        q1SelectedList,
        q2SelectedList,
        selectedTags,
        handleButtonClick,
        handleTagClick,
        handlePrev,
        handleSubmit
    } = useSurvey();

    // 폼 렌더링
    const renderForm = () => {
        switch (nowForm) {
            case SURVEY_FORM_NAME.Q1:
                return (<Q1Form
                    isError={isError} 
                    isToNext={isToNext}
                    selectList={getSurveySelectOptionsByQuestion(SURVEY_FORM_NAME.Q1)} 
                    nowSelectedList={q1SelectedList} 
                    nextSelectedList={q2SelectedList} 
                    handleSelect={handleButtonClick} 
                    handleIsNext={handleSubmit} 
                />);
            case SURVEY_FORM_NAME.Q2: 
                return (<Q2Form
                    isError={isError} 
                    isToNext={isToNext}
                    selectList={getSurveySelectOptionsByQuestion(SURVEY_FORM_NAME.Q2)} 
                    nowSelectedList={q2SelectedList} 
                    handleSelect={handleButtonClick} 
                    handleIsNext={handleSubmit} 
                    handlePrev={() => handlePrev(SURVEY_FORM_NAME.Q1)}
                />);
            case SURVEY_FORM_NAME.Q3: 
                return (<Q3Form
                    text={q3Text}
                    setText={setQ3Text}
                    tags={SURVEY_TAGS}
                    selectedTags={selectedTags}
                    handleTagClick={handleTagClick}
                    handleIsNext={handleSubmit}
                    handlePrev={() => handlePrev(SURVEY_FORM_NAME.Q2)}
                />);
            case SURVEY_FORM_NAME.Q4: 
                return (<Q4Form
                    currentCharge={currentCharge}
                    setCurrentCharge={setCurrentCharge}
                    handleIsNext={handleSubmit}
                    handlePrev={() => handlePrev(SURVEY_FORM_NAME.Q3)}
                />);
            case SURVEY_FORM_NAME.Q5: 
                return (<Q5Form
                    text={q5Text}
                    setText={setQ5Text}
                    handleIsNext={handleSubmit}
                    handlePrev={() => handlePrev(SURVEY_FORM_NAME.Q4)}
                />);

            default:
                return <div>페이지를 찾을 수 없습니다.</div>;
        }
    }


    return (
        <div className={style['page-container']}>
            <div className={style['tier-progress']}>
                <SurveyProgressBar step={nowForm} />
            </div>
            <div className={style['form-wrapper']}>
                {renderForm()}
            </div>
        </div>
    );
};

export default SurveyPage;