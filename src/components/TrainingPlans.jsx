import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Pobieranie danych z API
        axios.get("http://localhost:8080/api/training")
            .then((response) => {
                setPlans(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Błąd podczas pobierania planów:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="Container_for_many_window">
            {plans.length > 0 ? (
                plans.map((plan) => (
                    <a
                        href={`trainingPlans/${plan.id}`}
                        className="Container_for_window link"
                        key={plan.id}
                    >
                        <img
                            src="public/images/tlo.jpg"
                            alt={`Image for ${plan.title}`}
                            loading="lazy"
                        />
                        <p className=" text title_in_window">{plan.title}</p>
                        <p className="text text_in_window">
                            {
                                plan.description
                                    ? plan.description.split(" ").slice(0, 3).join(" ") + "..."
                                    : "No description available"
                            }
                        </p>
                    </a>
                ))
            ) : (
                <p>No training plans found.</p>
            )}
        </div>
    );
};

export default TrainingPlans;
