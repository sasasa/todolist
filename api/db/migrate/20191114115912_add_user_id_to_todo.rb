class AddUserIdToTodo < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :user_id, :integer
    add_index :todos, :user_id
  end
end
