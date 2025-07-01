import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "梦境之书 | AI Dream Book - 探索您的梦境世界",
  description: "使用AI技术解析您的梦境，生成专属的梦境小说、图片和视频。探索梦境的奥秘，记录您的潜意识世界。",
  keywords: "梦境, AI, 人工智能, 梦境解析, 梦境生成, 小说生成, 图片生成, 视频生成, dream analysis, AI dream",
  openGraph: {
    title: "梦境之书 | AI Dream Book",
    description: "探索梦境的奥秘，用AI技术解析和创造梦境内容",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "梦境之书 | AI Dream Book",
    description: "探索梦境的奥秘，用AI技术解析和创造梦境内容",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://aidreambook.com",
    languages: {
      "zh-CN": "https://aidreambook.com/zh",
      "en-US": "https://aidreambook.com/en",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "梦境之书",
              "alternateName": "AI Dream Book",
              "description": "AI-powered dream analysis and content generation platform",
              "url": "https://aidreambook.com",
              "applicationCategory": "Artificial Intelligence",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "category": "AI Service"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="min-h-screen dream-bg">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
