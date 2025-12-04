// src/components/EPaperCard/EPaperCard.tsx
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Download, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { GET_EDITION } from '@/graphql/queries';
import styles from './EPaperCard.module.css';

interface EPaperCardProps {
    cityId: string | number;
    cityName: { hi?: string; en?: string } | string;
    selectedDate: Date | null;
    onDownload: (args: { epaperId: string; pdfUrl: string | null }) => Promise<void>;
}

export function EPaperCard({
    cityId,
    cityName,
    selectedDate,
    onDownload,
}: EPaperCardProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const dateString = useMemo(
        () =>
            selectedDate
                ? format(selectedDate, 'dd-MM-yyyy')
                : format(new Date(), 'dd-MM-yyyy'),
        [selectedDate]
    );

    // 🔹 Fetch edition for this city + date
    const { data, loading, error }:any = useQuery(GET_EDITION, {
        variables: {
            id: cityId.toString(),
            date: dateString,
        },
        skip: !cityId,
        fetchPolicy: 'cache-and-network',
    });

    const edition = data?.epaperChildEditionByIdDate?.[0];

    // PDF URL from your sample response
    const pdfUrl: string | null =
        edition?.group_epaper_pdf && edition.group_epaper_pdf.length > 0
            ? edition.group_epaper_pdf[0].url
            : null;

    // If your API returns a banner image, map it here
    // For example: const imageUrl = edition?.imageurl || null;
    const imageUrl: string | null = (edition as any)?.imageurl || null;

    const title =
        edition?.title ||
        (typeof cityName === 'string' ? cityName : cityName?.en || cityName?.hi) ||
        'EPaper';

    const handleDownloadClick = async () => {
        if (!edition) return;

        setIsDownloading(true);
        try {
            await onDownload({
                epaperId: edition.id.toString(),
                pdfUrl,
            });
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading && !edition) {
        return (
            <div className={styles.card}>
                <div className={styles.thumbnail}>
                    <div className={styles.thumbnailPlaceholder}>
                        <div className={styles.placeholderContent}>
                            <div className={styles.placeholderIcon}>
                                <Calendar />
                            </div>
                            <p className={styles.placeholderDate}>Loading...</p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>Loading edition...</h3>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.card}>
                <div className={styles.thumbnail}>
                    <div className={styles.thumbnailPlaceholder}>
                        <div className={styles.placeholderContent}>
                            <div className={styles.placeholderIcon}>
                                <Calendar />
                            </div>
                            <p className={styles.placeholderDate}>{dateString}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.errorText}>Failed to load this edition.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.thumbnail}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles.thumbnailImage}
                    />
                ) : (
                    <div className={styles.thumbnailPlaceholder}>
                        <div className={styles.placeholderContent}>
                            <div className={styles.placeholderIcon}>
                                <Calendar />
                            </div>
                            <p className={styles.placeholderDate}>{dateString}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.badges}>
                    <Badge variant="outline">
                        {typeof cityName === 'string'
                            ? cityName
                            : cityName?.en || cityName?.hi}
                    </Badge>
                </div>
            </div>

            <div className={styles.footer}>
                <Button
                    onClick={handleDownloadClick}
                    disabled={isDownloading || !pdfUrl}
                    variant="editorial"
                    fullWidth
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Preparing...
                        </>
                    ) : (
                        <>
                            <Download />
                            {pdfUrl ? 'Download' : 'Not Available'}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
