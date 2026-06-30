import { AppShowcase } from "@/components/app-showcase"
import { BrandMarquee } from "@/components/brand-marquee"
import { Faq } from "@/components/faq"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StatsBand } from "@/components/stats-band"
import { StoreTeaser } from "@/components/store-teaser"
import { StructuredData } from "@/components/structured-data"
import { WaitlistSection } from "@/components/waitlist-section"
import { WhatsAppBanner } from "@/components/whatsapp-banner"

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <StructuredData />
      <SiteHeader />
      <main className="pb-24">
        <Hero />
        <StatsBand />
        <BrandMarquee />
        <Features />
        <AppShowcase />
        <WaitlistSection />
        <Faq />
        <StoreTeaser />
      </main>
      <SiteFooter />
      <WhatsAppBanner />
    </div>
  )
}
