# Form Guide

Since one of our core aspects is to be a neat frontend for allowing to manipulate various data handled in a fest, it made sense for us to roll out a common and elegant method for creating forms. While this is still a work in progress and the frontend javascript part is far from perfect, this document will list how you can easily create new forms in Fest Manager that typically look like this with the default theme:

![](images/form.png)

## Overview

We render pages using Jade and pass the fields of our form to it as a JSON object. The Jade template uses a `formMixin` to wrap the code that loops over each field object and converts it into corresponding HTML objects. This is what a field object looks like:

```js
var namefield = {
	icon: "name",
	name: "name",
	label: "Name",
	editable: true,
	type: "text",
	required: true,
	value: user.name,
};
```

To create a form, you pass an array of field objects to your template as follows:

```js
var params = {}; // The main page params variable.
var fields = [];
fields.push(namefield);
fields.push(emailfield);
fields.push(institutefield);
params.fields = fields;
res.renderState('path/to/my/view', params);
```

The simplest and suggested way to generate a form is using the `formMixin` in your view. A sample view using a form mixin would look like:

```jade
include mixins/form
div.header
	h1= "My Page Title"
- var form = { fields: fields, method: "PUT", action: "/api/my/endpoint" };
+formMixin(form)
```

Make sure that you have specified the correct path to `/views/mixins/form`.

## Field Options

We have the following options that are recognized in a field object:

1. **`label`** - Specify a string to be used as the label to be displayed along with the input field.
2. **`icon`** - Specify the name of an SVG icon of the format `icon-#{name}`. We automatically add the `icon-` prefix so you only need to write the `#{name}` part.
3. **`name`** - Specify a string to be used as the HTML id of the element of the format `field-#{name}`. We automatically add the `field-` prefix so you only need to write the `#{name}` part.
4. **`type`** - Specify a string to set as the `type` attribute of the `<input>` HTML tag, unless it is an exception among those listed below:
	- `type = 'select'` creates a `<select>` tag. It also recognizes an array of strings specified in the field object as `options = ['one', 'two']` to generate the dropdown options.
	- `type = 'textarea'` creates a `<textarea>` tag. It also takes the integer option to specify the height of the textarea as the number of rows like: `rows = 5`.
	- `type = 'image'` creates a special element that allows uploading an image to the server and it returns the file name of the image uploaded to be stored/used however the developer likes. Read the full documentation [here](image-upload). TODO Write image upload page.
5. **`placeholder`** - Specify a string to act as a placeholder when the input field is empty.
6. **`required`** - Specify a boolean to show visually whether the particular field is required or not. Note: it is possible for the developer to bypass this setting easily and submit the form regardless of the data being entered, so do have sanity checks on the backend for your data.
7. **`editable`** - Setting this to true creates an `<input>` tag, whereas setting this to false creates a `<span>` tag to just show the default content of the field. Use this to mark some fields as read only.
8. **`value`** - Specify a string here to set it as the default value of the input field. This option is ignored in the case of an image.
9. **`typeahead`** - This is a special value and it provies autocompletion in the cases where the dataset is too long to be displayed in an option. Additonally, this allows fuzzy search among the options as well to make it easier to enter data. Read the full documentation [here](typeahead).
10. **`qrcode`** - Set this to true to enable using a QR code to take the data input. Using this would result in creating a readonly field which can only be modified using the QR Code scanner. You must set `editable = true` for this to take effect.

## Frontend Processing

Right now, you need to write your own code to submit the form, but we are in the process of creating a simple wrapper that takes all the values in the form to create a JSON object so that creating forms can be automated for the most part.

You can use jQuery to easily select and manipulate the individual fields using their name like:

```js
$('#field-name');
$('form #field-email');
```
