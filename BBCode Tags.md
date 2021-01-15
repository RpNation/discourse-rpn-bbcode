# BBCode Tags

`inline text`: text only content (inline-level tag)
`lorem ipsum`: any content (block-level tag)

## TAG-001: Image Float

:exclamation: Supports both inline and block level. However it will only use div. Everything else is the same.

```
[imageFloat=left]insert image tag here[/imageFloat]
[imageFloat=right]insert image tag here[/imageFloat]
```

```html
<div class="float-left">insert image tag here</div>
<div class="float-right">insert image tag here</div>
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
<div class="bbcode-blockquote">
  <div class="bbcode-blockquote-left"></div>
  <div class="bbcode-blockquote-content">
    lorem ipsum
    <div class="bbcode-blockquote-speaker">author</div>
  </div>
  <div class="bbcode-blockquote-right"></div>
</div>
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
  <div class="bbcode-textmessage-name">Recipient</div>
  <div class="bbcode-textmessage-overflow">
    <div class="bbcode-textmessage-content">
      <div class="bbcode-message-them">message from Recipient</div>
      <div class="bbcode-message-me">message from sender</div>
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

## TAG-018: Block

`Option`

> dice  
> dice10  
> setting  
> warning  
> storyteller  
> announcement  
> important  
> question  
> encounter  
> information  
> character  
> treasure

```
[block=Option]lorem ipsum[/block]
```

```html
<div class="bbcode-block" data-bbcode-block="Option">
  <div class="bbcode-block-icon"></div>
  <div class="bbcode-block-content">lorem ipsum</div>
</div>
```

## TAG-019: Progress & Thin Progress

`value`: percentage

```
[progress=value]inline text[/progress]
[thinprogress=value]inline text[/thinprogress]
```

```html
<div class="bbcode-progress">
  <div class="bbcode-progress-text">inline text</div>
  <div class="bbcode-progress-bar" style="width: calc(value% - 6px);"></div>
  <div class="bbcode-progress-bar-other"></div>
</div>
<div class="bbcode-progress-thin">
  <div class="bbcode-progress-text">inline text</div>
  <div class="bbcode-progress-bar" style="width: value%;"></div>
  <div class="bbcode-progress-bar-other"></div>
</div>
```

## TAG-020: Note

```
[note]lorem ipsum[/note]
```

```html
<div class="bbcode-note">
  <div class="bbcode-note-tape"></div>
  <div class="bbcode-note-content">
    lorem ipsum
    <div class="bbcode-note-footer"></div>
  </div>
</div>
```

## TAG-021: Mail

```
[mail=send]
[person]Name[/person]
[subject]subject title[/subject]
inline text
[/mail]

[mail=receive]
[person]Name[/person]
[subject]subject title[/subject]
inline text
[/mail]
```

```html
<div class="bbcode-email-send">
  <div class="bbcode-email-top-send">Send New Email</div>
  <div class="bbcode-email-first-row"></div>
  <div class="bbcode-email-second-row"></div>
  <div class="bbcode-email-main">
    <div class="bbcode-email-person">Name</div>
    <div class="bbcode-email-subject">subject title</div>
    inline text
  </div>
  <div class="bbcode-email-footer"></div>
  <div class="bbcode-email-button"></div>
</div>

<div class="bbcode-email-send">
  <div class="bbcode-email-top-receive">New Email Received</div>
  <div class="bbcode-email-first-row"></div>
  <div class="bbcode-email-second-row"></div>
  <div class="bbcode-email-main">
    <div class="bbcode-email-person">Name</div>
    <div class="bbcode-email-subject">subject title</div>
    inline text
  </div>
  <div class="bbcode-email-footer"></div>
  <div class="bbcode-email-button"></div>
</div>
```

## TAG-022: Newspaper

```
[newspaper]lorem ipsum[/newspaper]
```

```html
<div class="bbcode-newspaper">lorem ipsum</div>
```

## TAG-023: Check

```
[check=dot]dotted[/check]
[check=check]checked[/check]
[check=cross]crossed[/check]
```

```html
<div class="bbcode-check-dot">dotted</div>
<div class="bbcode-check-check">checked</div>
<div class="bbcode-check-cross">crossed</div>
```

## TAG-024: Accordion

```
[accordion]
  [slide=name]
    lorem ipsum
  [/slide]
[/accordion]
```

```html
<div class="bbcode-accordion">
  <button class="bbcode-slide-title" onclick="toggleBBCodeSlide(event)">name</button>
  <div class="bbcode-slide-content">lorem ipsum</div>
</div>
```

## TAG-025: OOC

```
[ooc]text only[/ooc]
```

```html
<div class="bbcode-ooc">
  <div>OOC</div>
  text only
</div>
```

## TAG-026: Tabs

```
[tabs]
  [tab=title]
    lorem ipsum
  [/tab]
[/tabs]
```

```html
<div class="bbcode-tab">
  <button class="bbcode-tab-links">title</button>
  <div class="bbcode-tab-content">lorem ipsum</div>
</div>
```

## TAG-027: Center

```
[center]
lorem ipsum
[/center]
```

```html
<div class="bbcode-content-center">lorem ipsum</div>
```

## TAG-028: Left

```
[left]
lorem ipsum
[/left]
```

```html
<div class="bbcode-content-left">lorem ipsum</div>
```

## TAG-029: Right

```
[right]
lorem ipsum
[/right]
```

```html
<div class="bbcode-content-right">lorem ipsum</div>
```

## TAG-030: Color

:exclamation: Supports both inline and block level

```
[color=valid css value]inline text[/color]
[color=valid css value]
lorem ipsum
[/color]
```

```html
<span style="color: valid css value">inline text</span>
<div style="color: valid css value">lorem ipsum</div>
```

## TAG-031: Size

:exclamation: Supports both inline and block level for all options

```
[size=#]unitless size range from 1 to 7[/size]
[size=#px]size in px, range from 8px to 36px[/size]
[size=#rem]size in rem, range from 0.2rem to 3rem[/size]
```

```html
<div class="bbcode-size-#">unitless size range from 1 to 7</div>
<span class="bbcode-size-#">unitless size range from 1 to 7</span>

<span style="font-size: #px">size in px, range from 8px to 36px</span>
<span style="font-size: #rem">size in rem, range from 0.2rem to 3rem</span>
```

## TAG-032: Spoiler

```
[spoiler]
lorem ipsum
[/spoiler]

[spoiler=title]
lorem ipsum
[/spoiler]
```

```html
<div class="bbcode-spoiler">
  <button class="bbcode-spoiler-button">Spoiler</button>
  <div class="bbcode-spoiler-content">lorem ipsum</div>
</div>

<div class="bbcode-spoiler">
  <button class="bbcode-spoiler-button">Spoiler: title</button>
  <div class="bbcode-spoiler-content">lorem ipsum</div>
</div>
```

## TAG-033: Font Awesome Icons

:warning: works with FA5

If icon style is not given, defaults to `far`

```
[fa]fa-icon fa-class fa-primary-color{color code} fa-primary-opacity{range from 0 to 1} fa-secondary-color{color code} fa-secondary-opacity{range from 0 to 1}[/fa]
```

```html
<svg
  class="fa-class"
  style="--fa-primary-color: color code; --fa-primary-opacity: range from 0 to 1; --fa-secondary-color: color code; --fa-secondary-opacity: range from 0 to 1"
>
  <use href="#icon reference"></use>
</svg>
```

## TAG-034: Anchor

```
[a=TAG]inline text[/a]
[goto=TAG]inline text[/goto]
```

```html
<a id="user-anchor-TAG">inline text</a>

<a href="#user-anchor-TAG">inline text</a>
```
