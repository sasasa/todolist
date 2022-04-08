require 'rails_helper'

RSpec.describe User, type: :model do
  describe "バリデーションについて" do
    it "名前、メール、パスワードがあれば有効な状態であること" do
      user = FactoryBot.build(:user)
      expect(user).to be_valid
    end
  
    it "名前がなければ無効な状態であること" do
      user = FactoryBot.build(:user, name: nil)
      user.valid?
      expect(user.errors[:name]).to include("を入力してください")
    end
  
    it "名前が2文字以下なら無効な状態であること" do
      user = FactoryBot.build(:user, name: "AB")
      user.valid?
      expect(user.errors[:name]).to include("は3文字以上で入力してください")
    end
  
    it "名前が3文字以上なら有効な状態であること" do
      user = FactoryBot.build(:user, name: "ABC")
      expect(user).to be_valid
    end
  
    it "メールアドレスがなければ無効な状態であること" do
      user = FactoryBot.build(:user, email: "")
      user.valid?
      expect(user.errors[:email]).to include("を入力してください")
    end
  
    it "メールアドレス形式でなければ無効な状態であること" do
      user = FactoryBot.build(:user, email: "test@gmail ")
      user.valid?
      expect(user.errors[:email]).to include("はメールの形式ではありません")
    end
    
    it "重複したメールアドレスなら無効な状態であること" do
      FactoryBot.create(:user, email: "test@gmail.com")
      user = FactoryBot.build(:user, email: "test@gmail.com")
      user.valid?
      expect(user.errors[:email]).to include("はすでに存在します")
    end
  end

  describe "作成された際に付随して起こる" do
    it "自分のtodoが存在すること" do
      user = FactoryBot.create(:user, :with_todos)
      expect(user.todos.size).to be 5
    end
    it "メールを送信する" do
      allow(UserMailer).to receive_message_chain(:confirmation_email, :deliver_later)
      user = FactoryBot.create(:user)
      expect(UserMailer).to have_received(:confirmation_email).with(user)
    end
    it "トークンが自動生成される" do
      user = FactoryBot.create(:user)
      expect(user.authentication_token).to be_truthy
      expect(user.confirmation_token).to be_truthy
    end
  end
end
