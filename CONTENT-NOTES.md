# 콘텐츠 근거와 편집 결정

2026-10-07 확인. 공개자료에서 원리를 확인한 뒤 한국어 문장과 도해를 별도로 구성했다. 특정 회사의 공정 조건·미공개 자료·내부 문서는 사용하지 않았다.

| 콘텐츠 | 확인한 공개 근거 | 적용 범위 |
|---|---|---|
| 도핑 원소·도핑 유형 | [TU Wien §2.2.1](https://www.iue.tuwien.ac.at/phd/hoessinger/node21.html) | B의 p형, P·As의 n형. 빔 전하와 도핑 유형을 분리해 설명 |
| 이온원·선택·가속·스캔 | [TU Wien §2.1](https://www.iue.tuwien.ac.at/phd/hoessinger/node19.html) | 여러 이온종·전하 상태, 분석 자석과 슬릿, 장비별 스캔 구성 |
| 도즈 공식·마스크·어닐링 | [Kiel University §6.3.2](https://www.tf.uni-kiel.de/matwis/amat/semitech_en/kap_6/backbone/r6_3_2.html) | Q=It/(zeA), 선택적 주입, 손상 회복·활성화·확산 |
| 도즈의 면적 정의 | [TU Wien §2.2.3](https://www.iue.tuwien.ac.at/phd/hoessinger/node23.html) | 입사 이온의 면적당 수, 웨이퍼 표면 기준 |
| 에너지·깊이 | [TU Wien §2.2.2](https://www.iue.tuwien.ac.at/phd/hoessinger/node22.html) | 같은 기판·원소에서의 정성적 경향. 문헌 곡선·계수 복제 없음 |
| 분포와 근사의 한계 | [TU Wien §3.1.1](https://www.iue.tuwien.ac.at/phd/hoessinger/node31.html) | Gaussian 근사, Rₚ·Straggle, 비대칭·꼬리의 존재 |
| 에너지 손실 | [TU Wien §3.3.1](https://www.iue.tuwien.ac.at/phd/hoessinger/node37.html) | 핵·전자와의 상호작용. 원문 속 속도 수치는 사용하지 않음 |
| Tilt·Twist | [TU Wien §2.2.4](https://www.iue.tuwien.ac.at/phd/hoessinger/node24.html) | 법선 기준 기울임과 방위각. 7°를 보편 설정값으로 제시하지 않음 |
| PAI | [TU Wien §5.2](https://www.iue.tuwien.ac.at/phd/hoessinger/node79.html) | 비정질화로 규칙적인 결정 경로를 억제하는 원리 |
| 충돌 손상 | [TU Wien §3.3.5](https://www.iue.tuwien.ac.at/phd/hoessinger/node46.html) | 충돌 연쇄, Vacancy·Interstitial, 손상 누적 |
| SIMS | [EAG 공식 SIMS 설명](https://www.eag.com/techniques/mass-spec/secondary-ion-mass-spectrometry-sims/) | 원소 농도의 깊이 분포 측정. 활성 캐리어 측정과 구분 |

분석 자석 설명은 r=p/(qB), 같은 추출 전압에서 r∝√(m/q)의 조건을 반영했다. 단순히 질량에만 비례한다고 쓰지 않았다. 전기장 가속 설명은 에너지 변화의 크기 ΔE=qΔV로 표현했다.

도즈 그래프는 입사 이온이 모두 남는 이상적 경우에 한해 적분 면적을 도즈와 연결했다. 실제 입사 도즈와 잔류 도즈가 달라질 수 있다는 한계를 명시했다. 정규분포의 중심은 비대칭 실제 분포의 최빈 깊이나 전기적 접합 깊이와 동일시하지 않았다.

원소별 모형 계수, 채널링 가중 함수, 공간 분포와 어닐링 그림의 원자 수는 제작자가 정한 시각 설명 값이다. TCAD/SRIM 결과나 측정 데이터로 표기하지 않았다. 모형 상세는 `site/index.html`의 `models` 절과 `site/app.js`에 있다.

SensorBook은 [홈](https://sensorbook.euiyun.com/)과 [광전 변환 챕터](https://sensorbook.euiyun.com/chapters/photodiode.html)를 Chrome으로 실제 열람했다. 개념과 조작 실험의 인접 배치, 조건 변경과 결과 해석, 본문으로 돌아가는 복습 방식만 참고했다. 원문, 그림, CSS, JavaScript를 제품에 재사용하지 않았다. 참고 화면과 원문 조사 메모는 프로젝트 밖의 로컬 `research` 폴더에 있으며 배포 대상이 아니다.

기존 작업 지침을 확인한 뒤 독립 폴더에서 제작했다. 캐릭터·기존 사이트·회사 자료는 사용하거나 수정하지 않았다.
