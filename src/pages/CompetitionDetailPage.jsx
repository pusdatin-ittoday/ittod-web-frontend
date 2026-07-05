import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiFileText, FiUserPlus } from 'react-icons/fi';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import CompetitionInfoSidebar from '../components/competition/CompetitionInfoSidebar';
import CompetitionCategoryGrid from '../components/competition/CompetitionCategoryGrid';
import { getEventBySlug } from '../services/eventService';

const getDefaultImage = (title) => {
  if (!title) return '/LOGO_ITTODAY_2025.webp';
  const t = title.toLowerCase();
  if (t.includes('hack')) return '/logo-competition/HACKTODAY.webp';
  if (t.includes('mine')) return '/logo-competition/MINETODAY.webp';
  if (t.includes('ux')) return '/logo-competition/UXTODAY.webp';
  if (t.includes('game')) return '/logo-competition/GAMETODAY.webp';
  return '/LOGO_ITTODAY_2025.webp';
};

/**
 * Competition Detail Page — template tunggal, render berdasarkan :slug (id) dari API.
 * Layout 2 kolom: AboutChallengeCard + CompetitionInfoSidebar.
 */
const CompetitionDetailPage = () => {
  const { slug } = useParams();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchCompetition = async () => {
      const response = await getEventBySlug(slug);
      if (response.success && response.data) {
        const apiData = response.data;
        const mainDate = apiData.timelines && apiData.timelines.length > 0 
          ? new Date(apiData.timelines[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'TBA';

        const formattedComp = {
          ...apiData,
          tagline: `${apiData.title.toUpperCase()} // 2026`,
          icon: apiData.logo_url || getDefaultImage(apiData.title),
          registrationDeadline: mainDate,
          registrationFee: apiData.price > 0 ? `Rp ${apiData.price.toLocaleString('id-ID')}` : 'FREE / GRATIS',
          teamSize: apiData.participation_type === 'team' ? '1 - 3 Members' : 'Individual',
          prizePool: 'TBA',
          categories: [],
          guidebookUrl: apiData.guide_book_url || '#'
        };
        setCompetition(formattedComp);
      }
      setLoading(false);
    };
    fetchCompetition();
  }, [slug]);

  if (loading) {
    return (
      <>
        <NavbarNeo />
        <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
          <div className="text-center px-4">
            <h1 className="font-bebas text-4xl text-black mb-4">Loading...</h1>
          </div>
        </main>
        <FooterNeo />
      </>
    );
  }

  // 404 fallback
  if (!competition) {
    return (
      <>
        <NavbarNeo />
        <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
          <div className="text-center px-4">
            <h1 className="font-bebas text-6xl text-black mb-4">COMPETITION NOT FOUND</h1>
            <p className="font-inter text-gray-600 mb-8">
              Kompetisi tidak ditemukan.
            </p>
            <Button variant="indigo-solid" href="/">
              ← Kembali ke Home
            </Button>
          </div>
        </main>
        <FooterNeo />
      </>
    );
  }

  return (
    <>
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        {/* Banner */}
        <PageBanner icon={competition.icon} title={competition.title} subtitle={competition.tagline} />

        {/* 2-column layout */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: About the Challenge */}
              <div className="lg:col-span-2">
                <div className="card-brutal-no-hover rounded-lg p-6 md:p-8 relative">
                  {/* URGENT badge */}
                  <div className="absolute top-4 right-4 bg-red-neo text-white font-inter font-bold text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] tracking-wider uppercase">
                    URGENT
                  </div>

                  <h2 className="font-bebas text-3xl md:text-4xl text-black tracking-wider mb-6 uppercase">
                    About The Challenge
                  </h2>

                  <p className="font-inter text-base text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                    {competition.description}
                  </p>

                  {/* Category grid */}
                  {competition.categories?.length > 0 && (
                    <CompetitionCategoryGrid categories={competition.categories} />
                  )}

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button
                      variant="yellow-solid"
                      href={competition.guidebookUrl}
                      className="flex-1 text-center flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <FiFileText size={18} /> Download Guidebook
                    </Button>
                    <Button
                      variant="indigo-solid"
                      href={`/register-competition/${slug}`}
                      className="flex-1 text-center flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <FiUserPlus size={18} /> Daftar Sekarang
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div className="lg:col-span-1">
                <CompetitionInfoSidebar competition={competition} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterNeo />
    </>
  );
};

export default CompetitionDetailPage;
