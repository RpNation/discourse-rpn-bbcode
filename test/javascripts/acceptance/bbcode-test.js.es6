import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("RpN BBCode", function (needs) {
  needs.user();
  needs.hooks.beforeEach(async () => {
    QUnit.assert.cooked = function (input, expected, message) {
      fillIn(".d-editor-input", input);
      andThen(() => {
        const actual = document
          .querySelector(".d-editor-preview")
          .innerHTML.replaceAll(/\r?\n|\r/g, ""); //line breaks are rendered into paragraph tags in markdown. no need to test
        this.pushResult({
          result: actual === expected.replace(/\/>/g, ">"),
          actual: actual,
          expected,
          message,
        });
      });
    };
    QUnit.assert.cookedBlock = function (input, expected, message) {
      return QUnit.assert.cooked(
        "block\n" + input + "\nlevel",
        "<p>block</p>" + expected + "<p>level</p>",
        message
      );
    };
    QUnit.assert.cookedInline = function (input, expected, message) {
      return QUnit.assert.cooked(
        "inline " + input + " level",
        "<p>inline " + expected + " level</p>",
        message
      );
    };
    await visit("/");
    await click("#create-topic");
  });
  test("image float tag [imagefloat]", async function (assert) {
    assert.cooked(
      "[imageFloat=left]empty[/imagefloat]",
      '<div class="float-left"><p>empty</p></div>',
      "left option works with empty text"
    );
    assert.cooked(
      "[imageFloat=right]empty[/imagefloat]",
      '<div class="float-right"><p>empty</p></div>',
      "right option works with empty text"
    );
    assert.cookedBlock(
      "[imageFloat=right]\nempty\n[/imagefloat]",
      '<div class="float-right"><p>empty</p></div>',
      "Block level rendering works"
    );
    assert.cooked(
      "[imageFloat=right][img]https://geekandsundry.com/wp-content/uploads/2016/07/bananya2.jpg[/img][/imagefloat]",
      '<div class="float-right"><p><img src="https://geekandsundry.com/wp-content/uploads/2016/07/bananya2.jpg" alt=""></p></div>',
      "it renders images"
    );
  });
  test("highlight tag [highlight]", function (assert) {
    assert.cookedInline(
      "[highlight]this is highlighted[/highlight]",
      '<span class="bbcodeHighlight">this is highlighted</span>',
      "it works inline"
    );
  });
  test("border tag [border]", function (assert) {
    assert.cooked(
      "[border=1px solid red]renders border[/border]",
      '<div class="bbcode-border" style="border: 1px solid red"><p>renders border</p></div>',
      "it works single line"
    );
    assert.cookedBlock(
      "[border=1px solid red]\nrenders border\n[/border]",
      '<div class="bbcode-border" style="border: 1px solid red"><p>renders border</p></div>',
      "Block level rendering works"
    );
  });
  test("background tag [bg]", function (assert) {
    assert.cooked(
      "[bg=red]renders background[/bg]",
      '<div class="bbcode-background" style="background-color: red"><p>renders background</p></div>',
      "it works single line"
    );
    assert.cookedBlock(
      "[bg=red]\nrenders background\n[/bg]",
      '<div class="bbcode-background" style="background-color: red"><p>renders background</p></div>',
      "Block level rendering works"
    );
  });
  test("fieldset tag [fieldset]", function (assert) {
    assert.cookedBlock(
      "[fieldset=title]\nlorem ipsum\n[/fieldset]",
      '<fieldset class="bbcode-fieldset"><legend>title</legend><span><p>lorem ipsum</p></span></fieldset>',
      "it works block level"
    );
  });
  test("side tag [side]", function (assert) {
    assert.cookedBlock(
      "[side=left]\nlorem ipsum\n[/side]",
      '<div class="bbcode-side-left"><p>lorem ipsum</p></div>',
      "left option works"
    );
    assert.cookedBlock(
      "[side=right]\nlorem ipsum\n[/side]",
      '<div class="bbcode-side-right"><p>lorem ipsum</p></div>',
      "right option works"
    );
  });
  test("scroll tag [scroll]", function (assert) {
    assert.cookedBlock(
      "[scroll=100px]\nlorem ipsum\n[/scroll]",
      '<div style="max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:100px;"><p>lorem ipsum</p></div>',
      "scroll works"
    );
  });
  //skip nobr
  test("divide tag [divide]", function (assert) {
    assert.cookedInline(
      "[divide]inline text[/divide]",
      '<span class="bbcode-horizontal-rule">inline text</span>',
      "no option works"
    );
    assert.cookedInline(
      "[divide=dotted]inline text[/divide]",
      '<span class="bbcode-horizontal-rule-dotted">inline text</span>',
      "dotted option works"
    );
    assert.cookedInline(
      "[divide=thick]inline text[/divide]",
      '<span class="bbcode-horizontal-rule-thick">inline text</span>',
      "thick option works"
    );
    assert.cookedInline(
      "[divide=dotted-thick]inline text[/divide]",
      '<span class="bbcode-horizontal-rule-dotted-thick">inline text</span>',
      "dotted-thick option works"
    );
  });
  test("row & column tag [row][column]", function (assert) {
    for (let i = 1; i <= 8; i++) {
      assert.cookedBlock(
        `[row]\n[column=${i}]\nlorem ipsum\n[/column]\n[/row]`,
        `<div class="bbcode-row"><div class="bbcode-column column-width-span${i}"><p>lorem ipsum</p></div></div>`,
        `value ${i} works`
      );
      assert.cookedBlock(
        `[row]\n[column=span${i}]\nlorem ipsum\n[/column]\n[/row]`,
        `<div class="bbcode-row"><div class="bbcode-column column-width-span${i}"><p>lorem ipsum</p></div></div>`,
        `value span${i} works`
      );
    }
  });
  test("inline spoiler tag [inlineSpoiler]", function (assert) {
    assert.cookedInline(
      "[inlineSpoiler]inline text[/inlineSpoiler]",
      '<span class="inlineSpoiler">inline text</span>',
      "inline spoiler works"
    );
  });
  test("justify tag [justify]", function (assert) {
    assert.cookedBlock(
      "[justify]\nlorem ipsum\n[/justify]",
      '<div class="bbcode-justify"><p>lorem ipsum</p></div>',
      "justify works"
    );
  });
  test("blockquote tag [blockquote]", function (assert) {
    // TODO this needs to be updated when blockquote is fixed
    assert.cookedBlock(
      "[blockquote=author]lorem ipsum[/blockquote]",
      '<table class="bbcode-blockquote"><tr><td class="bbcode-blockquote-left"></td>' +
        '<td class="bbcode-blockquote-content"><p>lorem ipsum</p></td>' +
        '<td class="bbcode-blockquote-right"></td></tr></table>',
      "blockquote works"
    );
  });
  test("paragraph indent tag [pindent]", function (assert) {
    assert.cookedInline(
      "[pindent]inline text[/pindent]",
      '<span style="display: inline-block; text-indent:2.5em">inline text</span>',
      "pindent work"
    );
  });
  test("print tag [print]", function (assert) {
    assert.cookedBlock(
      "[print]lorem ipsum[/print]",
      '<div class="bbcode-print">lorem ipsum</div>',
      "no option works"
    );
    assert.cookedBlock(
      "[print=line]lorem ipsum[/print]",
      '<div class="bbcode-print-line">lorem ipsum</div>',
      "line option works"
    );
    assert.cookedBlock(
      "[print=graph]lorem ipsum[/print]",
      '<div class="bbcode-print-graph">lorem ipsum</div>',
      "graph option works"
    );
    assert.cookedBlock(
      "[print=parchment]lorem ipsum[/print]",
      '<div class="bbcode-print-parchment">lorem ipsum</div>',
      "parchment option works"
    );
  });
  test("text message tag [textmessage][message]", function (assert) {
    assert.cookedBlock(
      "[textmessage=Recipient][message=them]message from Recipient[/message][message=me]message from sender[/message][/textmessage]",
      '<div class="bbcode-textmessage"><div class="name">Recipient</div>' +
        '<div class="bbcode-textmessage-overflow"><div class="bbcode-textmessage-content">' +
        '<div class="bbcode-message-them them"><p>message from Recipient</p></div>' +
        '<div class="bbcode-message-me me"><p>message from sender</p></div></div></div></div>',
      "text message works"
    );
  });
  test("font tag [font]", function (assert) {
    const BUILT_IN_FONTS = [
      "arial",
      "book antiqua",
      "courier new",
      "georgia",
      "tahoma",
      "times new roman",
      "trebuchet ms",
      "verdana",
    ];
    BUILT_IN_FONTS.forEach((font) => {
      assert.cookedInline(
        `[font=${font}]font[/font]`,
        `<span style="font-family:${font},Helvetica,Arial,sans-serif;">font</span>`,
        `inline built in ${font} fonts work`
      );
    });
    BUILT_IN_FONTS.forEach((font) => {
      assert.cookedBlock(
        `[font=${font}]\nfont\n[/font]`,
        `<div style="font-family:${font},Helvetica,Arial,sans-serif;"><p>font</p></div>`,
        "block built in fonts work"
      );
    });
    assert.cookedBlock(
      "[font=Playfair Display]google font[/font]",
      '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css2?family=Playfair+Display">' +
        '<div style="font-family:Playfair Display,Helvetica,Arial,sans-serif;"><p>google font</p></div>',
      "google font works"
    );
    assert.cookedInline(
      '[font name="arial"]font[/font]',
      '<span style="font-family:arial,Helvetica,Arial,sans-serif;">font</span>',
      "name option works"
    );
    assert.cookedInline(
      '[font family="arial"]font[/font]',
      '<span style="font-family:arial,Helvetica,Arial,sans-serif;">font</span>',
      "family option works"
    );
    assert.cookedInline(
      '[font family="arial" size="12px" color="red"]font[/font]',
      '<span style="font-family:arial,Helvetica,Arial,sans-serif;font-size:12px;color:red;">font</span>',
      "multi option (name, size, color) works"
    );
  });
});
