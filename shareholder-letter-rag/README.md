# Shareholder Letter RAG (Retrieval-Augmented Generation)

RAG 파이프라인 구축

문서 수집 -> 전처리/청킹 -> 임베딩 -> Vector DB 저장 -> 유사도 검색 -> LLM 응답 생성으로 이어지는 전체 파이프라인 구축

This is an example of a Retrieval Augemented Generation with Fiscal AI's Shareholder letter. I will use Berkshire Hathaway's SHAREHOLDER LETTERS. I can extand this to other Shareholder letters as well. The goal is to create a RAG model that can answer questions about Berkshire Hathaway's shareholder letters using the content of the letters as context.

We want to meet the superinvestors and learn what they think. But they won't meet us so there's no way to get their feedback. So we need to read books and letters to understand their thinking. We want to read the letters and answer questions about them. We want to do this in a way that is fast and accurate.

## Tech stack

Supabase Vector DB,

Query와 Context를 함께 사용해서 정상적인 응답을 생성하는 Retrieval-Augmented Generation(RAG) 모델에 대한 예제입니다. RAG는 검색 기반의 정보와 생성 모델을 결합하여 더 정확하고 풍부한 응답을 제공합니다.

RAG는 사용자가 쿼리를 보내면, 쿼리에 맞는 정보를 지식 베이스에서 검색을 해보고

정상적인 답변을 LLM에게 받도록 하는것이다

RAG 정의 : LLM이 새로운 정보를 검색하고 통합할 수 있도록 하는 기술

## RAG이란 무엇인가?

LLM이 새로운 정보를 검색하고 통합할 수 있도록 하는 기술

## RAG의 3가지 파이프라인

RAG는 크게 세 가지 구성 요소로 이루어져 있습니다:

1. **색인(Indexing)**: 문서를 검색 가능한 형태로 가공하고 저장

2. **생성(Generation)**: 검색된 문서를 기반으로 최종 응답을 생성하는 역할을 합니다. 일반적으로 대규모 언어 모델(LLM)을 사용하여 자연스러운 텍스트를 생성합니다.

3. **평가(Evaluation)**: 시스템의 정확도와 품질을 측정하고 개선

## RAG 예시

목표 : 교육 운영 정보 질의응답 시스템 구축(자연어로 검색)

시행착오 1 : MCP 연동

사용자가 자연어로 질문을 입력하면, 내부 지식 베이스에서 관련 정보를 검색하고, 그 정보를 바탕으로 LLM이 응답을 생성하는 방식입니다. 이를 통해 사용자는 더 정확하고 풍부한 답변을 받을 수 있습니다.

관련된 파일, 데이터베이스 쿼리 등을 통해서 사용자가 원하는 정보를 빠르게 제공할 수 있으며, RAG 모델은 이러한 과정을 자동화하여 효율성을 높입니다.

## RAG 개발 단계와 핵심 고려사항

1. 사용 사례 식별 및 RAG 필요성 평가
2. 요규사항 수집 및 분석
3. RAG 프레임워크 결정
4. 색인 파이프라인 구현
5. 생성 파이프라인 구현
6. 평가 구현

### 1. 사용 사례 식별 및 RAG 필요성 평가

When the following conditions are met, RAG is needed: Realtime update, domain driven

When you do not need RAG, simple Q&A, static knowledge

- LLM의 학습 데이터에 없는 정보가 필요한가?
- 최신 정보나 자주 업데이트되는 정보가 필요한가?
- 정보의 인용이나 생성이 필요한가? 정확성이 얼마나 중요한가?
- 출처 제공이 사용자에게 도움이 되는가?

### 2. 요규사항 수집 및 분석

RAG 구출을 위해 이해곤계자의 요구사항을 다양한 관점에서 수집

- 비즈니스 목표가 무엇인가?
- 사용자 니즈는 무엇인가?
- 기능 요구사항은 무엇인가?
- 비기능 요구사항은 무엇인가?

비즈니스 목표가 무엇인가? – 교육 운영 정보 질의응답 시스템 구축
– 정량 목표: 정보 분석 시간 5분 → 30초, 시스템 접근 횟수 3번 → 1번
사용자 니즈는 무엇인가? – 여러 시스템을 방문할 필요 없이, 한 곳에서 자연어로 질문하고 신뢰할 수 있는 답변을 즉시 받기
기능 요구사항은 무엇인가? – 관련 정보를 자동으로 검색하고 답변을 생성
– 실시간 다중 데이터 소스 통합으로 최신 정보 제공
비기능 요구사항은 무엇인가? – 성능: 90% 이상의 쿼리에 대해 3초 이내 응답, Context window 문제 최소화
– 보안: 민감 데이터 및 사용자 접근 권한 관리

Shareholder letter RAG
Q: What's your business goal?
A: 투자자가 shareholder letter, annual report 등 수백 페이지의 문서를 분석하는 시간을 30분 → 1분 이내로 단축하고, 여러 문서를 직접 검색하는 과정을 다중 검색 → 단일 AI 질의로 개선

Q: What's your user need?
A: 여러 금융 문서를 직접 탐색하지 않고, 자연어로 질문하여 신뢰할 수 있는 투자 인사이트를 빠르게 얻고 싶음

- "Buffett는 Apple 투자 당시 어떤 기준을 중요하게 봤는가?"
- "Berkshire가 높은 현금을 유지하는 이유는 무엇인가?"

Q: What are your functional requirements?
A:투자 문서에서 관련 정보를 검색하고 근거 기반 답변 생성

- Shareholder letter, shareholder letter, annual report 등 문서 ingestion
- 문서 자동 chunking 및 embedding 생성
- Vector database 기반 semantic search
- 검색된 context를 활용한 LLM 답변 생성
- 답변과 함께 원본 문서 citation 제공
- 여러 투자자별 Knowledge Base 지원

Q : What are your non-functional requirements?

Performance:
90% 이상의 질의에 대해 5초 이내 응답
Context window 제한을 고려한 효율적인 retrieval
불필요한 문서 검색 최소화

Excutability:
Retrieved documents 기반 답변 생성
Hallucination 최소화
모든 답변에 출처 제공

## 3. RAG 프레임워크 결정

- 요구사항 변경 시 유연하게 대응 가능한가?
- 팀원들이 단기간에 습득 가능한가?
- 배포가 가능한가?
- 로깅/추적이 가능한가?

Cloudflare + Vercel AI SDK for shareholder letter RAG

```bash
                    User
                     |
                     v
              Next.js Application
                     |
                     v
              Vercel AI SDK
          (streaming, LLM orchestration)
                     |
                     v
          GPT / Claude / Workers AI


------------------------------------------------


              Document Ingestion Pipeline

Berkshire PDF
      |
      v
Cloudflare R2
(Document Storage)
      |
      v
Cloudflare Worker
(Parser + Chunking)
      |
      v
Embedding Model
(OpenAI Embedding / Workers AI)
      |
      v
Cloudflare Vectorize
(Vector Database)


------------------------------------------------


              Query Pipeline

User Question
      |
      v
Embedding Model
      |
      v
Cloudflare Vectorize
      |
      v
Top-K Relevant Chunks
      |
      v
Vercel AI SDK
      |
      v
LLM Answer + Citation

```

## 4. 색인(Indexing) 파이프라인 구현

문서를 검색 가능한 형태로 준비하고 저장하는 단계

로딩, 청킹, 임베딩, 저장소의 네 가지 핵심 구성 요소 구현

1. 로딩 : 데이터 소스를 연결하고 수집
   - Q: 어떤 데이터를 연결할 것인가? A: 버크셔 PDF 문서 수집
   - Q: 어떤 포맷을 파싱할 것인가? A: pdf
   - Q: 어떻게 데이터를 정제할 것인가? A: ?

2. 청킹 : 데이터를 검색 가능한 단위로 분할
   - Q : 어떤 전략으로 분할할 것인가?
     - A : 고정 크기 청킹, 부모-자식 구조
   - Q : 크기와 중복은 얼마로 할 것인가?
     - A : 5000자(저장소 최대), 중복 없음
   - Q : 어떤 메타데이터를 함께 저장할 것인가?
     - A : 출처, 시간, 구조 정보

3. 임베딩 : 데이터를 가져온 이후, 컴퓨터가 이해할수 있도록 청킹된 데이터를 n차원 행렬(벡터)로 변환
   - Q: 어떤 임베딩 모델을 선택할 것인가?
     - A: 멀티모달 지원, 파운데이션 모델 사용
   - Q: 차원의 크기를 어떻게 설정할 것인가?
     - A: 1024 차원 사용
   - Q: 파인튜닝이 필요한가?
     - A: X. 모델 기본값 사용

4. 저장소 : 임베딩된 데이터를 저장하고 검색할 서비스
   - Q : 어떤 저장소르 선택할 것인가?
     - A : Cloudflare Vectorize
   - Q : 확장성을 어떻게 확보할 것인가?
     - A: 추후에 다른 슈퍼인베스터들을 고려하고 있기에, Vectorize의 metadata filtering과 namespace 구조를 활용하여 다양한 투자 문서와 Agent Knowledge Base로 확장한다.

## 5. 생성(Generation) 파이프라인 구현

질문에 맞는 정보를 검색하고, 답변을 생성하는 과정(검색, 증강, 생성)의 세가지 핵심 구성 요소 구현

### 5-1. 검색(Retrieval): 관련성 높은 청크 추출

검색 : 사용자 질문에 가장 관련성 높은 청크 추출

- Q : 어떤 검색 전략을 사용할 것인가?
  - A : 문맥적 임베팅 (저장소 기본설정)
- Q : 사용자 질문을 최적화할 것인가?
  - A : LLM을 이용하여 최적화

- 메타데이터 필터링으로 검색 효율성 향상
- 검색할 청크 개수(Top-K) 설정 필요, 많이 가져오면 좋겟지만,많아질수록 컨텍스트 윈도우가 금방 소진됨.
- 유사도 점수 기준 필요
- 검색된 데이터에 대한 정밀도는 평가단계에서 검토

### 5.2 증강(Augmentation) : 검색된 청크를 사용자 질문과 결합하여 LLM에 전달

- Q : 페르소나를 어떻게 정의할 것인가?
  - A : AI가 수행해야 할 역활이나 성격
- Q : 컨텍스트 제약을 어떻게 설정할 것인가?
  - A : 검색된 내용으로만 답변
- Q : 어떤 프롬프팅 기법을 활용할 것인가?
  - A : 추론 과정 응답 요구, 답변 형식 지정

### 5.3 생성(Generation) : 증강된 프롬프트를 받아 최종 응답을 생성

- 파운데이션 모델로 먼저 검증
- 모델 크기 고려
- 성능과 속도 사이의 트레이드오프
- 증강된 데이터의 품질은 평가 단계에서 고려

## 6. 평가 파이프라인 구현

평가용 LLM과 운영용 LLM을 분리

### 6.1 컨텍스트 관련성(Contextual Relevance)

검색된 정보가 사용자 질문과 얼마나 관련성이 높은지 평가. '필요한 문장 수/전체 문장 수' 가 점수가 되므로, 관련 없는 문장이 많이 포함될수록 점수가 낮아짐.

ex) - Query : "Why does Warren Buffett prefer to maintain a large cash position at Berkshire Hathaway, and when does he decide to deploy cash?"

높은 컨텍스트 관련성 : "We will always maintain a huge amount of cash and equivalents because we want to be prepared for opportunities that may arise."

낮은 컨텍스트 관련성 : "Apple has become an important part of Berkshire Hathaway's equity portfolio."

### 6.2 답변 충실성(Answer Faithfulness)

생성된 답변이 검색된 정보에 얼마나 사실적으로 근거하는지 평가

### 6.3 답변 충실성(Answer Relevance)

생성된 답변이 사용자 질문과 얼마나 관련성이 높은지 평가

### Reference

<https://www.berkshirehathaway.com/letters/letters.html>
<https://www.youtube.com/watch?v=ZREt9MAozho&t=604s>
<https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/>
<https://techblog.woowahan.com/25900/>
<https://aws.amazon.com/blogs/dotnet/add-retrieval-augmented-generation-rag-to-your-net-applications-with-amazon-bedrock-knowledge-bases/>
<https://www.youtube.com/watch?v=ZREt9MAozho&t=604s>
