require 'rails_helper'

RSpec.describe Todo, type: :model do
  describe "バリデーションについて" do
    it "内容、期限があれば有効な状態であること" do
      todo = FactoryBot.build(:todo)
      expect(todo).to be_valid
    end
  
    it "内容がなければ無効な状態であること" do
      todo = FactoryBot.build(:todo, content: nil)
      todo.valid?
      expect(todo.errors[:content]).to include("を入力してください")
    end
  
    it "内容が4文字以下なら無効な状態であること" do
      todo = FactoryBot.build(:todo, content: "ABCD")
      todo.valid?
      expect(todo.errors[:content]).to include("は5文字以上で入力してください")
    end
  
    it "内容が5文字以上なら有効な状態であること" do
      todo = FactoryBot.build(:todo, content: "ABCDE")
      expect(todo).to be_valid
    end
  
    it "同一ユーザーで重複した内容なら無効な状態であること" do
      user = FactoryBot.create(:user)
      FactoryBot.create(:todo, content: "コンテンツ", user: user)
      todo = FactoryBot.build(:todo, content: "コンテンツ", user: user)
  
      todo.valid?
      expect(todo.errors[:content]).to include("はすでに存在します")
    end
  
    it "異なるユーザーなら重複した内容でも有効な状態であること" do
      user1 = FactoryBot.create(:user)
      user2 = FactoryBot.create(:user)
      FactoryBot.create(:todo, content: "コンテンツ", user: user1)
      todo = FactoryBot.build(:todo, content: "コンテンツ", user: user2)
      expect(todo).to be_valid
    end
  
    it "期限がなければ無効な状態であること" do
      todo = FactoryBot.build(:todo, due_on: "")
      todo.valid?
      expect(todo.errors[:due_on]).to include("を入力してください")
    end
  end

  describe "期限について" do
    it "期限が過ぎていれば遅延していること" do
      todo = FactoryBot.build(:todo, :due_yesterday)
      expect(todo).to be_late
    end
  
    it "期限が今日であれば遅延していること" do
      todo = FactoryBot.build(:todo, :due_today)
      expect(todo).to be_late
    end
  
    it "期限が明日であればスケジュール通りであること" do
      todo = FactoryBot.build(:todo, :due_tommorow)
      expect(todo).to_not be_late
    end
  end

  describe "作成、削除について" do
    it "ユーザーがtodoを作成できること" do
      user = FactoryBot.create(:user, :with_todos)
      expect{
        user.todos.create(content: "コンテンツ", due_on: 1.day.from_now)
      }.to change{ user.todos.size }.from(5).to(6)
    end
  
    it "ユーザーがtodoを全て削除できること" do
      user = FactoryBot.create(:user, :with_todos)
      expect{
        user.todos.destroy_all
      }.to change{ user.todos.size }.from(5).to(0)
    end
  end
end
