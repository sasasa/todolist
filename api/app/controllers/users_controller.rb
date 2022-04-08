class UsersController < ApplicationController
  protect_from_forgery except: [:login]
  before_action :set_user, only: [:show, :edit, :update, :destroy, :confirmation, :issue_token, :unlock]
  prepend_before_action :authenticate_user_from_token!, except: [:logout, :login, :loginform, :issue_token, :confirmation, :create, :unlock, :send_email, :reset_password]

  # POST
  def reset_password
    u_params = params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
    success, user = User.reset_password(u_params)
    if success
      user.clean_up_reset_column!
      render json: { success: true, user: user }
    else
      render json: { success: false, errors: user.errors }, status: :unprocessable_entity
    end
  end

  # POST
  def send_email
    if User.send_reset_email(params)
      render json: { success: true }
    else
      render json: { success: false }, status: 401
    end
  end

  # GET
  def issue_token
    @user.issue_confirmation_token
  end

  # GET
  def unlock
    if @user.unlock(params)
      redirect_to "#{FRONT_URL}login"
    else
    end
  end

  # GET
  def confirmation
    success, error = @user.confirmation(params)
    if success
      redirect_to "#{FRONT_URL}login"
    else
      @error = error
    end
  end

  # GET
  def loginform
    @user = User.new
  end

  # POST
  def logout
    # session[:user_id] = nil
    
    respond_to do |format|
      format.html { redirect_to users_loginform_path, notice: 'logout' }
      format.json { render json: { success: true } }
    end
  end

  # POST
  def login
    login_params = params.require(:user).permit(:email, :password)
    success, user, errors = User.login(login_params)
    if success
      csrf_token = form_authenticity_token
      # session[:csrf_token] = csrf_token # ???
      # session[:user_id] = user.id
  
      respond_to do |format|
        format.html { redirect_to user, notice: 'login success' }
        format.json { render json: { success: true, csrf: csrf_token, user: user.gwt_token! } }
      end
    else
      render json: errors, status: 401
    end
  end

  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: { errors: @user.errors }, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :email, :password)
    end
end
