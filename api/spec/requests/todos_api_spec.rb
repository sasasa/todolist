require 'rails_helper'

RSpec.describe "Todos Api", type: :request do
  describe "DELETE /api/todo/:id.json" do
    describe "認証情報を送らないとき" do
      it "5回トークンが間違っていたらアカウントロックされるが、30分後には解除されて削除できる" do
        user = FactoryBot.create(:user, :with_todos)
        test_todo = user.todos.last
        5.times {
          expect {
            delete todo_path(test_todo, format: :json), params: {
              user_email: user.email,
            }, headers: {
              'Authorization': "Bearer #{user.gwt_token![:authentication_token] + 't'}",
            }
          }.to_not change(user.todos, :count)
          expect(response).to have_http_status(401)

          json = JSON.parse(response.body)
          expect(json['errors']).to include "invalid token or email"
        }
        expect {
          delete todo_path(test_todo, format: :json), params: {
            user_email: user.email,
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to_not change(user.todos, :count)
        expect(response).to have_http_status(401)
        json = JSON.parse(response.body)
        expect(json['errors']).to include "acount locked"

        # 30分1秒後に飛ぶ
        travel_to((30*60+1).seconds.from_now) do
          expect {
            delete todo_path(test_todo, format: :json), params: {
              user_email: user.email,
            }, headers: {
              'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
            }
          }.to change(user.todos, :count).by(-1)
          expect(response).to have_http_status(200)
          json = JSON.parse(response.body)
          expect(json['id']).to be test_todo.id
          expect(json['content']).to match test_todo.content
          expect(json['due_on']).to match test_todo.due_on.to_s[0..9]
          expect(json['finished']).to be test_todo.finished
        end
      end

      it "todo を削除できないこと" do
        user = FactoryBot.create(:user, :with_todos)
        test_todo = user.todos.last
        expect {
          delete todo_path(test_todo, format: :json), headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to_not change(user.todos, :count)
        expect(response).to have_http_status(401)
        json = JSON.parse(response.body)
        expect(json['errors'][0]).to match 'invalid token or email'
      end
    end
    describe "認証情報を送るとき" do
      it "1件の todo を削除できること" do
        user = FactoryBot.create(:user, :with_todos)
        test_todo = user.todos.last
        expect {
          delete todo_path(test_todo, format: :json), params: {
            user_email: user.email,
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to change(user.todos, :count).by(-1)
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json['id']).to be test_todo.id
        expect(json['content']).to match test_todo.content
        expect(json['due_on']).to match test_todo.due_on.to_s[0..9]
        expect(json['finished']).to be test_todo.finished
      end
    end
  end
  describe "GET /api/todo/:id.json" do
    it "1件の todo を読み出せること" do
      user = FactoryBot.create(:user, :with_todos)
      get todo_path(user.todos.last, format: :json), params: {
        user_email: user.email,
      }, headers: {
        'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
      }
      expect(response).to have_http_status(200)
      json = JSON.parse(response.body)
      expect(json['id']).to be user.todos.last.id
    end
  end

  describe "PATCH /api/todo/:id.json" do
    describe "正しいデータを送ったとき" do
      it "todo を更新できること" do
        user = FactoryBot.create(:user, :with_todos)
        test_content = user.todos.first.content + "Test"
        test_due_on =  user.todos.first.due_on - 1

        patch todo_path(user.todos.first, format: :json), params: {
          user_email: user.email,
          todo: {
            id: user.todos.first.id,
            content: test_content,
            due_on: test_due_on,
            finished: user.todos.first.finished,
          }
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
        }
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json['id']).to be user.todos.first.id
        expect(json['content']).to match test_content
        expect(json['due_on']).to match test_due_on.to_s[0..9]
        expect(json['finished']).to be user.todos.first.finished
      end
    end
    describe "バリデーションエラーのデータを送ったとき" do
      it "todo の〆切が空の時 todo を更新できないこと" do
        user = FactoryBot.create(:user, :with_todos)
        test_due_on = ""

        patch todo_path(user.todos.first, format: :json), params: {
          user_email: user.email,
          todo: {
            id: user.todos.first.id,
            content: user.todos.first.content,
            due_on: test_due_on,
            finished: user.todos.first.finished,
          }
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
        }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['due_on'][0]).to match 'を入力してください'
      end
      
      it "todo の内容が空の時 todo を更新できないこと" do
        user = FactoryBot.create(:user, :with_todos)
        test_content = ""

        patch todo_path(user.todos.first, format: :json), params: {
          user_email: user.email,
          todo: {
            id: user.todos.first.id,
            content: test_content,
            due_on: user.todos.first.due_on,
            finished: user.todos.first.finished,
          }
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
        }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['content'][0]).to match 'を入力してください'
      end

      it "todo の内容が5文字未満の時 todo を更新できないこと" do
        user = FactoryBot.create(:user, :with_todos)
        test_content = "1234"

        patch todo_path(user.todos.first, format: :json), params: {
          user_email: user.email,
          todo: {
            id: user.todos.first.id,
            content: test_content,
            due_on: user.todos.first.due_on,
            finished: user.todos.first.finished,
          }
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
        }
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['content'][0]).to match 'は5文字以上で入力してください'
      end
    end
  end

  describe "GET /api/todos.json" do
    describe "認証情報を送ったとき" do
      it "複数件の todo を読み出せること" do
        user = FactoryBot.create(:user, :with_todos)
        get todos_path(format: :json), params: {
          user_email: user.email,
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
        }
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json.size).to be user.todos.size
        expect(json.first['id']).to be user.todos.first.id
        expect(json.last['id']).to be user.todos.last.id
      end      
    end
    
    describe "誤った認証情報を送ったとき" do
      it "todo を読み出せないこと" do
        user = FactoryBot.create(:user, :with_todos)
        get todos_path(format: :json), params: {
          user_email: user.email + 't',
        }, headers: {
          'Authorization': "Bearer #{user.gwt_token![:authentication_token]} + 't'",
        }

        expect(response).to have_http_status(401)
        json = JSON.parse(response.body)
        expect(json['errors'][0]).to match 'invalid token or email'
      end
    end

    describe "認証情報を送らないとき" do
      it "todo を読み出せないこと" do
        user = FactoryBot.create(:user, :with_todos)
        get todos_path(format: :json)

        expect(response).to have_http_status(401)
        
        expect(response.body).to match 'HTTP Token: Access denied.'
      end
    end
  end

  describe "POST /api/todos.json" do
    describe "正しいデータを送ったとき" do
      it "todo を新規作成できること" do
        user = FactoryBot.create(:user)
        todo_attributes = FactoryBot.attributes_for(:todo)
        expect {
          post todos_path(format: :json), params: {
            user_email: user.email,
            todo: todo_attributes
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to change(user.todos, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['content']).to match todo_attributes[:content]
        expect(json['due_on']).to match todo_attributes[:due_on].to_s[0..9]
      end
    end
    describe "バリデーションエラーのデータを送ったとき" do
      it "todo の〆切が空の時 todo を新規作成できないこと" do
        user = FactoryBot.create(:user)
        todo_attributes = FactoryBot.attributes_for(:todo, due_on: "")
        expect {
          post todos_path(format: :json), params: {
            user_email: user.email,
            todo: todo_attributes
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to_not change(user.todos, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['due_on'][0]).to match 'を入力してください'
      end

      it "todo の内容が空の時 todo を新規作成できないこと" do
        user = FactoryBot.create(:user)
        todo_attributes = FactoryBot.attributes_for(:todo, content: "")
        expect {
          post todos_path(format: :json), params: {
            user_email: user.email,
            todo: todo_attributes
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to_not change(user.todos, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['content'][0]).to match 'を入力してください'
      end

      it "todo の内容が5文字未満の時 todo を新規作成できないこと" do
        user = FactoryBot.create(:user)
        todo_attributes = FactoryBot.attributes_for(:todo, content: "1234")
        expect {
          post todos_path(format: :json), params: {
            user_email: user.email,
            todo: todo_attributes
          }, headers: {
            'Authorization': "Bearer #{user.gwt_token![:authentication_token]}",
          }
        }.to_not change(user.todos, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']['content'][0]).to match 'は5文字以上で入力してください'
      end
    end
  end
end
