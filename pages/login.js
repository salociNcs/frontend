import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resend, setResend] = useState(false);

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
            router.push('/dashboard'); // Annahme, dass es eine geschützte Dashboard-Seite gibt
        } else {
            setError(data.msg || 'Login fehlgeschlagen');
            setResend(data.resend || false);
        }
    };

    const resendVerification = async () => {
        const res = await fetch('/api/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),  // E-Mail im Body der Anfrage senden
        });

        const data = await res.json();
        if (res.ok) {
            alert('Bestätigungs-E-Mail erneut gesendet');
            setResend(false);
        } else {
            alert(data.msg || 'Fehler beim Senden der Bestätigungs-E-Mail');
        }
    };

    return (
        <div>
            <h1>Anmeldeng</h1>
            <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Anmelden</button>
            {error && <p>{error}</p>}
            {resend && (
                <div>
                    <p>Ihre E-Mail-Adresse ist noch nicht verifiziert.</p>
                    <button onClick={resendVerification}>Bestätigungs-E-Mail erneut senden</button>
                </div>
            )}
        </div>
    );
}
