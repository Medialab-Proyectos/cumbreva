import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProgrammaticSeoPageView } from "@/components/seo/programmatic-seo-page"
import {
  absoluteProgrammaticUrl,
  programmaticSeoPageByPath,
  rootSeoPages,
  rootSlug,
} from "@/lib/programmatic-seo"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return rootSeoPages.map((page) => ({ slug: rootSlug(page.path) }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = programmaticSeoPageByPath.get(`/${slug}`)

  if (!page) return {}

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: absoluteProgrammaticUrl(page.path),
      title: page.title,
      description: page.description,
      images: [{ url: page.heroImage, alt: page.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.heroImage],
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
  const page = programmaticSeoPageByPath.get(`/${slug}`)

  if (!page) notFound()

  return <ProgrammaticSeoPageView page={page} />
}
