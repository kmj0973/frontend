import style from "./GroupInputProgress.module.scss";
import LeaderImg from "@/assets/Leader.svg"
import ParticipantImg from "@/assets/Participant.svg"
import Button from "@/components/common/Button"
import { GROUP_INPUT_PROGRESS_TEXT } from "@/constants/groupPageConstants";
import { GROUP_ROLE } from "@/constants/groupStatus";

// 멤버 설문 완료 여부 확인
function isMemberSurveyCompleted(member) {
    return member.surveyCompleted === true || member.surveyCompleted === 1;
}

// 본인 여부 확인
function isSameMemberId(memberId, myId) {
    if (myId == null || memberId == null) {
        return false;
    }
    return Number(memberId) === Number(myId);
}

function GroupInputProgress({myId, memberList, handleMovePage}) {
    const progressInfoText = GROUP_INPUT_PROGRESS_TEXT.NOW;
    const members = Array.isArray(memberList) ? memberList : [];
    const completeMembers = members.filter(
        // 객체 프로퍼티 명은 DB 내용 참고
        (member) => isMemberSurveyCompleted(member)
    );
    const progressCount = `${completeMembers.length}/${members.length}`;

    return (
        <div className={style['progress-wrapper']}>
            <div className={style['progress-info-container']}>
                <span className={style['progress-info']}>{progressInfoText}</span>
                <span className={style['progress-count']}>{progressCount}</span>
            </div>
            <div className={style['progress-member-container']}>
                {members.map((item) => {
                    // 정적 텍스트 내용
                    const buttonContent = GROUP_INPUT_PROGRESS_TEXT.NO_COMPLETED;
                    const completedText = GROUP_INPUT_PROGRESS_TEXT.COMPLETED;
                    const pendingText = GROUP_INPUT_PROGRESS_TEXT.PENDING;
                    
                    // 유효성 검사 (데이터가 없는 경우 무시)
                    if (item?.memberId == null) {
                        return null;
                    }

                    const nickname = item.nickname ?? GROUP_INPUT_PROGRESS_TEXT.NO_NICKNAME;
                    const role = item.role;
                    const isCompleted = isMemberSurveyCompleted(item);
                    const isMe = isSameMemberId(item.memberId, myId);

                    // 이미지 소스 변환
                    let imgSrc = ParticipantImg;
                    if (role === GROUP_ROLE.LEADER) {
                        imgSrc = LeaderImg;
                    }

                    // 변환 내용
                    let memberName = nickname;
                    if (isMe) {
                        memberName = nickname + GROUP_INPUT_PROGRESS_TEXT.IS_ME;
                    }

                    const renderMemberStatus = () => {
                        if (isCompleted) {
                            return (
                                <span className={style['member-completed-text']}>
                                    {completedText}
                                </span>
                            );
                        }
                        if (isMe) {
                            return (
                                <Button
                                    type="input-response"
                                    size="button-fixed-sm"
                                    content={buttonContent}
                                    onClick={() => handleMovePage("SurveyPage")}
                                />
                            );
                        }
                        return (
                            <span className={style['member-pending-text']}>
                                {pendingText}
                            </span>
                        );
                    };

                    return (
                        <div key={item.memberId} className={style['member-block']}>
                            <div className={style['member-left-side']}>
                                <img src={imgSrc} className={style['member-icon']} />
                                <span className={style['member-name']}>{memberName}</span>
                            </div>
                            {renderMemberStatus()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GroupInputProgress;
