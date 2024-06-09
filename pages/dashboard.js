import ProtectedRoute from '../components/ProtectedRoute';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

import PoolModal from '../components/PoolModal';
import { useRouter } from 'next/router';
import DropdownPoolsMenu from '../components/DropDownPoolsMenu';

const Dashboard = () => {
    const router = useRouter();

    const { user } = useUser();

    const [pools, setPools] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);

    const [voteWatchData, setVoteWatchData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [votingStarted, setVotingStarted] = useState(false);

    const [watchDataIsLoading, setWatchDataIsLoading] = useState(true);

    const [watchData, setWatchData] = useState([]);


    const [showPoolModal, setShowPoolModal] = useState(false);



    // const handlePoolEditSelect = async (user, pool) => {
    //     console.log('Selected user:', user);
    //     console.log('Selected pool:', pool);

    //     // const res = await fetch('api/addPool2User', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Content-Type': 'application/json',
    //     //     },
    //     //     body: JSON.stringify({ user, pool }),
    //     // });

    //     // const poolsRes = await res.json();
    //     setShowPoolModal(false); // Modal schließen
    // };


    const getPools = async () => {

        const res = await fetch('api/pools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id }),
        });

        const poolsRes = await res.json();
        // console.log(poolsRes);
        setPools(poolsRes);

    };

    const getWatchDataMatches = async () => {
        if (!selectedPool) {
            return;
        }
        const res = await fetch('api/watchDataMatches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poolId: selectedPool }),
        });

        const watchDataRes = await res.json();
        setWatchData(watchDataRes);

    };

    useEffect(() => {
        getWatchDataMatches();
    }, [selectedPool]);


    useEffect(() => {
        getPools();
    }, [user]);

    // useEffect(() => {
    //     getWatchDataForVoting();
    // }, [user, selectedPool]);


    useEffect(() => {
        const savedPool = localStorage.getItem('selectedPool');
        if (savedPool) {
            if (savedPool != selectedPool) {
                setSelectedPool(savedPool);
            }
        }
    }, []);


    const handlePoolSelect = async (poolId) => {
        if (localStorage.getItem('selectedPool') != poolId) {
            setSelectedPool(poolId);
            localStorage.setItem('selectedPool', poolId);
        }
        setVoteWatchData([]);
        setCurrentIndex(0);
        setVotingStarted(false);
    };

    const handlePoolEdit = async () => {
        // console.log("edit pool:" + selectedPool);
        setShowPoolModal(true);
    };


    const handlePoolDelete = async (pool) => {
        // console.log("delete pool:");
        // console.log(pool);


        const res = await fetch('api/deletePool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pool }),
        });

        const poolDeleteRes = await res.json();
        // console.log(poolDeleteRes);
        const updatedPools = pools.filter(pool => pool._id != poolDeleteRes._id)
        // console.log(updatedPools);
        setPools(updatedPools);
        localStorage.removeItem('selectedPool');
        setSelectedPool(null);
        setVoteWatchData([]);
        setCurrentIndex(0);
        setVotingStarted(false);
        setShowPoolModal(false);
        await getPools();

    };

    const handlePoolClose = async (pool) => {
        // console.log("close pool:");
        // console.log(pool);


        const res = await fetch('api/updatePool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pool }),
        });

        const poolRes = await res.json();
        // console.log(poolRes);
        const updatedPools = pools.map(pool => {
            if (pool._id == poolRes._id) {
                return poolRes;
            }
            return pool;
        })
        // console.log(updatedPools);
        setPools(updatedPools);
        setShowPoolModal(false);
    };


    //Voting Begin
    const getWatchDataForVoting = async () => {
        if (!selectedPool || !user) {
            return;
        }
        const res = await fetch('api/watchDataForVoting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id, poolId: selectedPool }),
        });

        const watchDataRes = await res.json();

        const updatedWatchDataItm = await fetchWatchData(watchDataRes[currentIndex]);
        watchDataRes[currentIndex] = updatedWatchDataItm;
        setVoteWatchData(watchDataRes);
    };

    const updateWatchDataForVoting = async (watchDataItm, index) => {
        // console.log(watchDataItm);
        if (!watchDataItm) {
            return;
        }

        const updatedWatchDataItm = await fetchWatchData(watchDataItm);
        const updatedVoteWatchData = voteWatchData;
        updatedVoteWatchData[index] = updatedWatchDataItm;
        setVoteWatchData(updatedVoteWatchData);
    };

    const fetchWatchData = async (watchDataItm) => {
        // console.log("fetch data");

        const res = await fetch('api/watchDataTitle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ watchDataId: watchDataItm._id }),
        });

        const watchDataRes = await res.json();

        const updatedWatchDataItm = Object.assign({}, watchDataItm, watchDataRes)
        // console.log(updatedWatchDataItm)
        return updatedWatchDataItm;
    }

    const updateVote = async (voteId, liked) => {
        const res = await fetch('api/watchDataVote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id, poolId: selectedPool, voteId, liked }),
        });

        const updatedRes = await res.json();
        // console.log("updatedRes");

    };

    const handleStartVoting = async () => {
        // console.log('No Like:', watchData[currentIndex]);
        // console.log("start voting");
        setWatchDataIsLoading(true);
        setVotingStarted(true);
        await getWatchDataForVoting();
        setWatchDataIsLoading(false);
    };

    const handleLike = async () => {
        // console.log('Like:', watchData[currentIndex]);
        await updateVote(voteWatchData[currentIndex].voteId, true);
        await showNextEntry();
    };

    const handleNoLike = async () => {
        // console.log('No Like:', watchData[currentIndex]);
        await updateVote(voteWatchData[currentIndex].voteId, false);
        await showNextEntry();
    };

    // useEffect(() => {
    //     console.log('Count updated:', currentIndex); // Wird 1 sein nach dem Update

    // }, [currentIndex]);

    // useEffect(() => {
    //     console.log('selectewdPool :', selectedPool); // Wird 1 sein nach dem Update
    //     getPools();
    // }, [selectedPool]);

    const showNextEntry = async () => {
        setWatchDataIsLoading(true);
        if (currentIndex < voteWatchData.length - 1) {
            // console.log("hit#");
            // console.log(currentIndex);
            const newIndex = currentIndex + 1;
            // console.log(newIndex);
            // await getWatchDataForVoting();

            await updateWatchDataForVoting(voteWatchData[newIndex], newIndex);
            setCurrentIndex(newIndex);
            // console.log(currentIndex);
            // console.log("obj" + JSON.stringify(voteWatchData[currentIndex + 1]));
        } else {
            setVoteWatchData([]);
        }
        setWatchDataIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    }


    // const handlePoolsDropdownChange = (selectedId) => {
    //     console.log('Selected item ID:', selectedId);
    //     // Hier kannst du weitere Logik einfügen, die bei Änderung des Dropdown-Wertes ausgeführt werden soll
    // };

    const currentEntry = voteWatchData[currentIndex];


    const handlePoolAdd = async () => {
        const res = await fetch('api/addPool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user._id }),
        });

        const newPoolRes = await res.json();
        // console.log(newPoolRes);
        if (localStorage.getItem('selectedPool') != newPoolRes._id) {
            setSelectedPool(newPoolRes._id);
            localStorage.setItem('selectedPool', newPoolRes._id);
        }
        setVoteWatchData([]);
        setCurrentIndex(0);
        setVotingStarted(false);
        await getPools();
    }
    // useEffect(() => {
    //     console.log('selectedPool:', selectedPool); // Wird 1 sein nach dem Update
    // }, [selectedPool]);

    // useEffect(() => {
    //     console.log('pools:', pools); // Wird 1 sein nach dem Update
    // }, [pools]);

    // useEffect(() => {
    //     console.log('currentEntry:', currentEntry); // Wird 1 sein nach dem Update
    // }, [currentEntry]);
    //Voting End

    return (
        <ProtectedRoute>
            <div style={{ textAlign: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    {user ? (
                        <div>
                            <p>Willkommen, {user.username}!</p>
                            <button onClick={() => handleLogout()}>Logout</button>
                        </div>
                    ) : <p>Benutzer nicht gefunden.</p>}

                </div>
                <div>
                    <h1>Pools</h1>
                    <div>
                        {pools.length > 0 ? (
                            <div>
                                <DropdownPoolsMenu
                                    pools={pools}
                                    defaultSelectedId={selectedPool}
                                    onChange={handlePoolSelect}
                                />
                                {
                                    selectedPool ? (
                                        <button onClick={handlePoolEdit}>Bearbeiten</button>
                                    ) : (
                                        <div></div>
                                    )
                                }
                                <PoolModal
                                    show={showPoolModal}
                                    // onClose={() => setShowPoolModal(false)}
                                    onClose={handlePoolClose}
                                    onDelete={handlePoolDelete}
                                    // onSelect={handlePoolEditSelect}
                                    poolId={selectedPool}
                                ></PoolModal>
                            </div>
                        ) : (
                            <p>pool werden geladen...</p>
                        )
                        }
                        <button onClick={() => handlePoolAdd()}>Neuen Pool erstellen</button>
                    </div>
                </div>

                <div>
                    <h1>Voting Data</h1>
                    {
                        votingStarted ? (
                            !watchDataIsLoading ? (
                                voteWatchData.length > 0 ? (
                                    <div>
                                        <h1>{currentEntry.title || currentEntry._id}</h1>
                                        <img src={currentEntry.poster} alt={currentEntry.title} style={{ width: '300px', height: 'auto' }} />
                                        <div>
                                            <button onClick={handleLike}>Like</button>
                                            <button onClick={handleNoLike}>No Like</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>keine offenen Votes</p>
                                )
                            ) : (
                                <p>daten werden geladen...</p>
                            )
                        ) : (
                            <div>
                                <button onClick={handleStartVoting}>Start matching</button>
                            </div>
                        )
                    }
                </div>

                <div>
                    <h1>Matches</h1>
                    {watchData.length > 0 ? (
                        <ul>
                            {watchData.map(itm => (
                                <li key={itm._id}>{itm.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>keine matches gefunden</p>
                    )}
                </div>


            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
