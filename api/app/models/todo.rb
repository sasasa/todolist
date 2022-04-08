class Todo < ApplicationRecord
  belongs_to :user

  validates :content, presence: true,
                      length: { minimum: 5 },
                      uniqueness: { :scope => :user_id }
  validates :due_on, presence: true

  def late?
    due_on.in_time_zone <= Date.current.in_time_zone
  end
end
