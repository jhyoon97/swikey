---
name: download-switch-images
description: 스위치 리서치 문서의 출처 URL에서 스위치 대표 이미지를 다운로드합니다 (파일명은 Notion DB slug 사용)
user_invocable: true
---

# 스위치 이미지 다운로드 Skill

`/research-switches`로 작성된 리서치 문서에서 각 스위치의 출처 URL에 접속하여 대표 이미지 1개를 다운로드합니다.

## 절차

1. **Notion DB에서 스위치 정보 조회**: 대상 브랜드/제조사의 스위치를 Notion DB에서 조회하여 `이름`, `출처`, `slug`를 한 번에 가져옵니다.
   - slug는 이미지 파일명으로 사용됩니다.
   - Notion DB에 해당 스위치가 없는 경우, `nameToSlug` 규칙으로 직접 생성합니다:
     ```
     name → lowercase → trim → 공백을 '-'로 → [a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ()-] 외 제거 → 연속 '-' 제거 → 앞뒤 '-' 제거
     ```
   - 예: `Lekker Linear60 (L60) V1` → `lekker-linear60-(l60)-v1`

2. **출처 페이지에서 이미지 URL 추출**: 각 스위치의 `출처` URL에 WebFetch로 접속합니다.
   - `og_image` 메타태그 또는 CDN URL (예: `*.cdn.digitaloceanspaces.com`, `cdn.shopify.com`)을 찾습니다.
   - 제품 메인 이미지(OG 이미지)를 우선 사용합니다.
   - 동일 브랜드의 스위치는 **병렬로 WebFetch**하여 속도를 높입니다.

3. **404/접근 불가 시 대응**:
   - 제품 페이지가 404인 경우, 해당 브랜드의 CDN URL 패턴을 추측하여 시도합니다.
   - 여러 네이밍 패턴을 `curl -sL -o /dev/null -w "%{http_code}"` 로 확인하여 유효한 URL을 찾습니다.
   - 그래도 안 되면 WebSearch로 대체 이미지를 검색합니다.

4. **이미지 다운로드**:
   ```bash
   curl -sL -o "{다운로드경로}/{slug}.{ext}" "{이미지URL}" -w "%{http_code}"
   ```
   - **파일명**: `{slug}.{ext}` (Notion DB slug 사용)
   - **기본 다운로드 경로**: `C:\Users\jecgd\Downloads`
   - 사용자가 다른 경로를 지정하면 해당 경로를 사용합니다.

5. **검증**: `ls -la`로 다운로드된 파일의 존재 여부와 크기를 확인합니다.

## 브랜드별 CDN 패턴

알려진 CDN 패턴을 우선 활용하면 WebFetch 없이도 직접 다운로드할 수 있습니다.

| 브랜드 | CDN 패턴 | 예시 |
|--------|----------|------|
| Wooting | `https://wooting-website.ams3.cdn.digitaloceanspaces.com/products/switches/{name}_OG.webp` | `l45_v2_OG.webp`, `l60_v1_OG.webp` |
| Wooting (Tikken) | `.../switches/lekker-tikken/lekker-tikken-single-main.webp` | |

> 새로운 브랜드의 CDN 패턴을 발견하면 이 표에 추가합니다.

## 주의사항

- 하나의 스위치에 대해 **대표 이미지 1개만** 다운로드합니다.
- 이미지 포맷은 원본 그대로 유지합니다 (webp, jpg, png 등 변환하지 않음).
- 같은 파일명이 이미 존재하면 덮어씁니다.
- 다운로드 완료 후 결과를 표로 정리하여 사용자에게 보고합니다.
