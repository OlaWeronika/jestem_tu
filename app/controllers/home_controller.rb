class HomeController < ApplicationController
  allow_unauthenticated_access
  def index
    unless authenticated?
      redirect_to start_path
    else
      @all_places = Place.all
      @current_user_place_ids = Current.user.places.pluck(:id)
    end
  end

  def start
    if authenticated?
      redirect_to root_path
    end
  end
end
