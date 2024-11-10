# 카카오뱅크 조직도 시스템

이 프로젝트는 카카오뱅크 사내 시스템에 조직도를 추가하는 과제입니다. **Vanilla JavaScript**와 **CSS**만을 사용하여, 트리 구조의 조직도와 조직원 정보를 검색하고 확인할 수 있는 기능을 구현했습니다.

## 기능 요구 사항

- [x] 첨부된 `mockup.json` 데이터를 사용하여 조직도 구현
- [x] 좌측 영역에 트리구조 형태의 조직도를 표시하며, 팀 단위로 노출
- [x] 트리 구조에서 **+ / -** 아이콘으로 하위 트리를 열고 닫기 가능
- [x] 우측 영역에 상세 정보 리스트를 표시
- [x] 우측 영역 상단에 검색 기능을 추가
  - [x] 빈 값으로 검색 시 전체 리스트를 표시
  - [x] 검색 내용이 있을 경우 검색된 리스트만 노출
  - [x] 검색된 내용이 없을 경우 **Alert** 팝업을 띄우고 전체 리스트로 돌아가기
- [x] **Vanilla JavaScript** 및 **CSS(SASS 가능)**만 사용하여 개발
- [x] 나머지 추가 동작 / 애니메이션 / 개발 환경 등 나머지 요소들은 개인 재량껏 개발

## 폴더 구조

```plaintext
kakobank_org
src/
├── assets/
│   └── common/
│       └── constants.js       # 공통 상수 파일
├── components/
│   ├── layout/                # 전체 레이아웃을 관리하는 폴더
│   │   ├── content.js
│   │   ├── header.js
│   │   ├── layout.js
│   │   └── lnb.js
│   ├── Table/                 # 테이블과 페이지네이션 관련 컴포넌트 폴더
│   │   ├── Pagination.js
│   │   └── Table.js
│   └── Tree/                  # 조직도 트리 구조를 관리하는 폴더.
│       ├── appendNode.js
│       ├── events.js
│       ├── Tree.js
│       └── treeNode.js
├── lib/
│   ├── api.js                 # API 호출 관련 함수 (데이터 가져오기)
│   ├── logic.js               # 주요 로직 및 데이터 처리 함수
│   └── utils.js               # 유틸리티 함수들
├── styles/
│   ├── globals.css            # 전역 스타일 시트
│   └── reset.css
├── app.js
├── index.html                 # 메인 HTML 파일
├── index.js
├── mockup.json                # 조직도에 사용할 JSON 데이터
├── package.json
└── README.md                  # README.md
```
