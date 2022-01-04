# \<json-autoform>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i json-autoform
```

## Usage

```html
<script type="module">
  import 'json-autoform/json-autoform.js';
</script>

<json-autoform model-name="user" name="userForm"></json-autoform>
```

## Attributes:

- **modelName** is the name of the model to be used inside the **schema**.
- **name** is the name of the form.
- **level** the level of the web component. If the level is greater than 0, the web component belongs to other json-autoform web component and it will be rendered into a fieldset

## Events:

### Dispatched events:

- **wc-ready**: when the web component is ready.
- **save-form**: when the form is saved.
- **form-updated**: when a field of the form is updated.

### Listened events:

- **json-fill-data**: to fill the form with data.

## Theming:

- **--json-autoform-fieldset-border** Default 1px solid #ccc
- **--json-autoform-border-radius**. Default 1rem
- **--json-autoform-margin**. Default 1rem
- **--json-autoform-padding**. Default 1rem
- **--json-autoform-direction**. Default column
- **--json-autoform-wrap**. Default wrap
- **--json-autoform-justify**. Default flex-start
- **--json-autoform-label-padding**. Default 0
- **--json-autoform-label-margin**. Default 0.5rem 0 0 0
- **--json-autoform-label-font-size**. Default 1rem
- **--json-autoform-label-font-weight**. Default bold
- **--json-autoform-label-color**. Default #000
- **--json-autoform-bocadillo-cuadrado-height**. Default 200px
- **--json-autoform-bocadillo-cuadrado-width**. Default 300px
- **--json-autoform-bocadillo-cuadrado-background**. Default #fff
- **--json-autoform-bocadillo-cuadrado-padding**. Default 1rem
- **--json-autoform-bocadillo-cuadrado-font-family**. Default system-ui
- **--json-autoform-btn-font-weight**. Default 400;
- **--json-autoform-btn-line-height**. Default 1.5
- **--json-autoform-btn-color**. Default #212529
- **--json-autoform-btn-background-color**. Default transparent
- **--json-autoform-btn-border**. Default 1px solid transparent
- **--json-autoform-btn-padding**. Default 0.375rem 0.75rem
- **--json-autoform-btn-font-size**. Default 1rem
- **--json-autoform-btn-border-radius**. Default 0.25rem
- **--json-autoform-btn-max-width**. Default 9rem
- **--json-autoform-btn-primary-background-color**. Default #0d6efd
- **--json-autoform-btn-primary-border-color**. Default #0d6efd
- **--json-autoform-btn-primary-margin-left**. Default 1rem

## SCHEMA

El esquema que interpreta el componente es una estructura de datos que define el formulario.
Tiene la siguiente estructura:

```json
"nombre_formulario"": {
  "__fieldTypes__": {},
  "__modelTypes__": {},
  "__labels__": {},
  "__groups__": {},
  "__info__": {},
  "__validations__": {},
}
```

### Model types

En "\***\*modelTypes\*\***" se indica si el campo es único o multiple (se puede repetir). Los valores posibles son "single" y "multiple". En caso de no especificarse, por defecto es "single".

```json
"__modelTypes__": {
  "single_number_field_one": "single",
  "single_string_field_two": "single",
  "single_string_field_twoandhalf": "single",
  "single_radio_field_three_withoutgroup": "single",
  "single_textarea_field_four": "single",
  "single_file_field_six": "single",
  "single_checkbox_field_five_withoutgroup_neitherinfo": "single",
  "single_model_field_six": "single",
  "newbbdd_number_field_seven": "single",
  "newbbdd_string_field_eight": "single",
  "newbbdd_model_field_eightandhalf": "single",
  "multiple_number_field_nine": "multiple",
  "multiple_string_field_ten": "multiple",
  "multiple_radio_field_eleven": "multiple",
  "multiple_textarea_field_twelwe": "multiple",
  "multiple_model_field_thirteen": "multiple"
},
```

### Field types

En "**fieldTypes**" se indica de qué tipo será cada campo del formulario. Podemos elegir entre los tipos de campos de formulario: "text", "number", "file", "radio", "checkbox", "date"... Además de "select", "textarea" y "datalist".
En caso de que el campo sea de tipo "select", "radio" y "checkbox"(opcionalmente), se debe indicar seguido de dos puntos el id que irá en el esquema que contiene los "options".
En caso de querer que el campo sea otro modelo, se indica "model" seguido de dos puntos y el nombre del modelo, que debe estar definido en el esquema.
El id de cada campo se usará como nombre del campo en el formulario.
En la etiqueta _label_ se mostrará sin '\_' que serán reemplazados por ' ' en el nombre del campo en caso de que no exista en el esquema dentro de '**labels**'.

```json
"__fieldTypes__": {
  "single_number_field_one": "number",
  "single_string_field_two": "string",
  "single_string_field_twoandhalf": "string",
  "single_radio_field_three_withoutgroup": "radio:single_radio_field_three_withoutgroup",
  "single_textarea_field_four": "textarea",
  "single_file_field_six": "file",
  "single_checkbox_field_five_withoutgroup_neitherinfo": "checkbox",
  "single_model_field_six": "model:single_model_field_six",
  "newbbdd_number_field_seven": "number",
  "newbbdd_string_field_eight": "string",
  "newbbdd_model_field_eightandhalf": "select:myOptions",
  "multiple_number_field_nine": "number",
  "multiple_string_field_ten": "string",
  "multiple_radio_field_eleven": "radio",
  "multiple_textarea_field_twelwe": "textarea",
  "multiple_model_field_thirteen": "model:multiple_model_field_thirteen"
},
```

### Labels

En "**labels**" se indican las etiquetas de los campos del formulario. Si no estuviera definido se tomará por defecto el id del campo reemplazando los '\_' por ' '.

```json
"__labels__": {
  "single_number_field_one": "Single number field one",
  "single_string_field_two": "Single string field two",
  "single_string_field_twoandhalf": "Single string field two and half",
  "single_radio_field_three_withoutgroup": "Single radio field three without group",
  "single_textarea_field_four": "Single textarea field four",
  "single_file_field_six": "Single file field six",
  "single_checkbox_field_five_withoutgroup_neitherinfo": "Single checkbox field five without group neither info",
  "single_model_field_six": "Single model field six",
  "newbbdd_number_field_seven": "Newbbdd number field seven",
  "newbbdd_string_field_eight": "Newbbdd string field eight",
  "newbbdd_model_field_eightandhalf": "Newbbdd model field eight and half",
  "multiple_number_field_nine": "Multiple number field nine",
  "multiple_string_field_ten": "Multiple string field ten",
  "multiple_radio_field_eleven": "Multiple radio field eleven",
  "multiple_textarea_field_twelwe": "Multiple textarea field twelwe",
  "multiple_model_field_thirteen": "Multiple model field thirteen"
}
```

### Groups

En "**groups**" se encuentran los grupos de campos que se deben mostrar en el formulario, que se mostrarán dentro de un fieldset.
El id de cada grupo aparecerá como _legend_ del fieldset. En el caso de usar valores numéricos se mostrará sin _legend_.
Todos los elementos serán arrays de strings con los nombres de los campos.
Los campos de "**model**" que no estén definidos en ningún grupo se pintarán al final del formulario sueltos.

```json
"__groups__"": {
  "1": ["single_string_field_twoandhalf"],
  "single_group": [
    "single_number_field_one",
    "single_string_field_two",
    "single_model_field_six",
    "single_file_field_six",
  ],
  "newbbdd_group": [
    "newbbdd_number_field_seven",
    "newbbdd_string_field_eight",
    "single_textarea_field_four",
    "newbbdd_model_field_eightandhalf",
  ],
  "multiple_group": [
    "multiple_number_field_nine",
    "multiple_string_field_ten",
    "multiple_radio_field_eleven",
    "multiple_textarea_field_twelwe",
    "multiple_model_field_thirteen",
  ],
},
```

### Info

En "**info**" se almacena la descripción de cada campo, que se mostrará en el formulario al lado del icono de información '?' que se mostrará al lado de cada label del campo.

```json
"__info__"": {
  "single_number_field_one": "This is a single_number field one",
  "single_string_field_two": "This is a single_string field two",
  "single_radio_field_three_withoutgroup": "This is a single_radio field",
  "single_textarea_field_four": "This is a single_textarea field",
  "single_model_field_six": "This is a single_model field",
  "single_file_field_six": "This is a file. Extensions allowed: pdf,zip,jpg,png",
  "newbbdd_number_field_seven": "This is a newbbdd_number field",
  "newbbdd_string_field_eight": "This is a newbbdd_string field",
  "multiple_number_field_nine": "This is a multiple_number field",
  "multiple_string_field_ten": "This is a multiple_string field",
  "multiple_radio_field_eleven": "This is a multiple_radio field",
  "multiple_textarea_field_twelwe": "This is a multiple_textarea field",
  "multiple_model_field_thirteen": "This is a multiple_model field",
},
```

### Validation

En "**validation**" se indicará el tipo de validación que se aplicará al campo. Se puede indicar que sea obligatorio. Se puede indicar el tipo de validación que se aplicará, pudiendo ser validaciones complejas como "nif" o "tarjeta".

```json
"__validations__": {
  "single_number_field_one": {
    "maxlength: 2",
    "required: true",
    "tovalidate": "number"
  },
  "single_string_field_two": {
    "required": true,
    "tovalidate": "alpha"
  },
  "single_radio_field_three_withoutgroup": {
    "required": true
  },
  "single_textarea_field_four": {
    "required": true,
    "tovalidate": "alpha"
  },
  "single_file_field_six": {
    "required": true,
    "tovalidate": "file:pdf,zip,jpg,png"
  },
  "newbbdd_number_field_seven": {
    "maxlength": 5,
    "required": true,
    "tovalidate": "number"
  },
  "newbbdd_string_field_eight": {
    "required": true,
    "tovalidate": "alpha"
  },
  "multiple_number_field_nine": {
    "maxlength": 2,
    "required": true,
    "tovalidate": "number"
  },
  "multiple_string_field_ten": {
    "required": true,
    "tovalidate": "alpha"
  },
  "multiple_radio_field_eleven": {
    "required": true,
  },
  "multiple_textarea_field_twelwe": {
    "required": true,
    "tovalidate": "alpha"
  }
}
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

## SCHEMA FIELD TYPES

### PREFIX

- single
- newbbdd
- multiple

### SUFFIX

- number
- string
- textarea
- radio
- checkboxes
- model

## VALIDATIONS:

- int, integer, float, number, numero
- alpha, alfa, text, texto, text-, alphaNumericSpace, textspace, alphaNumeric, textnum
- email, correo
- iccid
- nummovil, movil, mobile
- numfijo, fijo, landphone
- telefono, tel, telephone
- cp, postalcode
- cuentabancaria, accountnumber
- tarjetacredito, creditcard
- nif
- cif
- nie
- fecha, date
- pattern (TODO)
