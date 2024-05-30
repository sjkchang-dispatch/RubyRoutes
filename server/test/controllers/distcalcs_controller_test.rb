require "test_helper"

class DistcalcsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @distcalc = distcalcs(:one)
  end

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
end
