require 'sinatra'

get '/' do
  svgData = IO.read('public/data/map.svg')
  erb :index, locals: {svgData: svgData}
end
