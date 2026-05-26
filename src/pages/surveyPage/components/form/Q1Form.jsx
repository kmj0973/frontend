import style from './Q1Form.module.scss';
import SurveyInfo from '@/pages/surveyPage/components/feat/SurveyInfo';
import Button from '@/components/common/Button';
import { SURVEY_FORM_NAME } from '@/constants/surveyFormName';

function Q1Form({ 
        isError,            // Info의 이미지 에러 출력을 위한 변수 
        isToNext,           // 다음 버튼 활성화를 위한 변수
        selectList,         // 전체의 선택 리스트
        nowSelectedList,    // 현재 선택된 선택 리스트
        nextSelectedList,   // 다음으로 선택된 선택 리스트 
        handleSelect,       // 선택시 실행되는 핸들러 (선택처리)
        handleIsNext,       // 다음 버튼을 누르면 전송하는 핸들러 (API 데이터 저장)
    }) {
    const countMax = 2;

    return (
        <div className={style['Q1-container']}>
            <SurveyInfo 
                type={SURVEY_FORM_NAME.Q1}
                isError={isError}
            />

            <div className={style['select-button-container']}>
                {selectList.map((item) => (
                    <Button 
                        key={item.id} 
                        type="select" 
                        size="lg" 
                        content={item.content}
                        isSelected={nowSelectedList.some((selected) => selected.id === item.id)}
                        onClick={() => handleSelect(item, countMax)}
                    />
                ))}
            </div>
            <div className={style['action-container']}>
                <Button
                    type="next-action"
                    size="md"
                    content="다음"
                    isActive={isToNext}
                    onClick={() => handleIsNext(SURVEY_FORM_NAME.Q2, nowSelectedList, nextSelectedList)}
                />
            </div>
        </div>
    )
}

export default Q1Form;