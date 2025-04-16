import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/ArticleList.css";

const ArticleList = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/articles")
            .then(res => {
                setArticles(res.data);
            })
            .catch(err => {
                console.error("Błąd podczas pobierania artykułów:", err);
            });
    }, []);

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
