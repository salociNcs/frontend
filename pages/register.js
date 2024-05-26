import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = async () => {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } else {
            alert(data.msg || 'Registrierung fehlgeschlagen');
        }
    };

    return (
        <div>
            <h1>Registrieren</h1>
            <input type="text" placeholder="Benutzername" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={register}>Registrieren</button>
        </div>
    );
}
