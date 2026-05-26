import style from './Q5Form.module.scss';
import SurveyInfo from '@/pages/surveyPage/components/feat/SurveyInfo';
import SurveyTextBox from '@/pages/surveyPage/components/feat/SurveyTextBox';
import Button from '@/components/common/Button';
import { SURVEY_FORM_NAME } from '@/constants/surveyFormName';

function Q5Form({ 
        text,               // Q5 텍스트 내용
        setText,            // Q5 텍스트 핸들러
        handleIsNext,       // 다음 버튼 핸들러
        handlePrev,         // 이전 버튼 핸들러
    }) {

    return (
        <div className={style['Q5-container']}>
            <SurveyInfo type={SURVEY_FORM_NAME.Q5} />
            
            <div className={style['content-area']}>
                <div className={style['textbox-area']}>
                    <SurveyTextBox
                        text={text}
                        setText={setText}
                        placeholder="팀원들에게 하고 싶은 말을 자유롭게 적어주세요"
                    />
                </div>
            </div>

            <div className={style['action-container']}>
                <Button
                    type="prev-action"
                    size="md"
                    content="이전"
                    onClick={handlePrev}
                />
                <Button
                    type="next-action"
                    size="md"
                    content="제출하기"
                    isActive={true} // 텍스트 입력 여부에 따라 활성화 여부 결정
                    onClick={() => handleIsNext(SURVEY_FORM_NAME.SUBMIT, text)}
                />
            </div>
        </div>
    )
}

export default Q5Form;
