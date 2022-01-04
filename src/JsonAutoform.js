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
       * @description The name of the model inside the __schema__.
       * @type {String}
       * @attribute model-name
       * @default ''
       * @example
       * <json-autoform model-name="user"></json-autoform>
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
       * <json-autoform level="1" model-name="user" name="user" show-name="true"></json-autoform>
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

    this.model = {};
    this.labels = {};
    this.types = {};
    this.groups = {};
    this.info = {};
    this.validations = {};

    this.data = {};
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

    document.addEventListener('json-fill-data', this._fillData.bind(this));
  }

  _getDataVerified(data) {
    const realData = {};
    if (data) {
      if (typeof data === 'object') {
        const dataKeys = Object.keys(data);
        dataKeys.forEach(key => {
          if (typeof data[key] === 'object') {
            realData[key] = this._getDataVerified(data[key]);
          } else {
            realData[key] = data[key];
          }
        });
      }
    }
    return realData;
  }

  _fillDataValues(myScope = this.shadowRoot) {
    const scope = myScope;
    const dataKeys = Object.keys(this.data);
    dataKeys.forEach(key => {
      const value = this.data[key];
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
      this.data = this._getDataVerified(event.detail.data);
      this._fillDataValues();
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
    let model = this.schema;
    paths.forEach(path => {
      model = model[path];
    });
    return model;
  }

  /** DRAW TYPES */
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
    fieldFormType,
    modelElementName,
    container = this._getContainer(modelElementName),
    where = 'inside'
  ) {
    const fieldFormTypeCleaned = fieldFormType.split(':')[0];
    const fnFormType = Object.keys(this.fnFormTypes).includes(
      fieldFormTypeCleaned
    )
      ? this.fnFormTypes[fieldFormTypeCleaned]
      : this.fnFormTypes.input;
    const field = fnFormType(modelElementName, fieldFormType);
    this._insertField(field, container, where);
    this._createInfoIcon(field, modelElementName);
  }

  // _drawNewBbddFields(
  //   fieldFormType,
  //   modelElementName,
  //   container = this._getContainer(modelElementName),
  //   where = 'inside'
  // ) {
  //   this._drawSingleFields(fieldFormType, modelElementName, container, where);
  // }

  _drawMultipleFields(
    fieldFormType,
    modelElementName,
    container = this._getContainer(modelElementName),
    where = 'inside'
  ) {
    const fieldFormTypeCleaned = fieldFormType.split(':')[0];
    const fnFormType = Object.keys(this.fnFormTypes).includes(
      fieldFormTypeCleaned
    )
      ? this.fnFormTypes[fieldFormTypeCleaned]
      : this.fnFormTypes.input;
    const field = fnFormType(modelElementName, fieldFormType);
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
    const { model, types } = this;
    this.allGroupValues = this._getAllGroupValues();
    Object.keys(model).forEach(modelElementName => {
      const field = model[modelElementName];
      const fieldSchemaType = types[modelElementName];
      console.log(fieldSchemaType, field, modelElementName);
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
    const fieldType = fType === 'string' ? 'text' : fType;
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

  _createOptions(select, model) {
    this._null = null;
    const optionDefault = document.createElement('option');
    optionDefault.setAttribute('value', '');
    optionDefault.innerHTML = 'Selecciona una opción';
    select.appendChild(optionDefault);
    model.forEach(item => {
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
    fieldset.innerHTML = `<legend${styleLegend}>${modelElementName}</legend>`;
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
    const pathModel = this.model[modelElementName].split(':')[1];
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
    const model = this.model[modelElementName].split(':')[1];
    const checkboxes = this.schema[model];
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

  _createSelectField(modelElementName) {
    const label = this._createLabel(modelElementName);
    const select = this._createSelect(modelElementName);
    const pathModel = this.model[modelElementName].split(':')[1];
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
    const model = this.model[modelElementName].split(':')[1];
    jsonAutoform.setAttribute('name', modelElementName);
    jsonAutoform.setAttribute('model-name', modelElementName);
    jsonAutoform.setAttribute('id', newId);
    jsonAutoform.setAttribute('level', this.level + 1);
    document.addEventListener('wc-ready', e => {
      // console.log('wc-ready', e.detail);
      if (e.detail.id === newId) {
        jsonAutoform.setSchema(this.schema[model]);
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
    const fieldFormType = this.model[modelElementName];
    const fieldType = this.types[modelElementName];
    this.fnTypes[fieldType](
      fieldFormType,
      modelElementName,
      parentElement,
      'last'
    );
    // console.log(modelElementName, this.model[modelElementName]);
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
    this.model = this.schema[this.modelName].__model__ || null;
    this.types = this.schema[this.modelName].__types__ || null;
    this.labels = this.schema[this.modelName].__labels__ || {};
    this.groups = this.schema[this.modelName].__groups__ || {};
    this.info = this.schema[this.modelName].__info__ || {};
    this.validations = this.schema[this.modelName].__validations__ || {};

    if (!this.models && !this.types) {
      throw new Error('No schema model and/or schema types found');
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
      this.data[modelElementName] = e.target.value;
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
      this.data[modelElementName] = e.target.value;
      this.isFormUpdated();
    });
  }

  _addTextareaEvents(textarea, modelElementName) {
    textarea.addEventListener('change', e => {
      this.data[modelElementName] = e.target.value;
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
    const updateEvent = new CustomEvent('form-updated', {
      detail: {
        model: this.model,
      },
    });
    document.dispatchEvent(updateEvent);
  }

  saveForm(e) {
    e.preventDefault();
    this.data = this.getFormData();
    const okFieldsNoEmpty = this.validateForm.noEmptyFields();
    const okFieldsValidated = this.validateForm.validateFields();
    if (okFieldsNoEmpty && okFieldsValidated) {
      if (this.level === 0) {
        const saveFormEvent = new CustomEvent('save-form', {
          detail: {
            id: this.id,
            data: this.data,
          },
        });
        document.dispatchEvent(saveFormEvent);
      }
    }
  }

  getFormData() {
    const data = {};
    this.container
      .querySelectorAll(
        'input[type="text"], input[type="number"], select, textarea, rich-inputfile'
      )
      .forEach(input => {
        if (!data[input.name]) {
          data[input.name] = input.value;
        } else if (Array.isArray(data[input.name])) {
          data[input.name].push(input.value);
        } else {
          const tmp = data[input.name];
          data[input.name] = [tmp, input.value];
        }
      });
    this.container
      .querySelectorAll('input[type="radio"], input[type="checkbox"]')
      .forEach(input => {
        if (input.checked) {
          data[input.name] = input.value;
        } else if (data[input.name] === undefined) {
          data[input.name] = '';
        }
      });
    this.container.querySelectorAll('json-autoform').forEach(jsonAutoform => {
      if (!data[jsonAutoform.name]) {
        data[jsonAutoform.name] = jsonAutoform.getFormData();
      } else if (Array.isArray(data[jsonAutoform.name])) {
        data[jsonAutoform.name].push(jsonAutoform.getFormData());
      } else {
        const tmp = data[jsonAutoform.name];
        data[jsonAutoform.name] = [tmp, jsonAutoform.getFormData()];
      }
    });
    return data;
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
