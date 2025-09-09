import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get('doctor');
  
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return null;
    }
  }
  
  return null;
}