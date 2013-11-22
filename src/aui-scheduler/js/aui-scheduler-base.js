/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-base
 */

/**
 * A base class for SchedulerEvents.
 *
 * @class A.SchedulerEvents
 * @extends A.ModelList
 * @param config {Object} Object literal specifying widget configuration
 * properties.
 * @constructor
 */
A.SchedulerEvents = A.Base.create('scheduler-events', A.ModelList, [], {

    /**
     * Compares the inputs of a start and end date to see if adding `1` to the
     * start date time is larger than the difference between start and end date
     * times.
     *
     * @method comparator
     * @param {Object} model
     * @return {Number}
     */
    comparator: function(model) {
        var startDateTime = model.get(START_DATE),
            endDateTime = model.get(END_DATE);

        return startDateTime + 1 / (endDateTime - startDateTime);
    },

    model: A.SchedulerEvent
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the SchedulerEvents.
     *
     * @property SchedulerEvents.ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {
        scheduler: {}
    }
});

/**
 * A base class for SchedulerEventSupport.
 *
 * @class A.SchedulerEventSupport
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SchedulerEventSupport = function() {};

/**
 * Static property used to define the default attribute
 * configuration for the SchedulerEventSupport.
 *
 * @property SchedulerEventSupport.ATTRS
 * @type {Object}
 * @static
 */
SchedulerEventSupport.ATTRS = {};

A.mix(SchedulerEventSupport.prototype, {
    calendarModel: A.SchedulerCalendar,

    eventModel: A.SchedulerEvent,

    eventsModel: A.SchedulerEvents,

    /**
     * Construction logic executed during SchedulerEventSupport instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @param config
     * @protected
     */
    initializer: function(config) {
        var instance = this;

        instance._events = new instance.eventsModel({
            after: {
                add: A.bind(instance._afterAddEvent, instance)
            },
            bubbleTargets: instance,
            scheduler: instance
        });

        instance.addEvents(config.items || config.events);
    },

    /**
     * Adds and returns the collection of events for this `Scheduler`.
     *
     * @method addEvents
     * @param {Object} models
     * @return {SchedulerEvents}
     */
    addEvents: function(models) {
        var instance = this,
            events = instance._toSchedulerEvents(models);

        return instance._events.add(events);
    },

    /**
     * Applies a `function` to the collection of `Scheduler` events.
     *
     * @method eachEvent
     * @param {Function} fn
     * @return {SchedulerEvents}
     */
    eachEvent: function(fn) {
        var instance = this;

        return instance._events.each(fn);
    },

    /**
     * Deletes each event in the collection of `Scheduler` events.
     *
     * @method flushEvents
     */
    flushEvents: function() {
        var instance = this;

        instance._events.each(function(evt) {
            delete evt._filtered;
        });
    },

    /**
     * Returns the event by matching it's `clientId`.
     *
     * @method getEventByClientId
     * @param {String} clientId
     * @return {Object}
     */
    getEventByClientId: function(clientId) {
        var instance = this;

        return instance._events.getByClientId(clientId);
    },

    /**
     * Gets a collection of events.
     *
     * @method getEvents
     * @param {Function} filterFn (optional) Filters `events` and returns a list
     * of events.
     * @return {Array}
     */
    getEvents: function(filterFn) {
        var instance = this,
            events = instance._events;

        // TODO: Check why the items are not being sorted on add
        events.sort({
            silent: true
        });

        if (filterFn) {
            events = events.filter(filterFn);
        }
        else {
            events = events.toArray();
        }

        return events;
    },

    /**
     * Gets a collection of events within a given day. It will filter
     * overlapping events by default unless `includeOverlap` is true.
     *
     * @method getEventsByDay
     * @param {Date} date
     * @param {Boolean} includeOverlap
     * @return {Array}
     */
    getEventsByDay: function(date, includeOverlap) {
        var instance = this;

        date = DateMath.safeClearTime(date);

        return instance.getEvents(function(evt) {
            return DateMath.compare(evt.getClearStartDate(), date) ||
                (includeOverlap && DateMath.compare(evt.getClearEndDate(), date));
        });
    },

    /**
     * Returns the list of all events that intersect with a given date. Events
     * that are not visible are not included in this list.
     *
     * @method getIntersectEvents
     * @param {Date} date
     * @return {Array}
     */
    getIntersectEvents: function(date) {
        var instance = this;

        date = DateMath.safeClearTime(date);

        return instance.getEvents(function(evt) {
            var startDate = evt.getClearStartDate();
            var endDate = evt.getClearEndDate();

            return (evt.get(VISIBLE) &&
                (DateMath.compare(date, startDate) ||
                    DateMath.compare(date, endDate) ||
                    DateMath.between(date, startDate, endDate)));
        });
    },

    /**
     * Removes given `SchedulerEvents` from the scheduler.
     *
     * @method removeEvents
     * @param {Object} models
     * @return {A.SchedulerEvents} Removed SchedulerEvents.
     */
    removeEvents: function(models) {
        var instance = this,
            events = instance._toSchedulerEvents(models);

        return instance._events.remove(events);
    },

    /**
     * * Completely replaces all `SchedulerEvents` in the list with the given
     * `SchedulerEvents`.
     *
     * @method resetEvents
     * @param {Object} models
     * @return {A.SchedulerEvents} Reset SchedulerEvents.
     */
    resetEvents: function(models) {
        var instance = this,
            events = instance._toSchedulerEvents(models);

        return instance._events.reset(events);
    },

    /**
     * Handles `add` events.
     *
     * @method _afterAddEvent
     * @param {Event.Facade} event Event Facade object
     * @protected
     */
    _afterAddEvent: function(event) {
        var instance = this;

        event.model.set(SCHEDULER, instance);
    },

    /**
     * Converts given values to `SchedulerEvents`.
     *
     * @method _toSchedulerEvents
     * @param val {Any} The value of the property.ues
     * @returns {A.SchedulerEvents} The values converted to `SchedulerEvents`.
     * @protected
     */
    _toSchedulerEvents: function(values) {
        var instance = this,
            events = [];

        if (isModelList(values)) {
            events = values.toArray();
            values.set(SCHEDULER, instance);
        }
        else if (isArray(values)) {
            A.Array.each(values, function(value) {
                if (isModelList(value)) {
                    events = events.concat(value.toArray());
                    value.set(SCHEDULER, instance);
                }
                else {
                    events.push(value);
                }
            });
        }
        else {
            events = values;
        }

        return events;
    }
});

A.SchedulerEventSupport = SchedulerEventSupport;

/**
 * A base class for SchedulerBase.
 *
 * @class A.SchedulerBase
 * @extends A.Component
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SchedulerBase = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property SchedulerBase.NAME
     * @type {String}
     * @static
     */
    NAME: SCHEDULER_BASE,

    /**
     * Static property used to define the default attribute
     * configuration for the SchedulerBase.
     *
     * @property SchedulerBase.ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute activeView
         * @type {SchedulerView}
         */
        activeView: {
            validator: isSchedulerView
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute date
         * @type {Date}
         */
        date: {
            value: new Date(),
            validator: isDate
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute eventRecorder
         */
        eventRecorder: {
            setter: '_setEventRecorder'
        },

        /**
         * Contains the collection of strings used to label elements of the UI.
         *
         * @attribute strings
         * @type {typeName}
         */
        strings: {
            value: {
                agenda: 'Agenda',
                day: 'Day',
                month: 'Month',
                today: 'Today',
                week: 'Week',
                year: 'Year'
            }
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

                return A.DataType.Date.format(
                    date, {
                        format: '%B %d, %Y',
                        locale: instance.get(LOCALE)
                    }
                );
            },
            validator: isFunction
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute views
         * @default []
         * @type {Array}
         */
        views: {
            setter: '_setViews',
            value: []
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute viewDate
         * @readOnly
         */
        viewDate: {
            getter: '_getViewDate',
            readOnly: true
        },

        /**
         * First day of the week: Sunday is 0, Monday is 1.
         *
         * @attribute firstDayOfWeek
         * @default 0
         * @type {Number}
         */
        firstDayOfWeek: {
            value: 0,
            validator: isNumber
        },

        /*
         * HTML_PARSER attributes
         */
        controlsNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_CONTROLS);
            }
        },

        viewDateNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_VIEW_DATE);
            }
        },

        headerNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_HD);
            }
        },

        iconNextNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_ICON_NEXT);
            }
        },

        iconPrevNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_ICON_PREV);
            }
        },

        navNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_NAV);
            }
        },

        /**
         * Today date representation. This option allows the developer to
         * specify the date he wants to be used as the today date.
         *
         * @attribute todayDate
         * @default new Date()
         * @type {Date}
         */
        todayDate: {
            value: new Date(),
            validator: isDate
        },

        todayNode: {
            valueFn: function() {
                return A.Node.create(
                    this._processTemplate(TPL_SCHEDULER_TODAY)
                );
            }
        },

        viewsNode: {
            valueFn: function() {
                return A.Node.create(TPL_SCHEDULER_VIEWS);
            }
        }
    },

    AUGMENTS: [A.SchedulerEventSupport, A.WidgetStdMod],

    /**
     * Contains an object hash, defining how attribute values are to be parsed
     * from markup contained in the widget's bounding box.
     *
     * @property SchedulerBase.HTML_PARSER
     * @type {typeName}
     * @static
     */
    HTML_PARSER: {
        controlsNode: _DOT + CSS_SCHEDULER_CONTROLS,
        viewDateNode: _DOT + CSS_SCHEDULER_VIEW_DATE,
        headerNode: _DOT + CSS_SCHEDULER_HD,
        iconNextNode: _DOT + CSS_SCHEDULER_ICON_NEXT,
        iconPrevNode: _DOT + CSS_SCHEDULER_ICON_PREV,
        navNode: _DOT + CSS_SCHEDULER_NAV,
        todayNode: _DOT + CSS_SCHEDULER_TODAY,
        viewsNode: _DOT + CSS_SCHEDULER_VIEWS
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @property SchedulerBase.UI_ATTRS
     * @type {Array}
     * @static
     */
    UI_ATTRS: [DATE, ACTIVE_VIEW],

    prototype: {
        viewStack: null,

        /**
         * Construction logic executed during SchedulerBase instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance[VIEW_STACK] = {};

            instance[CONTROLS_NODE] = instance.get(CONTROLS_NODE);
            instance[VIEW_DATE_NODE] = instance.get(VIEW_DATE_NODE);
            instance[HEADER] = instance.get(HEADER_NODE);
            instance[ICON_NEXT_NODE] = instance.get(ICON_NEXT_NODE);
            instance[ICON_PREV_NODE] = instance.get(ICON_PREV_NODE);
            instance[NAV_NODE] = instance.get(NAV_NODE);
            instance[TODAY_NODE] = instance.get(TODAY_NODE);
            instance[VIEWS_NODE] = instance.get(VIEWS_NODE);

            instance.after({
                activeViewChange: instance._afterActiveViewChange,
                render: instance._afterRender
            });
        },

        /**
         * Binds the events on the SchedulerBase UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance._bindDelegate();
        },

        /**
         * Syncs the SchedulerBase UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance.syncStdContent();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method getViewByName
         * @param name
         */
        getViewByName: function(name) {
            var instance = this;

            return instance[VIEW_STACK][name];
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method getStrings
         */
        getStrings: function() {
            var instance = this;

            return instance.get(STRINGS);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method getString
         * @param key
         */
        getString: function(key) {
            var instance = this;

            return instance.getStrings()[key];
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method renderView
         * @param view
         */
        renderView: function(view) {
            var instance = this;

            if (view) {
                view.show();

                if (!view.get(RENDERED)) {
                    if (!instance.bodyNode) {
                        instance.setStdModContent(WidgetStdMod.BODY, _EMPTY_STR);
                    }

                    view.render(instance.bodyNode);
                }
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method plotViewEvents
         * @param view
         */
        plotViewEvents: function(view) {
            var instance = this;

            view.plotEvents(
                instance.getEvents()
            );
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method syncEventsUI
         */
        syncEventsUI: function() {
            var instance = this,
                activeView = instance.get(ACTIVE_VIEW);

            if (activeView) {
                instance.plotViewEvents(activeView);
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method renderButtonGroup
         */
        renderButtonGroup: function() {
            var instance = this;

            instance.buttonGroup = new A.ButtonGroup({
                boundingBox: instance[VIEWS_NODE],
                on: {
                    selectionChange: A.bind(instance._onButtonGroupSelectionChange, instance)
                }
            }).render();
        },

        /**
         * Sync SchedulerBase StdContent.
         *
         * @method syncStdContent
         */
        syncStdContent: function() {
            var instance = this;
            var views = instance.get(VIEWS);

            instance[NAV_NODE].append(instance[ICON_PREV_NODE]);
            instance[NAV_NODE].append(instance[ICON_NEXT_NODE]);

            instance[CONTROLS_NODE].append(instance[TODAY_NODE]);
            instance[CONTROLS_NODE].append(instance[NAV_NODE]);
            instance[CONTROLS_NODE].append(instance[VIEW_DATE_NODE]);

            A.Array.each(views, function(view) {
                instance[VIEWS_NODE].append(instance._createViewTriggerNode(view));
            });

            instance[HEADER].append(instance[CONTROLS_NODE]);
            instance[HEADER].append(instance[VIEWS_NODE]);

            instance.setStdModContent(WidgetStdMod.HEADER, instance[HEADER].getDOM());
        },

        /**
         * Handles `activeView` events.
         *
         * @method _afterActiveViewChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterActiveViewChange: function(event) {
            var instance = this;

            if (instance.get(RENDERED)) {
                var activeView = event.newVal;
                var lastActiveView = event.prevVal;

                if (lastActiveView) {
                    lastActiveView.hide();
                }

                instance.renderView(activeView);

                var eventRecorder = instance.get(EVENT_RECORDER);

                if (eventRecorder) {
                    eventRecorder.hidePopover();
                }

                instance._uiSetDate(instance.get(DATE));
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _afterRender
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterRender: function(event) {
            var instance = this,
                activeView = instance.get(ACTIVE_VIEW);

            instance.renderView(activeView);
            instance.renderButtonGroup();

            instance._uiSetDate(instance.get(DATE));
            instance._uiSetActiveView(activeView);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _bindDelegate
         * @protected
         */
        _bindDelegate: function() {
            var instance = this;

            instance[CONTROLS_NODE].delegate('click', instance._onClickPrevIcon, _DOT + CSS_SCHEDULER_ICON_PREV,
                instance);
            instance[CONTROLS_NODE].delegate('click', instance._onClickNextIcon, _DOT + CSS_SCHEDULER_ICON_NEXT,
                instance);
            instance[CONTROLS_NODE].delegate('click', instance._onClickToday, _DOT + CSS_SCHEDULER_TODAY, instance);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _createViewTriggerNode
         * @param view
         * @protected
         */
        _createViewTriggerNode: function(view) {
            var instance = this;

            if (!view.get(TRIGGER_NODE)) {
                var name = view.get(NAME);

                view.set(
                    TRIGGER_NODE,
                    A.Node.create(
                        Lang.sub(TPL_SCHEDULER_VIEW, {
                            name: name,
                            label: (instance.getString(name) || name)
                        })
                    )
                );
            }

            return view.get(TRIGGER_NODE);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _getViewDate
         * @protected
         */
        _getViewDate: function() {
            var instance = this,
                date = instance.get(DATE),
                activeView = instance.get(ACTIVE_VIEW);

            if (activeView) {
                date = activeView.getAdjustedViewDate(date);
            }

            return date;
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onClickToday
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _onClickToday: function(event) {
            var instance = this,
                activeView = instance.get(ACTIVE_VIEW);

            if (activeView) {
                instance.set(DATE, instance.get(TODAY_DATE));
            }

            event.preventDefault();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onClickNextIcon
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _onClickNextIcon: function(event) {
            var instance = this,
                activeView = instance.get(ACTIVE_VIEW);

            if (activeView) {
                instance.set(DATE, activeView.get(NEXT_DATE));
            }

            event.preventDefault();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onClickPrevIcon
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _onClickPrevIcon: function(event) {
            var instance = this,
                activeView = instance.get(ACTIVE_VIEW);

            if (activeView) {
                instance.set(DATE, activeView.get(PREV_DATE));
            }

            event.preventDefault();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _onButtonGroupSelectionChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _onButtonGroupSelectionChange: function(event) {
            var instance = this,
                viewName = event.originEvent.target.attr(DATA_VIEW_NAME);

            instance.set(ACTIVE_VIEW, instance.getViewByName(viewName));

            event.preventDefault();
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _processTemplate
         * @param tpl
         * @protected
         */
        _processTemplate: function(tpl) {
            var instance = this;

            return Lang.sub(tpl, instance.getStrings());
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _setEventRecorder
         * @param val {Any} The value of the property.
         * @protected
         */
        _setEventRecorder: function(val) {
            var instance = this;

            if (val) {
                val.setAttrs({
                    scheduler: instance
                }, {
                    silent: true
                });

                val.addTarget(instance);
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _setViews
         * @param val {Any} The value of the property.
         * @protected
         */
        _setViews: function(val) {
            var instance = this;
            var views = [];

            A.Array.each(val, function(view) {
                if (isSchedulerView(view) && !view.get(RENDERED)) {
                    view.setAttrs({
                        scheduler: instance
                    });

                    views.push(view);

                    instance[VIEW_STACK][view.get(NAME)] = view;
                }
            });

            if (!instance.get(ACTIVE_VIEW)) {
                instance.set(ACTIVE_VIEW, val[0]);
            }

            return views;
        },

        /**
         * Sets `activeView` on the UI.
         *
         * @method _uiSetActiveView
         * @param val {Any} The value of the property.
         * @protected
         */
        _uiSetActiveView: function(val) {
            var instance = this;

            if (val) {
                var activeView = val.get(NAME),
                    activeNav = instance[VIEWS_NODE].one(_DOT + CSS_SCHEDULER_VIEW_ + activeView);

                if (activeNav) {
                    instance[VIEWS_NODE].all(BUTTON).removeClass(CSS_SCHEDULER_VIEW_SELECTED);
                    activeNav.addClass(CSS_SCHEDULER_VIEW_SELECTED);
                }
            }
        },

        /**
         * Sets `date` on the UI.
         *
         * @method _uiSetDate
         * @param val {Any} The value of the property.
         * @protected
         */
        _uiSetDate: function(val) {
            var instance = this;

            var formatter = instance.get(NAVIGATION_DATE_FORMATTER);
            var navigationTitle = formatter.call(instance, val);

            if (instance.get(RENDERED)) {
                var activeView = instance.get(ACTIVE_VIEW);

                if (activeView) {
                    activeView._uiSetDate(val);

                    formatter = activeView.get(NAVIGATION_DATE_FORMATTER);
                    navigationTitle = formatter.call(activeView, val);
                }

                instance[VIEW_DATE_NODE].html(navigationTitle);

                instance.syncEventsUI();
            }
        }
    }
});

A.Scheduler = SchedulerBase;
