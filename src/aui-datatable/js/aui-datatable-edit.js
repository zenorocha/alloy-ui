/**
 * The Datatable Component
 *
 * @module aui-datatable
 * @submodule aui-datatable-edit
 */

var Lang = A.Lang,
    AArray = A.Array,
    isArray = Lang.isArray,
    isBoolean = Lang.isBoolean,
    isFunction = Lang.isFunction,
    isObject = Lang.isObject,
    isString = Lang.isString,
    isValue = Lang.isValue,
    LString = Lang.String,
    DataType = A.DataType,

    isBaseEditor = function(val) {
        return (val instanceof A.BaseCellEditor);
    },

    WidgetStdMod = A.WidgetStdMod,
    AgetClassName = A.getClassName,

    ACTIVE_CELL = 'activeCell',
    ADD = 'add',
    ADD_OPTION = 'addOption',
    BASE_CELL_EDITOR = 'baseCellEditor',
    BOUNDING_BOX = 'boundingBox',
    CALENDAR = 'calendar',
    CANCEL = 'cancel',
    CELL = 'cell',
    CELLEDITOR = 'celleditor',
    CHECKBOX_CELL_EDITOR = 'checkboxCellEditor',
    CHECKED = 'checked',
    CLICK = 'click',
    CONTENT_BOX = 'contentBox',
    DATA = 'data',
    DATATABLE = 'datatable',
    DATE_CELL_EDITOR = 'dateCellEditor',
    DD = 'dd',
    DELETE = 'delete',
    DISK = 'disk',
    DOTTED = 'dotted',
    DROP_DOWN_CELL_EDITOR = 'dropDownCellEditor',
    EDIT = 'edit',
    EDIT_EVENT = 'editEvent',
    EDIT_OPTIONS = 'editOptions',
    EDITABLE = 'editable',
    EDITOR = 'editor',
    ELEMENT = 'element',
    ELEMENT_NAME = 'elementName',
    GRIP = 'grip',
    HANDLE = 'handle',
    HIDE = 'hide',
    HIDE_ON_SAVE = 'hideOnSave',
    ICON = 'icon',
    INIT_EDIT = 'initEdit',
    INIT_TOOLBAR = 'initToolbar',
    INIT_VALIDATOR = 'initValidator',
    INPUT = 'input',
    INPUT_FORMATTER = 'inputFormatter',
    KEY = 'key',
    LABEL = 'label',
    LINK = 'link',
    MOUSEDOWN = 'mousedown',
    MULTIPLE = 'multiple',
    NAME = 'name',
    ONLY = 'only',
    OPTION = 'option',
    OPTIONS = 'options',
    OPTIONS_CELL_EDITOR = 'optionsCellEditor',
    OUTPUT_FORMATTER = 'outputFormatter',
    PENCIL = 'pencil',
    RADIO_CELL_EDITOR = 'radioCellEditor',
    READ = 'read',
    READ_ONLY = 'readOnly',
    REMOVE = 'remove',
    RENDER = 'render',
    RENDERED = 'rendered',
    RETURN = 'return',
    ROW = 'row',
    SAVE = 'save',
    SELECTED = 'selected',
    SELECTED_ATTR_NAME = 'selectedAttrName',
    SHOW_TOOLBAR = 'showToolbar',
    SUBMIT = 'submit',
    TEXT_AREA_CELL_EDITOR = 'textAreaCellEditor',
    TEXT_CELL_EDITOR = 'textCellEditor',
    TOOLBAR = 'toolbar',
    UNESCAPE_VALUE = 'unescapeValue',
    VALIDATOR = 'validator',
    VALUE = 'value',
    VERTICAL = 'vertical',
    VISIBLE = 'visible',
    WRAPPER = 'wrapper',
    Z_INDEX = 'zIndex',

    _COMMA = ',',
    _DOT = '.',
    _EMPTY_STR = '',
    _NL = '\n',
    _SPACE = ' ',

    REGEX_BR = /<br\s*\/?>/gi,
    REGEX_NL = /[\r\n]/g,

    CSS_CELLEDITOR_EDIT = AgetClassName(CELLEDITOR, EDIT),
    CSS_CELLEDITOR_EDIT_ADD_OPTION = AgetClassName(CELLEDITOR, EDIT, ADD, OPTION),
    CSS_CELLEDITOR_EDIT_DD_HANDLE = AgetClassName(CELLEDITOR, EDIT, DD, HANDLE),
    CSS_CELLEDITOR_EDIT_DELETE_OPTION = AgetClassName(CELLEDITOR, EDIT, DELETE, OPTION),
    CSS_CELLEDITOR_EDIT_HIDE_OPTION = AgetClassName(CELLEDITOR, EDIT, HIDE, OPTION),
    CSS_CELLEDITOR_EDIT_INPUT_NAME = AgetClassName(CELLEDITOR, EDIT, INPUT, NAME),
    CSS_CELLEDITOR_EDIT_INPUT_VALUE = AgetClassName(CELLEDITOR, EDIT, INPUT, VALUE),
    CSS_CELLEDITOR_EDIT_LABEL = AgetClassName(CELLEDITOR, EDIT, LABEL),
    CSS_CELLEDITOR_EDIT_LINK = AgetClassName(CELLEDITOR, EDIT, LINK),
    CSS_CELLEDITOR_EDIT_OPTION_ROW = AgetClassName(CELLEDITOR, EDIT, OPTION, ROW),
    CSS_CELLEDITOR_ELEMENT = AgetClassName(CELLEDITOR, ELEMENT),
    CSS_CELLEDITOR_OPTION = AgetClassName(CELLEDITOR, OPTION),
    CSS_DATATABLE_EDITABLE = AgetClassName(DATATABLE, EDITABLE),
    CSS_ICON = AgetClassName(ICON),
    CSS_ICON_GRIP_DOTTED_VERTICAL = AgetClassName(ICON, GRIP, DOTTED, VERTICAL),

    TPL_BR = '<br/>';

/**
 * An extension for A.DataTable to support Cell Editing.
 *
 * @class A.DataTable.CellEditorSupport
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var CellEditorSupport = function() {};

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
CellEditorSupport.NAME = 'dataTableCellEditorSupport';

/**
 * Number which provides a `z-index` style value for the `BaseCellEditor`.
 *
 * @property EDITOR_ZINDEX
 * @default 9999
 * @type Number
 * @static
 */
CellEditorSupport.EDITOR_ZINDEX = 9999;

/**
 * Static property used to define the default attribute
 * configuration for the `CellEditorSupport`.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
CellEditorSupport.ATTRS = {

    /**
     * Defines the event which displays the `BaseCellEditor`.
     *
     * @attribute editEvent
     * @default 'click'
     * @type String
     */
    editEvent: {
        setter: '_setEditEvent',
        validator: isString,
        value: CLICK
    }
};

A.mix(CellEditorSupport.prototype, {

    /**
     * Construction logic executed during `CellEditorSupport` instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this,
            editEvent = instance.get(EDIT_EVENT);

        instance.CLASS_NAMES_CELL_EDITOR_SUPPORT = {
            cell: instance.getClassName(CELL),
            readOnly: instance.getClassName(READ, ONLY)
        };

        instance.after(RENDER, instance._afterCellEditorSupportRender);

        instance.delegate(editEvent, instance._onEditCell, _DOT + instance.CLASS_NAMES_CELL_EDITOR_SUPPORT.cell,
            instance);
    },

    /**
     * Returns the `BaseCellEditor` instance for the given `record` and `column`
     * arguments.
     *
     * @method getEditor
     * @param {Model} record
     * @param {Object} column Column configuration.
     * @static
     * @return {BaseCellEditor} The `BaseCellEditor` instance.
     *
     * Will return `null` if both `column` and `record` editors are not found.
     */
    getEditor: function(record, column) {
        var columnEditor = column.editor,
            recordEditor = record.get(EDITOR);

        if (columnEditor === false || recordEditor === false) {
            return null;
        }

        return recordEditor || columnEditor;
    },

    /**
     * Fires after the `CellEditorSupport` has rendered, and calls
     * `_syncModelsReadOnlyUI`.
     *
     * @method _afterCellEditorSupportRender
     * @protected
     */
    _afterCellEditorSupportRender: function() {
        var instance = this;

        instance._syncModelsReadOnlyUI();

        instance.body.after(A.bind(instance._syncModelsReadOnlyUI, instance), instance.body, RENDER);
    },

    /**
     * `render()` and `show()` the `BaseCellEditor`, of the active table cell.
     *
     * Called when active table cell is clicked (default).
     *
     * @method _onEditCell
     * @param {EventFacade} event The event defined in attribute `editEvent`.
     * @protected
     */
    _onEditCell: function(event) {
        var instance = this,
            activeCell = instance.get(ACTIVE_CELL),
            alignNode = event.alignNode || activeCell,
            column = instance.getColumn(alignNode),
            record = instance.getRecord(alignNode),
            editor = instance.getEditor(record, column);

        if (isBaseEditor(editor) && !record.get(READ_ONLY)) {
            if (!editor.get(RENDERED)) {
                editor.on({
                    visibleChange: A.bind(instance._onEditorVisibleChange, instance),
                    save: A.bind(instance._onEditorSave, instance)
                });

                editor.set(Z_INDEX, CellEditorSupport.EDITOR_ZINDEX);
                editor.render();
            }

            editor.set(VALUE, record.get(column.key));

            editor.show().move(alignNode.getXY());
        }
    },

    /**
     * Saves the new value from the `BaseCellEditor` input to the `Model`, on
     * the `save` event of the `BaseCellEditor`.
     *
     * @method _onEditorSave
     * @param {EventFacade} event
     * @protected
     */
    _onEditorSave: function(event) {
        var instance = this,
            editor = event.currentTarget,
            column = instance.getActiveColumn(),
            record = instance.getActiveRecord();

        editor.set(VALUE, event.newVal);

        // TODO: Memorize the activeCell coordinates to set the focus on it
        // instead
        instance.set(ACTIVE_CELL, instance.get(ACTIVE_CELL));

        record.set(column.key, event.newVal);

        // TODO: Sync highlight frames UI instead?
        if (instance.highlight) {
            instance.highlight.clear();
        }
    },

    /**
     * Calls `_syncFocus` if the `BaseCellEditor` input has a new value.
     *
     * Called on the `visibleChange` event.
     *
     * @method _onEditorVisibleChange
     * @param {EventFacade} event
     * @protected
     */
    _onEditorVisibleChange: function(event) {
        var instance = this,
            editor = event.currentTarget;

        if (event.newVal) {
            editor._syncFocus();
        }
    },

    /**
     * Toggles the row's `read-only` class. Toggle determined by the `readOnly`
     * attribute of the `Model`.
     *
     * @method _syncModelReadOnlyUI
     * @param {Model} model
     * @protected
     */
    _syncModelReadOnlyUI: function(model) {
        var instance = this,
            row = instance.getRow(model);

        row.toggleClass(instance.CLASS_NAMES_CELL_EDITOR_SUPPORT[READ_ONLY], model.get(READ_ONLY) === true);
    },

    /**
     * Calls `_syncModelReadOnlyUI` for each `Model` in the `data` attribute.
     *
     * @method _syncModelsReadOnlyUI
     * @protected
     */
    _syncModelsReadOnlyUI: function() {
        var instance = this;

        instance.get(DATA).each(function(model) {
            instance._syncModelReadOnlyUI(model);
        });
    },

    /**
     * Forwards method call to `getEditor`.
     *
     * @deprecated Use `getEditor` instead.
     * @method getCellEditor
     * @return {BaseCellEditor} See `getEditor`
     * @static
     */
    getCellEditor: function() {
        return this.getEditor.apply(this, arguments);
    },

    /**
     * Syntactic sugar for `record.get(column.key)`.
     *
     * @deprecated
     * @method getRecordColumnValue
     * @param {Model} record
     * @param {Object} column Column configuration.
     * @return {String} Record column key.
     */
    getRecordColumnValue: function(record, column) {
        return record.get(column.key);
    }
});

A.DataTable.CellEditorSupport = CellEditorSupport;

A.Base.mix(A.DataTable, [CellEditorSupport]);

/**
 * Abstract class BaseCellEditor.
 *
 * @class A.BaseCellEditor
 * @extends Overlay
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @abstract
 */
var BaseCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: BASE_CELL_EDITOR,

    /**
     * Static property used to define the default attribute
     * configuration for the `BaseCellEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Indicates whether or not the `BaseCellEditor` is able to edit a
         * cell's value.
         *
         * @attribute editable
         * @default false
         * @type Boolean
         */
        editable: {
            value: false,
            validator: isBoolean
        },

        /**
         * Defines the `name` of the `BaseCellEditor` input.
         *
         * @attribute elementName
         * @default 'value'
         * @type String
         */
        elementName: {
            value: VALUE,
            validator: isString
        },

        /**
         * Overrides `footerContent`. Defaults to a blank string.
         *
         * Originally defined in `WidgetStdMod`.
         *
         * @attribute footerContent
         * @default ''
         * @type String
         */
        footerContent: {
            value: _EMPTY_STR
        },

        /**
         * Indicates whether or not the `BaseCellEditor` is hidden on the `save`
         * event.
         *
         * @attribute hideOnSave
         * @default true
         * @type Boolean
         */
        hideOnSave: {
            value: true,
            validator: isBoolean
        },

        /**
         * Function which modifies data values for HTML display.
         *
         * Default Function replaces line feeds (`[\r\n]`) with `<br>`.
         *
         * @attribute inputFormatter
         * @type Function
         */
        inputFormatter: {
            value: function(val) {
                if (isString(val)) {
                    val = val.replace(REGEX_NL, TPL_BR);
                }

                return val;
            }
        },

        /**
         * Function which modifies input values for data storage.
         *
         * Default Function unescapes HTML Entities as well as replaces `<br>`
         * with line feeds (`\n`).
         *
         * Set attribute `unescapeValue` to 'false' to keep HTML Entities
         * unchanged.
         *
         * @attribute outputFormatter
         * @type Function
         */
        outputFormatter: {
            value: function(val) {
                var instance = this;

                if (isString(val)) {
                    if (instance.get(UNESCAPE_VALUE)) {
                        val = LString.unescapeEntities(val);
                    }

                    val = val.replace(REGEX_BR, _NL);
                }

                return val;
            }
        },

        /**
         * Indicates whether or not the `BaseCellEditor` toolbar is displayed.
         *
         * @attribute showToolbar
         * @default true
         * @type Boolean
         */
        showToolbar: {
            value: true,
            validator: isBoolean
        },

        /**
         * Collection of strings used to label elements of the UI.
         *
         * @attribute strings
         * @type Object
         */
        strings: {
            value: {
                edit: 'Edit',
                save: 'Save',
                cancel: 'Cancel'
            }
        },

        /**
         * Number defining the `tabindex` of the `BaseCellEditor` input.
         *
         * @attribute tabIndex
         * @default 1
         * @type Number
         */
        tabIndex: {
            value: 1
        },

        /**
         * Defines the `Toolbar` config for the `BaseCellEditor`.
         *
         * @attribute toolbar
         * @default null
         * @type Object
         */
        toolbar: {
            setter: '_setToolbar',
            validator: isObject,
            value: null
        },

        /**
         * Indicates whether or not HTML Entities get unescaped on input.
         *
         * See `outputFormatter` for more details.
         *
         * @attribute unescapeValue
         * @default true
         * @type Boolean
         */
        unescapeValue: {
            value: true,
            validator: isBoolean
        },

        /**
         * Defines the `FormValidator` config for the `BaseCellEditor`.
         *
         * @attribute validator
         * @default null
         * @type Object
         */
        validator: {
            setter: '_setValidator',
            validator: isObject,
            value: null
        },

        /**
         * Stores the input value of the `BaseCellEditor`.
         *
         * @attribute value
         * @default ''
         * @type String
         */
        value: {
            value: _EMPTY_STR
        },

        /**
         * Indicates whether or not the `BaseCellEditor` is visible.
         *
         * Originally defined in `Widget`.
         *
         * @attribute visible
         * @default false
         * @type Boolean
         */
        visible: {
            value: false
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.Overlay,

    /**
     * Static property used to define the UI attributes.
     *
     * @property UI_ATTRS
     * @type Array
     * @static
     */
    UI_ATTRS: [EDITABLE, SHOW_TOOLBAR, VALUE],

    prototype: {
        CONTENT_TEMPLATE: '<form></form>',
        ELEMENT_TEMPLATE: null,

        elements: null,
        validator: null,

        _hDocMouseDownEv: null,

        /**
         * Construction logic executed during the `BaseCellEditor`
         * instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function(config) {
            var instance = this;

            instance._initEvents();
        },

        /**
         * Destructor lifecycle implementation for the `BaseCellEditor` class.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this;
            var hDocMouseDown = instance._hDocMouseDownEv;
            var toolbar = instance.toolbar;
            var validator = instance.validator;

            if (hDocMouseDown) {
                hDocMouseDown.detach();
            }

            if (toolbar) {
                toolbar.destroy();
            }

            if (validator) {
                validator.destroy();
            }
        },

        /**
         * Bind the events on the `BaseCellEditor` UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance.get(BOUNDING_BOX).on(KEY, A.bind(instance._onEscKey, instance), 'down:27');
        },

        /**
         * Utility method, which calls the passed `inputFormatter` Function,
         * using `val` as an argument.
         *
         * @method formatValue
         * @param {Function} inputFormatter See `inputFormatter` attribute.
         * @param {mixed} val
         * @return {mixed} Formated Value.
         */
        formatValue: function(inputFormatter, val) {
            var instance = this;

            if (isFunction(inputFormatter)) {
                val = inputFormatter.call(instance, val);
            }

            return val;
        },

        /**
         * Gets and formats the `BaseCellEditor` input value.
         *
         * @method getValue
         * @return {mixed} Formated Value.
         */
        getValue: function() {
            var instance = this;

            return instance.formatValue(
                instance.get(INPUT_FORMATTER),
                instance.getElementsValue()
            );
        },

        /**
         * `publish()` custom events during `initializer`.
         *
         * @method _initEvents
         * @protected
         */
        _initEvents: function() {
            var instance = this;

            instance.publish({
                cancel: {
                    defaultFn: instance._defCancelFn
                },

                initEdit: {
                    defaultFn: instance._defInitEditFn,
                    fireOnce: true
                },

                initValidator: {
                    defaultFn: instance._defInitValidatorFn,
                    fireOnce: true
                },

                initToolbar: {
                    defaultFn: instance._defInitToolbarFn,
                    fireOnce: true
                },

                save: {
                    defaultFn: instance._defSaveFn
                }
            });

            instance.after({
                render: instance._afterRender,
                visibleChange: A.debounce(instance._debounceVisibleChange, 350, instance)
            });

            instance.on({
                'form-validator:submit': A.bind(instance._onSubmit, instance)
            });
        },

        /**
         * Bound Function which fires after the `render` event. Calls Functions
         * which initialize validation and toolbar.
         *
         * @method _afterRender
         * @protected
         */
        _afterRender: function() {
            var instance = this;

            instance._handleInitValidatorEvent();
            instance._handleInitToolbarEvent();
        },

        /**
         * Bound Function for the `cancel` event. Hides the `BaseCellEditor`.
         *
         * @method _defCancelFn
         * @param event
         * @protected
         */
        _defCancelFn: function(event) {
            var instance = this;

            instance.hide();
        },

        /**
         * Bound Function which initializes the `FormValidator` using the
         * config from the `validator` attribute.
         *
         * @method _defInitValidatorFn
         * @param event
         * @protected
         */
        _defInitValidatorFn: function(event) {
            var instance = this;

            instance.validator = new A.FormValidator(
                instance.get(VALIDATOR)
            );
        },

        /**
         * Bound Function which initializes the `Toolbar` using the config from
         * the `toolbar` attribute.
         *
         * @method _defInitToolbarFn
         * @param event
         * @protected
         */
        _defInitToolbarFn: function(event) {
            var instance = this;
            var editable = instance.get(EDITABLE);

            instance.toolbar = new A.Toolbar(
                instance.get(TOOLBAR)
            ).render(instance.footerNode);

            if (editable) {
                instance._uiSetEditable(editable);
            }
        },

        /**
         * Bound Function for the `save` event. Conditionally hides the
         * `BaseCellEditor` based off the `hideOnSave` attribute.
         *
         * @method _defSaveFn
         * @param event
         * @protected
         */
        _defSaveFn: function(event) {
            var instance = this;

            if (instance.get(HIDE_ON_SAVE)) {
                instance.hide();
            }
        },

        /**
         * Bound Function for the `visibleChange` event, which then binds the
         * `mousedown` event.
         *
         *See: `_onDocMouseDownExt` for details.
         *
         * @method _debounceVisibleChange
         * @param {EventFacade} event
         * @protected
         */
        _debounceVisibleChange: function(event) {
            var instance = this;
            var hDocMouseDown = instance._hDocMouseDownEv;

            if (event.newVal) {
                if (!hDocMouseDown) {
                    instance._hDocMouseDownEv = A.getDoc().on(MOUSEDOWN, A.bind(instance._onDocMouseDownExt,
                        instance));
                }
            }
            else if (hDocMouseDown) {
                hDocMouseDown.detach();
                instance._hDocMouseDownEv = null;
            }
        },

        /**
         * Bound Function for the `click` event on the `Toolbar` Cancel button.
         *
         * @method _handleCancelEvent
         * @protected
         */
        _handleCancelEvent: function() {
            var instance = this;

            instance.fire(CANCEL);
        },

        /**
         * Bound Function for the `click` event on the `BaseCellEditor` input.
         *
         * @method _handleEditEvent
         * @protected
         */
        _handleEditEvent: function() {
            var instance = this;

            instance.fire(EDIT);
        },

        /**
         * Fires the `initEdit` event.
         *
         * @method _handleInitEditEvent
         * @protected
         */
        _handleInitEditEvent: function() {
            var instance = this;

            if (instance.get(RENDERED)) {
                this.fire(INIT_EDIT);
            }
        },

        /**
         * Fires the `initValidator` event.
         *
         * Called during the `after({render:...}...)` event.
         *
         * @method _handleInitValidatorEvent
         * @protected
         */
        _handleInitValidatorEvent: function() {
            var instance = this;

            if (instance.get(RENDERED)) {
                this.fire(INIT_VALIDATOR);
            }
        },

        /**
         * Conditionally fires the `initToolbar` event, based off the
         * `showToolbar` attribute.
         *
         * Called during the `after({render:...}...)` event.
         *
         * @method _handleInitToolbarEvent
         * @protected
         */
        _handleInitToolbarEvent: function() {
            var instance = this;

            if (instance.get(RENDERED) && instance.get(SHOW_TOOLBAR)) {
                this.fire(INIT_TOOLBAR);
            }
        },

        /**
         * Bound Function for the `click` event on the `Toolbar` Save button.
         *
         * @method _handleSaveEvent
         * @protected
         */
        _handleSaveEvent: function() {
            var instance = this;

            if (!instance.validator.hasErrors()) {
                instance.fire(SAVE, {
                    newVal: instance.getValue(),
                    prevVal: instance.get(VALUE)
                });
            }
        },

        /**
         * Bound Function for the `mousedown` event of the `document`, which
         * hides the `BaseCellEditor`.
         *
         * @method _onDocMouseDownExt
         * @param {EventFacade} event
         * @protected
         */
        _onDocMouseDownExt: function(event) {
            var instance = this;
            var boundingBox = instance.get(BOUNDING_BOX);

            if (!boundingBox.contains(event.target)) {
                instance.set(VISIBLE, false);
            }
        },

        /**
         * Bound Function for the Esc `keydown` event, which hides the
         * `BaseCellEditor`.
         *
         * @method _onEscKey
         * @param event
         * @protected
         */
        _onEscKey: function(event) {
            var instance = this;

            instance.hide();
        },

        /**
         * Bound Function for the `form-validator:submit` event, which prevents
         * the form from submitting if the `FormValidator` doesn't validate.
         *
         * @method _onSubmit
         * @param {EventFacade} event
         * @protected
         */
        _onSubmit: function(event) {
            var instance = this;
            var validator = event.validator;

            if (validator) {
                validator.formEvent.halt();
            }
        },

        /**
         * `setter` Function for attribute `toolbar`, which merges passed
         * `toolbarConfig` with additional properties.
         *
         * @method _setToolbar
         * @param {Object} toolbarConfig `Toolbar` config.
         * @protected
         * @return {Object} Merged toolbarConfig `Toolbar` config.
         */
        _setToolbar: function(toolbarConfig) {
            var instance = this;
            var strings = instance.getStrings();

            return A.merge({
                activeState: false,
                children: [
                    [
                        {
                            on: {
                                click: A.bind(instance._handleSaveEvent, instance)
                            },
                            label: strings[SAVE],
                            icon: 'icon-ok-sign'
                        },
                        {
                            on: {
                                click: A.bind(instance._handleCancelEvent, instance)
                            },
                            label: strings[CANCEL]
                        }
                    ]
                ]
            }, toolbarConfig);
        },

        /**
         * `setter` Function for attribute `validator`, which merges the passed
         * `validatorConfig` with additional properties.
         *
         * @method _setValidator
         * @param {Object} validatorConfig
         * @protected
         * @return {Object} Merged validatorConfig
         */
        _setValidator: function(validatorConfig) {
            var instance = this;

            return A.merge({
                    boundingBox: instance.get(CONTENT_BOX),
                    bubbleTargets: instance
                },
                validatorConfig
            );
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetShowToolbar
         * @param {Boolean} val
         * @protected
         */
        _uiSetShowToolbar: function(val) {
            var instance = this;
            var footerNode = instance.footerNode;

            if (val) {
                footerNode.show();
            }
            else {
                footerNode.hide();
            }

            instance._handleInitToolbarEvent();
        },

        /**
         * Gets the `BaseCellEditor` input value.
         *
         * NOTE FOR DEVELOPERS: You *may* want to replace the methods from this
         * section on your implementation.
         *
         * @method getElementsValue
         * @return {String|Array} Input values.
         */
        getElementsValue: function() {
            var instance = this;
            var elements = instance.elements;

            if (elements) {
                return elements.get(VALUE);
            }

            return _EMPTY_STR;
        },

        /**
         * Render the `BaseCellEditor` component instance. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            if (instance.ELEMENT_TEMPLATE) {
                instance.elements = A.Node.create(instance.ELEMENT_TEMPLATE);

                instance._syncElementsName();

                instance.setStdModContent(WidgetStdMod.BODY, instance.elements);
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _defInitEditFn
         * @param event
         * @protected
         */
        _defInitEditFn: function(event) {},

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _syncElementsFocus
         * @protected
         */
        _syncElementsFocus: function() {
            var instance = this;

            instance.elements.selectText();
        },

        /**
         * Syncs the name attribute of the form input.
         *
         * @method _syncElementsName
         * @protected
         */
        _syncElementsName: function() {
            var instance = this;

            instance.elements.setAttribute(
                NAME,
                instance.get(ELEMENT_NAME)
            );
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _syncFocus
         * @protected
         */
        _syncFocus: function() {
            var instance = this;

            A.later(0, instance, instance._syncElementsFocus);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetEditable
         * @param {Boolean} val
         * @protected
         */
        _uiSetEditable: function(val) {
            var instance = this;
            var toolbar = instance.toolbar;

            if (instance.get(RENDERED) && toolbar) {
                if (val) {
                    toolbar.add(
                        [
                            {
                                icon: 'icon-edit',
                                label: instance.getString(EDIT),
                                on: {
                                    click: A.bind(instance._handleEditEvent, instance)
                                }
                            }
                        ], 1
                    );
                }
                else {
                    toolbar.remove(1);
                }
            }
        },

        /**
         * Sets and formats the `BaseCellEditor` input value.
         *
         * @method _uiSetValue
         * @param {mixed} val
         * @protected
         */
        _uiSetValue: function(val) {
            var instance = this;
            var elements = instance.elements;

            if (elements) {
                elements.val(
                    instance.formatValue(instance.get(OUTPUT_FORMATTER), val)
                );
            }
        }
    }
});

A.BaseCellEditor = BaseCellEditor;

/**
 * Abstract class `BaseOptionsCellEditor` for options attribute support.
 *
 * @class A.BaseOptionsCellEditor
 * @extends A.BaseCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @abstract
 */
var BaseOptionsCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: OPTIONS_CELL_EDITOR,

    /**
     * Static property used to define the default attribute configuration for
     * the `BaseOptionsCellEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Function which modifies data values for UI display.
         *
         * Default `null` Function will not modify the value.
         *
         * @attribute inputFormatter
         * @default null
         */
        inputFormatter: {
            value: null
        },

        /**
         * Array or Object which defines the available options for the
         * `BaseOptionsCellEditor`.
         *
         * @attribute options
         * @default {}
         * @type Object|Array
         */
        options: {
            setter: '_setOptions',
            value: {},
            validator: isObject
        },

        /**
         * Function which modifies input values for data storage.
         *
         * Default `null` Function will not modify the value.
         *
         * @attribute outputFormatter
         * @default null
         */
        outputFormatter: {
            value: null
        },

        /**
         * Defines the selected state of an option.
         *
         * @attribute selectedAttrName
         * @default 'selected'
         * @type String
         */
        selectedAttrName: {
            value: SELECTED,
            validator: isString
        },

        /**
         * Collection of strings used to label elements of the UI.
         *
         * @attribute strings
         * @type Object
         */
        strings: {
            value: {
                add: 'Add',
                cancel: 'Cancel',
                addOption: 'Add option',
                edit: 'Edit options',
                editOptions: 'Edit option(s)',
                name: 'Name',
                remove: 'Remove',
                save: 'Save',
                stopEditing: 'Stop editing',
                value: 'Value'
            }
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseCellEditor,

    /**
     * Static property used to define the UI attributes.
     *
     * @property UI_ATTRS
     * @type Array
     * @static
     */
    UI_ATTRS: [OPTIONS],

    prototype: {
        EDIT_TEMPLATE: '<div class="' + CSS_CELLEDITOR_EDIT + '"></div>',

        EDIT_OPTION_ROW_TEMPLATE: '<div class="' + CSS_CELLEDITOR_EDIT_OPTION_ROW + '">' + '<span class="' + [
            CSS_CELLEDITOR_EDIT_DD_HANDLE, CSS_ICON, CSS_ICON_GRIP_DOTTED_VERTICAL].join(_SPACE) + '"></span>' + '<input class="' + CSS_CELLEDITOR_EDIT_INPUT_NAME + '" size="7" placeholder="{titleName}" title="{titleName}" type="text" value="{valueName}" /> ' + '<input class="' + CSS_CELLEDITOR_EDIT_INPUT_VALUE + '" size="7" placeholder="{titleValue}" title="{titleValue}" type="text" value="{valueValue}" /> ' + '<a class="' + [
            CSS_CELLEDITOR_EDIT_LINK, CSS_CELLEDITOR_EDIT_DELETE_OPTION].join(_SPACE) + '" href="javascript:void(0);">{remove}</a> ' + '</div>',

        EDIT_ADD_LINK_TEMPLATE: '<a class="' + [CSS_CELLEDITOR_EDIT_LINK, CSS_CELLEDITOR_EDIT_ADD_OPTION].join(
            _SPACE) + '" href="javascript:void(0);">{addOption}</a> ',
        EDIT_LABEL_TEMPLATE: '<div class="' + CSS_CELLEDITOR_EDIT_LABEL + '">{editOptions}</div>',

        editContainer: null,
        editSortable: null,
        options: null,

        /**
         * Construction logic executed during `BaseOptionsCellEditor`
         * instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.on(EDIT, instance._onEditEvent);
            instance.on(SAVE, instance._onSave);
            instance.after(INIT_TOOLBAR, instance._afterInitToolbar);
        },

        /**
         * Adds a new option to the `BaseOptionsCellEditor`.
         *
         * If `name` or `value` is omitted, a blank string is used in it's
         * place.
         *
         * @method addNewOption
         * @param {String} [name='']
         * @param {String} [value='']
         */
        addNewOption: function(name, value) {
            var instance = this;
            var addOptionLink = instance.editContainer.one(_DOT + CSS_CELLEDITOR_EDIT_ADD_OPTION);

            var newRow = A.Node.create(
                instance._createEditOption(
                    name || _EMPTY_STR,
                    value || _EMPTY_STR
                )
            );

            addOptionLink.placeBefore(newRow);
            newRow.one(INPUT).focus();
        },

        /**
         * Removes the given `optionRow` Node from the `BaseOptionsCellEditor`.
         *
         * @method removeOption
         * @param {Node} optionRow
         * @static
         */
        removeOption: function(optionRow) {
            optionRow.remove();
        },

        /**
         * Saves the `BaseOptionsCellEditor` options.
         *
         * @method saveOptions
         */
        saveOptions: function() {
            var instance = this;
            var editContainer = instance.editContainer;

            if (editContainer) {
                var names = editContainer.all(_DOT + CSS_CELLEDITOR_EDIT_INPUT_NAME);
                var values = editContainer.all(_DOT + CSS_CELLEDITOR_EDIT_INPUT_VALUE);
                var options = {};

                names.each(function(inputName, index) {
                    var name = inputName.val();
                    var value = values.item(index).val();

                    if (name && value) {
                        options[value] = name;
                    }
                });

                instance.set(OPTIONS, options);

                instance._uiSetValue(
                    instance.get(VALUE)
                );

                instance.toggleEdit();
            }
        },

        /**
         * Toggles the display of the `BaseOptionsCellEditor`.
         *
         * @method toggleEdit
         */
        toggleEdit: function() {
            var instance = this;

            instance.editContainer.toggle();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         * TODO. Rewrite this method.
         *
         * @method _createOptions
         * @param  {Array} val
         * @protected
         */
        _createOptions: function(val) {
            var instance = this;
            var elements = instance.elements;
            var optionsBuffer = [];
            var wrappersBuffer = [];
            var optionTpl = instance.OPTION_TEMPLATE;
            var optionWrapperTpl = instance.OPTION_WRAPPER;

            A.each(val, function(oLabel, oValue) {
                var values = {
                    id: A.guid(),
                    label: oLabel,
                    name: oValue,
                    value: oValue
                };

                if (optionTpl) {
                    optionsBuffer.push(Lang.sub(optionTpl, values));
                }

                if (optionWrapperTpl) {
                    wrappersBuffer.push(Lang.sub(optionWrapperTpl, values));
                }
            });

            var options = A.NodeList.create(optionsBuffer.join(_EMPTY_STR));
            var wrappers = A.NodeList.create(wrappersBuffer.join(_EMPTY_STR));

            if (wrappers.size()) {
                wrappers.each(function(wrapper, i) {
                    wrapper.prepend(options.item(i));
                });

                elements.setContent(wrappers);
            }
            else {
                elements.setContent(options);
            }

            instance.options = options;
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _createEditBuffer
         * @protected
         * @return {String} HTML string for the `BaseOptionsCellEditor`.
         */
        _createEditBuffer: function() {
            var instance = this;
            var strings = instance.getStrings();
            var buffer = [];

            buffer.push(
                Lang.sub(instance.EDIT_LABEL_TEMPLATE, {
                    editOptions: strings[EDIT_OPTIONS]
                })
            );

            A.each(instance.get(OPTIONS), function(name, value) {
                buffer.push(instance._createEditOption(name, value));
            });

            buffer.push(
                Lang.sub(instance.EDIT_ADD_LINK_TEMPLATE, {
                    addOption: strings[ADD_OPTION]
                })
            );

            return buffer.join(_EMPTY_STR);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _createEditOption
         * @param {String} name
         * @param {String} value
         * @protected
         * @return {String} HTML string for a `BaseOptionsCellEditor` input
         * option.
         */
        _createEditOption: function(name, value) {
            var instance = this;
            var strings = instance.getStrings();

            return Lang.sub(
                instance.EDIT_OPTION_ROW_TEMPLATE, {
                    remove: strings[REMOVE],
                    titleName: strings[NAME],
                    titleValue: strings[VALUE],
                    valueName: name,
                    valueValue: value
                }
            );
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _defInitEditFn
         * @param event
         * @protected
         */
        _defInitEditFn: function(event) {
            var instance = this;
            var editContainer = A.Node.create(instance.EDIT_TEMPLATE);

            editContainer.delegate('click', A.bind(instance._onEditLinkClickEvent, instance), _DOT +
                CSS_CELLEDITOR_EDIT_LINK);
            editContainer.delegate('keydown', A.bind(instance._onEditKeyEvent, instance), INPUT);

            instance.editContainer = editContainer;

            instance.setStdModContent(
                WidgetStdMod.BODY,
                editContainer.hide(),
                WidgetStdMod.AFTER
            );

            instance.editSortable = new A.Sortable({
                container: editContainer,
                handles: [_DOT + CSS_CELLEDITOR_EDIT_DD_HANDLE],
                nodes: _DOT + CSS_CELLEDITOR_EDIT_OPTION_ROW,
                opacity: '.3'
            }).delegate.dd.plug(A.Plugin.DDConstrained, {
                constrain: editContainer,
                stickY: true
            });

            instance._syncEditOptionsUI();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _getSelectedOptions
         * @protected
         * @return {NodeList} Selected options.
         */
        _getSelectedOptions: function() {
            var instance = this;
            var options = [];

            instance.options.each(function(option) {
                if (option.get(instance.get(SELECTED_ATTR_NAME))) {
                    options.push(option);
                }
            });

            return A.all(options);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onEditEvent
         * @param event
         * @protected
         */
        _onEditEvent: function(event) {
            var instance = this;

            instance._handleInitEditEvent();

            instance.toggleEdit();

            instance._syncEditOptionsUI();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onEditLinkClickEvent
         * @param {EventFacade} event
         * @protected
         */
        _onEditLinkClickEvent: function(event) {
            var instance = this;
            var currentTarget = event.currentTarget;

            if (currentTarget.test(_DOT + CSS_CELLEDITOR_EDIT_ADD_OPTION)) {
                instance.addNewOption();
            }
            else if (currentTarget.test(_DOT + CSS_CELLEDITOR_EDIT_HIDE_OPTION)) {
                instance.toggleEdit();
            }
            else if (currentTarget.test(_DOT + CSS_CELLEDITOR_EDIT_DELETE_OPTION)) {
                instance.removeOption(
                    currentTarget.ancestor(_DOT + CSS_CELLEDITOR_EDIT_OPTION_ROW)
                );
            }

            event.halt();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onEditKeyEvent
         * @param {EventFacade} event
         * @protected
         */
        _onEditKeyEvent: function(event) {
            var instance = this;
            var currentTarget = event.currentTarget;

            if (event.isKey(RETURN)) {
                var nextInput = currentTarget.next(INPUT);

                if (nextInput) {
                    nextInput.selectText();
                }
                else {
                    instance.addNewOption();
                }

                event.halt();
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onSave
         * @param event
         * @protected
         */
        _onSave: function(event) {
            var instance = this;

            instance.saveOptions();
        },

        /**
         * Determines the proper format for the `options` attribute.
         *
         * @method _setOptions
         * @param {Array|Object} val
         * @protected
         * @return {Object} Options
         */
        _setOptions: function(val) {
            var options = {};

            if (isArray(val)) {
                AArray.each(val, function(value) {
                    options[value] = value;
                });
            }
            else if (isObject(val)) {
                options = val;
            }

            return options;
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _syncEditOptionsUI
         * @protected
         */
        _syncEditOptionsUI: function() {
            var instance = this;

            instance.editContainer.setContent(instance._createEditBuffer());
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetOptions
         * @param {Array} val
         * @protected
         */
        _uiSetOptions: function(val) {
            var instance = this;

            instance._createOptions(val);
            instance._uiSetValue(instance.get(VALUE));
            instance._syncElementsName();
        },

        /**
         * Sets the `BaseOptionsCellEditor` option values.
         *
         * @method _uiSetValue
         * @param {Array} val
         * @protected
         * @return {Array} Resulting new values.
         */
        _uiSetValue: function(val) {
            var instance = this;
            var options = instance.options;

            if (options && options.size()) {
                options.set(instance.get(SELECTED_ATTR_NAME), false);

                if (isValue(val)) {
                    if (!isArray(val)) {
                        val = String(val).split(_COMMA);
                    }

                    AArray.each(val, function(value) {
                        options.filter('[value="' + Lang.trim(value) + '"]').set(instance.get(
                            SELECTED_ATTR_NAME), true);
                    });
                }
            }

            return val;
        }
    }
});

A.BaseOptionsCellEditor = BaseOptionsCellEditor;

/**
 * TextCellEditor class.
 *
 * @class A.TextCellEditor
 * @extends A.BaseCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var TextCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: TEXT_CELL_EDITOR,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseCellEditor,

    prototype: {
        ELEMENT_TEMPLATE: '<input autocomplete="off" class="' + CSS_CELLEDITOR_ELEMENT + '" type="text" />'
    }
});

A.TextCellEditor = TextCellEditor;

/**
 * TextAreaCellEditor class.
 *
 * @class A.TextAreaCellEditor
 * @extends A.BaseCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var TextAreaCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: TEXT_AREA_CELL_EDITOR,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseCellEditor,

    prototype: {
        ELEMENT_TEMPLATE: '<textarea class="' + CSS_CELLEDITOR_ELEMENT + '"></textarea>'
    }
});

A.TextAreaCellEditor = TextAreaCellEditor;

/**
 * DropDownCellEditor class.
 *
 * @class A.DropDownCellEditor
 * @extends A.BaseOptionsCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var DropDownCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: DROP_DOWN_CELL_EDITOR,

    /**
     * Static property used to define the default attribute
     * configuration for the `DropDownCellEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Indicates whether or not multiple options are selectable.
         *
         * @attribute multiple
         * @default false
         * @type Boolean
         */
        multiple: {
            value: false,
            validator: isBoolean
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseOptionsCellEditor,

    /**
     * Static property used to define the UI attributes.
     *
     * @property UI_ATTRS
     * @type Array
     * @static
     */
    UI_ATTRS: [MULTIPLE],

    prototype: {
        ELEMENT_TEMPLATE: '<select class="' + CSS_CELLEDITOR_ELEMENT + '"></select>',
        OPTION_TEMPLATE: '<option value="{value}">{label}</option>',

        /**
         * Gets the `DropDownCellEditor` input value.
         *
         * @method getElementsValue
         * @return {String} Input value.
         */
        getElementsValue: function() {
            var instance = this;

            if (instance.get(MULTIPLE)) {
                return instance._getSelectedOptions().get(VALUE);
            }

            return instance.elements.get(VALUE);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _syncElementsFocus
         * @protected
         */
        _syncElementsFocus: function() {
            var instance = this;

            instance.elements.focus();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetMultiple
         * @param val
         * @protected
         */
        _uiSetMultiple: function(val) {
            var instance = this;
            var elements = instance.elements;

            if (val) {
                elements.setAttribute(MULTIPLE, MULTIPLE);
            }
            else {
                elements.removeAttribute(MULTIPLE);
            }
        }
    }
});

A.DropDownCellEditor = DropDownCellEditor;

/**
 * CheckboxCellEditor class.
 *
 * @class A.CheckboxCellEditor
 * @extends A.BaseOptionsCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var CheckboxCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: CHECKBOX_CELL_EDITOR,

    /**
     * Static property used to define the default attribute
     * configuration for the `CheckboxCellEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Defines the selected state of an option.
         *
         * @attribute selectedAttrName
         * @default 'checked'
         * @type String
         */
        selectedAttrName: {
            value: CHECKED
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseOptionsCellEditor,

    prototype: {
        ELEMENT_TEMPLATE: '<div class="' + CSS_CELLEDITOR_ELEMENT + '"></div>',
        OPTION_TEMPLATE: '<input class="' + CSS_CELLEDITOR_OPTION + '" id="{id}" name="{name}" type="checkbox" value="{value}"/>',
        OPTION_WRAPPER: '<label class="checkbox" for="{id}"> {label}</label>',

        /**
         * Gets the `CheckboxCellEditor` input value.
         *
         * @method getElementsValue
         * @return {String} Input value.
         */
        getElementsValue: function() {
            var instance = this;

            return instance._getSelectedOptions().get(VALUE);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _syncElementsFocus
         * @protected
         */
        _syncElementsFocus: function() {
            var instance = this;
            var options = instance.options;

            if (options && options.size()) {
                options.item(0).focus();
            }
        },

        /**
         * Syncs the name attribute of the form input.
         *
         * @method _syncElementsName
         * @protected
         */
        _syncElementsName: function() {
            var instance = this;
            var options = instance.options;

            if (options) {
                options.setAttribute(NAME, instance.get(ELEMENT_NAME));
            }
        }
    }
});

A.CheckboxCellEditor = CheckboxCellEditor;

/**
 * RadioCellEditor class.
 *
 * @class A.RadioCellEditor
 * @extends A.CheckboxCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var RadioCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: RADIO_CELL_EDITOR,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.CheckboxCellEditor,

    prototype: {
        OPTION_TEMPLATE: '<input class="field-input-choice" id="{id}" name="{name}" type="radio" value="{value}"/>',
        OPTION_WRAPPER: '<label class="radio" for="{id}"> {label}</label>',

        /**
         * Gets the `RadioCellEditor` input value.
         *
         * @method getElementsValue
         * @return {String} Input value.
         */
        getElementsValue: function() {
            var instance = this;

            return instance._getSelectedOptions().get(VALUE)[0];
        }
    }
});

A.RadioCellEditor = RadioCellEditor;

/**
 * DateCellEditor class.
 *
 * @class A.DateCellEditor
 * @extends A.BaseCellEditor
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
var DateCellEditor = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: DATE_CELL_EDITOR,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.BaseCellEditor,

    /**
     * Static property used to define the default attribute
     * configuration for the `DateCellEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Defines the content of body.
         *
         * @attribute bodyContent
         * @default ''
         * @type String
         */
        bodyContent: {
            value: _EMPTY_STR
        },

        /**
         * Defines the `Calendar` object used for the `DateCellEditor` input.
         *
         * @attribute calendar
         * @default null
         * @type Object
         */
        calendar: {
            setter: '_setCalendar',
            validator: isObject,
            value: null
        },

        /**
         * Defines the `DataType.Date` format used in input and output methods
         * of the `DateCellEditor` input.
         *
         * @attribute dateFormat
         * @default '%Y-%m-%d'
         * @type String
         */
        dateFormat: {
            value: '%Y-%m-%d',
            validator: isString
        },

        /**
         * Defines the Function which is used in `formatValue` to modify values
         * for the `DateCellEditor` input.
         *
         * Default Function iterates and formats values using the `dateFormat`
         * attribute.
         *
         * @attribute inputFormatter
         * @type Function
         */
        inputFormatter: {
            value: function(val) {
                var instance = this,
                    values = [];

                AArray.each(val, function(date, index) {
                    values.push(instance.formatDate(date).toString());
                });

                return values;
            }
        },

        /**
         * Defines the Function which is used in `formatValue` to modify values
         * for the `DateCellEditor` input.
         *
         * Default Function iterates and formats values using the `dateFormat`
         * attribute.
         *
         * @attribute outputFormatter
         * @type Function
         */
        outputFormatter: {
            value: function(val) {
                var instance = this,
                    values = [];

                AArray.each(val, function(date, index) {
                    values.push(DataType.Date.parse(instance.get('dateFormat'), date));
                });

                return values;
            }
        }
    },

    prototype: {
        ELEMENT_TEMPLATE: '<input class="' + CSS_CELLEDITOR_ELEMENT + '" type="hidden" />',

        /**
         * Construction logic executed during the `DateCellEditor`
         * instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.after('calendar:dateClick', A.bind(instance._afterDateSelect, instance));
        },

        /**
         * Gets the `DateCellEditor` input value.
         *
         * @method getElementsValue
         */
        getElementsValue: function() {
            var instance = this;

            return instance.calendar.get('selectedDates');
        },

        /**
         * Formats the passed `date` using the format define in the `dateFormat`
         * attribute.
         *
         * @method formatDate
         * @param {String} date
         * @return {String} HTML formatted for display.
         */
        formatDate: function(date) {
            var instance = this,
                mask = instance.get('dateFormat'),
                locale = instance.get('locale');

            return DataType.Date.format(date, {
                format: mask,
                locale: locale
            });
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _afterDateSelect
         * @param event
         * @protected
         */
        _afterDateSelect: function(event) {
            var instance = this,
                selectedDates = instance.calendar.get('selectedDates');

            instance.elements.val(AArray.invoke(selectedDates, 'getTime').join(_COMMA));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _afterRender
         * @protected
         */
        _afterRender: function() {
            var instance = this;

            A.DateCellEditor.superclass._afterRender.apply(instance, arguments);

            instance.calendar = new A.Calendar(
                instance.get(CALENDAR)
            ).render(instance.bodyNode);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _setCalendar
         * @param {Object} val
         * @protected
         * @return {Object} Merged `Calendar` object.
         */
        _setCalendar: function(val) {
            var instance = this;

            return A.merge({
                    bubbleTargets: instance
                },
                val
            );
        },

        /**
         * Sets and formats the `DateCellEditor` `Calendar` `date` attribute.
         *
         * @method _uiSetValue
         * @param {Array} val
         * @protected
         */
        _uiSetValue: function(val) {
            var instance = this,
                calendar = instance.calendar,
                formatedValue;

            if (calendar) {
                if (!isArray(val)) {
                    val = [val];
                }

                formatedValue = instance.formatValue(instance.get(OUTPUT_FORMATTER), val);

                calendar._clearSelection();

                if (formatedValue[0]) {
                    calendar.set('date', formatedValue[0]);
                    calendar.selectDates(formatedValue);
                }
                else {
                    calendar.set('date', new Date());
                }
            }
        }
    }
});

A.DateCellEditor = DateCellEditor;
