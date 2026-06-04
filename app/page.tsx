import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import ServicesSection from '@/components/home/ServicesSection'
import DiferenciaisSection from '@/components/home/DiferenciaisSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import AboutSection from '@/components/home/AboutSection'
import ContactSection from '@/components/home/ContactSection'
import Footer from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, category, cover_image_url, year, status, description, position, created_at, updated_at')
    .eq('status', 'published')
    .order('position', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <>
      <main>
        <HeroSection />
        <ServicesSection />
        <DiferenciaisSection />
        <ProjectsSection projects={projects ?? []} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
