import ProtectedRoute from '../components/ProtectedRoute';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

const UserModal = ({ show, onClose, onSelect, poolId }) => {
    const { user } = useUser();

    const [users, setUsers] = useState([]);

    const getFriends = async () => {
        const res = await fetch('/api/friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
        });

        const friendsRes = await res.json();
        // console.log(friendsRes);
        await setUsers(friendsRes);

    }

    useEffect(() => {
        if (show) {
            getFriends();
        }
    }, [show]);

    if (!show) {
        return null;
    }



    return (
        <ProtectedRoute>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Benutzer auswählen</h2>
                    {users.length > 0 ? (
                        <ul>
                            {users.map(user => (
                                <li key={user._id}>
                                    {user.username}
                                    <button onClick={() => onSelect(user, poolId)}>Auswählen</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>keine user gefunden</p>
                    )}
                    <button onClick={onClose}>Schließen</button>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UserModal;
