require 'json'
require 'pp'

POP_DIV = 10_000

QUESTIONS = JSON.load(IO.read('data/questions.json'))
SQUARES = JSON.load(IO.read('data/squares.json'))

def fuzz(x)
  x + (rand()-0.5)*2*0.2
end

def genperson(province, is_city)
  stat_prov = (['NT', 'YT', 'NU'].include? province) ? 'SK' : province
  person = {}

  person['views'] = QUESTIONS.map do |q|
    yes = rand() < q[stat_prov]
    strength = [0.0, [1.0, fuzz(q['power'])].min].max
    ((yes ? 1 : -1) * strength).round(2)
  end
  # seniors are less common, everyone else is even
  person['age'] = if rand() < 0.19
    rand(65..90)
  else
    rand(20..64)
  end

  person
end

res = SQUARES.map do |k,sq|
  num = [3, sq['pop'] / POP_DIV].max
  people = (1..num).map do
    genperson(sq['prov'], sq['city'])
  end
  [k, people]
end

res.sample(10).each {|e| p e}

File.open("data/people.json",'w') do |f|
  f.puts JSON.dump(res.to_h)
end
