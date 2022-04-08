class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.string :content
      t.date :due_on
      t.boolean :finished

      t.timestamps
    end
  end
end
