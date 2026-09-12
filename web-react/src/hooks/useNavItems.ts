import { useMemo, useEffect, useState } from 'react';
import { NAV_ITEMS } from '@/data';
import { reviewsService } from '@/services/reviews.service';
import { useAuth } from '@/context/AuthContext';

export function useNavItems() {
  const { user } = useAuth();
  const [reviewsDue, setReviewsDue] = useState(0);

  useEffect(() => {
    if (!user) {
      setReviewsDue(0);
      return;
    }

    // Fetch initial review stats
    fetchReviewStats();

    // Poll for updates every 2 minutes
    const interval = setInterval(fetchReviewStats, 120000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchReviewStats = async () => {
    try {
      const stats = await reviewsService.getStats();
      setReviewsDue(stats.dueToday);
    } catch (err) {
      console.error('Failed to fetch review stats:', err);
    }
  };

  const navItems = useMemo(() => {
    return NAV_ITEMS.map((item) => {
      // Update review badge
      if (item.id === 'review') {
        return { ...item, badge: reviewsDue > 0 ? reviewsDue : undefined };
      }
      // Update notifications badge from user data
      if (item.id === 'notifications') {
        return { ...item, badge: user?.unreadNotifications || undefined };
      }
      return item;
    });
  }, [reviewsDue, user?.unreadNotifications]);

  return navItems;
}
