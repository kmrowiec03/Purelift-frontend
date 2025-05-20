import React, { useState } from "react";
import "/src/style/homePage.css";

const Home = () => {
    const [isLoggedIn] = useState(false);


    return (
        <div>

            <header className="header-main-page">
                <div className="rectangle-container">
                    <h1 className="title">Zbuduj swój plan treningowy i śledź postępy</h1>
                    <p className="subtitle">Personalizowane plany, analizy wyników, motywacja i współzawodnictwo</p>
                </div>
            </header>

            <section className="benefits">
                <div className="rectangle-container">
                    <h2>Co oferujemy?</h2>
                    <div className="benefits-container">
                        <div className="benefit-item">
                            <h3>Spersonalizowane plany treningowe</h3>
                            <p>Dopasowane do Twoich celów i poziomu zaawansowania.</p>
                        </div>
                        <div className="benefit-item">
                            <h3>Analiza postępów</h3>
                            <p>Śledź swoje wyniki i poprawiaj swoje maksy!</p>
                        </div>
                        <div className="benefit-item">
                            <h3>Tablica rekordów</h3>
                            <p>Porównuj swoje wyniki.</p>
                        </div>
                    </div>
                </div>
            </section>

            {!isLoggedIn && (
                <section className="community">
                    <div className="rectangle-container">
                        <h2>Dołącz do naszej społeczności</h2>
                        <p>Rywalizuj ze samym sobą</p>
                        <div className="container-for-buttons">
                            <a href="/register" className="btn-primary">Zarejestruj się teraz</a>
                            <a href="/login" className="btn-secondary">Zaloguj się</a>
                        </div>
                    </div>
                </section>
            )}

            <section className="records">
                <div className="rectangle-container">
                    <h2>Top rekordy</h2>
                    <div className="records-list">
                        <>
                            <div className="record"><p><strong>Kacper Mrowiec</strong> - Bench Press: 200kg</p></div>
                            <div className="record"><p><strong>Krzysztof Mazur</strong> - Bench Press: 150kg</p></div>
                            <div className="record"><p><strong>Piotr Nycz</strong> - Bench Press: 100kg</p></div>
                        </>

                    </div>
                    <a href="/records" className="btn-secondary">Zobacz wszystkie rekordy</a>
                </div>
            </section>

            <footer className="footer">
                <div className="rectangle-container">
                    <p>&copy; 2025 Platforma Treningowa. Wszystkie prawa zastrzeżone.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
