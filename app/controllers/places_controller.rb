class PlacesController < ApplicationController
  def index
    @places = Current.user.places
  end

  def new
    @place = Current.user.places.build
  end

  def create
    @place = Current.user.places.build(place_params)
    if @place.save
      redirect_to root_path, notice: "Miejsce zostało dodane!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @place = Place.find(params[:id])
  end

  private

  def place_params
    params.require(:place).permit(:name, :address, :latitude, :longitude, :visited_on, :notes)
  end
end
