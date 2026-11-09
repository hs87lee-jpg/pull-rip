import { Suspense } from "react";
import { GoogleButton } from "./google-button";

async function ErrorNote({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
      초대된 계정만 쓸 수 있어요. 다른 구글 계정으로 시도하거나 운영자에게 문의해 주세요.
    </p>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-bold">식물 기록</h1>
      <p className="text-sm text-neutral-600">초대된 계정만 이용할 수 있습니다.</p>
      <Suspense>
        <ErrorNote searchParams={searchParams} />
      </Suspense>
      <GoogleButton />
    </main>
  );
}
