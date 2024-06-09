import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import UserModal from '../components/UserModal';

const PoolModal = ({ show, onClose, onDelete, poolId }) => {
    const { user } = useUser();
    const [showUserModal, setShowUserModal] = useState(false);

    const [pool, setPool] = useState({});


    const getPool = async () => {

        const res = await fetch('api/pool', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ poolId }),
        });

        const poolsRes = await res.json();
        setPool(poolsRes);

    };

    useEffect(() => {
        if (show) {
            getPool();
        }
    }, [show]);

    if (!show) {
        return null;
    }

    const handleUserSelect = async (user, poolId) => {

        const res = await fetch('api/addPool2User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, poolId }),
        });
        setShowUserModal(false); // Modal schließen
    };

    const handleClose = async () => {
        onClose(pool);
    };

    const handleDelete = async () => {
        onDelete(pool);
    };

    const handleChange = (event) => {
        const { id, value } = event.target;
        setPool(prevPool => ({
            ...prevPool,
            [id]: value
        }));
    };

    return (
        <ProtectedRoute>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{pool.label || pool._id}</h2>
                    <label>
                        <label>
                            <input
                                type="text"
                                id="label"
                                value={pool.label || ""}
                                onChange={handleChange}
                                placeholder="enter name here"
                            />
                        </label>
                    </label>
                    <br></br>
                    <button onClick={() => setShowUserModal(true)}>Benutzer einladen</button>
                    <br></br>
                    <button onClick={handleDelete}>löschen</button>
                    <br></br>
                    <button onClick={handleClose}>speichern & Schließen</button>
                    <UserModal
                        show={showUserModal}
                        onClose={() => setShowUserModal(false)}
                        onSelect={handleUserSelect}
                        poolId={poolId}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default PoolModal;
