import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
    return (
        <ProtectedRoute>
            <div>
                <h1>Dashboard</h1>
                <p>Willkommen auf Ihrem Dashboard!</p>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
