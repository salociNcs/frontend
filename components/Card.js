// components/Card.js
const Card = ({ title, description }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700">{description}</p>
        </div>
    )
}

export default Card
