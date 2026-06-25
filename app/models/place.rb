class Place < ApplicationRecord
  belongs_to :user

  before_save :geocode_address
  validates :name, presence: true
  validates :latitude, :longitude, numericality: true
  validates :visited_on, presence: true

  def user_email
    user.email_address
  end

  private

  def geocode_address
    # Ustalanie adresu na podstawie współrzędnych geograficznych (latitude, longitude) przy użyciu geokodowania odwrotnego.
    geocoded = Geocoder.search([ latitude, longitude ]).first
    if geocoded
      self.address = geocoded.address
    end
  end
end
