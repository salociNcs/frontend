export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ msg: 'Method not allowed' });
        return;
    }

    const { poolId, user } = req.body;
    const response = await fetch('http://localhost:4000/api/watchFinder/addPool2User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poolId, user }),
    });

    const data = await response.json();
    if (response.ok) {
        res.status(200).json(data);
    } else {
        res.status(response.status).json(data);
    }
}