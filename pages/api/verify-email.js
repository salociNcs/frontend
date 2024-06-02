export default async function handler(req, res) {
    console.log("code...");
    console.log(req.body);
    const { verificationCode } = req.body;
    console.log(verificationCode);
    const response = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode}),
    });

    const data = await response.json();
    if (response.ok) {
        res.status(200).json(data);
    } else {
        res.status(response.status).json(data);
    }
}
