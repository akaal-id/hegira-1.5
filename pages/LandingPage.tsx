

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import HeroSlider from '../components/HeroSlider';
import EventCard from '../components/EventCard';
import BusinessMatchingCard from '../components/BusinessMatchingCard'; // Re-added import
import FeatureItem from '../components/FeatureItem'; // Updated import
import ArticleCard from '../components/ArticleCard'; // New import
import { Briefcase, CalendarDays, BarChart3, Users, Mail, TrendingUp, Zap, ShieldCheck, Search, Lightbulb, Link2, CheckCircle, SpeakerIcon, Heart, TrendingUpIcon, CalendarCheck2, Headset, LayoutGrid, Ticket as TicketIcon, BookOpen } from 'lucide-react'; 
import { PageName, EventData } from '../HegiraApp'; // Renamed import

// Re-added sample vendors
const sampleVendors = [
  { id: 1, logoUrl: 'https://picsum.photos/seed/vendor1/150/150', name: 'PT Solusi Teknologi Cerdas', matchScore: 4.8, sector: 'Teknologi Informasi', location: 'Jakarta', budget: 'Rp 100jt - Rp 500jt' },
  { id: 2, logoUrl: 'https://picsum.photos/seed/vendor2/150/150', name: 'CV Kreasi Nusantara Mandiri', matchScore: 4.5, sector: 'Industri Kreatif', location: 'Bandung', budget: 'Rp 50jt - Rp 200jt' },
];

const sampleArticles = [
  {
    slug: '5-tips-sukses-menggelar-event-hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Tips & Trik',
    title: '5 Tips Sukses Menggelar Event Hybrid yang Menarik',
    excerpt: 'Event hybrid semakin populer. Kombinasikan pengalaman fisik dan virtual dengan strategi jitu untuk engagement maksimal.',
    author: 'Tim Hegira',
    date: '15 Juli 2024',
  },
  {
    slug: 'studi-kasus-konser-xyz-bersama-hegira',
    imageUrl: 'https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Studi Kasus',
    title: 'Studi Kasus: Kesuksesan Konser XYZ dengan Dukungan Penuh Hegira',
    excerpt: 'Bagaimana Konser XYZ berhasil menjual ribuan tiket dan memberikan pengalaman tak terlupakan bagi penontonnya? Simak ceritanya.',
    author: 'Andini Putri',
    date: '10 Juli 2024',
  },
  {
    slug: 'tren-event-2025-yang-wajib-diketahui',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Wawasan',
    title: 'Tren Event 2025: Inovasi dan Teknologi yang Akan Mendominasi',
    excerpt: 'Dari AI hingga keberlanjutan, apa saja tren yang akan membentuk industri event di tahun mendatang? Persiapkan diri Anda!',
    author: 'Budi Santoso',
    date: '5 Juli 2024',
  },
];


const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [elements, setElements] = React.useState<HTMLElement[]>([]);
  const observer = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (elements.length === 0) return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, options);

    elements.forEach(element => observer.current?.observe(element));

    return () => observer.current?.disconnect();
  }, [elements, options]);

  return setElements;
};


interface LandingPageProps {
  heroEvents: EventData[]; 
  featuredEvents: EventData[];
  onNavigate: (page: PageName, data?: any) => void;
  onOpenLoginModal?: () => void; 
}

const LandingPage: React.FC<LandingPageProps> = ({ heroEvents, featuredEvents, onNavigate, onOpenLoginModal }) => {
  const setObservedElements = useIntersectionObserver({ threshold: 0.1 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const validRefs = sectionRefs.current.filter(el => el !== null) as HTMLElement[];
    setObservedElements(validRefs);
  }, [setObservedElements]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      alert(`Terima kasih! Email ${emailInput.value} telah didaftarkan untuk newsletter Hegira.`);
      emailInput.value = ''; // Clear input
    } else {
      alert('Mohon masukkan alamat email Anda.');
    }
  };

  return (
    <>
      {/* Section 1: Hero Slider */}
      <HeroSlider events={heroEvents} onNavigate={onNavigate} />

      {/* Section 2: Temukan Event Menarik */}
      <section id="events" className="py-16 md:py-24 bg-hegra-card-bg animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-0 sm:px-6 lg:px-8"> {/* Adjusted padding for full-bleed scroll */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16  px-4 sm:px-0"> {/* Padding for title section */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hegra-deep-navy text-center md:text-left">Temukan Event <span className="text-gradient">Menarik</span></h2>
              <p className="text-neutral-700 mt-2 text-center md:text-left">Jelajahi berbagai acara terbaru dan paling populer.</p>
            </div>
            <button 
              onClick={() => onNavigate('events')} 
              className="mt-4 md:mt-0 text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center"
            >
              Lihat Semua Event <TrendingUp size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {/* Horizontal Scroll Container for Event Cards */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8"> {/* Negative margins for full bleed effect */}
            <div className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 py-4 px-4 sm:px-6 lg:px-8 horizontal-event-scroll">
              {featuredEvents.length > 0 ? featuredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="flex-shrink-0 w-[90%] xs:w-[80%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                >
                  <EventCard {...event} posterUrl={event.posterUrl || event.coverImageUrl} onNavigate={onNavigate} />
                </div>
              )) : (
                 <div className="w-full text-center py-10 px-4">
                    <p className="text-gray-500">Belum ada event unggulan yang tersedia saat ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: About Hegira - Reconstructed */}
      <section id="about-hegira" className="py-16 md:py-24 bg-hegra-chino/20 animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="bg-hegra-turquoise/20 text-hegra-turquoise font-semibold px-4 py-1.5 rounded-full text-xs inline-block">
              ABOUT US
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-hegra-deep-navy mb-8">
            Apa itu <span className="text-hegra-turquoise">Hegira?</span>
          </h2>
          
          <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 mb-12 text-gray-700 text-base md:text-lg leading-relaxed space-y-4 md:space-y-0">
            <p>
              Hegira adalah platform event terintegrasi yang dirancang untuk merevolusi cara Anda menemukan, mengelola, dan menikmati berbagai acara. Kami percaya bahwa setiap event adalah sebuah kesempatan—untuk belajar, bertumbuh, berjejaring, dan menciptakan kenangan.
            </p>
            <p>
              Misi kami adalah memberdayakan penyelenggara event dengan alat yang intuitif dan komprehensif, sekaligus memberikan pengalaman yang mulus dan menyenangkan bagi para peserta. Dari konser musik megah hingga workshop bisnis yang intim, Hegira hadir untuk Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 mb-12 md:mb-16 ">
            <FeatureItem
              icon={TicketIcon}
              title="Tiket Terintegrasi"
              description="Beli dan jual tiket untuk berbagai jenis event (B2C, B2B, B2G) dengan mudah, aman, dan cepat."
              iconBgClass="bg-hegra-turquoise/20"
              iconColorClass="text-hegra-turquoise"
            />
            <FeatureItem
              icon={Users}
              title="Jangkauan Luas"
              description="Temukan audiens yang lebih luas untuk event Anda atau jelajahi ribuan event menarik di seluruh Indonesia."
              iconBgClass="bg-hegra-yellow/20"
              iconColorClass="text-hegra-yellow"
            />
            <FeatureItem
              icon={Briefcase}
              title="Kelola Event Mudah"
              description="Tools lengkap bagi event creator untuk mengelola penjualan tiket, promosi, dan analitik secara profesional."
              iconBgClass="bg-hegra-chino/20"
              iconColorClass="text-hegra-chino"
            />
          </div>

          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
            alt="Hegira - Connecting Visions and Solutions"
            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-xl "
          />
        </div>
      </section>
      
      {/* Section 4: Business Matching - RE-ADDED */}
      <section id="business-matching" className="py-16 md:py-24 bg-hegra-card-bg animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 ">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hegra-deep-navy">Jalin Koneksi <span className="text-gradient">Bisnis Strategis</span></h2>
            <p className="text-lg text-neutral-700 mt-3 max-w-3xl mx-auto">Temukan partner, vendor, atau investor potensial untuk pertumbuhan bisnis Anda melalui platform business matching kami yang inovatif.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {sampleVendors.map((vendor, index) => (
              <div key={vendor.id} className=" " style={{ animationDelay: `${index * 0.15}s` }}>
                <BusinessMatchingCard {...vendor} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
           <div className="text-center mt-12 md:mt-16 ">
            <button 
                onClick={() => onNavigate('business')} 
                className="bg-hegra-turquoise text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hegra-yellow focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
                Jelajahi Semua Peluang Business Matching
            </button>
          </div>
        </div>
      </section>
      
      {/* Section 5: Articles - NEW SECTION */}
      <section id="articles" className="py-16 md:py-24 bg-hegra-chino/20 animate-on-scroll fade-in" ref={addToRefs}>
        <div className="container mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 px-4 sm:px-0">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hegra-deep-navy text-center md:text-left">
                Artikel & Wawasan <span className="text-gradient">Terbaru</span>
              </h2>
              <p className="text-neutral-700 mt-2 text-center md:text-left">
                Dapatkan insight, tips, dan cerita inspiratif seputar dunia event dan bisnis.
              </p>
            </div>
            <button
              onClick={() => onNavigate('articlesPage')} 
              className="mt-4 md:mt-0 text-hegra-gradient-start hover:text-hegra-gradient-mid font-semibold transition-colors duration-300 group flex items-center"
            >
              Baca Artikel Lain <BookOpen size={20} className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 ">
            <div className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 py-4 px-4 sm:px-6 lg:px-8 horizontal-event-scroll">
              {sampleArticles.map((article, index) => (
                <div
                  key={article.slug}
                  className="flex-shrink-0 w-[90%] xs:w-[80%] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
                >
                  <ArticleCard {...article} onNavigate={(slug) => alert(`Navigasi ke artikel: ${slug} (placeholder)`)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Newsletter */}
      <section id="newsletter" className="py-16 md:py-24 bg-gradient-to-b from-hegra-turquoise/60 to-hegra-turquoise text-hegra-white" ref={addToRefs}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className=" ">
            <Mail size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Tetap Terhubung!</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Dapatkan berita terbaru, promo eksklusif, dan info event pilihan dari Hegira langsung ke kotak masuk Anda.
            </p>
            <form 
              onSubmit={handleNewsletterSubmit} 
              className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 items-center"
            >
              <label htmlFor="newsletter-email" className="sr-only">Alamat Email</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="Masukkan alamat email Anda"
                required
                className="w-full sm:flex-grow py-3 px-5 rounded-lg text-hegra-deep-navy placeholder-gray-500 focus:ring-2 focus:ring-hegra-yellow focus:outline-none transition-shadow shadow-sm bg-white"
                aria-label="Alamat email untuk newsletter"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-hegra-yellow text-hegra-navy font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hegra-navy focus:ring-offset-2 focus:ring-offset-hegra-turquoise shadow-md"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;