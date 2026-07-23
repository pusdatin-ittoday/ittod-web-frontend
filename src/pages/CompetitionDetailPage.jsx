import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiFileText, FiUserPlus } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import AgendaSidebar from '../components/ui/AgendaSidebar';
import CompetitionCategoryGrid from '../components/competition/CompetitionCategoryGrid';
import GetInTouchSection from '../components/home/GetInTouchSection';
import { getEventBySlug } from '../services/eventService';
import LoadingState from '../components/ui/LoadingState';
import { registerTeam } from '../api/compe';
import { requireCompleteProfile } from '../utils/profileCompletion';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

const formatWaLink = (num) => {
  if (!num) return '#';
  let clean = num.toString().replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  return `https://wa.me/${clean}`;
};

const cleanDisplayNumber = (num) => {
  if (!num) return '';
  return num.toString()
    .replace(/^(https?:\/\/)?(www\.)?wa\.me\//i, "")
    .trim();
};

const isIndividualParticipation = (value) => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'individual' || normalized === 'individu';
};

/**
 * Competition Detail Page — template tunggal, render berdasarkan :slug (id) dari API.
 * Layout 2 kolom: AboutChallengeCard + CompetitionInfoSidebar.
 */
const CompetitionDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { isAuthenticated } = useAuth();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchCompetition = async () => {
      const response = await getEventBySlug(slug);
      if (response.success && response.data) {
        const apiData = response.data;
        const formattedComp = {
          ...apiData,
          tagline: `${apiData.title.toUpperCase()} // 2026`,
          icon: apiData.logo_url,
          categories: [],
          guidebookUrl: apiData.guide_book_url || '#'
        };
        setCompetition(formattedComp);
      }
      setLoading(false);
    };
    fetchCompetition();
  }, [slug]);

  const isIndividualCompetition = isIndividualParticipation(
    competition?.participation_type ||
      competition?.participationType ||
      competition?.participant_type ||
      competition?.participantType,
  );

  const handleRegisterClick = async () => {
    if (!competition || isRegistering) return;

    if (!isAuthenticated) {
      navigate(`/login?redirectTo=${encodeURIComponent(`/competition/${slug}`)}`);
      return;
    }

    if (!isIndividualCompetition) {
      navigate(`/dashboard/lomba/${competition.id || slug}/register`);
      return;
    }

    const canContinue = await requireCompleteProfile(navigate, showAlert);
    if (!canContinue) return;

    const confirmed = await showAlert({
      isConfirm: true,
      message: `Apakah kamu yakin ingin mendaftar ${competition.title}? Pendaftaran ini bersifat individu dan tidak menggunakan tim.`,
    });

    if (!confirmed) return;

    setIsRegistering(true);
    const response = await registerTeam({
      competition_id: competition.id || slug,
    });
    setIsRegistering(false);

    if (!response.success) {
      await showAlert({
        message: `Pendaftaran gagal: ${response.error}`,
      });
      return;
    }

    await showAlert({
      message: 'Pendaftaran individu berhasil!',
    });
    navigate('/dashboard/ikut-lomba');
  };

  if (loading) {
    return <LoadingState />;
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
                      onClick={handleRegisterClick}
                      disabled={isRegistering}
                      className="flex flex-1 items-center justify-center gap-2 text-center uppercase tracking-wider"
                    >
                      <FiUserPlus size={18} /> {isRegistering ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </Button>
                  </div>

                  {/* Contact Person */}
                  {(competition.contact_person1 || competition.contact_person2) && (
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="font-inter text-xs font-black uppercase tracking-wider text-gray-400">
                        Contact Person
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {competition.contact_person1 && (
                          <a
                            href={formatWaLink(competition.contact_person1)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border-2 border-black bg-[#f7f7f4] px-3 py-1.5 font-inter text-xs font-black text-black shadow-[3px_3px_0_#000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] hover:bg-yellow-neo"
                          >
                            <FaWhatsapp size={14} className="text-[#25D366]" />
                            <span>{cleanDisplayNumber(competition.contact_person1)}</span>
                          </a>
                        )}
                        {competition.contact_person2 && (
                          <a
                            href={formatWaLink(competition.contact_person2)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border-2 border-black bg-[#f7f7f4] px-3 py-1.5 font-inter text-xs font-black text-black shadow-[3px_3px_0_#000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] hover:bg-yellow-neo"
                          >
                            <FaWhatsapp size={14} className="text-[#25D366]" />
                            <span>{cleanDisplayNumber(competition.contact_person2)}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Sidebar */}
              <div>
                <AgendaSidebar timelines={competition.timelines} type="competition" />
              </div>
            </div>
          </div>
        </section>
        <GetInTouchSection compact />
      </main>
      <FooterNeo />
    </div>
  );
};

export default CompetitionDetailPage;
