FactoryBot.define do
  factory :todo do
    sequence(:content) { |n| "コンテン#{n}" }
    sequence(:due_on) { |n| n.day.from_now }
    association :user

    # 昨日が締め切りのtodo
    trait :due_yesterday do
      due_on { 1.day.ago }
    end

    # 今日が締め切りのtodo
    trait :due_today do
      due_on { Date.current.in_time_zone }
      # due_on Time.zone.now
    end

    # 明日が締め切りのtodo
    trait :due_tommorow do
      due_on { 1.day.from_now }
    end

  end
end
