import React from 'react';
import style from './SurveySlider.module.scss';

const SurveySlider = ({ currentCharge, setCurrentCharge }) => {
  const min = 10;
  const max = 100;
  const step = 5;

  // datalist에 들어갈 옵션 생성 (단위 : 5만 원)
  const ticks = Array.from(
    { length: (max - min) / step + 1 }, (_, i) => min + i * step);

  return (
    <div className={style['slider-wrapper']}>
      {/* 상단 현재 값 표시 */}
      <div className={style['value-display']}>
        <p className={style.total}>
          {currentCharge}만 원 {currentCharge === max ? '+' : ''}
        </p>
        <p className={style.description}>5만 원 단위로 설정 가능합니다</p>
      </div>

      <div className={style['slider-container']}>
        {/* 실제 슬라이더 Input (절대 색상 사용) */}
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentCharge}
            onChange={(e) => setCurrentCharge(Number(e.target.value))}
            className={style['range-input']}
            style={{
                // 최대값(100)일 때는 전체를 주황색으로, 그 외에는 그라데이션 적용
                background: currentCharge === max 
                ? '#FF822E' 
                : `linear-gradient(to right, #FF822E 0%, #FF822E ${
                    ((currentCharge - min) / (max - min)) * 100
                    }%, #F2F2F2 ${
                    ((currentCharge - min) / (max - min)) * 100
                    }%, #F2F2F2 100%)`
            }}
        />

        {/* 눈금자 (datalist를 활용) */}
        <datalist id="tickmarks" className={style['tick-list']}>
          {ticks.map((tick) => (
            <option key={tick} value={tick}></option>
          ))}
        </datalist>

        {/* 양 끝 단위 텍스트 */}
        <div className={style.label}>
          <span>10만 원</span>
          <span>100만 원 +</span>
        </div>
      </div>
    </div>
  );
};

export default SurveySlider;