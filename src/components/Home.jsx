import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users")
            .then((response) => {
                setUsers(response.data);
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
        <div >
            {
            users.map((user) => (

                    <p className={"text text_in_window"}>
                        {user.name}
                    </p>
                )
            )
            }

        </div>
    );
};

export default Home;
