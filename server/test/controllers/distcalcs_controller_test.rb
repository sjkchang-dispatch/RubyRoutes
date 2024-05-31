require "test_helper"

class DistcalcsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @distcalc = distcalcs(:one)
  end

  test "should accept addresses and return distance as json response" do
    post "/api/distcalc", params: {addresses: {addr1: "11 W 53rd St, New York, NY 10019", addr2: "1900 Anacostia Dr, Washington, DC 20020"}}, as: :json
    assert_response :success

    dist = @response.parsed_body
    assert_equal "227 mi", dist['dist']
  end

=begin
  test "should get index" do
    get distcalcs_url, as: :json
    assert_response :success
  end

  test "should create distcalc" do
    assert_difference("Distcalc.count") do
      post distcalcs_url, params: { distcalc: { body: @distcalc.body, title: @distcalc.title } }, as: :json
    end

    assert_response :created
  end

  test "should show distcalc" do
    get distcalc_url(@distcalc), as: :json
    assert_response :success
  end

  test "should update distcalc" do
    patch distcalc_url(@distcalc), params: { distcalc: { body: @distcalc.body, title: @distcalc.title } }, as: :json
    assert_response :success
  end

  test "should destroy distcalc" do
    assert_difference("Distcalc.count", -1) do
      delete distcalc_url(@distcalc), as: :json
    end

    assert_response :no_content
  end
=end
end
