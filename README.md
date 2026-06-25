# Jestem Tu

Aplikacja społecznościowa do udostępniania odwiedzonych miejsc znajomym i nie tylko.

### Wymagania

Przed uruchomieniem projektu upewnij się, że masz zainstalowane:

- Ruby 4.0.5
- Ruby on Rails (Rails 8)
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


