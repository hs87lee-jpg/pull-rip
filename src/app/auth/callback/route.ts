// 구글 로그인 후 돌아오는 주소. 받은 코드를 세션으로 바꾼다.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 허용목록 밖 계정은 가입 단계에서 거절되면 여기로 온다
  return NextResponse.redirect(`${origin}/login?error=not_allowed`);
}
