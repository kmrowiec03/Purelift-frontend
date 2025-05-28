import React, { useEffect, useState } from "react";
import { api } from '../api/axios';
import { Link } from "react-router-dom";

const TrainingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="Container_for_many_window">
            {plans.length > 0 ? (
                plans.map(plan => (
                    <Link to={`${plan.id}`} className="Container_for_window link" key={plan.id}>
                        <img src="/src/assets/tlo.jpg" alt={`Image for ${plan.title}`} loading="lazy" />
                        <p className="text title_in_window">{plan.title}</p>
                    </Link>
                ))
            ) : (
                <p>No training plans found.</p>
            )}
        </div>
    );
};

export default TrainingPlans;
