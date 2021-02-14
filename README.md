## RpNation Custom BBCodes

Official RpNation BBCodes for Discourse

See: [https://www.rpnation.com]

For documentation, see [wiki](https://github.com/Ghan04/discourse-rpn-bbcode/wiki)

Ⓜ️ = BBCode dropped in favor of Markdown equivalent. In the case of Media & Embeds use Discourse iframe whitelisting, since that is what Challenge and GDOcs technically did in xF.

🚧 = In progress or needs CSS.

✔️ = Complete.

⌨️ = BBCode dropped in favor of HTML equivalent.

🎉 = Powered by official Discourse Addon.

☠️ = Do not proceed. Markdown-it and/or Discourse do not like this code. Use Markdown equivalent. Unable to be rebaked.

|              Text Formatting              |  Layout & Design  |     Media & Embeds     |      Aesthetics       |
| :---------------------------------------: | :---------------: | :--------------------: | :-------------------: |
|   Headers & Sub-Headers<sup>1</sup> Ⓜ️    |    Dividers ✔️    | Google Docs(PDF) Ⓜ️ 🚧 |       Print ✔️        |
|               Highlights ✔️               |  Image Float ✔️   |   Height Restrict ✔️   |    Text Message ✔️    |
|             Justified Text ✔️             |   Fieldsets ✔️    |    Challonge Ⓜ️ 🚧     |       Blocks ✔️       |
|              Blockquotes ✔️               |     Sides ✔️      |                        |    Progress Bar ✔️    |
|         Sub Script<sup>2</sup> ⌨️         |      Tabs ✔️      |                        |    Sticky Note 🚧     |
|        Super Script<sup>3</sup> ⌨️        |     Tables ☠️     |                        |        Mail ✔️        |
|          Google Font Library ✔️           |  Center Block ❓  |                        |     Newspaper 🚧      |
|        HTML Comment<sup>4</sup> ⌨️        |   Background ✔️   |                        |       Checks ✔️       |
|            Paragraph Indent ✔️            |     Border ✔️     |                        | Font Awesome Icons ✔️ |
| Bold, Italic, Underline, Strikethrough Ⓜ️ |   Accordions ✔️   |                        |        OOC ✔️         |
|                 Color ✔️                  |   Scroll Box ✔️   |                        |                       |
|               Font Size ✔️                |    Div Box ❓     |                        |                       |
|          Left, Center, Right ✔️           |    Anchors ✔️     |                        |                       |
|                Spoiler ✔️                 | Rows & Columns 🚧 |                        |                       |
|                  NOBR ✔️                  |                   |                        |                       |
|             Inline Spoiler 🚧             |                   |                        |                       |
|                 Indent ✔️                 |                   |                        |                       |

<sup>1</sup> Headers & Subheaders can be rebaked into the equivalent number of #

<sup>2</sup> This bbcode is no longer needed. Discourse accepts the proper HTML comment tag in the Markdown engine. Example: `<sup>1</sup>`

<sup>3</sup> This bbcode is no longer needed. Discourse accepts the proper HTML comment tag in the Markdown engine. Example: `<sub>2</sub>`

<sup>4</sup> This bbcode is no longer needed. Discourse accepts the proper HTML comment tag in the Markdown engine. Example: `<!--This is a comment. Comments are not displayed in the browser-->`

### Text Replacement Method: List of completed tags:

- imagefloat
- border
- bg
- font
- color
- indent
- scroll
- nobr
- Center, Left, Right
- heightrestrict
- fieldset
- spoiler
