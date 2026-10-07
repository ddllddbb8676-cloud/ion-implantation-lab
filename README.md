# IMP LAB · 직접 만지는 이온주입

반도체 입문자·취업 준비생·신입 엔지니어를 위한 한국어 인터랙티브 교재입니다. **12장, 14개 실험, 해설 문항 28개, 검색 용어 40개**로 원자부터 공정·소자·물리적 해석까지 연결합니다.

v03 교재 확장본입니다. [교재 열기](https://ddllddbb8676-cloud.github.io/ion-implantation-lab/) · [LV/HV 소자 실험](https://ddllddbb8676-cloud.github.io/ion-implantation-lab/#devices) · [배포 상태](https://github.com/ddllddbb8676-cloud/ion-implantation-lab/actions/workflows/pages.yml)

## 미리보기

`site/index.html`을 Chrome/Edge에서 직접 열면 인터넷 없이 실험을 사용할 수 있습니다. 출처 링크를 열 때만 인터넷이 필요합니다.

```powershell
npm start
```

PC 내부 주소 `http://127.0.0.1:4173/`에 접속합니다. 소자 실험 바로 가기는 `http://127.0.0.1:4173/#devices`입니다. Ctrl+C로 서버를 종료합니다. 장별 읽기·전체 이어 읽기를 선택할 수 있습니다.

## 구성

| 장 | 설명과 실험 |
|---|---|
| 1. 원자에서 전하까지 | 양성자·전자 수, 중성·양이온·음이온 |
| 2. 실리콘 안의 전자와 정공 | 결합·밴드, 캐리어 쌍 생성·정공 이동·재결합 |
| 3. 도핑으로 캐리어 수를 바꾸다 | 도너·억셉터, 보상 도핑·전하 중성·평형 관계 |
| 4. 영역을 나누면 트랜지스터가 된다 | 접합·공핍·MOS, NMOS/PMOS의 전압 부호와 반전 |
| 5. 이온이 웨이퍼에 도착하기까지 | 빔라인 5단계와 전압·전하수·에너지 계산 |
| 6. 얼마나 넣었는가: 도즈 | 전류·시간·면적·전하수, 단위·계측 가정 |
| 7. 어디서 멈추는가: 깊이 분포 | 저지·투영 비정·퍼짐, 원소·도즈·에너지 비교 |
| 8. 마스크와 결정 방향 | 마스크·틸트·트위스트·채널링, 그림자 길이 실험 |
| 9. 한 점의 빔을 한 장의 결과로 | 스캔·도즈 지도·평균과 CV·표본 위치 |
| 10. 손상과 어닐링 | 빈자리·격자간 원자, 회복·활성화·확산의 구분 |
| 11. LV·HV, NMOS·PMOS | 네 소자 예제, 주입 창·마스크·영역·분포의 단계별 비교 |
| 12. 분포에서 측정값으로 | Fick 법칙·확산 폭·활성 비율·이동도·상대 면저항 |

매 장에 학습 목표, 선수 개념 연결, 쉬운 설명, 실험 과제, 결과 해석, 요약, 해설 문항, 이전·다음 탐색을 제공합니다. 부록에는 용어 검색과 종합 문항이 있습니다.

## 소자 모형의 경계

LV는 평면 벌크 MOS의 웰·얕은 확장·스페이서 예제입니다. HV는 LDMOS의 역할을 설명하는 측면 드리프트 구조이며 실제 이중 확산으로 채널 길이를 계산하지 않습니다. HV PMOS는 격리된 영역에서 극성을 바꾼 대응 예제로 물성·제조 조건의 대칭을 가정하지 않습니다.

공정 순서와 사각형 도핑 영역은 설명을 위한 단순화입니다. 할로·격리·매몰층·세정·배선·필드 플레이트·RESURF 상세 설계 등은 생략했습니다. 상대 투입량과 침투 깊이를 keV·nm·실제 도즈로 변환하거나 양산 레시피·항복 전압·온저항 예측으로 사용하지 않습니다.

도즈·가속 에너지는 명시한 조건의 이상식을 계산합니다. 나머지 모형의 가정·단위·한계는 각 실험과 자료·모형 부록에 표시합니다. 외부 API·분석 도구·광고·쿠키·스토리지·외부 폰트는 사용하지 않습니다.

## 원고 편집과 검증

`content/textbook.py`는 본문과 문항, `content/labs.py`는 실험 HTML, `content/reference_data.py`는 추가 출처·용어집입니다. `content/legacy-labs.json`에는 기존 여섯 실험과 기술 출처를 보존했습니다. 원고 수정 뒤 정적 HTML을 재생성합니다.

```powershell
npm run build
npm run check
npm test
```

빌드는 Python 3 표준 라이브러리만 사용합니다. 생성된 `site/`는 실행 시 Python·Node가 필요 없습니다. 브라우저 검증은 개발 의존성 Playwright·axe-core와 Chrome을 사용합니다. 다른 PC에서는 먼저 `npm ci`를 실행하세요. Windows 표준 Chrome 외의 실행 파일은 `IMP_BROWSER_PATH`로 지정할 수 있습니다.

검증 범위와 제한은 `QA-REPORT.md`에 있습니다. 최종 로컬 결과와 화면 캡처는 `qa/results/v03-release/local/`, 공개 사이트 검사 결과는 `qa/results/v03-release/public/`에 기록합니다. 이전 로컬 검토 기록은 `qa/results/v03/`에 보존합니다. 결과 파일은 Git 추적 대상이 아니며 인계용 ZIP에 포함합니다. 자동 검사와 터치 에뮬레이션은 실제 휴대전화·스크린리더 검사나 완전한 WCAG 준수 인증을 대신하지 않습니다. 공개 기술자료와 교육적 단순화는 `CONTENT-NOTES.md`에 정리했습니다.

공개 사이트 검사는 `IMP_TARGET_URL` 환경 변수를 위 공개 URL로 설정하고 `npm test`를 실행합니다. 이 검사는 해당 URL만 허용하며, file:// 폴백 항목은 로컬 산출물에서 검사합니다.

## 배포와 확인

전용 저장소: <https://github.com/ddllddbb8676-cloud/ion-implantation-lab>

공개 URL: <https://ddllddbb8676-cloud.github.io/ion-implantation-lab/>

사용자가 기존 저장소와 Pages의 재배포를 요청했습니다. `.github/workflows/pages.yml`은 `main`에 사이트 변경이 push되면 JavaScript 파일 세 개의 문법을 검사한 뒤 `site/`만 배포합니다. `npm run build`가 갱신하는 `site-manifest.json`은 정적 파일의 SHA-256을 기록합니다.

배포 완료 후 `node qa/verify-deployment.cjs <전체 커밋 SHA> <Actions 실행 ID>`로 원격 커밋·실행 결과·Pages 배포 상태와 공개 파일의 해시를 확인합니다. 결과는 `qa/results/v03-release/deployment-report.json`에 저장합니다. DNS·도메인·인증 권한·다른 프로젝트의 변경은 포함하지 않습니다.

로컬 검토 기준 커밋 `402f4719f8ca6cd121b5bde49510fda6d675f88f`와 이전 공개본 `cd33a2cab6a69cc34fcf07bd8efc7b77daf0fda2`는 이력에 남아 있습니다. 과거 `qa/results/deployment-report.json`은 이전 공개본의 기록이며 v03 배포 근거와 구분합니다.
