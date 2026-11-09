import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 로그인 + 허용목록 확인. 실제 데이터 보호는 DB의 RLS가 한다.
async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const { data: allowed } = await supabase.rpc("is_allowed");

  if (!allowed) {
    return (
      <section className="flex flex-col gap-4">
        <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          초대된 계정만 쓸 수 있어요. 지금 로그인한 계정은 허용목록에 없습니다.
        </p>
        <SignOut />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <p className="text-lg">로그인되었습니다.</p>
      <p className="text-sm text-neutral-600">오늘 관리 화면은 다음 단계(G4)에서 만듭니다.</p>
      <SignOut />
    </section>
  );
}

function SignOut() {
  return (
    <form action="/auth/signout" method="post">
      <button className="min-h-11 rounded-lg border px-4 text-sm">로그아웃</button>
    </form>
  );
}

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">식물 기록</h1>
      <Suspense fallback={<p className="text-sm text-neutral-500">확인 중…</p>}>
        <Home />
      </Suspense>
    </main>
  );
}
