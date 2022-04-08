class AddIndexToUsers < ActiveRecord::Migration[6.0]
  def change
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
  end
end
