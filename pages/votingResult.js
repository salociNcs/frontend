import { useState, useEffect } from 'react';

const poolId = "665e1d5ccc21bafeb9710fe5";

const Voting = () => {
    const [watchData, setWatchData] = useState([]);

    const getWatchDataMatches = async () => {
        const res = await fetch('api/watchDataMatches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poolId }),
        });

        const watchDataRes = await res.json();
        console.log(watchDataRes);
        setWatchData(watchDataRes);

    };



    useEffect(() => {
        getWatchDataMatches();
    }, []);


    if (watchData.length === 0) {
        return <div>Keine Einträge mehr vorhanden</div>;
    }



    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <h1>Titles</h1>
                <ul>
                    {watchData.map(itm => (
                        <li key={itm._id}>{itm.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Voting;

