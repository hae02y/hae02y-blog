# RAG 글의 절별 시각화 계획

도구: built-in image_gen. 새 이미지 3장은 blog/2026-11-16-local-rag-ollama/에 원본으로 저장했다.

| 제목 | 판단 | 이유·핵심 메시지·배치 |
| --- | --- | --- |
| H1 글 제목 | 별도 생성 안 함 | 첫 H2의 전체 개요와 중복 |
| H2 1. RAG 범위 | 기존 이미지 유지 | 문서 준비와 질문 처리 전체 흐름, 절 시작 |
| H2 2. 실행 방법 | 불필요 | 복사 가능한 명령이 더 유용 |
| H2 3. 문서 분할 | 생성 | 긴 절의 창과 120자 중첩 관계, 절 시작 |
| H2 4. 임베딩·인덱스 | 불필요 | 개요도와 본문의 데이터 구조로 설명 |
| H2 5. 검색 점수 | 별도 생성 안 함 | 다음 절의 검색과 생성 분리 그림으로 연결 |
| H2 6. 근거·출력 검사 | 생성 | 번호 검사와 의미 검토는 다름, 절 시작 |
| H2 7. 실험 결과 | 생성 | 실제 오답과 과도한 보류를 대조, 절 시작 |
| H2 8. 실패·복구 | 불필요 | 기존 표가 증상과 조치를 명확히 대응 |
| H2 9. 보안 경계 | 불필요 | 현재 범위에서는 짧은 설명으로 충분 |
| H2 10. 다음 개선 | 불필요 | 진단 질문 목록을 유지 |
| H3 | 해당 없음 | 현재 글에는 H3 없음 |

검수: 청크 중첩은 같은 절 안에서만 표현. 의미 대조는 자동 구현으로 오해하지 않도록 직접 검토라고 표시. 실패 비교는 실제 실행 기록의 두 사례만 사용하며 집계 차트가 아님. 핵심 라벨이 작은 부가 문구에 묻히지 않게 구성.

## rag-chunking.png

Use case: infographic-diagram. Create an extremely clean Korean technical presentation infographic, wide 3:2 aspect ratio, white background, dark charcoal text, one blue accent, generous whitespace, crisp large Korean sans-serif type, flat minimal shapes. Inspired by the restrained information hierarchy of polished Korean engineering conference slides, no logos, no gradients, no thick frames, no decorative icons. One message only: split a document by headings, then use overlapping windows inside long sections.
Exact title: "문서를 작게 나누되, 맥락은 이어 둔다"
Left: simple document rectangle titled "원본 문서", divided into three visibly labeled sections "제목 A", "제목 B", "제목 C". Highlight only long section 제목 B with pale blue. Arrow from this highlighted section to right.
Right: two horizontal text strips stacked, labeled "청크 1" and "청크 2". First strip depicts a long body with its final segment highlighted blue. Second strip begins with an identical blue segment and then continues with gray text lines. A thin connector links matching blue segments, labeled "겹치는 내용 120자". Above strips: "긴 절은 최대 900자씩". Below left short text "제목 경계로 먼저 분리". Bottom single takeaway "중첩은 경계에서 끊기는 문맥을 보완한다".
Draw strip proportions illustrative, not quantitative charts. No other words. Do not put full article text, model names, code or pipeline in this image. Make labels readable on a phone and keep large empty margins. Technical correctness: overlap is between windows within one long section, not between unrelated section headings.

## rag-grounding.png

Use case: infographic-diagram. Make a minimal Korean explanatory diagram for a technical blog. Wide 3:2, white background, charcoal typography, restrained blue accent, small amber warning accent only. Huge whitespace, large legible Korean sans serif, thin arrows, flat rectangles, no decorative icons, no gradients or heavy frames. Single message: retrieval and answer correctness are separate checks.
Exact title "근거를 찾는 것과 답을 맞히는 것은 다르다"
Three large blocks in a left-to-right row:
1 "관련 근거 검색" with secondary line "어떤 문서를 찾았나?"
2 "답변 생성" with secondary line "근거를 어떻게 읽었나?"
3 "출처 번호 검사" with secondary line "존재하는 번호인가?"
Arrows 1→2→3.
Below third block an amber simple text note "번호가 맞아도 내용은 틀릴 수 있다".
Below the row a separate clear check labeled "답변 내용 ↔ 실제 근거 대조". Connect this with thin dashed lines up to first and second blocks only, showing it compares the retrieved text with generated answer; don't imply this semantic validation was implemented in the CLI. Add bottom small but readable text "이번 실험에서는 내용을 직접 대조했다".
No percentages, no numeric confidence scores, no invented test results. No other text. Correct spatial hierarchy and very few elements.

## rag-failures.png

Use case: infographic-diagram. Create an editorial Korean technical blog illustration comparing TWO actual RAG failure modes. Wide 3:2, pure white background, charcoal large Korean sans-serif, muted blue for source facts and amber for wrong outcomes. Extremely minimal typography-led layout, generous whitespace, no gradients, no 3D, no robot or decoration, no logos. Title exactly "같은 근거를 줘도, 실패는 다르게 나타났다".
Two balanced columns with ample gap; subtle vertical separator.
Left column heading "근거와 반대로 답함". Under it source fact in simple pale blue text panel: "와일드카드 인증서\n루트 도메인 보호 불가". Thin downward arrow. Under arrow output in light amber panel: "모델 답변\n보호할 수 있습니다". Small final label "비추론 모드: 오답".
Right column heading "답이 있어도 보류함". Under it source fact in simple pale blue panel: "DNSSEC\n질의 이름을 숨기지 않음". Thin downward arrow. Under arrow output in light amber panel: "모델 답변\n확인할 수 없습니다". Small final label "추론 모드: 과도한 보류".
Footer exact "검색 성공만으로 답변 품질을 판단하지 않는다".
These are factual examples, not an aggregate chart. Make all Korean exact, do not add invented numbers or accuracy ratings. Explicitly separate source statements from wrong model responses. Keep the negative word '불가' highly readable.

