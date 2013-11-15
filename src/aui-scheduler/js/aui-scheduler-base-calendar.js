/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-base-calendar
 */

/**
 * A base class for SchedulerCalendar.
 *
 * @class A.SchedulerCalendar
 * @extends A.ModelList
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SchedulerCalendar = A.Base.create(SCHEDULER_CALENDAR, A.ModelList, [], {
    model: A.SchedulerEvent,

    /**
     * Construction logic executed during SchedulerCalendar instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('colorChange', instance._afterColorChange);
        instance.after('enabledChange', instance._afterEnabledChange);
        instance.after('visibleChange', instance._afterVisibleChange);
        instance.after(['add', 'remove', 'reset'], instance._afterEventsChange);
        instance.on(['remove', 'reset'], instance._onRemoveEvents);

        instance._uiSetEvents(
            instance.toArray()
        );

        instance._setModelsAttrs({
            color: instance.get(COLOR),
            enabled: instance.get(ENABLED),
            visible: instance.get(VISIBLE)
        });
    },

    /**
     * Handles `color` events.
     *
     * @method _afterColorChange
     * @param event {Event.Facade} Event Facade object
     * @protected
     */
    _afterColorChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            color: instance.get(COLOR)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `enabled` events.
     *
     * @method _afterEnabledChange
     * @param event {Event.Facade} Event Facade object
     * @protected
     */
    _afterEnabledChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            enabled: instance.get(ENABLED)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `events` events.
     *
     * @method _afterEventsChange
     * @param event {Event.Facade} Event Facade object
     * @protected
     */
    _afterEventsChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            color: instance.get(COLOR),
            enabled: instance.get(ENABLED),
            visible: instance.get(VISIBLE)
        }, {
            silent: true
        });

        instance._uiSetEvents(instance.toArray());
    },

    /**
     * Handles `visible` events.
     *
     * @method _afterVisibleChange
     * @param event {Event.Facade} Event Facade object
     * @protected
     */
    _afterVisibleChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            visible: instance.get(VISIBLE)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `remove` events.
     *
     * @method _onRemoveEvents
     * @param event {Event.Facade} Event Facade object
     * @protected
     */
    _onRemoveEvents: function(event) {
        var instance = this;
        var scheduler = instance.get(SCHEDULER);

        if (scheduler) {
            scheduler.removeEvents(instance);
        }
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _setModelsAttrs
     * @param attrMap
     * @param {Object} options (optional) Zero or more options.
     * @protected
     */
    _setModelsAttrs: function(attrMap, options) {
        var instance = this;

        instance.each(function(schedulerEvent) {
            schedulerEvent.setAttrs(attrMap, options);
        });
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _uiSetEvents
     * @param val
     * @protected
     */
    _uiSetEvents: function(val) {
        var instance = this;
        var scheduler = instance.get(SCHEDULER);

        if (scheduler) {
            scheduler.addEvents(val);
            scheduler.syncEventsUI();
        }
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the SchedulerCalendar.
     *
     * @property SchedulerCalendar.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * The `color` of the scheduler calendar.
         *
         * @attribute color
         * @type String
         */
        color: {
            valueFn: function() {
                var instance = this;
                var palette = instance.get(PALETTE);
                var randomIndex = Math.ceil(Math.random() * palette.length) - 1;

                return palette[randomIndex];
            },
            validator: isString
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute enabled
         * @default false
         * @type Boolean
         */
        enabled: {
            value: false,
            validator: isBoolean
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute name
         * @default '(no name)'
         * @type String
         */
        name: {
            value: '(no name)',
            validator: isString
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute palette
         * @type Array
         */
        palette: {
            value: ['#d93636', '#e63973', '#b22eb3', '#6e36d9', '#2d70b3', '#376cd9', '#25998c', '#249960',
                '#24992e', '#6b9926', '#999926', '#a68f29', '#b3782d', '#bf6030', '#bf6060', '#997399', '#617181',
                '#6b7a99', '#548c85', '#747446', '#997e5c', '#b34d1b', '#993d48', '#802d70'],
            validator: isArray
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute scheduler
         */
        scheduler: {},

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute visible
         * @default true
         * @type Boolean
         */
        visible: {
            value: true,
            validator: isBoolean
        }
    }
});

A.SchedulerCalendar = SchedulerCalendar;
