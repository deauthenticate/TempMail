import { Mail } from '../types/mail';

export const fetchMails = async (email: string): Promise<Mail[]> => {
  try {
    const response = await fetch(`https://mails-api.cybervilla.xyz/mails/${email}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mail data:', error);
    return [];
  }
};