import { html, LitElement } from 'lit';
import { ValidateForm } from 'automatic_form_validation';
import 'rich-inputfile/rich-inputfile';
import { jsonAutoformStyles } from './json-autoform-style.js';

export class JsonAutoform extends LitElement {
  static get styles() {
    return [jsonAutoformStyles];
  }

  static get properties() {
    return {
      id: { type: String },
      /**
       * @description The name of the types inside the __schema__.
       * @type {String}
       * @attribute types-name
       * @default ''
       * @example
       * <json-autoform types-name="user"></json-autoform>
       */
      modelName: { type: String, attribute: 'model-name' },
      /**
       * @description The name of the form.
       * @type {String}
       * @attribute name
       * @default ''
       * @example
       * <json-autoform name="userForm"></json-autoform>
       */
      name: { type: String },
      /**
       * @description Set the level of the web component. If the level is greater than 0, the web component belongs to other json-autoform web component and it will be rendered into a fieldset
       * @type {Number}
       * @attribute level
       * @default 0
       * @example
       * <json-autoform level="1" types-name="user" name="user" show-name="true"></json-autoform>
       */
      level: { type: Number, reflect: true },
    };
  }

  constructor({ modelName = '', name = '', level = 0, autoSave = false } = {}) {
    super();
    this.id = `json-keyslist${Math.floor(Math.random() * 1000000)}`;
    this.modelName = modelName;
    this.name = name;
    this.level = level;
    this.autoSave = autoSave;

    this.fieldTypes = {};
    this.labels = {};
    this.modelTypes = {};
    this.groups = {};
    this.info = {};
    this.validations = {};

    this.jsonData = {};
    this.user = null;

    this.container = null;

    this.fnTypes = {
      single: this._drawSingleFields.bind(this),
      multiple: this._drawMultipleFields.bind(this),
    };

    this.fnFormTypes = {
      input: this._createInputField.bind(this),
      textarea: this._createTextareaField.bind(this),
      file: this._createFileField.bind(this),
      radio: this._createRadioButtonField.bind(this),
      checkbox: this._createCheckboxField.bind(this),
      model: this._createModelFields.bind(this),
      select: this._createSelectField.bind(this),
      datalist: this._createInputDetailsField.bind(this),
    };

    this.linkStyles =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" />';

    // Used by ValidateForm
    this.htmlInputAttributes = [
      'maxlength',
      'minlength',
      'size',
      'max',
      'min',
      'step',
      'pattern',
      'placeholder',
    ];

    this.saveForm = this.saveForm.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    document.removeEventListener('click', this._hideBocadillo.bind(this));
  }

  firstUpdated() {
    customElements.whenDefined('rich-inputfile').then(() => {
      if (super.firstUpdated) {
        super.firstUpdated();
      }
      this.id = this.id || `json-autoform-${new Date().getTime()}`;
      document.addEventListener('click', this._hideBocadillo.bind(this));
      this.container = this.shadowRoot.querySelector('.container');
      this._createBocadillo();
      const componentCreatedEvent = new CustomEvent('wc-ready', {
        detail: {
          id: this.id,
          componentName: this.tagName,
          component: this,
        },
      });
      document.dispatchEvent(componentCreatedEvent);
    });

    document.addEventListener(
      'json-autoform-fill-data-values',
      this._fillData.bind(this)
    );
  }

  _getDataVerified(jsonData) {
    const realData = {};
    if (jsonData) {
      if (typeof jsonData === 'object') {
        const dataKeys = Object.keys(jsonData);
        dataKeys.forEach(key => {
          if (typeof jsonData[key] === 'object') {
            realData[key] = this._getDataVerified(jsonData[key]);
          } else {
            realData[key] = jsonData[key];
          }
        });
      }
    }
    return realData;
  }

  fillDataValues(myScope = this.shadowRoot) {
    const scope = myScope;
    const dataKeys = Object.keys(this.jsonData);
    dataKeys.forEach(key => {
      const value = this.jsonData[key];
      if (typeof value === 'object') {
        this._fillDataValues(value);
      } else if (scope.querySelector(`[name="${key}"]`)) {
        scope.querySelector(`[name="${key}"]`).value = value;
      } else {
        scope.querySelectorAll('json-autoform').forEach(jsonAutoform => {
          this._fillDataValues(jsonAutoform.shadowRoot);
        });
      }
    });
  }

  _fillData(event) {
    if (event.detail.id === this.id) {
      this.jsonData = this._getDataVerified(event.detail.jsonData);
      this.fillDataValues();
    }
  }

  _getContainer(modelElementName) {
    let { container } = this;
    this.groupsKeys.forEach(groupKey => {
      if (this.groups[groupKey].includes(modelElementName)) {
        // console.log(modelElementName, [...this.shadowRoot.querySelectorAll(`[id^="${groupKey}"`)].length);
        const groupKeyId = Number.isNaN(parseInt(groupKey, 10))
          ? groupKey
          : `_${groupKey}`;
        container = this.container.querySelector(`#${groupKeyId}`);
      }
    });
    return container;
  }

  _getSchemaModel(modelPathName) {
    const paths = modelPathName.split('/');
    if (paths[0] === '') paths.shift();
    let types = this.schema;
    paths.forEach(path => {
      types = types[path];
    });
    return types;
  }

  /** DRAW types */
  _insertField(field, container, where = 'inside') {
    this.kk = null;
    if (where === 'inside') {
      container.appendChild(field);
    } else if (where === 'before') {
      container.insertBefore(field, container.firstChild);
    } else if (where === 'after') {
      container.parentNode.insertBefore(field, container.nextSibling);
    } else if (where === 'last') {
      container.appendChild(field);
    }
  }

  _drawSingleFields(
    fieldType,
    modelElementName,
    container = this._getContainer(modelElementName),
    where = 'inside'
  ) {
    const fieldTypeCleaned = fieldType.split(':')[0];
    const fnFormType = Object.keys(this.fnFormTypes).includes(fieldTypeCleaned)
      ? this.fnFormTypes[fieldTypeCleaned]
      : this.fnFormTypes.input;
    const field =
      fieldType === 'hidden'
        ? this._createHiddenField(modelElementName, fieldType)
        : fnFormType(modelElementName, fieldType);
    this._insertField(field, container, where);
    if (fieldType !== 'hidden') this._createInfoIcon(field, modelElementName);
  }

  _drawMultipleFields(
    fieldType,
    modelElementName,
    container = this._getContainer(modelElementName),
    where = 'inside'
  ) {
    const fieldTypeCleaned = fieldType.split(':')[0];
    const fnFormType = Object.keys(this.fnFormTypes).includes(fieldTypeCleaned)
      ? this.fnFormTypes[fieldTypeCleaned]
      : this.fnFormTypes.input;
    const field = fnFormType(modelElementName, fieldType);
    const divLayer = this._createDivLayer(
      modelElementName,
      'multiple_container'
    );
    container.appendChild(divLayer);
    this._insertField(field, divLayer, where);
    this._createInfoIcon(field, modelElementName);
    const addButton = this._createAddButton(modelElementName);
    if (addButton) {
      field.appendChild(addButton);
    }
  }

  /** DRAWING FORM */
  _drawFieldsetsFormGroups() {
    const { groups } = this;
    if (groups) {
      this.groupsKeys = Object.keys(groups);
      this.groupsKeys.forEach(groupKey => {
        const fieldset = this._createFieldset(groupKey);
        this.container.appendChild(fieldset);
      });
    }
  }

  _getAllGroupValues() {
    let all = [];
    const arr = Object.values(this.groups);
    arr.reduce((acum, el) => {
      all = [...all, ...el];
      return all;
    }, []);
    return all;
  }

  _drawFormFieldsModel() {
    const { fieldTypes, modelTypes } = this;
    this.allGroupValues = this._getAllGroupValues();
    const groupAndNoGroupKeys = new Set([
      ...this.allGroupValues,
      ...Object.keys(fieldTypes),
    ]);
    // Object.keys(fieldTypes).forEach(modelElementName => {
    groupAndNoGroupKeys.forEach(modelElementName => {
      const field = fieldTypes[modelElementName];
      const fieldSchemaType = modelTypes[modelElementName];
      // console.log(fieldSchemaType, field, modelElementName);
      this.fnTypes[fieldSchemaType](field, modelElementName);
    });
  }

  _drawFormScaffolding() {
    this.container.innerHTML = '';
    this.container.appendChild(this.bocadillo);
    this._drawFieldsetsFormGroups();
    this._drawFormFieldsModel();
    this.validateForm = new ValidateForm(this.isFormUpdated, {
      scope: this.shadowRoot,
    });
  }

  /** CREATE FORM ELEMENTS */
  _createLabel(modelElementName) {
    this._null = null;
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    label.classList.add('main-form-label');
    label.innerHTML = this.labels[modelElementName]
      ? this.labels[modelElementName]
      : modelElementName.replace(/_/g, ' ');
    return label;
  }

  _createInput(modelElementName, fType = 'text') {
    const fieldType = fType;
    const input = document.createElement('input');
    input.setAttribute('type', fieldType);
    input.setAttribute('name', modelElementName);
    input.setAttribute('id', this._getNewId(modelElementName));
    input.setAttribute('value', '');
    input.classList.add('form-control');
    return this._addvalidations(input, modelElementName);
  }

  _createRichInputfile(modelElementName) {
    const validations = this.validations[modelElementName];
    const elemAttributes = [
      `id="${modelElementName}"`,
      `name="${modelElementName}"`,
    ];
    if (validations) {
      const validationsKeys = Object.keys(validations);
      validationsKeys.forEach(validationsKey => {
        const validationsValue = validations[validationsKey];
        if (validationsKey === 'required') {
          elemAttributes.push(`data-required="${validationsValue}"`);
        }
        if (validationsKey === 'tovalidate') {
          elemAttributes.push(
            `allowed-extensions="${String(validationsValue).replace(
              'file:',
              ''
            )}"`
          );
        }
      });
    }
    const richInputfile = `<rich-inputfile 
      ${elemAttributes.join(' ')}
    ></rich-inputfile>`;
    return richInputfile;
  }

  _createTextarea(modelElementName) {
    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control');
    textarea.setAttribute('name', modelElementName);
    textarea.setAttribute('id', this._getNewId(modelElementName));
    textarea.setAttribute('rows', '5');
    textarea.innerHTML = '';
    this._addTextareaEvents(textarea, modelElementName);
    return this._addvalidations(textarea, modelElementName);
  }

  _createRadioButton(modelElementName, radioName = modelElementName, row) {
    const radio = document.createElement('input');
    radio.setAttribute('type', 'radio');
    radio.classList.add('form-check-input');
    radio.style.gridRow = `${row} / ${row}`;
    radio.setAttribute('name', radioName);
    radio.setAttribute('value', modelElementName);
    radio.setAttribute('id', this._getNewId(radioName));
    this._addInputEvents(radio, modelElementName);
    return this._addvalidations(radio, modelElementName);
  }

  _createCheckbox(modelElementName) {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('form-check-input');
    checkbox.setAttribute('name', modelElementName);
    checkbox.setAttribute('id', this._getNewId(modelElementName));
    this._addInputEvents(checkbox, modelElementName);
    return this._addvalidations(checkbox, modelElementName);
  }

  _createDatalist(select, types, modelElementName) {
    this._null = null;
    const patternMatcher = [];
    const datalist = document.createElement('datalist');
    datalist.id = `${modelElementName}-datalist`;
    types.forEach(item => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerHTML = item;
      datalist.appendChild(option);
      patternMatcher.push(item);
    });
    select.setAttribute('pattern', patternMatcher.join('|'));
    return datalist;
  }

  _createOptions(select, types) {
    this._null = null;
    const optionDefault = document.createElement('option');
    optionDefault.setAttribute('value', '');
    optionDefault.innerHTML = 'Selecciona una opción';
    select.appendChild(optionDefault);
    types.forEach(item => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerHTML = item;
      select.appendChild(option);
    });
  }

  _createSelect(modelElementName) {
    this._null = null;
    const select = document.createElement('select');
    select.setAttribute('name', modelElementName);
    select.setAttribute('id', this._getNewId(modelElementName));
    select.classList.add('form-control');
    return this._addvalidations(select, modelElementName);
  }

  _createInfoIcon(element, modelElementName) {
    if (this.info) {
      const label = element.querySelector('label');
      const infoIcon = document.createElement('div');
      infoIcon.classList.add('info-space');
      element.insertBefore(infoIcon, label);
      if (this.info[modelElementName]) {
        infoIcon.classList.add('info-icon');
        infoIcon.addEventListener('click', ev => {
          ev.stopPropagation();
          ev.preventDefault();
          const targetInfo = ev.target.getClientRects();
          const bocadillo = this.info[modelElementName];
          this._showBocadillo(targetInfo, bocadillo);
        });
      }
    }
  }

  _createFieldset(modelElementName) {
    const fieldsetName = Number.isNaN(parseInt(modelElementName, 10))
      ? modelElementName
      : `_${modelElementName}`;
    const fieldset = document.createElement('fieldset');
    fieldset.setAttribute('id', fieldsetName);
    fieldset.setAttribute('name', fieldsetName);
    const styleLegend = Number.isNaN(parseInt(modelElementName, 10))
      ? ''
      : ' style="display:none;"';
    const legend = this.labels[modelElementName]
      ? this.labels[modelElementName]
      : modelElementName;
    fieldset.innerHTML = `<legend${styleLegend}>${legend}</legend>`;
    this.container.appendChild(fieldset);
    return fieldset;
  }

  /** CREATE FROM FIELDS (div with label, form element and icon info) */
  _createDivLayer(modelElementName, layerPrefixName = 'layer-field') {
    const divLayer = document.createElement('div');
    divLayer.setAttribute(
      'id',
      this._getElementId(layerPrefixName, modelElementName)
    );
    return divLayer;
  }

  _createHiddenField(modelElementName) {
    const hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    hidden.setAttribute('name', modelElementName);
    hidden.setAttribute('id', this._getNewId(modelElementName));
    return hidden;
  }

  _createInputField(modelElementName, fieldType = 'text') {
    const label = this._createLabel(modelElementName);
    const input = this._createInput(modelElementName, fieldType);
    this._addInputEvents(input, modelElementName);
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    return divLayer;
  }

  _createTextareaField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const textarea = this._createTextarea(modelElementName);
    textarea.style.maxHeight = '8rem';
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    return divLayer;
  }

  _createFileField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.innerHTML += this._createRichInputfile(modelElementName);
    return divLayer;
  }

  _createRadioButtonField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const pathModel = this.fieldTypes[modelElementName].split(':')[1];
    const radiobuttons = this._getSchemaModel(pathModel);
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    if (radiobuttons) {
      radiobuttons.forEach((item, index) => {
        const radio = this._createRadioButton(
          item,
          modelElementName,
          index + 2
        );
        const subLabel = this._createLabel(item);
        subLabel.classList.add('form-check-label');
        divLayer.appendChild(radio);
        divLayer.appendChild(subLabel);
      });
    } else {
      const radio = this._createRadioButton(
        modelElementName,
        modelElementName,
        2
      );
      divLayer.appendChild(radio);
    }
    return divLayer;
  }

  _createCheckboxField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const types = this.fieldTypes[modelElementName].split(':')[1];
    const checkboxes = this.schema[types];
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    if (checkboxes) {
      checkboxes.forEach(item => {
        const checkbox = this._createCheckbox(item, modelElementName);
        const subLabel = this._createLabel(item);
        subLabel.classList.add('form-check-label');
        divLayer.appendChild(checkbox);
        divLayer.appendChild(subLabel);
      });
    } else {
      const checkbox = this._createCheckbox(modelElementName);
      divLayer.appendChild(checkbox);
    }
    return divLayer;
  }

  _createInputDetailsField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const select = this._createInput(modelElementName);
    select.removeAttribute('type');
    select.setAttribute('list', `${modelElementName}-datalist`);
    const pathModel = this.fieldTypes[modelElementName].split(':')[1];
    const selectSchema = this._getSchemaModel(pathModel);
    this._addSelectEvents(select, modelElementName);
    const datalist = this._createDatalist(
      select,
      selectSchema,
      modelElementName
    );
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    divLayer.appendChild(datalist);
    return divLayer;
  }

  _createSelectField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const select = this._createSelect(modelElementName);
    const pathModel = this.fieldTypes[modelElementName].split(':')[1];
    const radiobuttonsSchema = this._getSchemaModel(pathModel);
    this._addSelectEvents(select, modelElementName);
    this._createOptions(select, radiobuttonsSchema);
    const divLayer = this._createDivLayer(modelElementName);
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    return divLayer;
  }

  _createModelFields(modelElementName) {
    const newId = this._getNewId(modelElementName);
    const fieldset = this._createFieldset(modelElementName);
    const jsonAutoform = document.createElement('json-autoform');
    jsonAutoform.setAttribute('name', modelElementName);
    jsonAutoform.setAttribute('model-name', modelElementName);
    jsonAutoform.setAttribute('id', newId);
    jsonAutoform.setAttribute('level', this.level + 1);
    document.addEventListener('wc-ready', e => {
      // console.log('wc-ready', e.detail);
      if (e.detail.id === newId) {
        jsonAutoform.setSchema(this.schema);
      }
    });
    fieldset.appendChild(jsonAutoform);
    return fieldset;
  }

  /** CREATE ADD BUTTONS */
  _addBtnProperties(btn, modelElementName) {
    const addButton = btn;
    const numButtons = [
      ...this.shadowRoot.querySelectorAll(`[id^="add-${modelElementName}"]`),
    ].length;
    if (numButtons === 0) {
      addButton.setAttribute('id', `add-${modelElementName}-${numButtons}`);
      addButton.title = `Add new ${modelElementName}`;
      addButton.innerHTML = 'Add';
      addButton.classList.add('btn', 'btn-primary');
      addButton.setAttribute('tabindex', 0);
    }
  }

  _addNewElement(modelElementName, e) {
    e.preventDefault();
    const { parentElement } = e.target.parentElement;
    const fieldFormType = this.fieldTypes[modelElementName];
    const fieldType = this.modelTypes[modelElementName];
    this.fnTypes[fieldType](
      fieldFormType,
      modelElementName,
      parentElement,
      'last'
    );
    // console.log(modelElementName, this.fieldTypes[modelElementName]);
  }

  _createAddButton(modelElementName) {
    const numButtons = [
      ...this.shadowRoot.querySelectorAll(`[id^="add-${modelElementName}"]`),
    ].length;
    if (numButtons === 0) {
      const addButton = document.createElement('button');
      this._addBtnProperties(addButton, modelElementName);
      addButton.addEventListener(
        'click',
        this._addNewElement.bind(this, modelElementName)
      );
      return addButton;
    }
    return null;
  }

  _createSaveBtn() {
    const saveButton = document.createElement('button');
    saveButton.title = 'Save';
    saveButton.innerHTML = 'Save';
    saveButton.classList.add('btn', 'btn-primary');
    saveButton.setAttribute('tabindex', 0);
    this.shadowRoot.querySelector(`form`).appendChild(saveButton);
    saveButton.addEventListener('click', this.saveForm);
  }

  /** BOCADILLO */
  _createBocadillo() {
    this.bocadillo = document.createElement('div');
    this.bocadillo.setAttribute('id', 'bocadillo');
    this.bocadillo.setAttribute('style', 'display: none;');
    this.bocadillo.classList.add('bocadillo-cuadrado');
  }

  _showBocadillo(targetInfo, bocadillo) {
    if (bocadillo) {
      this.bocadillo.style.display = 'block';
      const { scrollY } = window;
      const targetInfoTop = targetInfo[0].top;
      const targetInfoHeight = targetInfo[0].height;
      const bocadilloInfoHeight = this.bocadillo.getBoundingClientRect().height;
      const targetInfoBottom =
        targetInfoTop - targetInfoHeight - bocadilloInfoHeight + scrollY;
      this.bocadillo.innerHTML = `<p>${bocadillo}</p>`;
      this.bocadillo.style.top = `${targetInfoBottom}px`;
    }
  }

  _hideBocadillo(ev) {
    if (ev.target.id !== 'bocadillo') {
      this.bocadillo.style.display = 'none';
    }
  }

  /** SETTERS */
  setSchema(schema) {
    this.schema = schema;
    // console.log(`modelName: ${this.modelName}`);
    this.fieldTypes = this.schema[this.modelName].__fieldTypes__ || null;
    this.modelTypes = this.schema[this.modelName].__modelTypes__ || null;
    this.labels = this.schema[this.modelName].__labels__ || {};
    this.groups = this.schema[this.modelName].__groups__ || {};
    this.info = this.schema[this.modelName].__info__ || {};
    this.validations = this.schema[this.modelName].__validations__ || {};

    if (!this.fieldTypes && !this.modelTypes) {
      throw new Error('No schema fieldTypes and/or schema modelTypes found');
    }

    this.generateForm();
  }

  /** GETTERS */
  _getElementId(element, modelElementName) {
    const nLayer = [
      ...this.shadowRoot.querySelectorAll(
        `[id^="${element}-${modelElementName}"]`
      ),
    ].length;
    return `${element}-${modelElementName}-${nLayer}`;
  }

  _getNewId(modelElementName) {
    const parentId = this.container.id;
    return this._getElementId(parentId, modelElementName);
  }

  /** ADD EVENTS */
  _addSelectEvents(select, modelElementName) {
    select.addEventListener('change', e => {
      this.jsonData[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
    select.addEventListener('focus', ev => {
      const targetInfo = ev.target.getClientRects();
      const bocadillo = this.info[modelElementName];
      this._showBocadillo(targetInfo, bocadillo);
    });
  }

  _addInputEvents(input, modelElementName) {
    input.addEventListener('blur', e => {
      this.jsonData[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
  }

  _addTextareaEvents(textarea, modelElementName) {
    textarea.addEventListener('change', e => {
      this.jsonData[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
  }

  /** ADD FORM ELEMENTS */
  _addNewModel(modelElementName, bFieldMultiple, fieldType, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const fieldset = this._createFieldset(modelElementName);
    this.container.appendChild(fieldset);
    this.fn[fieldType](modelElementName, bFieldMultiple, fieldType);
  }

  _addNewInput(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const input = this._createInput(modelElementName, modelElement);
    this._addInputEvents(input, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(input);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addNewSelect(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const select = this._createSelect(modelElementName, modelElement);
    this._createOptions(select, modelElement);
    this._addSelectEvents(select, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(select);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addNewTextarea(modelElementName, modelElement, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const label = document.createElement('label');
    label.setAttribute('for', modelElementName);
    const textarea = this._createTextarea(modelElementName, modelElement);
    this._addInputEvents(textarea, modelElementName);
    const divLayer = document.createElement('div');
    divLayer.classList.add('form-group');
    divLayer.appendChild(label);
    divLayer.appendChild(textarea);
    const brotherLayer = ev.target.parentNode;
    brotherLayer.parentNode.insertBefore(divLayer, brotherLayer.nextSibling);
    this._createInfoIcon(label, '');
  }

  _addvalidations(formElement, modelElementName) {
    const element = formElement;
    const validations = this.validations[modelElementName];
    if (validations) {
      const validationsKeys = Object.keys(validations);
      validationsKeys.forEach(validationsKey => {
        const validationsValue = validations[validationsKey];
        if (this.htmlInputAttributes.includes(validationsKey)) {
          element.setAttribute(validationsKey, validationsValue);
        } else {
          element.dataset[validationsKey] = validationsValue;
        }
      });
    }
    return element;
  }

  /** MAIN METHODS */
  generateForm() {
    if (this.schema) {
      this._drawFormScaffolding();
      if (this.level === 0) {
        this._createSaveBtn();
      }
    } else {
      const errObj = {
        message: 'No schema defined',
        type: 'error',
      };
      throw errObj();
    }
  }

  isFormUpdated() {
    const updateEvent = new CustomEvent('json-autoform-field-updated', {
      detail: {
        types: this.fieldTypes,
      },
    });
    document.dispatchEvent(updateEvent);
  }

  saveForm(e) {
    e.preventDefault();
    this.jsonData = this.getFormData();
    const okFieldsNoEmpty = this.validateForm.noEmptyFields();
    const okFieldsValidated = this.validateForm.validateFields();
    if (okFieldsNoEmpty && okFieldsValidated) {
      if (this.level === 0) {
        const saveFormEvent = new CustomEvent('json-autoform-save-form', {
          detail: {
            id: this.id,
            jsonData: this.jsonData,
          },
        });
        document.dispatchEvent(saveFormEvent);
      }
    }
  }

  getFormData() {
    const jsonData = {};
    this.container
      .querySelectorAll(
        'input[type="text"], input[type="number"], select, textarea, rich-inputfile'
      )
      .forEach(input => {
        if (!jsonData[input.name]) {
          jsonData[input.name] = input.value;
        } else if (Array.isArray(jsonData[input.name])) {
          jsonData[input.name].push(input.value);
        } else {
          const tmp = jsonData[input.name];
          jsonData[input.name] = [tmp, input.value];
        }
      });
    this.container
      .querySelectorAll('input[type="radio"], input[type="checkbox"]')
      .forEach(input => {
        if (input.checked) {
          jsonData[input.name] = input.value;
        } else if (jsonData[input.name] === undefined) {
          jsonData[input.name] = '';
        }
      });
    this.container.querySelectorAll('json-autoform').forEach(jsonAutoform => {
      if (!jsonData[jsonAutoform.name]) {
        jsonData[jsonAutoform.name] = jsonAutoform.getFormData();
      } else if (Array.isArray(jsonData[jsonAutoform.name])) {
        jsonData[jsonAutoform.name].push(jsonAutoform.getFormData());
      } else {
        const tmp = jsonData[jsonAutoform.name];
        jsonData[jsonAutoform.name] = [tmp, jsonAutoform.getFormData()];
      }
    });
    return jsonData;
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      />
      <form
        id="form-${this.id}"
        class="container 100%"
        data-validate="true"
        data-checkrealtime="true"
      ></form>
    `;
  }
}
