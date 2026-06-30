import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SeoLandingPage } from "@/components/seo/seo-landing-page"
import {
  absoluteLandingUrl,
  seoLandingBySlug,
  seoLandings,
} from "@/lib/seo-landings"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return seoLandings.map((landing) => ({ slug: landing.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const landing = seoLandingBySlug.get(slug)

  if (!landing) {
    return {}
  }

  return {
    title: landing.title,
    description: landing.metaDescription,
    alternates: {
      canonical: `/seo/${landing.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: absoluteLandingUrl(landing.slug),
      title: landing.title,
      description: landing.metaDescription,
      images: [
        {
          url: landing.heroImage,
          alt: landing.heroAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: landing.title,
      description: landing.metaDescription,
      images: [landing.heroImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const landing = seoLandingBySlug.get(slug)

  if (!landing) {
    notFound()
  }

  return <SeoLandingPage landing={landing} />
}
