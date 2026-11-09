# 구글 로그인 연결하기 (시험 프로젝트)

상석님이 직접 하는 설정입니다. 약 20~30분. 시험 프로젝트(`vzytphssywwoebftqduw`)에만 합니다.

## 1. Supabase에 허용목록 만들기
1. supabase.com → 시험 프로젝트 열기
2. 왼쪽 메뉴 **SQL Editor** → **New query**
3. 저장소의 `supabase/migrations/0001_allowlist.sql` 내용을 전부 붙여넣고 **Run**
4. 왼쪽 **Table Editor** → `allowed_users`에 `hs87lee@gmail.com` 한 줄이 보이면 성공

## 2. 가입 차단 훅 켜기
1. 왼쪽 **Authentication** → **Hooks**(또는 Auth Hooks)
2. **Before User Created** → **Add hook** → 종류 **Postgres**
3. 스키마 `public`, 함수 `hook_before_user_created` 선택 → 저장

## 3. Google Cloud에서 로그인 키 만들기
1. console.cloud.google.com → 상단에서 **새 프로젝트** (이름 예: plant-log)
2. **API 및 서비스 → OAuth 동의 화면**(Google Auth Platform) → 시작하기
   - 앱 이름, 지원 이메일 입력 → 대상 **외부** → 저장
   - **테스트 사용자**에 본인 구글 이메일 추가
3. **사용자 인증 정보(클라이언트)** → **클라이언트 만들기** → 유형 **웹 애플리케이션**
   - 승인된 JavaScript 원본: `http://localhost:3000`
   - 승인된 리디렉션 URI: `https://vzytphssywwoebftqduw.supabase.co/auth/v1/callback`
4. 만들어진 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사 (대화창에 붙여넣지 마세요)

## 4. Supabase에 구글 연결
1. 시험 프로젝트 → **Authentication → Sign In / Providers → Google** → 켜기
2. 3번에서 복사한 클라이언트 ID·보안 비밀번호 붙여넣기 → 저장
3. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs에 `http://localhost:3000/auth/callback` 추가

## 5. 내 컴퓨터에서 실행
1. 저장소 폴더에서 `.env.example`을 복사해 `.env.local` 파일 만들기
2. Supabase **Project Settings → API Keys**의 **Publishable key**(`sb_publishable_`로 시작)를 `.env.local`에 붙여넣기
3. 터미널에서 `npm install` → `npm run dev`
4. 브라우저에서 `http://localhost:3000` → **구글로 로그인**

## 확인할 것
- [ ] 본인 계정: "로그인되었습니다."가 보인다
- [ ] 다른 구글 계정: "초대된 계정만 쓸 수 있어요"가 보이고 Supabase **Authentication → Users**에 그 계정이 생기지 않는다
- [ ] 로그아웃 후 `http://localhost:3000`에 들어가면 로그인 화면으로 간다

막히는 화면이 있으면 캡처를 보내 주세요. Google Cloud 메뉴 이름은 자주 바뀝니다.
