import style from './Q3Form.module.scss';
import SurveyInfo from '@/pages/surveyPage/components/feat/SurveyInfo';
import SurveyTextBox from '@/pages/surveyPage/components/feat/SurveyTextBox';
import Button from '@/components/common/Button';
import { SURVEY_FORM_NAME } from '@/constants/surveyFormName';

function Q3Form({ 
        text,               // 텍스트 박스 내용
        setText,            // 텍스트 박스 핸들러
        tags,               // 전체 태그 리스트
        selectedTags,       // 선택된 태그 리스트
        handleTagClick,     // 태그 클릭 핸들러
        handleIsNext,       // 다음 버튼 핸들러
        handlePrev,         // 이전 버튼 핸들러
    }) {

    return (
        <div className={style['Q3-container']}>
            <SurveyInfo type={SURVEY_FORM_NAME.Q3} />
            
            <div className={style['content-area']}>
                <SurveyTextBox 
                    text={text}
                    setText={setText}
                    placeholder="예) 등산하는 거 정말 싫어요"
                />

                <div className={style['tag-section']}>
                    <p className={style['tag-title']}>자주 선택하는 항목</p>
                    <div className={style['tag-container']}>
                        {tags.map((tag) => (
                            <Button
                                key={tag}
                                type="tag"
                                size="auto-sm"
                                content={tag}
                                isSelected={selectedTags.includes(tag)}
                                onClick={() => handleTagClick(tag)}
                            />
                        ))}
                    </div>
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
                    content="다음"
                    isActive={true} // 입력형은 일단 항상 다음으로 넘어갈 수 있게 (사용자 확인 기반)
                    onClick={() => handleIsNext(SURVEY_FORM_NAME.Q4, { text, selectedTags })}
                />
            </div>
        </div>
    )
}

export default Q3Form;
