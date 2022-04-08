# rails g delayed_job:active_record
# 開発環境
# rails jobs:check[max_age]  # max_age秒より古いジョブがまだ試行されていない場合、エラーステータスで終了します
# rails jobs:clear           # Delayed Job のキューをクリアな状態にする
# rails jobs:work            # Delayed Job ワーカーを起動させる
# rails jobs:workoff         # Delayed Job ワーカーを起動させ、すべてのジョブが完了したら終了する

# 本番環境
# 別々のプロセス内で2つのワーカーを走らせる
# RAILS_ENV=production bin/delayed_job -n 2 start
# ワーカーを停止させる
# RAILS_ENV=production bin/delayed_job stop
# ワーカーを再起動させる(ワーカー数は2つ)
# RAILS_ENV=production bin/delayed_job -n 2 restart


# 失敗したジョブを消さない
Delayed::Worker.destroy_failed_jobs = false
# Delayed::Worker.logger = Logger.new(File.join(Rails.root, 'log', 'delayed_job.log'))

# リトライしない
Delayed::Worker.max_attempts = 0
