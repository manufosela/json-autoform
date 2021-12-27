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
