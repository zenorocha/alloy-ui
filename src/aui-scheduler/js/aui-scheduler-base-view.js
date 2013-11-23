/**
 * Contains the Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-base-view
 */

/**
 * A base class for SchedulerView.
 *
 * @class A.SchedulerView
 * @extends A.Component
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SchedulerView = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property SchedulerView.NAME
     * @type {String}
     * @static
     */
    NAME: SCHEDULER_VIEW,

    /**
     * Static property used to define the default attribute
     * configuration for the SchedulerView.
     *
     * @property SchedulerView.ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Determines the content of Scheduler view's body section.
         *
         * @attribute bodyContent
         * @default ''
         * @type {String}
         */
        bodyContent: {
            value: _EMPTY_STR
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute filterFn
         */
        filterFn: {
            validator: isFunction,
            value: function(evt) {
                return true;
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute height
         * @default 600
         * @type {Number}
         */
        height: {
            value: 600
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute isoTime
         * @default false
         * @type {Boolean}
         */
        isoTime: {
            value: false,
            validator: isBoolean
        },

        /**
         * Determines the name for this view.
         *
         * @attribute name
         * @default ''
         * @type {String}
         */
        name: {
            value: _EMPTY_STR,
            validator: isString
        },

        /**
         * Contains the function that formats the navigation date.
         *
         * @attribute navigationDateFormatter
         * @default %A - %d %b %Y
         * @type {Function}
         */
        navigationDateFormatter: {
            value: function(date) {
                var instance = this;
                var scheduler = instance.get(SCHEDULER);

                return A.DataType.Date.format(date, {
                    format: '%A, %d %B, %Y',
                    locale: scheduler.get(LOCALE)
                });
            },
            validator: isFunction
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute nextDate
         * @readOnly
         */
        nextDate: {
            getter: 'getNextDate',
            readOnly: true
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute prevDate
         * @readOnly
         */
        prevDate: {
            getter: 'getPrevDate',
            readOnly: true
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute scheduler
         */
        scheduler: {
            lazyAdd: false,
            setter: '_setScheduler'
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute scrollable
         * @default true
         * @type {Boolean}
         */
        scrollable: {
            value: true,
            validator: isBoolean
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute triggerNode
         */
        triggerNode: {
            setter: A.one
        },

        /**
         * Indicates whether the calendar is visible.
         *
         * @attribute visible
         * @default false
         * @type {Boolean}
         */
        visible: {
            value: false
        }
    },

    AUGMENTS: [A.WidgetStdMod],

    /**
     * Static property used to define the attributes
     * for the bindUI lifecycle phase.
     *
     * @property SchedulerView.BIND_UI_ATTRS
     * @type {Array}
     * @static
     */
    BIND_UI_ATTRS: [SCROLLABLE],

    prototype: {

        /**
         * Construction logic executed during SchedulerView instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.after('render', instance._afterRender);
        },

        /**
         * Syncs the SchedulerView UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance.syncStdContent();
        },

        /**
         * Returns a date value of the date with its time adjusted
         * to midnight.
         *
         * @method getAdjustedViewDate
         * @param val {Any} The value of the property.
         */
        getAdjustedViewDate: function(val) {
            var instance = this;

            return DateMath.toMidnight(val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method flushViewCache
         */
        flushViewCache: function() {},

        /**
         * Returns the value of the date that follows the view's current
         * date.
         *
         * @method getNextDate
         * @return {Date}
         */
        getNextDate: function() {},

        /**
         * Returns the value of the date that preceeds the view's current
         * date.
         *
         * @method getPrevDate
         * @return {Date}
         */
        getPrevDate: function() {},

        /**
         * Returns the value of the current date.
         *
         * @method getToday
         * @return {Date}
         */
        getToday: function() {
            return DateMath.clearTime(new Date());
        },

        /**
         * Returns a clone of a given `date` that will adjust to the `maxDate`
         * if it occurs after `maxDate`.
         *
         * @method limitDate
         * @param {Date} date
         * @param {Date} maxDate
         * @return {Date}
         */
        limitDate: function(date, maxDate) {
            var instance = this;

            if (DateMath.after(date, maxDate)) {
                date = DateMath.clone(maxDate);
            }

            return date;
        },

        /**
         * Plots all events in the current view.
         *
         * @method plotEvents
         */
        plotEvents: function() {},

        /**
         * Sync SchedulerBase StdContent.
         *
         * @method syncStdContent
         */
        syncStdContent: function() {},

        /**
         * Sync `event` on the UI.
         *
         * @method syncEventUI
         * @param {Object} evt
         */
        syncEventUI: function(evt) {},

        /**
         * Set `date` on the UI.
         *
         * @method _uiSetDate
         * @param val {Any} The value of the property.
         * @protected
         */
        _uiSetDate: function(val) {},

        /**
         * Handles `render` events.
         *
         * @method _afterRender
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterRender: function(event) {
            var instance = this;
            var scheduler = instance.get(SCHEDULER);

            instance._uiSetScrollable(
                instance.get(SCROLLABLE)
            );
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _setScheduler
         * @param val {Any} The value of the property.
         * @protected
         */
        _setScheduler: function(val) {
            var instance = this;
            var scheduler = instance.get(SCHEDULER);

            if (scheduler) {
                instance.removeTarget(scheduler);
            }

            if (val) {
                instance.addTarget(val);

                val.after(['*:add', '*:remove', '*:reset'], A.bind(instance.flushViewCache, instance));
            }

            return val;
        }

        /**
         * Set `scrollable` on the UI.
         *
         * @method _uiSetScrollable
         * @param val {Any} The value of the property.
         * @protected
         */
        _uiSetScrollable: function(val) {
            var instance = this;
            var bodyNode = instance.bodyNode;

            if (bodyNode) {
                bodyNode.toggleClass(CSS_SCHEDULER_VIEW_SCROLLABLE, val);
                bodyNode.toggleClass(CSS_SCHEDULER_VIEW_NOSCROLL, !val);
            }
        },
    }
});

A.SchedulerView = SchedulerView;
