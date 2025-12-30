# Testowanie aplikacji PureLift Frontend

## Przegląd testów jednostkowych

Aplikacja zawiera 10 testów jednostkowych sprawdzających kluczowe komponenty frontendu:

### 1. Login Component (`Login.test.jsx`)
- Sprawdzenie renderowania wszystkich pól formularza
- Testowanie aktualizacji wartości pól podczas wpisywania

### 2. Home Component (`Home.test.jsx`)
- Weryfikacja renderowania tytułu strony głównej
- Sprawdzenie sekcji z korzyściami
- Testowanie sekcji społeczności z przyciskami

### 3. NavBar Component (`NavBar.test.jsx`)
- Sprawdzenie wyświetlania logo aplikacji
- Testowanie przycisków dla niezalogowanych użytkowników
- Weryfikacja menu hamburgera

### 4. Register Component (`Register.test.jsx`)
- Sprawdzenie renderowania pól formularza rejestracji
- Testowanie walidacji haseł
- Weryfikacja linku do logowania

### 5. AuthContext (`AuthContext.test.jsx`)
- Testowanie początkowego stanu uwierzytelnienia
- Sprawdzenie obsługi błędów poza providerem

### 6. Profile Component (`Profile.test.jsx`)
- Testowanie stanu ładowania
- Weryfikacja wyświetlania danych użytkownika
- Sprawdzenie obsługi błędów

### 7. TrainingPlans Component (`TrainingPlans.test.jsx`)
- Testowanie stanu ładowania
- Weryfikacja listy planów treningowych
- Sprawdzenie komunikatu przy braku planów
- Testowanie przycisku dodawania

### 8. CoachList Component (`CoachList.test.jsx`)
- Testowanie stanu ładowania
- Weryfikacja listy trenerów
- Sprawdzenie obsługi błędów
- Testowanie komunikatu dla niezalogowanych użytkowników

### 9. ExerciseProgress Component (`ExerciseProgress.test.jsx`)
- Testowanie ładowania listy ćwiczeń
- Weryfikacja obsługi błędów
- Sprawdzenie zachowania bez użytkownika

### 10. API Helpers (`ApiHelpers.test.jsx`)
- Testowanie funkcji `getCookie`
- Weryfikacja funkcji `parseJwt`
- Sprawdzenie obsługi błędów

## Uruchamianie testów

```bash
# Instalacja zależności
npm install

# Uruchomienie wszystkich testów
npm test

# Uruchomienie testów z obserwowaniem zmian
npm run test:watch

# Wygenerowanie raportu pokrycia kodu
npm run test:coverage
```

## Konfiguracja testów

Testy wykorzystują:
- **Jest** - framework testowy
- **React Testing Library** - narzędzia do testowania komponentów React
- **@testing-library/jest-dom** - dodatkowe matchery
- **jsdom** - środowisko DOM dla Node.js

### Pliki konfiguracyjne:
- `jest.config.js` - główna konfiguracja Jest
- `babel.config.js` - konfiguracja Babel dla transpilacji
- `src/setupTests.js` - konfiguracja globalna dla testów

## Struktura testów

Wszystkie testy znajdują się w katalogu `src/__tests__/` i używają konwencji nazewnictwa `*.test.jsx`.

## Mocki

Testy wykorzystują mocki dla:
- API axios (`../api/axios`)
- Komponentów z bibliotek zewnętrznych (recharts)
- Context API React
- Funkcji przeglądarki (document.cookie, atob)

## Uruchamianie poszczególnych testów

```bash
# Uruchomienie konkretnego pliku testowego
npx jest Login.test.jsx

# Uruchomienie testów dla konkretnego komponentu
npx jest --testNamePattern="Login Component"
```