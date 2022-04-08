require "securerandom"

class User < ApplicationRecord
  has_secure_password(:password, validations: true)
  has_many :todos, dependent: :destroy

  validates :name, presence: true,  length: { minimum: 3 }

  PASS_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!-\/:-@\[-`{-~])[!-~]{8,100}+\z/i
  validates :password,  presence: true, 
                        length: { minimum: 8 }, 
                        format: { with: PASS_REGEX, message: 'は半角英小文字、大文字、数字、記号が最低でも1文字必要です。' },
                        allow_nil: true,
                        on: :create

  validates :password,  presence: true, 
                        length: { minimum: 8 }, 
                        format: { with: PASS_REGEX, message: 'は半角英小文字、大文字、数字、記号が最低でも1文字必要です。' },
                        allow_nil: true,
                        if: :reset?

  VALID_EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
  validates :email, { 
                      presence: true, 
                      format: { with: VALID_EMAIL_REGEX, message: 'はメールの形式ではありません' },
                      uniqueness: { case_sensitive: false },
                    }

  before_create :ensure_token
  after_create :send_confirmation_email
  before_save { self.email = email.downcase }

  def unlock(params)
    self.unlock_token == params[:unlock_token]
    self.locked_at = nil
    save
  end

  def confirmation(params)
    if self.is_confirmed
      return true, nil
    elsif self.confirmation_sent_at < 30.minutes.ago
      return false, "期限切れです。"
    elsif self.confirmation_token != params[:confirmation_token]
      return false, "不正なトークンが指定されました。"
    else
      self.is_confirmed = true
      return save, nil
    end
  end

  def issue_confirmation_token
    self.confirmation_token = generate_token(:confirmation_token)
    if save
      send_reconfirmation_email
    end
  end

  def increment_failed_attempts
    increment!(:failed_attempts)
    if failed_attempts >= 5
      self.locked_at = DateTime.current.in_time_zone
      self.failed_attempts = 0
      self.unlock_token = generate_token(:unlock_token)
      save
      send_unlock_email
    end
  end

  def send_reset_password
    self.reset_password_token = generate_token(:reset_password_token)
    reset_password_email if save
  end

  def clean_up_reset_column!
    reset_password_token = nil
    reset_password_sent_at = nil
    save!
  end

  def gwt_token!
    payload = { token: authentication_token }
    hmac_secret = Rails.application.credentials.secret_key_base
    # payloadを、hmac_secret(秘密鍵)でHS256アルゴリズムで署名する
    token = JWT.encode(payload, hmac_secret, 'HS256', { typ: 'JWT' })
    {
      id: self.id,
      name: self.name,
      email: self.email,
      authentication_token: token,
    }
  end

  private
  def send_reconfirmation_email
    UserMailer.reconfirmation_email(self).deliver_later
  end

  def send_confirmation_email
    UserMailer.confirmation_email(self).deliver_later
  end

  def send_unlock_email
    UserMailer.unlock_email(self).deliver_later
  end

  def reset_password_email
    UserMailer.reset_password_email(self).deliver_later
  end

  def reset?
    reset_password_token && reset_password_sent_at
  end


  def ensure_token
    if authentication_token.blank? || confirmation_token.blank?
      self.authentication_token = generate_token(:authentication_token)
      self.confirmation_token = generate_token(:confirmation_token)
    end
  end

  def generate_token(key)
    loop do
      token = SecureRandom.uuid
      break token unless User.where(key => token).first
    end
  end

  def self.reset_password(params)
    token = params[:reset_password_token].presence
    user = token && find_by(reset_password_token: token)
    if user && user.reset_password_sent_at > 30.minutes.ago
      if params[:password].blank?
        user.errors.add(:password, 'を入力してください') 
        return false, user
      else
        user.password = params[:password]
        user.password_confirmation = params[:password_confirmation]
        return user.save, user
      end
    else
      user = new
      user.errors.add(:password, 'は制限時間が過ぎています。再度メールを送信してください')
      return false, user
    end
  end

  def self.send_reset_email(params)
    user_email = params[:user][:email].presence
    user = user_email && find_by(email: user_email)
    if user
      user.send_reset_password
      true
    else
      false
    end
  end

  def self.auth_gwt_token(token)
    hmac_secret = Rails.application.credentials.secret_key_base
    decoded_token = JWT.decode(token, hmac_secret, true, { algorithm: 'HS256' })
    self.find_by(authentication_token: decoded_token[0]["token"])
  rescue JWT::VerificationError
    nil
  end

  def self.authenticate_user_from_token(params, token)
    user_email = params[:user_email].presence
    user = user_email && find_by(email: user_email)
    if user && user.locked_at && user.locked_at > 30.minutes.ago
      # アカウントロックされている
      return false, nil, errors: ['acount locked']
    elsif user && (user == self.auth_gwt_token(token))
      return true, user, nil
    else
      user&.increment_failed_attempts
      return false, nil, errors: ['invalid token or email']
    end
  end

  def self.login(params)
    user = find_by(email: params[:email])

    if user.nil?
      # メールアドレスで User が特定出来なかった
      return false, nil, errors: ['メールアドレスまたはパスワードが間違っています']
    elsif user.locked_at && user.locked_at > 30.minutes.ago
      # アカウントロックされている
      return false, nil, errors: ['アカウントがロックされています。メールを確認ください']
    elsif !user.authenticate(params[:password])
      # パスワードが合わない
      user.increment_failed_attempts
      return  false, nil, errors: ['メールアドレスまたはパスワードが間違っています']
    elsif !user.is_confirmed
      return false, nil, errors: ['メールを確認してユーザー登録を完了してください']
    else
      return true, user, nil
    end
  end
end
