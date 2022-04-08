class ApplicationController < ActionController::Base
  include ActionController::HttpAuthentication::Token::ControllerMethods
  
  def authenticate_user_from_token!
    #return true if session[:user_id] && User.find(session[:user_id])

    authenticate_or_request_with_http_token do |token, options|
      success, user, errors = User.authenticate_user_from_token(params, token)
      if success
        #session[:user_id] = user.id
        @user = user
        true
      else
        render json: errors, status: 401
      end
    end
  end
end
