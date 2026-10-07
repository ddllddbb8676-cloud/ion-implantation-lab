# IMP LAB · 직접 만지는 이온주입

반도체 입문자·취업 준비생·신입 엔지니어를 위한 한국어 인터랙티브 공정 노트입니다. 빔라인부터 손상 회복·활성화까지 7개 장, 6개 실험, 복습 4문제로 구성했습니다.

## 바로 열기

`site/index.html`을 Chrome 또는 Edge에서 열면 됩니다. 정적 HTML·CSS·JavaScript만 사용하므로 설치와 인터넷 없이 모든 실험이 동작합니다. 출처 링크를 열 때만 인터넷이 필요합니다.

Node.js가 있다면 다음 명령으로 로컬 미리보기를 실행할 수도 있습니다.

```powershell
npm start
```

브라우저에서 `http://127.0.0.1:4173/`을 엽니다. 종료는 Ctrl+C입니다. 서버는 PC 내부 주소에만 바인딩합니다.

## 구성

| 장 | 직접 조작하는 내용 |
|---|---|
| 이온의 여정 | 이온 생성·질량 분리·가속·스캔·주입의 5단계 선택 |
| 도즈·에너지 | 원소·도즈·에너지 변경, 비교 곡선 저장·삭제, 초기화 |
| 도즈 계산 | 전류·시간·면적·전하수, 범위·빈 값·0 입력 처리 |
| 채널링 | 틸트, 0°·7° 비교, 결정/비정질 표면층 비교 |
| 스캔 | 공간 분배 3종, 누적 진행, 재생·정지·재시작 |
| 손상·어닐링 | 주입 직후·회복과 활성화·확산 증가 상태 비교 |
| 복습 | 즉시 해설, 관련 실험 연결, 점수와 다시 풀기 |

원문·이미지·코드를 가져오지 않고 작성했습니다. SensorBook은 학습 경험의 참고이며, 기술 근거는 본문의 대학·분석기관 출처 11개에 연결했습니다. 모든 도해는 이 프로젝트에서 작성한 SVG입니다. 분석·광고·외부 폰트·쿠키·스토리지·API 호출은 없습니다.

## 모형의 경계

도즈 계산은 일정 전류·균일 조사·단일 원자 이온의 이상식입니다. 나머지 실험은 보정되지 않은 교육용 모형입니다. 깊이 축은 임의 단위이며 nm로 환산할 수 없습니다. 틸트·주입 에너지·도즈 입력은 장비 레시피 권장값이 아닙니다. 실제 공정 예측, 장비 제어, 활성화율 또는 수율 계산에 사용하면 안 됩니다. 각 실험의 가정과 식은 사이트 하단에 공개했습니다.

## 검증

세부 결과는 `QA-REPORT.md`, 기계 판독 보고서는 `qa/results/browser-report.json`에 있습니다. 결과 폴더는 로컬 검수용이며 Git 커밋과 Pages 업로드에서 제외합니다.

재현하려면 Node.js와 설치된 Chrome(Windows) 또는 Playwright Chromium이 필요합니다.

```powershell
npm ci
npm run check
npm test
```

Windows에서는 표준 위치의 Chrome을 사용합니다. 다른 실행 파일은 환경변수 `IMP_BROWSER_PATH`로 지정할 수 있습니다. Linux/macOS에서는 `npx playwright install chromium` 후 실행합니다. 테스트 도구는 사이트 실행과 무관한 개발 의존성입니다.

## GitHub Pages 상태

배포 대상: [`ddllddbb8676-cloud/ion-implantation-lab`](https://github.com/ddllddbb8676-cloud/ion-implantation-lab).

2026-10-07 사용자가 위 전용 공개 저장소 생성·코드 업로드·GitHub Pages 활성화를 승인했습니다. 생성 전에 해당 이름의 기존 저장소가 없음을 확인했습니다. 기존 계정 인증을 사용하며 DNS·기존 도메인·다른 프로젝트는 변경하지 않습니다.

`.github/workflows/pages.yml`은 `site/`만 업로드합니다. `main` 브랜치의 사이트 파일 또는 워크플로가 바뀌면 자동 배포하며, `workflow_dispatch`로 명시적 실행도 가능합니다. Pages Source는 GitHub Actions입니다. QA 도구·로컬 검수 결과·조사 파일은 Pages 산출물에 포함하지 않습니다.

워크플로는 [GitHub 공식 custom workflow 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 확인해 구성했습니다. 원격 커밋별 실행 결과와 Pages URL은 [Actions](https://github.com/ddllddbb8676-cloud/ion-implantation-lab/actions)에서 확인할 수 있습니다. 공개 배포 검증 기록은 로컬 `qa/results/deployment-report.json`에 별도로 보존합니다.
