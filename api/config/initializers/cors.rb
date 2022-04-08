Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ['localhost:8080', '192.168.99.100:8080', 'todolist-vue-front.herokuapp.com']
    resource '/api/*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end