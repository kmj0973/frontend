import style from "./GroupPage.module.scss";
import GroupHeader from "./components/GroupHeader";
import GroupInvite from "./components/GroupInvite";
import GroupInputProgress from "./components/GroupInputProgress";
import Button from "@/components/common/Button";
import { useGroup } from "@/hooks/useGroup";
import { GROUP_BUTTON_TEXT } from "@/constants/groupHooksConstants";

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
        handleStartAnalysis,
    } = useGroup();

    if (isLoading) {
        return (
            <div className={style["group-container"]}>
                {nextButtonText === GROUP_BUTTON_TEXT.ERROR
                    ? nextButtonText
                    : "데이터를 불러오는 중입니다..."}
            </div>
        );
    }

    return (
        <div className={style["group-container"]}>
            <GroupHeader
                groupName={groupInfo.name}
                tripLength={groupInfo.tripLength}
                startDate={groupInfo.startDate}
                endDate={groupInfo.endDate}
            />
            <GroupInvite handleCopyLink={copyLink} handleKakao={shareKakao} />
            <GroupInputProgress
                myId={user?.memberId}
                memberList={memberList}
                handleMovePage={() => {
                    console.log("survey 페이지로 이동");
                }}
            />
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
