export default async function InstallPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <h1 className="text-2xl font-bold">설치 완료!</h1>
        <p className="text-muted-foreground">매일 아침 AI 논문 요약이 Slack으로 전송됩니다.</p>
        <a href="/" className="text-primary underline">홈으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-2xl font-bold">설치 실패</h1>
      <p className="text-muted-foreground">오류 코드: {params.error || 'unknown'}</p>
      <a href="/" className="text-primary underline">다시 시도하기</a>
    </div>
  );
}
