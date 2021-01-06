import PrettyText, { buildOptions } from "pretty-text/pretty-text";
import { deepMerge } from "discourse-common/lib/object";

const rawOpts = {
  siteSettings: {
    enable_emoji: true,
    enable_emoji_shortcuts: true,
    enable_mentions: true,
    emoji_set: "emoji_one",
    highlighted_languages: "json|ruby|javascript",
    default_code_lang: "auto",
    enable_markdown_linkify: true,
    markdown_linkify_tlds: "com",
  },
  getURL: (url) => url,
};

const defaultOpts = buildOptions(rawOpts);

QUnit.assert.cooked = function (input, expected, message) {
  const actual = new PrettyText(defaultOpts).cook(input);
  this.pushResult({
    result: actual === expected.replace(/\/>/g, ">"),
    actual,
    expected,
    message,
  });
};

QUnit.assert.cookedOptions = function (input, opts, expected, message) {
  const merged = deepMerge({}, rawOpts, opts);
  const actual = new PrettyText(buildOptions(merged)).cook(input);
  this.pushResult({
    result: actual === expected,
    actual,
    expected,
    message,
  });
};

QUnit.assert.cookedPara = function (input, expected, message) {
  QUnit.assert.cooked(input, `<p>${expected}</p>`, message);
};

module("Highlight Test", function () {
  test("basic cooking", function (assert) {
    assert.cooked("hello", "<p>hello</p>", "surrounds text with paragraphs");
    assert.cooked("**evil**", "<p><strong>evil</strong></p>", "it bolds text.");
    assert.cooked("__bold__", "<p><strong>bold</strong></p>", "it bolds text.");
    assert.cooked("*trout*", "<p><em>trout</em></p>", "it italicizes text.");
    assert.cooked("_trout_", "<p><em>trout</em></p>", "it italicizes text.");
    assert.cooked(
      "***hello***",
      "<p><em><strong>hello</strong></em></p>",
      "it can do bold and italics at once."
    );
    assert.cooked(
      "word_with_underscores",
      "<p>word_with_underscores</p>",
      "it doesn't do intraword italics"
    );
    assert.cooked(
      "common/_special_font_face.html.erb",
      "<p>common/_special_font_face.html.erb</p>",
      "it doesn't intraword with a slash"
    );
    assert.cooked("hello \\*evil\\*", "<p>hello *evil*</p>", "it supports escaping of asterisks");
    assert.cooked("hello \\_evil\\_", "<p>hello _evil_</p>", "it supports escaping of italics");
    assert.cooked(
      "brussels sprouts are *awful*.",
      "<p>brussels sprouts are <em>awful</em>.</p>",
      "it doesn't swallow periods."
    );
    assert.cookedPara(
      "it can [highlight]highlight[/highlight]",
      'it can <span class="bbcodeHighlight">highlight</span>',
      "it highlights"
    );
  });
});
