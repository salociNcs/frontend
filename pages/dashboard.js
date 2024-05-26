import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
    }, []);

    if (!user) {
        return <div>Lädt...</div>;
    }

    return (
        <div>
            <h1>Willkommen, {user.username}</h1>
        </div>
    );
}
