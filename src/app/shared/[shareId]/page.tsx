import { Metadata } from "next";
import { notFound } from "next/navigation";

interface SharedPageProps {
  params: Promise<{
    shareId: string;
  }>;
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: SharedPageProps): Promise<Metadata> {
  const { shareId } = await params;
  
  // TODO: Fetch time capsule data from API
  // For now, use placeholder data
  const title = "TimeGrave - Time Capsule Share";
  const description = "TimeGrave에서 Share된 Time Capsule을 Confirm해보세요.";
  const imageUrl = "/og-image.png"; // TODO: Generate dynamic OG image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://timegrave.com/shared/${shareId}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharedTimeCapsulePage({ params }: SharedPageProps) {
  const { shareId } = await params;

  // TODO: Fetch time capsule data from API
  // For now, show placeholder

  return (
    <main className="relative min-h-screen bg-[var(--deep-void)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-stone-700 rounded-lg p-8">
          <h1 className="font-cinzel text-4xl text-stone-200 mb-4">
            Share된 Time Capsule
          </h1>
          <p className="text-stone-400 mb-8">
            Share ID: {shareId}
          </p>
          
          <div className="text-stone-500">
            <p>이 페이지는 백엔드 API 연동 후 완성됩니다.</p>
            <p className="mt-2">Time Capsule 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
