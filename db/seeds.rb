# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.find_or_create_by!(
  email_address: "test@example.com"
) do |user|
  user.password = "password"
  user.password_confirmation = "password"
  user.save!
end

puts "Created test user with email: test@example.com"
user = User.find_by(email_address: "test@example.com")
puts "Creating default places..."

# atrakcje  z okolic Bialegostoku
#       t.string :name
# t.string :address
# t.decimal :latitude
# t.decimal :longitude
# t.date :visited_on
# t.text :notes
addresses = [
  {
    name: "Pałac Branickich",
    address: "ul. Kilińskiego 1, 15-089 Białystok, Polska",
    latitude: 53.1325,
    longitude: 23.1689,
    visited_on: Date.new(2023, 5, 10),
    notes: "Piękny pałac barokowy z ogrodem.",
    user: user
  },
  {
    name: "Rynek Kościuszki",
    address: "Rynek Kościuszki, 15-062 Białystok, Polska",
    latitude: 53.1321,
    longitude: 23.1685,
    visited_on: Date.new(2023, 5, 11),
    notes: "Główny plac miasta z fontanną i ratuszem.",
    user: user
  },
  {
    name: "Muzeum w Grajewie",
    address: "ul. Wojska Polskiego 1, 19-200 Grajewo, Polska",
    latitude: 53.6475,
    longitude: 22.4558,
    visited_on: Date.new(2023, 5, 12),
    notes: "Muzeum regionalne z ciekawymi eksponatami.",
    user: user
  },
  {
    name: "Twierdza Boyen",
    address: "ul. Twierdza 1, 11-500 Giżycko, Polska",
    latitude: 54.0361,
    longitude: 21.7647,
    visited_on: Date.new(2023, 5, 13),
    notes: "Historyczna twierdza z XIX wieku.",
    user: user
  }
]

addresses.each do |place_attrs|
  Place.find_or_create_by!(place_attrs)
end

puts "Default places created."
