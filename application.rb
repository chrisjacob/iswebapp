require 'rubygems'
require 'sinatra'

configure :production do
  # Configure stuff here you'll want to
  # only be run at Heroku at boot

  # TIP:  You can get you database information
  #       from ENV['DATABASE_URI'] (see /env route below)
end

before do
  headers "Content-Type" => 'text/html; charset=utf-8'
end

get '/' do
  @title = 'isWebApp.com'
  @page_name = 'index'
  erb :index
end

get '/itunes/rss' do
  @title = 'iTunes Store RSS Feed Generator | isWebApp.com'
  @page_name = 'itunes_rss'
  erb :itunes_rss
end

# Test at <appname>.heroku.com

# You can see all your app specific information this way.
# IMPORTANT! This is a very bad thing to do for a production
# application with sensitive information

#get '/env' do
#  ENV.inspect
#end