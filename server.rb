require 'sinatra'

get '/' do
  svgData = IO.read('data/map.svg')
  erb :index, locals: {svgData: svgData}
end
