class UserMailer < ApplicationMailer
  def confirmation_email(user)
    user.confirmation_sent_at = Time.zone.now
    if user.save
      @user = user
      mail(to: @user.email, subject: 'ユーザー登録を完了してください')
    end
  end

  def reconfirmation_email(user)
    user.confirmation_sent_at = Time.zone.now
    if user.save
      @user = user
      mail(to: @user.email, subject: 'ユーザー登録を完了してください')
    end
  end

  def unlock_email(user)
    @user = user
    mail(to: @user.email, subject: 'ロックを解除してください')
  end

  def reset_password_email(user)
    user.reset_password_sent_at = Time.zone.now
    if user.save
      @user = user
      mail(to: @user.email, subject: 'パスワードを再設定してください')
    end
  end
end
