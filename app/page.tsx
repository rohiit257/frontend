import HeroSection from './components/HeroSection';
import Companies from './components/Companies';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AlwaysVisibleAvatar from './components/AlwaysVisibleAvatar';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] scroll-smooth">
      <HeroSection />
      <Companies />
      <Services />
      <Testimonials />
      <Footer />
      <AlwaysVisibleAvatar />
    </main>
  );
}
