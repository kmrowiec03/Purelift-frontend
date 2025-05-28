import React, { useEffect, useState } from "react";
import { api } from '../api/axios';
import "../style/ArticleList.css";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get("/articles", {
                    withCredentials: true
                });
                setArticles(response.data);
            } catch (err) {
                console.error("Błąd podczas pobierania artykułów:", err.response || err.message);
                setError("Nie udało się pobrać artykułów.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) return <p>Ładowanie artykułów...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="articles-container">
            {articles.length > 0 ? (
                articles.map((article) => (
                    <div className="article-card" key={article.id}>
                        <h3 className="article-title">{article.title}</h3>
                        <p className="article-content">
                            {article.content?.split(" ").slice(0, 10).join(" ") + "..."}
                        </p>
                    </div>
                ))
            ) : (
                <p>Brak opublikowanych artykułów.</p>
            )}
        </div>
    );
};

export default ArticleList;
