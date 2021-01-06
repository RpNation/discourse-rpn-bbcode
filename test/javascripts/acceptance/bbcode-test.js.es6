import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import PrettyText, { buildOptions } from "pretty-text/pretty-text";

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

QUnit.assert.cookedPara = function (input, expected, message) {
  QUnit.assert.cooked(input, `<p>${expected}</p>`, message);
};

acceptance("RpN BBCode", function () {
  test("basic cooking", function (assert) {
    assert.cookedPara(
      "it can [highlight]highlight[/highlight]",
      'it can <span class="bbcodeHighlight">highlight</span>',
      "it highlights"
    );
    assert.cookedPara(
      "it can [divide]divide[/divide]",
      'it can <span class="bbcode-horizontal-rule">divide</span>',
      "it divides"
    );
  });
});
