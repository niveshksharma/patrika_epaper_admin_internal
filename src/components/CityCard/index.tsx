// components/CityCard/CityCard.tsx

import styles from './citycard.module.css';

interface CityCardProps {
    city: any;
    onSelect: () => void;
}

export function CityCard({ city, onSelect }: CityCardProps) {
    return (
        <div className={styles.card} onClick={onSelect}>
            {/* Icon/Thumbnail */}
            <div className={styles.iconWrapper}>
                {city.thumbnail ? (
                    <img
                        src={city.thumbnail}
                        alt={city.title}
                        className={styles.thumbnail}
                    />
                ) : (
                    <></>
                    // <div className={styles.iconPlaceholder}>
                    //     <LocationCityIcon sx={{ fontSize: 48 }} />
                    // </div>
                )}
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.title}>{city.title}</h3>

                {city.description && (
                    <p className={styles.description}>{city.description}</p>
                )}

                <div className={styles.footer}>
                    {/* <div className={styles.badge}>
                        <NewspaperIcon sx={{ fontSize: 14 }} />
                        <span>View ePapers</span>
                    </div> */}

                    {/* <ArrowForwardIcon className={styles.arrow} sx={{ fontSize: 20 }} /> */}
                </div>
            </div>
        </div>
    );
}