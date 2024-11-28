document.addEventListener('DOMContentLoaded', () => {
    const serverSelect = document.getElementById('server-select');
    const serverStatus = document.getElementById('selected-server-status');
    const serverPort = document.getElementById('selected-server-port');
    const serverPlayers = document.getElementById('selected-server-players');
    const serverDescription = document.getElementById('selected-server-description');
    
    // 서버 종류 선택 시 처리
    serverSelect.addEventListener('change', (event) => {
        const selectedServer = event.target.value;
        updateServerInfo(selectedServer);
    });

    // 서버 정보 업데이트 함수 (API로 서버 상태 실시간 가져오기)
    async function updateServerInfo(serverType) {
        let serverDomain;
        let serverPortValue = 25565; // 기본 포트 25565 설정

        // 서버 종류에 따른 도메인 설정
        switch (serverType) {
            case 'fanya':
                serverDomain = 'nanoserver.m-c.kr';  // 반야생 서버 도메인
                break;
            case 'rpg':
                serverDomain = 'rpg.example.com';   // RPG 서버 도메인
                break;
            default:
                serverDomain = '';
                break;
        }

        // api.mcsrvstat.us API 호출 (도메인 이름을 사용, 포트는 기본값인 25565)
        const url = `https://api.mcsrvstat.us/2/${serverDomain}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.online) {
                // 서버가 온라인일 때
                serverStatus.textContent = '서버 상태: 온라인';
                serverPort.textContent = `포트: ${serverPortValue}`;
                serverPlayers.textContent = `현재 플레이어 수: ${data.players.online}`;
                serverDescription.textContent = getServerDescription(serverType);
            } else {
                // 서버가 오프라인일 때
                if (serverType === 'rpg') {
                    // RPG 서버는 아직 열리지 않았다고 표시
                    serverStatus.textContent = '서버 상태: 아직 열리지 않았습니다.';
                    serverPort.textContent = '포트: 확인할 수 없음';
                    serverPlayers.textContent = '현재 플레이어 수: 확인할 수 없음';
                    serverDescription.textContent = 'RPG 서버는 아직 열리지 않았습니다.';
                } else {
                    // 다른 서버는 오프라인 상태로 처리
                    serverStatus.textContent = '서버 상태: 오프라인';
                    serverPort.textContent = '포트: 확인할 수 없음';
                    serverPlayers.textContent = '현재 플레이어 수: 확인할 수 없음';
                    serverDescription.textContent = '서버 설명을 선택해 주세요.';
                }
            }
        } catch (error) {
            console.error('서버 상태를 가져오는 데 오류가 발생했습니다:', error);
            serverStatus.textContent = '서버 상태: 오류';
            serverPort.textContent = '포트: 오류';
            serverPlayers.textContent = '현재 플레이어 수: 오류';
            serverDescription.textContent = '서버 상태를 확인할 수 없습니다.';
        }
    }

    // 서버 종류에 따른 설명 반환
    function getServerDescription(serverType) {
        switch (serverType) {
            case 'fanya':
                return '자연과의 조화 속에서 자유로운 플레이를 즐기세요. 반야생 서버!';
            case 'rpg':
                return '퀘스트와 전투가 펼쳐지는 RPG 세상에 도전하세요!';
            default:
                return '서버 설명을 선택해 주세요.';
        }
    }

    // 기본 서버 정보 업데이트
    updateServerInfo('fanya');

    // 5초마다 실시간 서버 상태 갱신
    setInterval(() => {
        const selectedServer = serverSelect.value; // 현재 선택된 서버 종류
        updateServerInfo(selectedServer);
    }, 5000); // 5000ms = 5초마다 갱신
});
