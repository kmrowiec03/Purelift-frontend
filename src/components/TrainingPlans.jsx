import React, { useEffect, useState } from "react";
import { api } from '../api/axios';
import { Link, useNavigate } from "react-router-dom";

const TrainingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/training', {
            withCredentials: true
        })
            .then(response => {
                setPlans(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd podczas pobierania planów:", error.response || error.message || error);
                setLoading(false);
            });
    }, []);

    // Funkcja do losowego wyboru zdjęcia
    const getRandomImage = () => {
        const images = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'];
        const randomIndex = Math.floor(Math.random() * images.length);
        return `/src/assets/${images[randomIndex]}`;
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className="Container_for_many_window">
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <Link to={`${plan.id}`} className="Container_for_window link" key={plan.id}>
                            <img src={getRandomImage()} alt={`Image for ${plan.title}`} loading="lazy" />
                            <p className="text title_in_window">{plan.title}</p>
                        </Link>
                    ))
                ) : (
                    <p>No training plans found.</p>
                )}
            </div>
            
            {/* Menu do tworzenia planów */}
            <div className="plan-creation-menu">
                <button 
                    className="button_to_generate_plan"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    +
                </button>
                {showMenu && (
                    <div className="plan-menu-dropdown">
                        <button 
                            className="menu-option"
                            onClick={() => {
                                navigate("/generate-plan");
                                setShowMenu(false);
                            }}
                        >
                            Wygeneruj plan
                        </button>
                        <button 
                            className="menu-option"
                            onClick={() => {
                                navigate("/create-plan");
                                setShowMenu(false);
                            }}
                        >
                            Stwórz plan
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default TrainingPlans;
