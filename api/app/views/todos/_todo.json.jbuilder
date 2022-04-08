json.extract! todo, :id, :content, :due_on, :finished, :created_at, :updated_at
json.url todo_url(todo, format: :json)
