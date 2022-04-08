require 'rails_helper'

RSpec.describe "Users Api", type: :request do
  describe "GET /api/users/:id/issue_token" do
    it "confirmation_token が再発行されてメールが送信される" do
      user = FactoryBot.create(:user, :unconfirmed, confirmation_sent_at: (30*60+1).seconds.ago)
      test_confirmation_token = user.confirmation_token
      perform_enqueued_jobs do
        get issue_token_user_path(user)
        expect(response).to have_http_status(200)
        html = response.body
        expect(html).to match "ユーザー登録を再発行しました。"
        expect(user.reload.confirmation_token).to_not eql test_confirmation_token
      end

      mail = ActionMailer::Base.deliveries.last
      aggregate_failures do
        expect(mail.to).to eq [user.email]
        expect(mail.subject).to eq "ユーザー登録を完了してください"
        expect(mail.body.parts[0].body.raw_source).to match "ユーザー登録を再発行しました。"
        expect(mail.body.parts[0].body.raw_source).to match /#{user.name}/
        expect(mail.body.parts[1].body.raw_source).to match "ユーザー登録を再発行しました。"
        expect(mail.body.parts[1].body.raw_source).to match /#{user.name}/
      end
    end
  end

  describe "POST /api/users/reset_password" do
    describe "正しいデータを送信した時" do
      it "パスワードを変更できる" do
        user = FactoryBot.create(:user, :reset_password, reset_password_sent_at: DateTime.current.in_time_zone)
        test_password_digest = user.password_digest
        post reset_password_users_path(format: :json), params: {
          user: {
            password: 'testTe1!',
            password_confirmation: 'testTe1!',
            reset_password_token: user.reset_password_token,
          }
        }
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(user.reload.password_digest).to_not match test_password_digest
      end

    end
    describe "誤ったデータを送信した時" do
      it "パスワードを変更できない" do
        user = FactoryBot.create(:user, :reset_password, reset_password_sent_at: DateTime.current.in_time_zone)
        test_password_digest = user.password_digest
        post reset_password_users_path(format: :json), params: {
          user: {
            password: 't',
            password_confirmation: 'tes',
            reset_password_token: user.reset_password_token,
          }
        }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(json['errors']).to eq({
          "password" => ["は8文字以上で入力してください", "は半角英小文字、大文字、数字、記号が最低でも1文字必要です。"],
          "password_confirmation" => ["とパスワードの入力が一致しません"],
        })
        expect(user.reload.password_digest).to match test_password_digest
      end
    end
    describe "時間切れて送信した時" do
      it "パスワードを変更できない" do
        # 30分よりも前
        user = FactoryBot.create(:user, :reset_password, reset_password_sent_at: (30*60+1).seconds.ago)
        test_password_digest = user.password_digest
        post reset_password_users_path(format: :json), params: {
          user: {
            password: 'testTe1!',
            password_confirmation: 'testTe1!',
            reset_password_token: user.reset_password_token,
          }
        }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(json['errors']).to eq({
          "password" => ['は制限時間が過ぎています。再度メールを送信してください'],
        })
        expect(user.reload.password_digest).to match test_password_digest
      end
    end
  end

  describe "POST /api/users/send_email" do
    it "存在しているユーザのメールアドレスの場合は送信される" do
      user = FactoryBot.create(:user, :confirmed)
      perform_enqueued_jobs do
        # この中の exmaple では perform_later が同期実行される
        post send_email_users_path(format: :json), params: {
          user: {
            email: user.email,
          }
        }
        expect(response).to have_http_status(200)
      end
      mail = ActionMailer::Base.deliveries.last
      aggregate_failures do
        expect(mail.to).to eq [user.email]
        expect(mail.subject).to eq "パスワードを再設定してください"
        expect(mail.body.parts[0].body.raw_source).to match "下のリンクからパスワードを変更してください。"
        expect(mail.body.parts[0].body.raw_source).to match /#{user.name}/
        expect(mail.body.parts[1].body.raw_source).to match "下のリンクからパスワードを変更してください。"
        expect(mail.body.parts[1].body.raw_source).to match /#{user.name}/
      end
    end
    it "存在していないユーザのメールアドレスの場合は送信されない" do
      perform_enqueued_jobs do
        post send_email_users_path(format: :json), params: {
          user: {
            email: 'hoge.hoge.12345@gmail.com',
          }
        }
        expect(response).to have_http_status(401)
      end
      expect(ActionMailer::Base.deliveries).to be_empty
    end
  end

  describe "POST /api/users/logout" do
    it "ログアウトできること" do
      user = FactoryBot.create(:user, :confirmed)
      post login_users_path(format: :json), params: {
        user: {
          email: user.email,
          password: user.password,
        }
      }
      expect(response).to have_http_status(200)
      
      post logout_users_path(format: :json)
      expect(response).to have_http_status(200)
      json = JSON.parse(response.body)
      expect(json['success']).to be true
    end
  end

  describe "GET /api/users/:id/confirmation" do
    it "メールを確認してユーザー登録を完了できること" do
      user = FactoryBot.create(:user, :unconfirmed, confirmation_sent_at: DateTime.current.in_time_zone)
      get confirmation_user_path(user), params: {
        confirmation_token: user.confirmation_token
      }
      expect(response).to have_http_status(302)
      expect(response).to redirect_to "//192.168.99.100:8080/login"
    end

    it "制限時間30分を超えたときメールを確認してユーザー登録を完了できないこと" do
      user = FactoryBot.create(:user, :unconfirmed, confirmation_sent_at: 30.minutes.ago)
      get confirmation_user_path(user), params: {
        confirmation_token: user.confirmation_token
      }
      expect(response).to have_http_status(200)
      html = response.body
      expect(html).to match "ユーザー登録が完了していません"
      expect(html).to match "期限切れです。"
    end

    it "トークンが間違っているときメールを確認してユーザー登録を完了できないこと" do
      user = FactoryBot.create(:user, :unconfirmed, confirmation_sent_at: DateTime.current.in_time_zone)
      get confirmation_user_path(user), params: {
        confirmation_token: user.confirmation_token + "1234"
      }
      expect(response).to have_http_status(200)
      html = response.body
      expect(html).to match "ユーザー登録が完了していません"
      expect(html).to match "不正なトークンが指定されました。"
    end
  end

  describe "POST /api/users.json" do
    it "user を新規作成できること" do
      user_attributes = FactoryBot.attributes_for(:user)
      
      perform_enqueued_jobs do
        # この中の exmaple では perform_later が同期実行される 
        expect {
          post users_path(format: :json), params: {
            user: user_attributes
          }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['name']).to match user_attributes[:name]
        expect(json['email']).to match user_attributes[:email]  
      end

      mail = ActionMailer::Base.deliveries.last
      aggregate_failures do
        expect(mail.to).to eq [user_attributes[:email]]
        expect(mail.subject).to eq "ユーザー登録を完了してください"
        expect(mail.body.parts[0].body.raw_source).to match "下のリンクからユーザー登録を完了してください。"
        expect(mail.body.parts[0].body.raw_source).to match /#{user_attributes[:name]}/
      end
    end
  end

  describe "POST /api/users/login.json" do
    describe "メールを確認してユーザー登録を完了しているとき" do
      describe "認証情報が正しいとき" do
        it "ログインできること" do
          user = FactoryBot.create(:user, :confirmed)
          post login_users_path(format: :json), params: {
            user: {
              email: user.email,
              password: user.password,
            }
          }
          expect(response).to have_http_status(200)
          json = JSON.parse(response.body)
          expect(json['success']).to be true
          expect(json['user']['name']).to match user.name
          expect(json['user']['email']).to match user.email
        end
        it "5回間違えたのち30分以内に正しいパスワードを入れてもロックされるが30分後にはログインできること" do
          user = FactoryBot.create(:user, :confirmed)
          5.times {
            post login_users_path(format: :json), params: {
              user: {
                email: user.email,
                password: user.password + "t",
              }
            }
            expect(response).to have_http_status(401)
            json = JSON.parse(response.body)
            expect(json['errors'][0]).to match 'メールアドレスまたはパスワードが間違っています'
          }
          post login_users_path(format: :json), params: {
            user: {
              email: user.email,
              password: user.password,
            }
          }
          expect(response).to have_http_status(401)
          json = JSON.parse(response.body)
          expect(json['errors'][0]).to match 'アカウントがロックされています。メールを確認ください'

          # 30分1秒後に飛ぶ
          travel_to((30*60+1).seconds.from_now) do
            post login_users_path(format: :json), params: {
              user: {
                email: user.email,
                password: user.password,
              }
            }
            expect(response).to have_http_status(200)
            json = JSON.parse(response.body)
            expect(json['success']).to be true
            expect(json['user']['name']).to match user.name
            expect(json['user']['email']).to match user.email
          end
        end
      end
      describe "認証情報が正しくないとき" do
        it "ログインできないこと" do
          user = FactoryBot.create(:user, :confirmed)
          post login_users_path(format: :json), params: {
            user: {
              email: user.email + "t",
              password: user.password,
            }
          }
          expect(response).to have_http_status(401)
          json = JSON.parse(response.body)
          expect(json['errors'][0]).to match 'メールアドレスまたはパスワードが間違っています'
        end
      end

    end
    describe "メールを確認してユーザー登録を完了していないとき" do
      it "ログインできないこと" do
        user = FactoryBot.create(:user, :unconfirmed)
        post login_users_path(format: :json), params: {
          user: {
            email: user.email,
            password: user.password,
          }
        }
        expect(response).to have_http_status(401)
        json = JSON.parse(response.body)
        expect(json['errors'][0]).to match 'メールを確認してユーザー登録を完了してください'
      end
    end
  end
end
