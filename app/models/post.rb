class Post < ActiveRecord::Base
  attr_accessible :content, :title

  before_save :parse

  def parse 
    self.content = BlueCloth.new(self.content).to_html
  end
end
