import style from "./GroupInvite.module.scss";
import LinkImg from "@/assets/Link.svg"
import CopyImg from "@/assets/Copy.svg"
import KakaoImg from "@/assets/Kakao.svg"
import Button from "@/components/common/Button"
import { GROUP_INVITE_TEXT } from "@/constants/groupPageConstants";

function GroupInvite({handleCopyLink, handleKakao}) {
    return (
        <div className={style['invite-container']}>
            <img src={LinkImg} className={style['img-icon']} />
            <span className={style['invite-info']} >{GROUP_INVITE_TEXT.INFO}</span>
            <p className={style['invite-warning']}>{GROUP_INVITE_TEXT.WARNING}</p>
            <Button 
                type="select" 
                size="md" 
                imgSrc={CopyImg} 
                content={GROUP_INVITE_TEXT.LINK} 
                onClick={() => handleCopyLink()}
            />
            <Button 
                type="kakao" 
                size="md" 
                imgSrc={KakaoImg} 
                content={GROUP_INVITE_TEXT.KAKAO} 
                onClick={() => handleKakao()}
            />
        </div>
    );
}

export default GroupInvite;