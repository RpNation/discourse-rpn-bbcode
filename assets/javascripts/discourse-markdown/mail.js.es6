/**
 * @file Adds [mail] to bbcode
 * @example [mail=send][person]guy[/person][subject]hello[/subject]content[/mail]
 * @example [mail type=send person=guy subject="hello"]content[/mail]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["mail"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("mail", {
    tag: "mail",
    before: function (state, tagInfo) {
      let { type: mailOption = "send", person = "Unknown", subject = "Empty" } = tagInfo.attrs;

      //<div class="bbcode-email" data-bbcode-email="mailOption">
      let token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-email"],
        ["data-bbcode-email", mailOption],
      ];

      //  <div class="bbcode-email-top"></div>
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-top"]];
      state.push("div_close", "div", -1);

      //  <div class="bbcode-email-address">person</div>
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-address"]];
      token = state.push("text", "", 0);
      token.content = person;
      state.push("div_close", "div", -1);

      //  <div class="bbcode-email-subject">subject</div>
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-subject"]];
      token = state.push("text", "", 0);
      token.content = subject;
      state.push("div_close", "div", -1);

      //  <div class="bbcode-email-content">
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-content"]];
    },
    after: function (state) {
      //  </div>
      state.push("div_close", "div", -1);

      //  <div class="bbcode-email-footer">
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-footer"]];

      //    <div class="bbcode-email-button"></div>
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-button"]];
      state.push("div_close", "div", -1);

      //  </div>
      state.push("div_close", "div", -1);
      //</div>
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-email",
    "div[data-bbcode-email=send]",
    "div[data-bbcode-email=receive]",
    "div.bbcode-email-top",
    "div.bbcode-email-address",
    "div.bbcode-email-subject",
    "div.bbcode-email-footer",
    "div.bbcode-email-content",
    "div.bbcode-email-footer",
    "div.bbcode-email-button",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
