import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const login = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert(data.msg || 'Login fehlgeschlagen');
    }
  };

  const register = () => {
    router.push('/register');
  };

  return (
    <div>
      <h1>Willkommen</h1>
      <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Anmelden</button>
      <button onClick={register}>Registrieren</button>
    </div>
  );
}
