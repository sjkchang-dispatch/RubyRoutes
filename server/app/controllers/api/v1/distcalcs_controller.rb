require 'json'
require 'dotenv'

class Api::V1::DistcalcsController < ApplicationController
  before_action :set_distcalc, only: %i[ show update destroy ]

  def calculate_dist
    #calculate distance between two locations using google map api

    #TODO: validate using validate_value?
    #handle POST requests taking 2 addresses
    addresses = params.require(:addresses).permit(:addr1, :addr2)

    address1 = params[:addresses][:addr1]
    address2 = params[:addresses][:addr2]

    response = HTTParty.get("https://maps.googleapis.com/maps/api/distancematrix/json?destinations=#{address1}&origins=#{address2}&units=imperial&key=#{ENV['GOOGLE_API_KEY']}", format: :plain)

    obj = JSON.parse(response)

    begin
      distance = obj['rows'][0]['elements'][0]['distance']['text']
    rescue
      distance = "error: could not calculate distance (invalid address?)"
    end

    #return result as json
    render json: {dist: distance}
  end

  # GET /distcalcs
  def index
    @distcalcs = Distcalc.all

    render json: @distcalcs
  end

  # GET /distcalcs/1
  def show
    render json: @distcalc
  end

  # POST /distcalcs
  def create
    @distcalc = Distcalc.new(distcalc_params)

    if @distcalc.save
      render json: @distcalc, status: :created, location: @distcalc
    else
      render json: @distcalc.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /distcalcs/1
  def update
    if @distcalc.update(distcalc_params)
      render json: @distcalc
    else
      render json: @distcalc.errors, status: :unprocessable_entity
    end
  end

  # DELETE /distcalcs/1
  def destroy
    @distcalc.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_distcalc
      @distcalc = Distcalc.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def distcalc_params
      params.require(:distcalc).permit(:title, :body)
    end

end
