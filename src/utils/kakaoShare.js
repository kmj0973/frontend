import image from "@/assets/public/KakaoFeedImage.jpg";
import { GROUP_INVITE_URL } from "@/constants/groupHooksConstants";

export function initKakao() {
    const key = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key) {
        console.error("VITE_KAKAO_JS_KEY가 없습니다.");
        return false;
    }
    if (!window.Kakao) {
        console.error("Kakao SDK가 로드되지 않았습니다.");
        return false;
    }
    if (!window.Kakao.isInitialized()) {
        window.Kakao.init(key);
    }
    return true;
}
  
export function shareInviteLink({ inviteCode, groupName }) {
    if (!initKakao()) return;

    const inviteUrl = GROUP_INVITE_URL(inviteCode);
    const imageUrl = new URL(image, window.location.origin).href;

    window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
            title: (groupName ? groupName + "에서 당신을 초대합니다!" : "TripTruths에서 당신을 초대합니다!"),
            description: "함께 여행 취향을 맞춰보세요!",
            imageUrl: imageUrl,
            link: {
                mobileWebUrl: inviteUrl,
                webUrl: inviteUrl,
            },
        },
        buttons: [
            {
                title: "초대 링크로 참여하기",
                link: {
                    mobileWebUrl: inviteUrl,
                    webUrl: inviteUrl,
                },
            },
        ],
    });
}