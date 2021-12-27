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

- modelName is the name of the model to be used inside the **schema**.
- name is the name of the form.
- level the level of the web component. If the level is greater than 0, the web component belongs to other json-autoform web component and it will be rendered into a fieldset

## Events:

### Output dispatched events:

- wc-ready: when the web component is ready.
- save-form: when the form is saved.
- form-updated: when a field of the form is updated.

### Output listened events:

- json-fill-data: to fill the form with data.

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
