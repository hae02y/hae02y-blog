# RAG 흐름도 이미지

도구: built-in image_gen.
최종 파일: blog/2026-11-16-local-rag-ollama/rag-pipeline.png

## 생성 프롬프트

Use case: infographic-diagram. Create a polished Korean educational infographic for a technical blog showing an ACTUAL small local RAG pipeline, not a decorative hero. White/off-white background, dark ink typography, restrained blue for indexing, teal for retrieval, amber for generation. Large highly legible Korean sans-serif labels, generous spacing, flat diagram icons, thin precise arrows. Portrait-ish 4:5 composition suitable for reading in a blog. Title exactly "RAG는 이렇게 동작한다". Two clearly separated panels stacked vertically.
Panel 1 heading "① 문서를 미리 준비한다". Four large steps connected in order: document icon "DNS·TLS 글 2개" → cards "52개 청크" with small note "최대 900자 · 중첩 120자" → vector icon "문서 임베딩" with note "EmbeddingGemma · 768차원" → file icon "JSON 인덱스". Arrange as readable 2x2 serpentine or single vertical flow with unmistakable arrows.
Panel 2 heading "② 질문할 때 근거를 찾는다". Show input "사용자 질문" → "질문 임베딩" → "코사인 유사도 검색" (clear incoming arrow from saved JSON index in panel 1) → "상위 3개 근거". Then merge question via a distinct labeled thin arrow "원래 질문" with retrieved evidence into box "Qwen3 답변 생성". Final box "JSON·출처 번호 검사" → two possible outputs "답변 + 출처" and "근거 부족: 답변 보류".
Bottom restrained amber note exactly "검색 성공 ≠ 답변 정확성". No made-up metrics, no training/fine-tuning arrows, no cloud services, no vector database cylinder (index is JSON file), no vendor logos, no excessive small text, no unrelated decoration. Keep the question and document embedding roles clearly separate. The image should explain the process immediately, with crisp Korean lettering and visible directional flow.

## 수정 지시

질문과 상위 3개 근거를 합친 화살표가 JSON 검사로 직접 들어가는 오류를 수정했다. 합친 입력이 먼저 Qwen3 답변 생성으로 들어가고, Qwen3 → JSON·출처 번호 검사 → 두 출력으로 이어지게 했다. 나머지 글자·배치·색상은 유지했다.

