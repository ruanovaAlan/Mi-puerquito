import { useState, useEffect } from 'react';
import { getClosestReminderByUser } from '../utils/database';

const useFetchClosestReminder = (userId) => {
  const [closestReminder, setClosestReminder] = useState(null);

  useEffect(() => {
    const fetchClosestReminder = async () => {
      try {
        const result = await getClosestReminderByUser(userId);
        setClosestReminder(result[0] || null); // Si no hay resultados, setea `null`
      } catch (error) {
        console.error('Error fetching closest reminder:', error);
      }
    };

    if (userId) {
      fetchClosestReminder();
    }
  }, [userId]);

  return closestReminder;
};

export default useFetchClosestReminder;
