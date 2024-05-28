import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, [router]);

  const fetchUser = async (token) => {
    const res = await fetch('/api/auth/user', {
      headers: {
        'x-auth-token': token,
      },
    });

    if (res.ok) {
      const user = await res.json();
      if (user.isVerified) {
        router.push('/dashboard');
      } else {
        router.push('/verify-email');
      }
    } else {
      localStorage.removeItem('token');
      router.push('/'); // Redirect to home page if token is invalid
    }
  };

  return (
    <div>
      <h1>Willkommen</h1>
      <button onClick={() => router.push('/login')}>Anmelden</button>
      <button onClick={() => router.push('/register')}>Registrieren</button>
    </div>
  );
}
