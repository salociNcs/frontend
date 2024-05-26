export default async function handler(req, res) {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ msg: 'Kein Token, Authentifizierung fehlgeschlagen' });
    }

    const response = await fetch('http://localhost:4000/api/auth/user', {
        headers: {
            'x-auth-token': token,
        },
    });

    const data = await response.json();
    if (response.ok) {
        res.status(200).json(data);
    } else {
        res.status(response.status).json(data);
    }
}
