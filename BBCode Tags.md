# BBCode Tags

`inline text`: text only content
`lorem ipsum`: any content

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
> :exclamation: must manually put in `px`
```
[scroll=height value in px]lorem ipsum[/scroll]
```
```html
<div style="max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:height value in px;">lorem ipsum<div>
```

## TAG-008: NOBR
```
[nobr]lorem ipsum[/nobr]
```
```html
<!--replaces all line breaks with spaces in lorem ipsum-->
```

## 