// 로컬 스토리지에 데이터 저장하기
export function setStoredJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.error(`localStorage "${key}" JSON 파싱에 실패했습니다.`);
    }
}