require 'oily_png'
require 'json'
require 'builder'

PROVINCES = {
  100 => {
    name: "BC",
    pop: 4_400_000
  },
  120 => {
    name: "AB",
    pop: 3_600_000
  },
  130 => {
    name: "SK",
    pop: 1_000_000
  },
  140 => {
    name: "MB",
    pop: 1_200_000
  },
  150 => {
    name: "ON",
    pop: 12_900_000
  },
  160 => {
    name: "QC",
    pop: 7_900_000
  },
  170 => {
    name: "NS",
    pop: 1_500_000
  },
  180 => {
    name: "NB",
    pop: 700_000
  },
  190 => {
    name: "NT",
    pop: 40_000
  },
  110 => {
    name: "YT",
    pop: 30_000
  },
  200 => {
    name: "NU",
    pop: 30_000
  },
}

def image_squares(image)
  squares = []
  image.width.times do |x|
    image.height.times do |y|
      color = ChunkyPNG::Color.to_truecolor_alpha_bytes(image[x,y])
      next if color[3] == 0
      squares << {
        x: x, y: y,
        # color: color,
        province: PROVINCES[color[1]],
        city: color[0] == 200,
      }
    end
  end
  squares
end

def pop_noise(avg)
  ((rand()-0.5)*(avg/10)).to_i
end

def allocate_population_prov(squares, pool)
  cities, rural = squares.partition { |sq| sq[:city] }
  cities.each {|sq| sq[:pop] = 1_000_000 + pop_noise(1_000_000)}
  left = pool - (cities.map {|sq| sq[:pop]}.inject(:+) || 0)
  rural_avg = (left / rural.length).to_i
  rural.each {|sq| sq[:pop] = [rural_avg + pop_noise(rural_avg),1].max}
end

def allocate_population(squares)
  provinces = squares.group_by {|sq| sq[:province][:name]}
  provinces.each do |pv, sqs|
    allocate_population_prov(sqs, sqs.first[:province][:pop])
  end
end

def transform_squares(squares)
  hash = {}
  squares.each do |sq|
    hash["x#{sq[:x]}y#{sq[:y]}"] = {
      "prov" => sq[:province][:name],
      "city" => sq[:city],
      "pop" => sq[:pop]
    }
  end
  hash
end

image = ChunkyPNG::Image.from_file('script/canada-map-input.png')
puts "loaded"
squares = image_squares(image)
allocate_population(squares)
p squares.count
# p squares.count {|s| s[:city] }
# p squares.max_by {|s| s[:pop]}
# p squares.min_by {|s| s[:pop]}
p squares.sample(10)
transformed_squares = transform_squares(squares)
File.open("data/squares.json",'w') do |f|
  f.puts JSON.dump(transformed_squares)
end

def map_colour(pop)
  # scale = ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']
  # scale[Math.log10(pop).floor]
  x = [(Math.log10(pop)-2),0.0].max
  red = ((x/6.2)*250).floor
  # "rgb(#{red}, 30, #{[0,173-(red)].max})"
  "rgb(#{red}, 95, 173)"
end

RECT_SIZE = 11
MARGIN = 1
GRID = RECT_SIZE + MARGIN
def map_svg(squares, image)
  builder = Builder::XmlMarkup.new(indent: 2)
  w = image.width * GRID
  h = image.height * GRID
  attrs = {
    'version' => "1.1",
    'baseProfile' => "full",
    'xmlns' => "http://www.w3.org/2000/svg",
    'xmlns:xlink' => "http://www.w3.org/1999/xlink",
    'xmlns:ev' => "http://www.w3.org/2001/xml-events",
    'class' => "map-svg",
    'viewBox' => "0 0 #{w} #{h}"
  }
  builder.svg(attrs) do |b|
    squares.each do |sq|
      b.rect({
        'class' => ["sq", "sq-prov-#{sq[:province][:name]}", sq[:city] ? "sq-city" : nil].compact.join(' '),
        'x' => sq[:x] * GRID, 'y' => sq[:y] * GRID,
        'width' => RECT_SIZE,'height' => RECT_SIZE,
        'id' => "x#{sq[:x]}y#{sq[:y]}",
        # 'rx' => 3, 'ry' => 3,
        # 'style' => "fill: #{map_colour(sq[:pop])};stroke-width:1;stroke:rgba(0,0,0,0.4)"
        'style' => "fill: #{map_colour(sq[:pop])}; stroke: #{map_colour(sq[:pop])}"
      })
    end
  end
end

svg = map_svg(squares, image)
File.open("data/map.svg",'w') do |f|
  f.puts svg
end
