Rails.application.routes.draw do
  scope :api do
    resources :todos
    resources :users do
      member do
        get :confirmation
        get :issue_token
        get :unlock
      end
      collection do
        get :loginform
        post :login, :logout
        post :send_email
        post :reset_password
      end
    end
  end
  
end
