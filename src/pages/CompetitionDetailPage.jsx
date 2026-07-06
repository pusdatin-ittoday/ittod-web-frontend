import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiFileText, FiUserPlus } from 'react-icons/fi';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import CompetitionInfoSidebar from '../components/competition/CompetitionInfoSidebar';
import CompetitionCategoryGrid from '../components/competition/CompetitionCategoryGrid';
import GetInTouchSection from '../components/home/GetInTouchSection';
import { getEventBySlug } from '../services/eventService';

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
          icon: apiData.logo_url,
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
    <div className="min-h-screen bg-[#f7f7f4] text-black">
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        {/* Banner */}
        <PageBanner
          icon={competition.icon}
          title={competition.title}
          subtitle={competition.tagline}
          variant="event"
        />

        {/* 2-column layout */}
        <section className="w-full bg-[#f7f7f4] py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.72fr)]">
              {/* Left: About the Challenge */}
              <div>
                <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#111] transition-transform duration-300 hover:-translate-y-1 md:p-9">
                  <h2 className="mb-5 w-fit border-b-[4px] border-yellow-neo pb-2 font-inter text-2xl font-black uppercase leading-tight text-[#171918] md:text-4xl">
                    About The Challenge
                  </h2>

                  <p className="mb-6 whitespace-pre-wrap font-inter text-sm leading-relaxed text-[#2e3238] md:text-base">
                    {competition.description}
                  </p>

                  {/* Category grid */}
                  {competition.categories?.length > 0 && (
                    <CompetitionCategoryGrid categories={competition.categories} />
                  )}

                  {/* CTA buttons */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Button
                      variant="yellow-solid"
                      href={competition.guidebookUrl}
                      className="flex flex-1 items-center justify-center gap-2 text-center uppercase tracking-wider"
                    >
                      <FiFileText size={18} /> Download Guidebook
                    </Button>
                    <Button
                      variant="indigo-solid"
                      href={`/register-competition/${slug}`}
                      className="flex flex-1 items-center justify-center gap-2 text-center uppercase tracking-wider"
                    >
                      <FiUserPlus size={18} /> Daftar Sekarang
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div>
                <CompetitionInfoSidebar competition={competition} />
              </div>
            </div>
          </div>
        </section>
        <GetInTouchSection compact contact1={competition.contact_person1} contact2={competition.contact_person2} />
      </main>
      <FooterNeo />
    </div>
  );
};

export default CompetitionDetailPage;
