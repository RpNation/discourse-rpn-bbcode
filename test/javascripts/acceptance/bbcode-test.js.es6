import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("RpN BBCode", function (needs) {
  needs.user();
  needs.settings({ rpn_bbcode_enabled: true });
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
  test("image float tag [imagefloat]", function (assert) {
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
      '<div class="bbcode-textmessage"><div class="bbcode-textmessage-name">Recipient</div>' +
        '<div class="bbcode-textmessage-overflow"><div class="bbcode-textmessage-content">' +
        '<div class="bbcode-message-them">message from Recipient</div>' +
        '<div class="bbcode-message-me">message from sender</div></div></div></div>',
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
  test("block tag [block]", function (assert) {
    const BLOCKS = [
      "dice",
      "dice10",
      "setting",
      "warning",
      "storyteller",
      "announcement",
      "important",
      "question",
      "encounter",
      "information",
      "character",
      "treasure",
    ];
    assert.cookedBlock(
      "[block]lorem ipsum[/block]",
      `<div class="bbcode-block" data-bbcode-block="block"><div class="bbcode-block-icon"></div><div class="bbcode-block-content"><p>lorem ipsum</p></div></div>`,
      "no option works"
    );
    BLOCKS.forEach((block) => {
      assert.cookedBlock(
        `[block=${block}]lorem ipsum[/block]`,
        `<div class="bbcode-block" data-bbcode-block="${block}"><div class="bbcode-block-icon"></div><div class="bbcode-block-content"><p>lorem ipsum</p></div></div>`,
        `${block} option works`
      );
    });
  });
  test("progress tag [progress]", function (assert) {
    assert.cookedBlock(
      "[progress=50]progress bar[/progress]",
      '<div class="bbcode-progress"><div class="bbcode-progress-text">progress bar</div><div class="bbcode-progress-bar" style="width: calc(50% - 6px);"></div><div class="bbcode-progress-bar-other"></div></div>',
      "progress bar works"
    );
  });
  test("note tag [note]", function (assert) {
    assert.cookedBlock(
      "[note]inline text[/note]",
      '<div class="bbcode-note"><div class="bbcode-note-tape"></div><div class="bbcode-note-content">inline text<div class="bbcode-note-footer"></div></div></div>',
      "note works"
    );
  });
  test("mail tag [mail][person][subject]", function (assert) {
    assert.cookedBlock(
      "[mail=send]\n[person]Name[/person]\n[subject]subject title[/subject]\ninline text[/mail]",
      '<div class="bbcode-email-send"><div class="bbcode-email-top-send">Send New Email</div><div class="bbcode-email-first-row"></div><div class="bbcode-email-second-row"></div><div class="bbcode-email-main"><div class="bbcode-email-person">Name</div><div class="bbcode-email-subject">subject title</div><p>inline text</p></div><div class="bbcode-email-footer"></div><div class="bbcode-email-button"></div></div>',
      "send option works"
    );
  });
  test("newspaper tag [newspaper]", function (assert) {
    assert.cooked(
      "hello [newspaper]inline[/newspaper] world",
      '<p>hello </p><div class="bbcode-newspaper">inline</div> world<p></p>', //this seems to be a quirk of the markdown plugin. where divs can't be inline
      "inline newspaper works"
    );
    assert.cookedBlock(
      "[newspaper]\nblock\n[/newspaper]",
      '<div class="bbcode-newspaper"><p>block</p></div>',
      "block newpaper works"
    );
  });
  test("check tag [check]", function (assert) {
    const CHECKS = ["dot", "check", "cross"];
    CHECKS.forEach((check) => {
      assert.cooked(
        `hello [check=${check}]text[/check] world`,
        `<p>hello </p><div class="bbcode-check-${check}">text</div> world<p></p>`, //this seems to be a quirk of the markdown plugin, where divs can't be inline
        `${check} option works`
      );
    });
  });
  test("accordion tag [accordion][slide]", async function (assert) {
    await fillIn(
      ".d-editor-input",
      "[accordion]\n[slide=slide1]\ntext\n[/slide]\n[slide=slide2]\ntext\n[/slide]\n[/accordion]"
    );
    const actual = document
      .querySelector(".d-editor-preview")
      .innerHTML.replaceAll(/\r?\n|\r/g, "");
    assert.equal(
      actual,
      '<div class="bbcode-accordion">' +
        '<button class="bbcode-slide-title">slide1</button>' +
        '<div class="bbcode-slide-content"><p>text</p></div>' +
        '<button class="bbcode-slide-title">slide2</button>' +
        '<div class="bbcode-slide-content"><p>text</p></div>' +
        "</div>",
      "accordion html is generated"
    );
    await document.querySelectorAll(".d-editor-preview button.bbcode-slide-title")[0].click();
    assert.ok(
      document.querySelectorAll("button.bbcode-slide-title")[0].classList.contains("active"),
      "slide button active"
    );
    // Don't bother trying to do this test. This is reliant on CSS, and QUnit won't apply CSS classes
    // let content = document.querySelectorAll("button.bbcode-slide-title")[0]
    //   .nextElementSibling;
    // assert.ok(
    //   content.getAttribute("style").includes("block"),
    //   "slide content is visible"
    // );
    await document.querySelectorAll(".d-editor-preview button.bbcode-slide-title")[1].click();
    assert.notOk(
      document.querySelectorAll("button.bbcode-slide-title")[0].classList.contains("active"),
      "slide button deactivated"
    );
  });
  test("ooc tag [ooc]", function (assert) {
    assert.cooked(
      "inline [ooc]text only[/ooc] text",
      '<p>inline </p><div class="bbcode-ooc"><div>OOC</div>text only</div> text<p></p>', //this seems to be a quirk of the markdown plugin. where divs can't be inline
      "ooc tag works"
    );
  });
  test("tabs tag [tabs][tab]", async function (assert) {
    await fillIn(
      ".d-editor-input",
      "[tabs]\n[tab=tab1]\nlorem ipsum\n[/tab]\n[tab=tab2]\nlorem ipsum\n[/tab]\n[/tabs]"
    );
    const actual = document
      .querySelector(".d-editor-preview")
      .innerHTML.replaceAll(/\r?\n|\r/g, "");
    assert.equal(
      actual,
      '<div class="bbcode-tab">' +
        '<button class="bbcode-tab-links">tab1</button>' +
        '<div class="bbcode-tab-content"><p>lorem ipsum</p></div>' +
        '<button class="bbcode-tab-links">tab2</button>' +
        '<div class="bbcode-tab-content"><p>lorem ipsum</p></div>' +
        "</div>",
      "tabs html is generated"
    );
    await document.querySelectorAll(".d-editor-preview button.bbcode-tab-links")[0].click();
    assert.ok(
      document.querySelectorAll("button.bbcode-tab-links")[0].classList.contains("active"),
      "tab button is active"
    );
    assert.equal(
      document.querySelectorAll("div.bbcode-tab-content")[0].style.display,
      "block",
      "corresponding tab content is visible"
    );
    await document.querySelectorAll(".d-editor-preview button.bbcode-tab-links")[1].click();
    assert.notOk(
      document.querySelectorAll("button.bbcode-tab-links")[0].classList.contains("active"),
      "when clicking on another tab, 1st tab button is not active"
    );
    assert.notEqual(
      document.querySelectorAll("div.bbcode-tab-content")[0].style.display,
      "block",
      "when click on another tab, 1st tab content is not visible"
    );
  });
  test("center left right tags [center][left][right]", function (assert) {
    const ALIGN = ["center", "left", "right"];
    ALIGN.forEach((alignment) => {
      assert.cookedBlock(
        `[${alignment}]\nlorem ipsum\n[/${alignment}]`,
        `<div class="bbcode-content-${alignment}"><p>lorem ipsum</p></div>`,
        `${alignment} tag block works`
      );
      assert.cooked(
        `inline [${alignment}]lorem ipsum[/${alignment}] text`,
        `<p>inline </p><div class="bbcode-content-${alignment}">lorem ipsum</div> text<p></p>`,
        `${alignment} tag inline works`
      );
    });
  });
  test("color tag [color]", function (assert) {
    assert.cookedBlock(
      "[color=red]\ntext\n[/color]",
      '<div style="color:red"><p>text</p></div>',
      "block level works"
    );
    assert.cookedInline(
      "[color=red]text[/color]",
      '<span style="color:red">text</span>',
      "inline level works"
    );
  });
  test("size tag [size]", function (assert) {
    assert.cookedBlock(
      "[size=1]\ntext\n[/size]",
      '<div class="bbcode-size-1"><p>text</p></div>',
      "block level works"
    );
    assert.cookedInline(
      "[size=1]text[/size]",
      '<span class="bbcode-size-1">text</span>',
      "inline level works"
    );
    for (let i = 1; i <= 7; i++) {
      assert.cookedInline(
        `[size=${i}]lorem ipsum[/size]`,
        `<span class="bbcode-size-${i}">lorem ipsum</span>`,
        `[size=${i}] works`
      );
    }
    assert.cookedInline(
      "[size=15px]lorem ipsum[/size]",
      '<span style="font-size:15px">lorem ipsum</span>',
      "px option works ([size=15px])"
    );
    assert.cookedInline(
      "[size=1rem]lorem ipsum[/size]",
      '<span style="font-size:1rem">lorem ipsum</span>',
      "rem option works ([size=1rem])"
    );
  });
  test("spoiler tag [spoiler]", async function (assert) {
    assert.cookedBlock(
      "[spoiler]\nlorem ipsum\n[/spoiler]",
      '<div class="bbcode-spoiler">' +
        '<button class="bbcode-spoiler-button">Spoiler</button>' +
        '<div class="bbcode-spoiler-content"><p>lorem ipsum</p></div>' +
        "</div>",
      "spoiler with no title html is generated"
    );
    assert.cookedBlock(
      "[spoiler=title]\nlorem ipsum\n[/spoiler]",
      '<div class="bbcode-spoiler">' +
        '<button class="bbcode-spoiler-button">Spoiler: title</button>' +
        '<div class="bbcode-spoiler-content"><p>lorem ipsum</p></div>' +
        "</div>",
      "spoiler with title html is generated"
    );
    // TODO this is a pain to test for because of CSS not rendering in QUnit.
    // await fillIn(".d-editor-input", "[spoiler]\nlorem ipsum\n[/spoiler]");
    // await document.querySelector("button.bbcode-spoiler-button").click();
    // assert.equal(
    //   document.querySelectorAll("div.bbcode-spoiler-content")[0].style.display,
    //   "block",
    //   "spoiler content is visible when clicked"
    // );
  });
  test("font awesome tag [fa]", function (assert) {
    assert.cooked(
      "[fa]fas fa-vial[/fa]",
      '<p><svg><use href="#fas-vial"></use></svg></p>',
      "basic fa tag works [fa]fas fa-vial[/fa]"
    );
    assert.cooked(
      "[fa]fa fa-vial[/fa]",
      '<p><svg><use href="#far-vial"></use></svg></p>',
      "backwards compatibility works [fa]fa fa-vial[/fa]"
    );
    assert.cooked(
      "[fa]fas fa-vial fa-fw[/fa]",
      '<p><svg class="fa-fw"><use href="#fas-vial"></use></svg></p>',
      "fa classes works [fa]fas fa-vial fa-fw[/fa]"
    );
    assert.cooked(
      "[fa]fad fa-vial fa-primary-color{green} fa-primary-opacity{0.5} fa-secondary-color{blue} fa-secondary-opacity{0.7}[/fa]",
      '<p><svg style="--fa-primary-color:green; --fa-primary-opacity:0.5; --fa-secondary-color:blue; --fa-secondary-opacity:0.7;"><use href="#fad-vial"></use></svg></p>',
      "fa duotones works [fa]fad fa-vial fa-primary-color{green} fa-primary-opacity{0.5} fa-secondary-color{blue} fa-secondary-opacity{0.7}[/fa]"
    );
  });
  test("anchor tag [a][goto]", function (assert) {
    assert.cookedInline(
      "[a=tag]inline text[/a]",
      '<a id="user-anchor-tag">inline text</a>',
      "anchor tag works"
    );
    assert.cookedInline(
      "[goto=tag]inline text[/goto]",
      '<a href="#user-anchor-tag">inline text</a>',
      "goto tag works"
    );
  });
});
