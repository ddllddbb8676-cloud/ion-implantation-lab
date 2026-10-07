# 콘텐츠 근거와 편집 결정

## v03: 교재 확장과 소자 단면

이번 개정은 원자·전하 → 결합·캐리어 → 도핑 → 접합·MOS → 장비·공정 변수 → 손상·열처리 → 소자 공정 → 확산·측정 해석의 12장 흐름으로 작성했다. 모든 장에 목표·선수 개념 연결·조작 과제·결과 해석·요약·해설 2문항·이전/다음 링크를 넣었다. 수식 앞에 기호·단위·가정을 설명하고 가상의 계수 예제로 이해를 연결했다.

추가 근거 11개는 `content/reference_data.py`와 본문 출처 12~22번에 URL·근거 범위를 기록했다. 원자·전하/eV는 OpenStax, 캐리어·전하 중성·접합·MOS·이동도는 MIT 6.012, 공정 통합은 MIT 6.774, 측면 HV/확산은 TU Wien 공개 자료로 확인했다. 원문에서 발견한 p형 다수 캐리어 표기 오류 등은 옮기지 않고 교차 확인했다.

특히 다음을 구분했다: 원소와 이온의 전하 상태, 빔의 양전하와 p형 도핑, 정공과 원자 빈자리, 전체 중성과 국소 공핍, 채널 조절 주입과 반전 채널, 도즈와 부피 농도, 입사/잔류 도즈, 화학/활성 도핑/자유 캐리어, 평균 깊이/봉우리/접합 깊이, 손상 회복/활성화/확산.

### 소자 구조와 생략 범위

LV는 평면 벌크 MOS의 웰·채널 조절·게이트·얕은 확장·스페이서·S/D·바디 접촉·어닐링 예제다. HV는 측면 드리프트·바디·채널 조절·게이트·S/D·바디 접촉·어닐링의 역할을 연결한다. 준비를 포함하면 LV 9단계·HV 8단계이며 각각 NMOS/PMOS를 선택한다.

HV는 실제 LDMOS 이중 확산의 순서나 채널 길이 계산을 재현하지 않는다. HV PMOS는 격리된 영역의 극성 대응 약도로 물성·공정 조건의 대칭을 주장하지 않는다. 실제 웰/드리프트 형성법, 절연·매몰·포켓·할로, 필드 플레이트·RESURF 상세 설계 등은 생략했다. 공통 경계 전압이나 임의의 keV·도즈·온도·시간 양산 레시피를 제시하지 않았다.

단면 색은 의도된 도핑 역할이며, 어닐링 전 자유 캐리어가 그 농도로 활성화됐다는 뜻이 아니다. 선택 영역 그래프는 그 단계에서 추가하는 도펀트의 정성 분포로 배경·보상·활성화를 포함한 순 농도나 접합 깊이가 아니다. 마스크는 완전 차단, 이웃 소자는 보호된 것으로 가정했다. 색과 함께 영역 문자·주입 창·가림막을 표시했다.

확산 실험은 반사 표면의 가우스 쌍으로 총량을 보존한다. 표시 폭은 구성 함수의 σ이며 반공간 분포의 엄밀한 표준편차가 아니다. 고정 활성 비율·이동도에서 상대 면저항이 확산 정도와 무관한 것은 의도한 가정의 결과이며 실제 농도 의존 물성으로 일반화하지 않는다.

### 직접 확인한 참고 교재와 적용

| 참고 페이지 | 확인한 학습 방식 | 이번 적용 |
|---|---|---|
| [Books 목록](https://books.euiyun.com/) | Device/Doping/Process 교재 연결 | 관련 장을 실제로 찾아 선수 개념과 공정 해석 순서 검토 |
| [SensorBook 제조 장](https://sensorbook.euiyun.com/chapters/fabrication.html) | 프로파일 조작과 공정 단면 스테퍼 | 7장의 도즈/에너지 독립 비교와 11장의 단계 연결 |
| [DopingBook 공정 흐름](https://dopingbook.euiyun.com/chapters/flow.html) | 처음/다음·접합선 표시를 직접 조작 | 현재 마스크·주입 창·누적 영역을 함께 표시하고 영역별 프로파일 추가 |
| [DeviceBook MOSFET](https://devicebook.euiyun.com/chapters/mosfet.html) | 게이트 슬라이더에서 반전층·공핍 변화 확인 | 4장의 동작/도핑 구분과 12장의 물리식·실험 가정 연결 |

상호작용과 설명 순서만 참고했다. 원문·그림·SVG·CSS·JavaScript는 가져오지 않았다. 참고 화면과 수집 원문은 프로젝트 밖 조사 폴더에 보존하고 로컬 전달 패키지·Pages 대상에서 제외한다.

## 기존 여섯 실험의 근거

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
