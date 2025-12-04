// src/app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { FilterBar } from '@/components/FilterBar/FilterBar';
import { EPaperCard } from '@/components/EPaperCard/EPaperCard';
import { Toaster } from '@/components/ui/Toast/Toast';
import { useToast } from '@/components/ui/Toast/useToast';
import { GET_EPAPERS } from '@/graphql/queries';
import { DOWNLOAD_EPAPER, LOG_DOWNLOAD } from '@/graphql/mutations';
import { State, City } from '@/types';
import styles from './page.module.css';
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toasts, toast, dismiss } = useToast();

  const [selectedState, setSelectedState] = useState<string | null>('4121001');
  const [selectedCity, setSelectedCity] = useState<string | null>('4121844');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: epapersData,
    loading: epapersLoading,
  }: any = useQuery(GET_EPAPERS);

  const [downloadEPaper] = useMutation(DOWNLOAD_EPAPER);
  const [logDownload] = useMutation(LOG_DOWNLOAD);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const states: State[] = useMemo(() => {
    return epapersData?.epaperEditions || [];
  }, [epapersData]);

  const cities: City[] = useMemo(() => {
    if (!selectedState || !epapersData?.epaperEditions) {
      return [];
    }

    const selectedStateData = epapersData.epaperEditions.find(
      (edition: any) => edition.id == selectedState
    );

    return selectedStateData?.children || [];
  }, [selectedState, epapersData]);

  useEffect(() => {
    if (selectedState && cities.length > 0) {
      const cityExists = cities.some((city: City) => city.id === selectedCity);

      if (!cityExists) {
        setSelectedCity(cities[0]?.id || null);
      }
    } else {
      setSelectedCity(null);
    }
  }, [selectedState, cities, selectedCity]);

  const handleStateChange = (stateId: string | null) => {
    setSelectedState(stateId);
  };

  const handleCityChange = (cityId: string | null) => {
    setSelectedCity(cityId);
  };

  // onDownload handler used by EPaperCard


  const handleDownload = async ({
    epaperId,
    pdfUrl,
  }: {
    epaperId: string;
    pdfUrl: string | null;
  }) => {
    if (!user) return;

    if (!pdfUrl) {
      toast({
        title: 'Download Not Available',
        description: 'No PDF is available for this ePaper.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // 1️⃣ Fetch the PDF file as bytes
      const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer()
      );

      // 2️⃣ Load PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // 3️⃣ Embed font for watermark text
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Watermark content
      const watermarkText = `${user.username} - ${new Date().toLocaleString()}`;

      const pages = pdfDoc.getPages();

      pages.forEach((page: any) => {
        const { width, height } = page.getSize();

        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: 28,
          opacity: 0.25,
          rotate: { type: "degrees", angle: 45 },
          font,
          color: rgb(0.8, 0.1, 0.1), // Light red watermark
        });
      });

      // 4️⃣ Export the watermarked PDF
      const watermarkedPdfBytes: any = await pdfDoc.save();

      // 5️⃣ Trigger browser download
      const blob = new Blob([watermarkedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `epaper-${epaperId}-watermarked.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your watermarked ePaper is being downloaded.",
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Download Failed",
        description:
          error?.message || "Unable to download the ePaper. Please try again.",
        variant: "destructive",
      });
    }
  };


  // Filter epapers based on selections
  const epapers: any[] = useMemo(() => {
    if (!cities) {
      return [];
    }

    let filtered = [...cities];

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter((e: any) => e.parent == selectedState);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((e: any) => e.id == selectedCity);
    }

    // (Optional) date/search filters can be added here later

    return filtered;
  }, [cities, selectedState, selectedCity, selectedDate, searchQuery]);

  if (authLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Browse ePapers</h2>
          <p className={styles.heroDescription}>
            Select your state and city to find local newspapers. All downloads
            are watermarked with your username for security.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <FilterBar
            states={states}
            cities={cities}
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            onDateChange={setSelectedDate}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* ePapers Grid */}
        {epapersLoading ? (
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonThumbnail} />
                <div className={styles.skeletonContent}>
                  <div className={`${styles.skeletonLine} ${styles.wide}`} />
                  <div className={`${styles.skeletonLine} ${styles.medium}`} />
                  <div className={`${styles.skeletonLine} ${styles.button}`} />
                </div>
              </div>
            ))}
          </div>
        ) : epapers.length > 0 ? (
          <div className={styles.grid}>
            {epapers.map((city, index) => (
              <div
                key={city.id}
                className={styles.card}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <EPaperCard
                  cityId={city.id}
                  cityName={city.name}
                  selectedDate={selectedDate}
                  onDownload={handleDownload}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No ePapers Found</h3>
            <p className={styles.emptyDescription}>
              {selectedState || selectedCity || selectedDate || searchQuery
                ? 'No ePapers available for the selected filters. Try adjusting your filters.'
                : 'No ePapers have been uploaded yet. Check back later!'}
            </p>
          </div>
        )}
      </main>

      <Footer />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
