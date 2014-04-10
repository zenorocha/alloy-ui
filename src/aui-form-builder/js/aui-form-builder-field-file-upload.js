/**
 * The Form Builder Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-upload
 */

var L = A.Lang,

    getClassName = A.getClassName,

    CSS_FORM_BUILDER_FIELD = getClassName('form-builder-field'),
    CSS_FORM_BUILDER_FIELD_NODE = getClassName('form-builder-field', 'node'),

    TPL_FILE_UPLOAD = '<input id="{id}" class="' + [CSS_FORM_BUILDER_FIELD_NODE].join(' ') +
        '" name="{name}" type="file" value="{value}" />';

/**
 * A base class for `A.FormBuilderFileUploadField`.
 *
 * @class A.FormBuilderFileUploadField
 * @extends A.FormBuilderField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var FormBuilderFileUploadField = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'form-builder-file-upload-field',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilderFileUploadField`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Reusable block of markup used to generate the field.
         *
         * @attribute template
         */
        template: {
            valueFn: function() {
                return TPL_FILE_UPLOAD;
            }
        }

    },

    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: CSS_FORM_BUILDER_FIELD,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.FormBuilderField,

    prototype: {

        /**
         * Injects data into the template and returns the HTML result.
         *
         * @method getHTML
         * @return {String}
         */
        getHTML: function() {
            var instance = this;

            return L.sub(
                instance.get('template'), {
                    id: instance.get('id'),
                    label: instance.get('label'),
                    name: instance.get('name'),
                    value: instance.get('predefinedValue')
                }
            );
        }

    }

});

A.FormBuilderFileUploadField = FormBuilderFileUploadField;

A.FormBuilder.types.fileupload = A.FormBuilderFileUploadField;
