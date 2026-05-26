import style from "./SurveyTextBox.module.scss";

function SurveyTextBox({ text, setText, placeholder = "", onChange }) {
    const maxLength = 200;

    // 200자 도달 유효성 검사
    const isLimit = text.length >= maxLength;

    const handleChange = (e) => {
        const newText = e.target.value;

        // 200자까지만 잘라서 상태에 저장 (200자 초과 입력 차단)
        if (newText.length <= maxLength) {
            setText(newText);
            if (onChange) {
                onChange(newText);
            }
        }
    };

    return (
        <div className={style.container}>
            <textarea 
                className={[
                    style.textarea,
                    isLimit ? style.error : "" 
                ].filter(Boolean).join(" ")} 
                placeholder={placeholder}
                value={text}
                onChange={handleChange}
            />
            <div className={[
                style['char-count'],
                isLimit ? style['error-text'] : "" 
            ].filter(Boolean).join(" ")}>
                {text.length}/{maxLength}
            </div>
        </div>
    );
}

export default SurveyTextBox;