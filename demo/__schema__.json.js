export default {
  canonical: {
    __modelTypes__: {},
    __fieldTypes__: {},
    __labels__: {},
    __groups__: {},
    __info__: {},
    __validations__: {},
  },
  demo: {
    __fieldTypes__: {
      single_number_field_one: 'number',
      single_text_field_two: 'text',
      single_text_field_twoandhalf: 'password',
      single_radio_field_three_withoutgroup:
        'radio:single_radio_field_three_withoutgroup',
      single_textarea_field_four: 'textarea',
      single_file_field_six: 'file',
      single_checkbox_field_five_withoutgroup_neitherinfo: 'checkbox',
      single_model_field_six: 'model:single_model_field_six',
      multiple_number_field_seven: 'number',
      newbbdd_text_field_eight: 'url',
      newbbdd_model_field_eightandhalf:
        'select:newbbdd_model_field_eightandhalf',
      multiple_number_field_nine: 'number',
      multiple_text_field_ten: 'text',
      multiple_radio_field_eleven:
        'radio:single_radio_field_three_withoutgroup',
      multiple_textarea_field_twelwe: 'textarea',
      multiple_model_field_thirteen: 'model:multiple_model_field_thirteen',
    },
    __modelTypes__: {
      single_number_field_one: 'single',
      single_text_field_two: 'single',
      single_text_field_twoandhalf: 'single',
      single_radio_field_three_withoutgroup: 'single',
      single_textarea_field_four: 'single',
      single_file_field_six: 'single',
      single_checkbox_field_five_withoutgroup_neitherinfo: 'single',
      single_model_field_six: 'single',
      newbbdd_number_field_seven: 'single',
      newbbdd_text_field_eight: 'single',
      newbbdd_model_field_eightandhalf: 'single',
      multiple_number_field_nine: 'multiple',
      multiple_text_field_ten: 'multiple',
      multiple_radio_field_eleven: 'multiple',
      multiple_textarea_field_twelwe: 'multiple',
      multiple_model_field_thirteen: 'multiple',
      multiple_number_field_seven: 'multiple',
    },
    __labels__: {
      single_number_field_one: 'Single number field one',
      single_text_field_two: 'Single text field two',
      single_text_field_twoandhalf: 'Single text field two and half PASSWORD',
      single_radio_field_three_withoutgroup:
        'Single radio field three without group',
      single_textarea_field_four: 'Single textarea field four',
      single_file_field_six: 'Single file field six',
      single_checkbox_field_five_withoutgroup_neitherinfo:
        'Single checkbox field five without group neither info',
      single_model_field_six: 'Single model field six',
      newbbdd_number_field_seven: 'Newbbdd number field seven',
      newbbdd_text_field_eight: 'Newbbdd text field eight URL',
      newbbdd_model_field_eightandhalf: 'Newbbdd model field eight and half',
      multiple_number_field_nine: 'Multiple number field nine',
      multiple_text_field_ten: 'Multiple text field ten',
      multiple_radio_field_eleven: 'Multiple radio field eleven',
      multiple_textarea_field_twelwe: 'Multiple textarea field twelwe',
      multiple_model_field_thirteen: 'Multiple model field thirteen',
    },
    __groups__: {
      1: ['single_text_field_twoandhalf'],
      single_group: [
        'single_number_field_one',
        'single_text_field_two',
        'single_model_field_six',
        'single_file_field_six',
      ],
      newbbdd_group: [
        'multiple_number_field_seven',
        'newbbdd_text_field_eight',
        'single_textarea_field_four',
        'newbbdd_model_field_eightandhalf',
      ],
      multiple_group: [
        'multiple_number_field_nine',
        'multiple_text_field_ten',
        'multiple_radio_field_eleven',
        'multiple_textarea_field_twelwe',
        'multiple_model_field_thirteen',
      ],
    },
    __info__: {
      single_number_field_one: 'info about single_number field one',
      single_text_field_two: 'info about single_text field two',
      single_radio_field_three_withoutgroup:
        'info about single_radio field three',
      single_textarea_field_four: 'info about single_textarea field four',
      single_model_field_six: 'info about single_model field six',
      single_file_field_six: 'extension allowed: pdf,zip,jpg,png',
      multiple_number_field_seven: 'info about newbbdd_number field seven',
      newbbdd_text_field_eight: 'info about newbbdd_text field eight URL',
      multiple_number_field_nine: 'info about multiple_number field nine',
      multiple_text_field_ten: 'info about multiple_text field ten',
      multiple_radio_field_eleven: 'info about multiple_radio field eleven',
      multiple_textarea_field_twelwe:
        'info about multiple_textarea field twelwe',
      multiple_model_field_thirteen: 'info about multiple_model field thirteen',
    },
    __validations__: {
      single_text_field_twoandhalf: {
        tovalidate: 'password',
      },
      single_number_field_one: {
        maxlength: 2,
        required: true,
        tovalidate: 'number',
      },
      single_text_field_two: {
        required: true,
        tovalidate: 'alpha',
      },
      single_radio_field_three_withoutgroup: {
        required: true,
      },
      single_textarea_field_four: {
        required: true,
        tovalidate: 'alpha',
      },
      single_file_field_six: {
        required: true,
        tovalidate: 'file:pdf,zip,jpg,png',
      },
      multiple_number_field_seven: {
        maxlength: 5,
        required: true,
        tovalidate: 'number',
      },
      newbbdd_model_field_eightandhalf: {
        required: true,
      },
      newbbdd_text_field_eight: {
        required: true,
        tovalidate: 'url',
      },
      multiple_number_field_nine: {
        maxlength: 2,
        required: true,
        tovalidate: 'number',
      },
      multiple_text_field_ten: {
        required: true,
        tovalidate: 'alpha',
      },
      multiple_radio_field_eleven: {
        required: true,
      },
      multiple_textarea_field_twelwe: {
        required: true,
        tovalidate: 'alpha',
      },
    },
  },
  single_model_field_six: {
    __modelTypes__: {
      submodel_single_text_field: 'single',
      submodel_single_textarea_field: 'single',
    },
    __fieldTypes__: {
      submodel_single_text_field: 'text',
      submodel_single_textarea_field: 'textarea',
    },
    __labels__: {
      submodel_single_text_field: 'Submodel single text field',
      submodel_single_textarea_field: 'Submodel single textarea field',
    },
    __groups__: {},
    __info__: {},
    __validations__: {},
  },
  newbbdd_model_field_eightandhalf: [
    'value one',
    'value two',
    'value three',
    'value four',
    'value five',
    'value six',
  ],
  single_radio_field_three_withoutgroup: [
    'radio value one',
    'radio value two',
    'radio value three',
    'radio value four',
    'radio value five',
    'radio value six',
  ],
  multiple_model_field_thirteen: {
    __modelTypes__: {
      submodel_multiple_number_field: 'multiple',
      submodel_multiple_text_field: 'multiple',
      submodel_multiple_textarea_field: 'multiple',
    },
    __fieldTypes__: {
      submodel_multiple_number_field: 'number',
      submodel_multiple_text_field: 'text',
      submodel_multiple_textarea_field: 'textarea',
    },
    __labels__: {
      submodel_multiple_number_field: 'Multiple number field thirteen',
      submodel_multiple_text_field: 'Multiple text field thirteen',
      submodel_multiple_textarea_field: 'Multiple textarea field thirteen',
    },
    __groups__: {},
    __info__: {},
    __validations__: {},
  },
};
