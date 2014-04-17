/**
 * The Dropdown Component
 *
 * @module aui-dropdown
 */

var Lang = A.Lang,
    createNode = A.Node.create,
    isBoolean = Lang.isBoolean,

    isNodeList = function(v) {
        return (v instanceof A.NodeList);
    },

    isNode = function(val) {
        return A.instanceOf(val, A.Node);
    },

    getClassName = A.getClassName,

    CSS_DROPDOWN_TOGGLE = getClassName('dropdown','toggle'),
    CSS_DROPDOWN_MENU = getClassName('dropdown','menu'),

    TPL_ENTRY = '<li><a href="{href}">{label}</a></li>',
    TPL_DIVIDER = '<li class="divider"></li>',
    TPL_LIST = '<ul class="java dropdown-menu"/>';

/**
 * A base class for Dropdown.
 *
 * Check the [live demo](http://alloyui.com/examples/dropdown/).
 *
 * @class A.Dropdown
 * @extends Widget
 * @uses A.WidgetCssClass, A.WidgetToggle, A.WidgetStack, A.WidgetTrigger
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.Dropdown = A.Base.create('dropdown', A.Widget, [
    A.WidgetCssClass,
    A.WidgetToggle,
    A.WidgetStack,
    A.WidgetTrigger
], {

    /**
     * Construction logic executed during Dropdown instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        if (instance.get('hideOnEsc')) {
            A.one(A.config.doc).on(
                'key', A.bind(instance.close, instance), 'esc');
        }

        if (instance.get('hideOnClickOutSide')) {
            instance.get('contentBox').on(
                'clickoutside', A.bind(instance.close, instance));
        }
    },

    /**
     * Bind the events on the Dropdown UI. Lifecycle.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function() {
        var instance = this;

        instance.get('trigger').on(
            'click', A.bind(instance.toggle, instance));
    },

    /**
     * Render the Dropdown component instance. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        var instance = this;

        instance.get('contentBox').append(instance.get('items'));
    },

    /**
     * Close the `Dropdown` instance.
     *
     * @method close
     */
    close: function() {
        this.get('contentBox').removeClass('open');
    },

    /**
     * Display the `Dropdown` instance.
     *
     * @method open
     */
    open: function() {
        this.get('contentBox').addClass('open');
    },

    /**
     * Displays or close the `Dropdown`.
     *
     * @method toggle
     */
    toggle: function() {
        this.get('contentBox').toggleClass('open');
    },

    /**
     * Create a list item `<li>` using values from parameter.
     *
     * @method _createItem
     * @param val
     * @protected
     */
    _createItem: function(val) {
        var elementNode = createNode(Lang.sub(
            TPL_ENTRY, {
                label: val.label,
                href: val.link ? val.link : '#'
            }
        ));

        if (val.fn) {
            elementNode.on('click', val.fn);
        }

        return elementNode;
    },

    /**
     * Create a list of items based on `items` parameter.
     *
     * @method _setItems
     * @param {Array} items
     */
    _setItems: function(items) {
        var instance = this,
            tplList;

        if (isNode(items)) {
            return items;
        }

        tplList = createNode(TPL_LIST);

        if (isNodeList(items)) {
            return tplList.append(items);
        }

        if (Lang.isArray(items)) {
            A.Array.each(items, function(value) {
                if (!value.divider) {
                    tplList.appendChild(instance._createItem(value));
                }
                else {
                    tplList.appendChild(TPL_DIVIDER);
                }
            });
        }

        return tplList;
    }

}, {

    /**
     * Static property used to define the default attribute configuration for
     * the Dropdown.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * A Node in which results will be shown.
         *
         * @attribute items
         * @default null
         * @type Node
         */
        items: {
            setter: '_setItems'
        },

        /**
         * Determine if `dropdown` will close when press `esc`.
         *
         * @attribute hideOnEsc
         * @default true
         * @type Boolean
         * @writeOnce
         */
        hideOnEsc: {
            validator: isBoolean,
            value: true,
            writeOnce: true
        },

        /**
         * Determine if `dropdown` will close when click outside the `boundingBox`
         * area.
         *
         * @attribute hideOnClickOutSide
         * @default true
         * @type Boolean
         * @writeOnce
         */
        hideOnClickOutSide: {
            validator: isBoolean,
            value: true,
            writeOnce: true
        }
    },

    /**
     * Object hash, defining how attribute values have to be parsed from markup.
     *
     * @property HTML_PARSER
     * @type Object
     * @static
     */
    HTML_PARSER: {
        trigger: '.' + CSS_DROPDOWN_TOGGLE,
        items: '.' + CSS_DROPDOWN_MENU
    }
});
