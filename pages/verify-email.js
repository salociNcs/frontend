import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

// Für serverseitiges Rendern
export async function getServerSideProps(context) {
    const { code } = context.query;

    return {
        props: {
            code: code || null,
        },
    };
}

export default function VerifyEmail({ code: serverCode }) {
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState(serverCode || '');
    const hasVerified = useRef(false);

    useEffect(() => {
        console.log('Komponente wird gerendert');
        console.log('Server Code:', serverCode);
        console.log('Client Code:', router.query.code);
    }, []);

    useEffect(() => {
        if (router.isReady) {
            const { code: clientCode } = router.query;
            if (clientCode && clientCode !== verificationCode) {
                setVerificationCode(clientCode);
                console.log('Verification Code gesetzt:', clientCode);
            }
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (verificationCode  && !hasVerified.current) {
            console.log('Verification Code im useEffect:', verificationCode);
            hasVerified.current = true;
            verifyEmail(verificationCode);
        }
    }, [verificationCode]);

    // const verifyEmail = async (verificationCode) => {
    //     try {
    //         const res = await fetch(`/api/auth/verify-email?code=${verificationCode}`);
    //         if (res.ok) {
    //             router.push('/login');
    //         } else {
    //             console.error('Verifizierung fehlgeschlagen');
    //         }
    //     } catch (error) {
    //         console.error('Fehler bei der Verifizierung:', error);
    //     }
    // };

    const verifyEmail = async (verificationCode) => {
        const res = await fetch('/api/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({verificationCode}),
        });

        const data = await res.json();
        if (res.ok) {
            // localStorage.setItem('token', data.token);
            // router.push('/dashboard'); // Annahme, dass es eine geschützte Dashboard-Seite gibt
        } else {
            // setError(data.msg || 'Login fehlgeschlagen');
            // setResend(data.resend || false);
        }
    };

    return (
        <div>
            <h1>Überprüfen Sie Ihre E-Mail</h1>
            <p>Wir haben Ihnen eine Bestätigungs-E-Mail geschickt. Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink.</p>
        </div>
    );
}
