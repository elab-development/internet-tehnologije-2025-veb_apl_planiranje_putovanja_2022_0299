# Planiranje putovanja

Web aplikacija za **planiranje putovanja**, istraživanje destinacija , razvijena u **Laravelu 11** + **React** uz **MariaDB** bazu podataka i **Docker** infrastrukturu.

---

## Tech Stack
- **Laravel** `11` (PHP 8.2)
- **React** `18`
- **MariaDB** (MySQL kompatibilna)
- **Docker** + **Docker Compose**
- **TailwindCSS**
- **L5-Swagger** (API dokumentacija)
- **TripAdvisor API** (RapidAPI)

---

## Struktura projekta
├── backend/            # Laravel API (Models, Controllers, Migrations)
├── frontend/           # React aplikacija (Components, Pages, Hooks)
├── docker/             # Docker konfiguracioni fajlovi
├── docker-compose.yml  # Definicija servisa (app, db, server)
├── .env                # Environment varijable
└── README.md           # Dokumentacija projekta

> `vendor/`, `node_modules/` i `.env` fajlovi su generisani i ne treba da se commit-uju.

---

## Preduslovi (Prerequisites)
- **Docker** & **Docker Compose** (instaliran i pokrenut)
- **npm**

---

## Podešavanje okruženja (.env)

Kreiraj `.env` fajl u `backend/` direktorijumu projekta.

### Minimalno (Laravel + MariaDB)
```bash
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=planiranje_putovanja
DB_USERNAME=root
DB_PASSWORD=root

##Pokretanje aplikacije
# Podizanje svih kontejnera u pozadini
docker-compose up -d --build

# Instalacija PHP zavisnosti unutar kontejnera
docker-compose exec backend composer install

# Generisanje aplikacionog ključa
docker-compose exec backend php artisan key:generate

# Pokretanje migracija (kreiranje tabela u bazi)
docker-compose exec backend php artisan migrate


docker-compose exec backend php artisan tinker
# Unutar tinkera nalepite sledeće:
$c = new \App\Http\Controllers\ImportController();
$c->importFromTripAdvisor(new \Illuminate\Http\Request(['query' => 'Paris']));

Aplikacija radi na: http://localhost:3000
Swagger dokumentacija: http://localhost:8000/api/documentation