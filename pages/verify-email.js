import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerifyEmail() {
    const router = useRouter();
    const { code } = router.query;

    useEffect(() => {
        if (code) {
            verifyEmail(code);
        }
    }, [code]);

    const verifyEmail = async (verificationCode) => {
        const res = await fetch(`/api/auth/verify-email?code=${verificationCode}`);
        if (res.ok) {
            router.push('/login');
        } else {
            console.error('Verifizierung fehlgeschlagen');
        }
    };

    return (
        <div>
            <h1>Überprüfen Sie Ihre E-Mail</h1>
            <p>Wir haben Ihnen eine Bestätigungs-E-Mail geschickt. Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink.</p>
        </div>
    );
}
