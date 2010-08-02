require 'rubygems'
require 'sinatra'
require 'partials'

helpers Sinatra::Partials

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
  @page_title = 'isWebApp.com'
  @page_name = 'index'
	@page_css = css_partial_symbol(@page_name)
	@page_js = js_partial_symbol(@page_name)
  erb :index
end

get '/itunes/rss' do
  @page_title = 'iTunes Store RSS Feed Generator | isWebApp.com'
  @page_name = 'itunes_rss'
	@page_css = css_partial_symbol(@page_name)
	@page_js = js_partial_symbol(@page_name)
  erb :itunes_rss
end

def css_partial_symbol( page_name )
  css_partial_path = 'partials/' + page_name + '/stylesheets'
  css_partial_path.to_sym
end

def js_partial_symbol( page_name )
  js_partial_path = 'partials/' + page_name + '/javascripts'
  js_partial_path.to_sym
end

# Test at <appname>.heroku.com

# You can see all your app specific information this way.
# IMPORTANT! This is a very bad thing to do for a production
# application with sensitive information

#get '/env' do
#  ENV.inspect
#end