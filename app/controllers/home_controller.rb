class HomeController < ApplicationController
  allow_unauthenticated_access
  def index
    unless authenticated?
      redirect_to start_path
    end
  end

  def start
    if authenticated?
      redirect_to root_path
    end
  end
end
