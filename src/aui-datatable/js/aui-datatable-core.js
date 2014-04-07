A.DataTable.NAME = 'table';
A.DataTable.CSS_PREFIX = 'table';

/**
 * The Datatable Component
 *
 * @module aui-datatable
 * @submodule aui-datatable-core
 */

var getCN = A.getClassName,
    CSS_TABLE = getCN('table'),
    CSS_TABLE_BORDERED = getCN('table', 'bordered');

/**
 * An extension for A.DataTable that adds correct class to Table.
 *
 * @class A.DataTable.DataTableCore
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
function DataTableCore() {}

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
DataTableCore.NAME = 'dataTableCore';

DataTableCore.prototype = {

    /**
     * Construction logic executed during DataTableCore instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this.after('render', this._setTableClass);
    },

    /**
     * Sets the correct table class.
     *
     * @method _setTableClass
     * @protected
     */
    _setTableClass: function() {
        this.get('contentBox').one('table')
            .addClass(CSS_TABLE)
            .addClass(CSS_TABLE_BORDERED);
    }
};

A.Base.mix(A.DataTable, [DataTableCore]);
