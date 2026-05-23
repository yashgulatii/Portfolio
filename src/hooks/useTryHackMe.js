import { useState, useEffect } from 'react';

const FALLBACK_STATS = {
  points: 31972,
  streak: '0 days',
  badges: 22,
  roomsCompleted: 193,
  rank: 'Top 2%'
};

export function useTryHackMe(userPublicId = '2570639') {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `tryhackme_stats_${userPublicId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // 2 hour cache TTL
        if (Date.now() - timestamp < 2 * 60 * 60 * 1000) {
          setStats(data);
          setLoading(false);
          return;
        }
        // If expired, pre-populate state with cached data while we refetch silently
        setStats(data);
      } catch (e) {
        console.warn('Failed to parse cached TryHackMe stats', e);
      }
    }

    const targetUrl = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${userPublicId}`;
    // Use AllOrigins raw proxy to bypass CORS
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch TryHackMe data');
        return res.text();
      })
      .then((html) => {
        // Parse the details-text elements containing stats
        const regex = /<span class="details-text">([^<]+)<\/span>/g;
        const parsedStats = [];
        let match;
        
        while ((match = regex.exec(html)) !== null) {
          parsedStats.push(match[1].trim());
        }

        if (parsedStats.length >= 4) {
          const freshStats = {
            points: parseInt(parsedStats[0].replace(/,/g, ''), 10) || FALLBACK_STATS.points,
            streak: parsedStats[1] || FALLBACK_STATS.streak,
            badges: parseInt(parsedStats[2], 10) || FALLBACK_STATS.badges,
            roomsCompleted: parseInt(parsedStats[3], 10) || FALLBACK_STATS.roomsCompleted,
            rank: FALLBACK_STATS.rank // Since global percentage rank is stable, we use the fallback
          };

          setStats(freshStats);
          setLoading(false);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: freshStats,
              timestamp: Date.now(),
            })
          );
        } else {
          throw new Error('Badge HTML layout mismatch or parsing failed');
        }
      })
      .catch((err) => {
        console.error('TryHackMe fetch error, using fallback:', err);
        setError(err);
        setLoading(false);
        // Maintain fallback/previous state
      });
  }, [userPublicId]);

  return { stats, loading, error };
}
