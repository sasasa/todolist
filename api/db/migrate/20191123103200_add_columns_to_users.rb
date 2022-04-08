class AddColumnsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :confirmation_token, :string
    add_column :users, :is_confirmed, :boolean
    add_column :users, :confirmation_sent_at, :datetime
  end
end
