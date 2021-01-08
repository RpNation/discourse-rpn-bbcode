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
    await visit("/");
    await click("#create-topic");
  });
  test("imageFloat tag [imagefloat]", async function (assert) {
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
    assert.cooked(
      "hello [highlight]this is highlighted[/highlight] world",
      '<p>hello <span class="bbcodeHighlight">this is highlighted</span> world</p>',
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
});
