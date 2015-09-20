require 'json'
require 'pp'

POP_DIV = 1_000

QUESTIONS = JSON.load(IO.read('public/data/questions.json'))
SQUARES = JSON.load(IO.read('public/data/squares.json'))
PARTIES = JSON.load(IO.read('public/data/parties.json'))

CONSERVATIVE = PARTIES.last['views']
LIBERAL = PARTIES.first['views']

def fuzz(x)
  x + (rand()-0.5)*2*0.2
end

def genperson(province, is_city)
  stat_prov = (['NT', 'YT', 'NU'].include? province) ? 'SK' : province
  person = {}

  base_views = QUESTIONS.map do |q|
    yes = rand() < q[stat_prov]
    strength = [0.0, [1.0, fuzz(q['power'])].min].max
    ((yes ? 1 : -1) * strength).round(2)
  end
  # seniors are less common, everyone else is even
  person['age'] = age = if rand() < 0.19
    rand(65..90)
  else
    rand(20..64)
  end
  # Conservative bias with age
  con_bias = CONSERVATIVE.map {|x| x * (0.75/70.0) * (age-20)}
  city_bias_factor = is_city ? 0.35 : 0.0
  lib_bias = LIBERAL.map {|x| x * city_bias_factor}
  views = [base_views, con_bias, lib_bias].transpose.map {|x| x.reduce(:+)}
  person['views'] = views.map {|x| [-1.0, [1.0, x].min].max.round(2) }

  person
end

res = SQUARES.map do |k,sq|
  num = [2, sq['pop'] / POP_DIV].max
  people = (1..num).map do
    genperson(sq['prov'], sq['city'])
  end
  [k, people]
end

res.sample(10).each {|e| p e}

File.open("public/data/people.json",'w') do |f|
  f.puts JSON.dump(res.to_h)
end
