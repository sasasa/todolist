require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local
    #　以下の記述を追記する(設定必須)
    config.i18n.default_locale = :ja # デフォルトのlocaleを日本語(:ja)にする
    #　#　以下の記述を追記する(設定必須)
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.active_job.queue_adapter = :delayed_job

    config.action_view.field_error_proc = Proc.new do |html_tag, instance|
      if instance.kind_of?(ActionView::Helpers::Tags::Label)
        # skip when label
        html_tag.html_safe
      else
        "<span class=\"field_with_errors\">#{html_tag}</span>".html_safe
      end
    end

    # Don't generate system test files.
    config.generators.system_tests = nil

    config.generators do |g|
      g.stylesheets false
      g.javascripts false
      g.helper false
      g.fixture_replacement :factory_bot, dir: "spec/factories"

      g.test_framework :rspec,
        # fixtures: false,
        view_specs: false,
        helper_specs: false,
        routing_specs: false
        # controller_specs: false
    end

    # クロスオリジンで POST や PUT を拒否しない
    config.action_controller.forgery_protection_origin_check = false
  end
end
