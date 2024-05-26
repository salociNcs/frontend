import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/');
                return;
            }

            const res = await fetch('/api/user', {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                localStorage.removeItem('token');
                router.push('/');
            }
        };

        fetchUser();
    }, [router]);

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    if (!user) {
        return <div>Lädt...</div>;
    }

    return (
        <ProtectedRoute>
            <div>
                <h1>Willkommen, {user.username}</h1>
                <button onClick={logout}>Abmelden</button>
            </div>
        </ProtectedRoute>
    );
}
