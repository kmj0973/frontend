// 로컬 스토리지에서 데이터 가져오기
export function getStoredJson(key) {
    try {
        const raw = localStorage.getItem(key);
        if (raw == null) return null;
        return JSON.parse(raw);
    } catch {
        console.error(`localStorage "${key}" JSON 파싱에 실패했습니다.`);
        return null;
    }
}