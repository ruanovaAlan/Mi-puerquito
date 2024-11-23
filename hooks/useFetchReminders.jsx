import { useEffect, useContext } from 'react';
import { getRemindersByUser, deleteReminders, getReminders } from '../utils/database';
import { RemindersContext } from '../context/RemindersContext';

export function useFetchReminders(userId, homeCount) {
  const { reminders, setReminders, count, setCount } = useContext(RemindersContext);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        // await deleteReminders();
        const result = await getRemindersByUser(userId);
        setReminders(result);
        // console.log('Reminders:', result);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    fetchReminders();
  }, [userId, count, setReminders, homeCount]);

  return { reminders, setCount };
};
