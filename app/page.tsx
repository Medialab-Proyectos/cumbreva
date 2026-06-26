import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { StatsBand } from "@/components/stats-band"
import { BrandMarquee } from "@/components/brand-marquee"
import { Features } from "@/components/features"
import { AppShowcase } from "@/components/app-showcase"
import { WaitlistSection } from "@/components/waitlist-section"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppBanner } from "@/components/whatsapp-banner"
import { StructuredData } from "@/components/structured-data"

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
      </main>
      <SiteFooter />
      <WhatsAppBanner />
    </div>
  )
}
