# https://swikeys.com

## TODO

### 스위치 데이터

- [x] 스위치 이미지: slug 기반 `/images/switches/{slug}.webp` (800px, q90) — 778/994 완료 (78%)
- [ ] 스위치 이미지: 나머지 22% (접근 불가 소스 대체 검색 필요)
- [ ] 택타일 / 클릭키 걸립압 값 추가
- [x] 로우프로파일: `lowProfile` boolean 필드 추가 (타입, Notion 매핑, 업로드 스크립트, 리서치 문서 32개)

#### 스위치 속성 추가 (리서치 완료, 구현 필요)

**높은 우선순위**
- [ ] 스템 폴 길이 (`stemPoleLength`): `normal` / `long-pole`
  - 롱폴은 바닥 타격 시 날카로운 "클랙" 사운드, 트래블 3.5mm 이하로 짧아짐
- [ ] 스템 폴 형태 (`stemPoleShape`): `round` / `flat`
  - round: 점 접촉 → 깊고 묵직한 "톡" / flat: 면 접촉 → 날카로운 "클랙"
- [ ] 스프링 타입 (`springType`): `standard` / `slow` / `progressive` / `dual-stage` / `multi-stage`
  - 현재 스프링 길이만 있어서 포스 커브 차이를 설명 못함. Divinikey, UniKeyboards 등에서 제공

**중간 우선순위**
- [ ] 스템 디자인 (`stemDesign`): `standard` / `box` / `dustproof` / `low-profile`
  - box: Kailh 박스 구조 (IP56 방진방수), dustproof: 먼지 차단 구조
- [ ] 사운드 프로필 태그 (`soundTags`): clacky, thocky, creamy 등
  - Divinikey, LumeKeebs에서 제공. 주관적이라 데이터 일관성 유지가 과제

**낮은 우선순위**
- [ ] LED 호환성 (`ledCompatibility`): `smd` / `through-hole` / `both` / `none`
- [ ] 내구성 (`operatingLife`): 50M / 80M / 100M / unlimited (자석축)
- [ ] 리셋 포인트 (`resetPoint`): 입력 해제 지점 (mm). 게이밍 더블탭 속도에 영향

### 기능

- [ ] 사운드파일 클라우드 서비스 연동 (AWS? OCI?)
- [ ] 타건음/키보드 빌드 정보 업로드 기능 구현
- [ ] 홈 - 최근 업로드 스위치 대신 빌드 공유 목록
- [ ] 스위치 / 빌드 좋아요 기능 (노션DB -> DB 마이그레이션 필요할듯)
