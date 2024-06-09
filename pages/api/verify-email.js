export default async function handler(req, res) {
    const { verificationCode } = req.body;
    const response = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
    });

    const data = await response.json();
    if (response.ok) {
        res.status(200).json(data);
    } else {
        res.status(response.status).json(data);
    }
}
