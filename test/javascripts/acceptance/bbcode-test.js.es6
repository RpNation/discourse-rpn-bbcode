import { acceptance } from "discourse/tests/helpers/qunit-helpers";
// import { cookAsync } from "discourse/lib/text";

acceptance("RpN BBCode", function (needs) {
  needs.user();
  needs.hooks.beforeEach(async () => {
    QUnit.assert.cooked = function (input, expected, message) {
      fillIn(".d-editor-input", input);
      andThen(() => {
        const actual = document
          .querySelector(".d-editor-preview")
          .innerHTML.replaceAll(/\r?\n|\r/g, "");
        this.pushResult({
          result: actual === expected.replace(/\/>/g, ">"),
          actual: actual,
          expected,
          message,
        });
      });
    };
    await visit("/");
    await click("#create-topic");
  });
  test("cooking via site", function (assert) {
    assert.cooked("hello world", "<p>hello world</p>", "this test works");
  });
  test("imageFloat tag", async function (assert) {
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
    assert.cooked(
      "hello\n[imageFloat=right]\nempty\n[/imagefloat]\nworld",
      '<p>hello</p><div class="float-right"><p>empty</p></div><p>world</p>',
      "Block level rendering works"
    );
    assert.cooked(
      "[imageFloat=right][img]https://geekandsundry.com/wp-content/uploads/2016/07/bananya2.jpg[/img][/imagefloat]",
      '<div class="float-right"><p><img src="https://geekandsundry.com/wp-content/uploads/2016/07/bananya2.jpg" alt=""></p></div>',
      "it renders images"
    );
  });
  test("highlight tag", function (assert) {
    assert.cooked(
      "hello [highlight]this is highlighted[/highlight] world",
      '<p>hello <span class="bbcodeHighlight">this is highlighted</span> world</p>',
      "it works inline"
    );
  });
});

// acceptance("Method 2", function (needs) {
//   needs.user();
//   test("cooking using cookAsync", async function (assert) {
//     const cooked = await cookAsync("hello world", {});
//     assert.equal(cooked, "<p>hello world</p>", "this test also works");
//   });
// });
