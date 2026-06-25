# Jestem Tu

Aplikacja społecznościowa do udostępniania odwiedzonych miejsc znajomym i nie tylko.
Aplikacja stworzona jako projekt na zaliczenie przedmiotu Narzędzie Procesu Tworzenia Oprogramowania.

### Wymagania

Przed uruchomieniem projektu upewnij się, że masz zainstalowane:

- Ruby 4.0.5
- Ruby on Rails (Rails 8) - https://guides.rubyonrails.org/install_ruby_on_rails.html
- SQLite

## 1. Instalacja projektu

1. Klon repozytorium

```bash
git clone git@github.com:OlaWeronika/jestem_tu.git
cd jestem_tu
```

2. Instalacja ruby:
> Język ruby można zainstalować na kilka sposobów, poniżej wypisano kilka z nich (mogą pojawić się błędy w instalacji, więc warto googlować):

- Przez RVM: https://rvm.io/ (instrukcja instalacji znajduje się w linku)
- Przez ASDF: https://asdf-vm.com/guide/getting-started.html
- Przez mise: https://mise.jdx.dev/
- I każdy inny sposób znaleziony w internecie.

3. Instalacja zależności
```bash
bundle install
```

4. Utworzenie bazy danych i uruchomienie potrzebnych migracji:

> Seedy załadują podstawowe dane do przykładowego uruchomienia aplikacji.

```bash
rails db:create
rails db:migrate
rails db:seed
```

5. Włączenie serwera deweloperskiego:
```bash
rails s
```

## Struktura projektu i zawartość repozytorium

Projekt opiera się na standardowej strukturze katalogów frameworka MVC Ruby on Rails 8. Poniżej przedstawiono najważniejsze elementy aplikacji:

```text
jestem_tu/
├── app/						# Główny katalog aplikacji
│   ├── controllers/			# Kontrolery obsługujące logikę biznesową (np. sesje, miejsca)
│   ├── javascript/				# Skrypty JS, w tym kontrolery Stimulus.js do obsługi mapy Leaflet - więcej na https://stimulus.hotwired.dev/
│   ├── models/					# Modele ActiveRecord odzwierciedlające tabele bazy danych
│   └── views/					# Widoki aplikacji 
├── config/						# Pliki konfiguracyjne aplikacji
│   ├── routes.rb				# Definicje ścieżek URL
│   └── database.yml			# Konfiguracja połączenia z bazą danych
├── db/							# Pliki powiązane z bazą danych
│   ├── migrate/				# Migracje tworzące strukturę tabel w bazie
│   └── seeds.rb				# Skrypt z danymi testowymi do wstępnego zasilenia bazy
├── public/						# Pliki statyczne dostępne publicznie
├── Gemfile						# Lista zewnętrznych bibliotek (gemów) użytych w projekcie
└── bin/dev						# Skrypt deweloperski uruchamiający jednocześnie serwer i kompilację CSS/JS
```


### Warstwa modeli (app/models) - M

Modele w aplikacji odpowiadają za mapowanie obiektowo-relacyjne (ORM) z wykorzystaniem wzorca Active Record. Implementują one logikę biznesową, reguły walidacji danych oraz zarządzają relacjami między poszczególnymi tabelami w bazie. 

W skład warstwy danych wchodzą następujące klasy:

* **ApplicationRecord (`application_record.rb`)**
  Stanowi fundament dla wszystkich pozostałych modeli powiązanych z tabelami w bazie danych, zgodnie z konwencją frameworka Rails.

* **Current (`current.rb`)**
  Przechowuje globalny stan aplikacji – w tym przypadku obiekt aktywnej sesji (`session`). Dodatkowo deleguje zapytanie o użytkownika (`user`) do obiektu sesji, co pozwala na wygodny i bezpieczny dostęp do danych zalogowanego użytkownika z każdego miejsca w systemie (np. z modeli, kontrolerów i widoków) w obrębie czasu requestu.

* **User (`user.rb`)**
  Główna encja reprezentująca użytkownika systemu. Wykorzystuje wbudowany mechanizm `has_secure_password` (oparty na algorytmie bcrypt) do bezpiecznego szyfrowania poświadczeń.

* **Session (`session.rb`)**
  Reprezentuje aktywną sesję użytkownika (np. na konkretnym urządzeniu lub w przeglądarce) (nowoczesny mechanizm uwierzytelniania wdrożony w Rails 8).

### Warstwa widoków (app/views) - V

Warstwa widoków (View) w architekturze MVC (Model-View-Controller) odpowiada za interfejs użytkownika (UI) oraz warstwę prezentacyjną aplikacji. Jej głównym zadaniem jest transformacja danych przetworzonych i dostarczonych przez kontrolery na ostateczny format wizualny, z którym wchodzi w interakcję użytkownik.

W projekcie warstwa widoków opiera się na szablonach HTML rozszerzonych o składnię języka Ruby (pliki `.html.erb`), co pozwala na dynamiczne renderowanie zawartości.

### Warstwa kontrolerów (app/controllers) - C

Architektura logiki biznesowej opiera się na wydzielonych kontrolerach dziedziczących po głównym kontrolerze aplikacji. Kod wykorzystuje natywne dla najnowszych wersji frameworka Rails mechanizmy uwierzytelniania, filtrowania dostępu oraz zabezpieczeń (m.in. rate limiting). 

W projekcie zaimplementowano najważniejsze klasy i moduły:

* **Moduł Authentication (`concerns/authentication.rb`)**
  Dostarcza kompleksową logikę zarządzania sesjami użytkowników. Domyślny plik po wygenerowaniu komendą `rails g authentication` 

* **HomeController (`home_controller.rb`)**
  Kontroler zarządzający głównym interfejsem aplikacji (mapa).

* **PasswordsController (`passwords_controller.rb`)**
  Odpowiada za bezpieczny proces odzyskiwania dostępu do konta.

* **PlacesController (`places_controller.rb`)**
  Zarządza modelem lokalizacji (`Place`). Realizuje operacje typu CRUD (tworzenie, wyświetlanie pojedynczego miejsca oraz listowanie). Akcje są ściśle powiązane z zalogowanym użytkownikiem (`Current.user.places`), co gwarantuje poprawną izolację danych i przypisanie nowych pinezek do właściwego autora.
