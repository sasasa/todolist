FactoryBot.define do
  factory :user do
    name { "さえき" }
    sequence(:email) { |n| "tester#{n}@example.com" }
    password { "aQ1!aQ1!" }
    password_confirmation { "aQ1!aQ1!" }
    password_digest { '$2a$12$/K6bm/0NrGGUwTut0Z1e2.oUFErBfQi3VbXoHLbvABcVoipl3Ky.m' }

    trait :reset_password do
      is_confirmed { true }
      reset_password_token { '9e5be9f3-8ca0-4a02-9520-4e9beaa7d218' }
    end

    trait :with_todos do
      is_confirmed { true }
      after(:create) { |user| create_list(:todo, 5, user: user) }
    end

    trait :confirmed do
      is_confirmed { true }
      password_digest { '$2a$12$/K6bm/0NrGGUwTut0Z1e2.oUFErBfQi3VbXoHLbvABcVoipl3Ky.m' }
    end

    trait :unconfirmed do
      is_confirmed { false }
      password_digest { '$2a$12$/K6bm/0NrGGUwTut0Z1e2.oUFErBfQi3VbXoHLbvABcVoipl3Ky.m' }
    end
  end
end
