# BBCode Tags

`inline text`: text only content (inline-level tag)
`lorem ipsum`: any content (block-level tag)

## TAG-001: Image Float

```
[imageFloat=left]insert image tag here[/imageFloat]
[imageFloat=right]insert image tag here[/imageFloat]
```

```html
<span class="float-left">insert image tag here</span>
<span class="float-right">insert image tag here</span>
```

## TAG-002: Highlight

```
[highlight]inline text[/highlight]
```

```html
<span class="bbcodeHighlight">inline text</span>
```

## TAG-003: Border

```
[border=css value]lorem ipsum[/border]
```

```html
<div class="bbcode-border" style="border: css value">lorem ipsum</div>
```

## TAG-004: Background

```
[bg=css value]lorem ipsum[/bg]
```

```html
<div class="bbcode-background" style="background-color: css value"></div>
```

## TAG-005: Fieldset

```
[fieldset=title]lorem ipsum[/fieldset]
```

```html
<fieldset class="bbcode-fieldset">
  <legend>title</legend>
  <span>lorem ipsum</span>
</fieldset>
```

## TAG-006: Side

```
[side=left]lorem ipsum[/side]
[side=right]lorem ipsum[/side]
```

```html
<div class="bbcode-side-left">lorem ipsum</div>
<div class="bbcode-side-right">lorem ipsum</div>
```

## TAG-007: Scroll

:exclamation: must manually put in `px`

```
[scroll=height value in px]lorem ipsum[/scroll]
```

```html
<div
  style="max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:height value in px;"
>
  lorem ipsum
  <div></div>
</div>
```

## TAG-008: NOBR

```
[nobr]lorem ipsum[/nobr]
```

```html
<!--replaces all line breaks with spaces in lorem ipsum-->
```

## TAG-009: Divide

```
[divide]inline text[/divide]
[divide=dotted]inline text[/divide]
[divide=thick]inline text[/divide]
[divide=dotted-thick]inline text[/divide]
```

```html
<span class="bbcode-horizontal-rule">inline text</span>
<span class="bbcode-horizontal-rule-dotted">inline text</span>
<span class="bbcode-horizontal-rule-thick">inline text</span>
<span class="bbcode-horizontal-rule-dotted-thick">inline text</span>
```

## TAG-010: Row & Column

`VALUE`: `1-8` or `span1-8`

```
[row]
	[column=VALUE]
		lorem ipsum
	[/column]
[/row]
```

```html
<div class="bbcode-row">
  <div class="bbcode-column column-width-spanVALUE">lorem ipsum</div>
</div>
```

## TAG-011: Inline Spoiler

```
[inlineSpoiler]inline text[/inlineSpoiler]
```

```html
<span class="inlineSpoiler">inline text</span>
```

## TAG-012: Justify

```
[justify]lorem ipsum[/justify]
```

```html
<div class="bbcode-justify">lorem ipsum</div>
```

## TAG-013: Blockquote

```
[blockquote=author]lorem ipsum[/blockquote]
```

```html
<table class="bbcode-blockquote">
  <tr>
    <td class="bbcode-blockquote-left"></td>
    <td class="bbcode-blockquote-content">lorem ipsum</td>
    <td class="bbcode-blockquote-right"></td>
  </tr>
</table>
```

## TAG-014: Paragraph Indent

```
[pindent]inline text[/pindent]
```

```html
<span style="display: inline-block; text-indent: 2.5em">inline text</span>
```

## TAG-015: Print

```
[print]lorem ipsum[/print]
[print=line]lorem ipsum[/print]
[print=graph]lorem ipsum[/print]
[print=parchment]lorem ipsum[/print]
```

```html
<div class="bbcode-print">lorem ipsum</div>
<div class="bbcode-print-line">lorem ipsum</div>
<div class="bbcode-print-graph">lorem ipsum</div>
<div class="bbcode-print-parchment">lorem ipsum</div>
```

## TAG-016: Text Message

```
[textmessage=Recipient]
	[message=them]message from Recipient[/message]
	[message=me]message from sender[/message]
[/textmessage]
```

```html
<div class="bbcode-textmessage">
  <div class="name">Recipient</div>
  <div class="bbcode-textmessage-overflow">
    <div class="bbcode-textmessage-content">
      <div class="bbcode-message-them them">message from Recipient</div>
      <div class="bbcode-message-me me">message from sender</div>
    </div>
  </div>
</div>
```

## TAG-017: Font

Built in fonts:

> arial  
> book antiqua  
> courier new  
> georgia  
> tahoma  
> times new roman  
> trebuchet ms  
> verdana

Valid fonts also include [Google Fonts](https://fonts.google.com/).

:exclamation: Supports both inline and block level. It will use span or div depending on the context. Everything else is the same.

```
[font=built in]this is a built in font[/font]
[font=Google Font]this is a google font[/font]
```

```html
<div style="font-family: built in, Helvetica, Arial, sans-serif;">this is a built in font</div>
<div style="font-family: Google Font, Helvetica, Arial, sans-serif;">this is a google font</div>
<link rel=stylesheet type=text/css href="https://fonts.googleapis.com/css2?family=Google+Font">
```

**Multi Options**  
:exclamation: `color` and `size` are both optional. Only `family` or `name` is required.  
`family` and `name` do the same thing.

`valid size`: Must match [TAG-031: Size] constraints.

```
[font name="font"]multi[/font]
[font family="font"]multi[/font]

[font name="font" color="valid css color" size="valid size"]optional[/font]
```

```html
<div style="font-family: Font, Helvetica, Arial, sans-serif;">multi</div>

<div
  style="font-family: Font, Helvetica, Arial, sans-serif; font-size: valid size; color: valid css color;"
>
  optional
</div>
```