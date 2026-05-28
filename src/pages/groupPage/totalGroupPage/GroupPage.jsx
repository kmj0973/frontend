import style from "./GroupPage.module.scss";
import GroupHeader from "./components/GroupHeader";
import GroupInvite from "./components/GroupInvite";
import GroupInputProgress from "./components/GroupInputProgress";
import Button from "@/components/common/Button";
import { useGroup } from "@/hooks/useGroup";

function GroupPage() {
    const {
        user,
        groupInfo,
        memberList,
        isToNext,
        nextButtonText,
        isLoading,
        copyLink,
        shareKakao,
        handleMoveSurveyPage,
        handleStartAnalysis,
    } = useGroup();

    if (isLoading) {
        return (
            <div className={style["loading-container"]}>
                <p>데이터를 불러오는 중입니다...</p>
                <p>잠시만 기다려주세요</p>
            </div>
        );
    }

    return (
        <div className={style["group-container"]}>
            <div className={style["header-section"]}>
                <GroupHeader
                    groupName={groupInfo.name}
                    tripLength={groupInfo.tripLength}
                    startDate={groupInfo.startDate}
                    endDate={groupInfo.endDate}
                />
            </div>
            <div className={style["invite-section"]}>
                <GroupInvite handleCopyLink={copyLink} handleKakao={shareKakao} />
            </div>
            <div className={style["progress-section"]}>
                <GroupInputProgress
                    myId={user?.memberId}
                    memberList={memberList}
                    handleMovePage={handleMoveSurveyPage}
                />
            </div>
            <div className={style["next-button-container"]}>
                <Button
                    type="next-action"
                    size="md"
                    content={nextButtonText}
                    isActive={isToNext}
                    onClick={handleStartAnalysis}
                />
            </div>
        </div>
    );
}

export default GroupPage;
