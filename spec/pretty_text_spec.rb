# frozen_string_literal: true

require 'rails_helper'

describe PrettyText do

  it 'can apply table bbcode' do
    cooked = PrettyText.cook "cool text [table]Tabular Text[/table] cool text"
    html = '<p>cool text <table>Tabular Text</table> cool text</p>'

    expect(cooked).to eq(html)
  end
end
