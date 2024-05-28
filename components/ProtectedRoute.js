import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchUser = async () => {
            const res = await fetch('/api/user', {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (res.ok) {
                const user = await res.json();
                if (!user.isVerified) {
                    router.push('/verify-email');
                } else {
                    setLoading(false);
                }
            } else {
                localStorage.removeItem('token');
                router.push('/');
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return <div>Laden...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
