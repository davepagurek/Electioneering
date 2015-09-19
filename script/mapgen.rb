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

def transform_squares(squares)
  hash = {}
  squares.each do |sq|
    hash["x#{sq[:x]}y#{sq[:y]}"] = {
      "prov" => sq[:province][:name],
      "city" => sq[:city]
    }
  end
  hash
end

image = ChunkyPNG::Image.from_file('canada-map-input.png')
puts "loaded"
squares = image_squares(image)
p squares.count
p squares.count {|s| s[:city] }
p squares.sample(10)
transformed_squares = transform_squares(squares)
File.open("../data/squares.json",'w') do |f|
  f.puts JSON.dump(transformed_squares)
end


RECT_SIZE = 12
MARGIN = 1
GRID = RECT_SIZE + MARGIN
def map_svg(squares, image)
  builder = Builder::XmlMarkup.new(indent: 2)
  attrs = {
    'width' => image.width * GRID,
    'height' => image.height * GRID,
    'version' => "1.1",
    'baseProfile' => "full",
    'xmlns' => "http://www.w3.org/2000/svg",
    'xmlns:xlink' => "http://www.w3.org/1999/xlink",
    'xmlns:ev' => "http://www.w3.org/2001/xml-events",
  }
  builder.svg(attrs) do |b|
    squares.each do |sq|
      b.rect({
        'x' => sq[:x] * GRID, 'y' => sq[:y] * GRID,
        'width' => RECT_SIZE,'height' => RECT_SIZE,
        'class' => ["sq", "sq-prov-#{sq[:province][:name]}", sq[:city] ? "sq-city" : nil].compact.join(' '),
        'id' => "x#{sq[:x]}y#{sq[:y]}",
        'rx' => 3, 'ry' => 3,
      })
    end
  end
end

svg = map_svg(squares, image)
File.open("../data/map.svg",'w') do |f|
  f.puts svg
end
