import InputField from '@/components/common/inputField/InputField';
import styles from './NicknameStep.module.scss';

const NicknameStep = ({
  title,
  subTitle,
  nickname,
  setNickname,
  nicknameVariant = 'default',
  nicknameMessage = '',
}) => {
  return (
    <>
      <h1 className={styles['create-group-title']}>Trip Truth</h1>

      <div className={styles['create-group-text']}>
        <h2>{title}</h2>
        <p>{subTitle}</p>
      </div>

      <div className={styles['create-group-input']}>
        <InputField
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임을 입력해 주세요"
          variant={nicknameVariant}
          message={nicknameMessage}
        />
      </div>
    </>
  );
};

export default NicknameStep;
