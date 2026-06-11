class CreatePlaces < ActiveRecord::Migration[8.1]
  def change
    create_table :places do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :address
      t.decimal :latitude
      t.decimal :longitude
      t.date :visited_on
      t.text :notes

      t.timestamps
    end

    add_index :places, [ :latitude, :longitude ]
  end
end
