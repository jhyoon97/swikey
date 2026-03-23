---
name: upload-switches
description: 리서치된 스위치 데이터를 Notion DB에 업로드합니다
user_invocable: true
---

# 스위치 업로드 Skill

`/research-switches`로 작성된 리서치 결과 파일을 Notion DB에 업로드합니다.

## 절차

1. **대상 파일 확인**: `docs/` 디렉토리에서 `*-switches-research.md` 파일을 찾거나, 사용자가 지정한 파일을 사용합니다.

2. **업로드 스크립트 실행**: `scripts/upload-switches.mjs`를 사용합니다.
   ```bash
   node scripts/upload-switches.mjs docs/{파일명}
   ```

3. **사용자 확인**: 업로드 전에 반드시 아래 사항을 사용자에게 확인합니다:
   - 업로드할 스위치 총 개수
   - 상태값 (`게시됨` 또는 `제보(대기중)`)
   - 기존 DB에 동일 이름 데이터 중복 가능성

4. **결과 보고**: 업로드 완료 후 성공/실패 건수를 보고합니다.

## 스크립트 상세 (`scripts/upload-switches.mjs`)

이 스크립트는 리서치 markdown 파일을 파싱하여 Notion API로 페이지를 생성합니다.

### Notion DB 프로퍼티 매핑

| markdown 컬럼 | Notion 프로퍼티 | 타입 |
|--------------|----------------|------|
| 이름 | 이름 | title |
| 제조사 | 제조사 | rich_text |
| 콜라보업체 | 콜라보업체 | rich_text |
| 스위치타입 | 스위치타입 | select |
| 상부하우징재질 | 상부하우징재질 | rich_text |
| 하부하우징재질 | 하부하우징재질 | rich_text |
| 스템재질 | 스템재질 | rich_text |
| 공장윤활 | 공장윤활 | checkbox |
| 스프링길이(mm) | 스프링길이 | number |
| 마운트핀 | 마운트핀 | select |
| 트래블(mm) | 트래블 | number |
| 입력지점(mm) | 입력지점 | number |
| 입력압(g) | 입력압 | number |
| 초기압(g) | 초기압 | number |
| 바닥압(g) | 바닥압 | number |
| 출처 | 출처 | url |
| (자동) | 상태 | status → `게시됨` |
| (자동) | slug | rich_text → `nameToSlug(이름)` |

### 주의사항
- Notion API rate limit (3 req/sec)을 고려하여 350ms 간격으로 순차 업로드
- `-` 값은 해당 프로퍼티를 설정하지 않음 (undefined)
- `Yes`/`Partial` → `true`, `No` → `false`
- `22 / 18` 같은 복합값은 첫 번째 숫자만 사용
