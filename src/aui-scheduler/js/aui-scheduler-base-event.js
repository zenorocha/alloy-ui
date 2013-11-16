/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-base-event
 */

var Lang = A.Lang,
    isArray = Lang.isArray,
    isBoolean = Lang.isBoolean,
    isDate = Lang.isDate,
    isFunction = Lang.isFunction,
    isNumber = Lang.isNumber,
    isObject = Lang.isObject,
    isString = Lang.isString,
    isValue = Lang.isValue,

    Color = A.Color,
    DateMath = A.DataType.DateMath,
    WidgetStdMod = A.WidgetStdMod,

    _COLON = ':',
    _DOT = '.',
    _EMPTY_STR = '',
    _N_DASH = '&ndash;',
    _SPACE = ' ',

    isModelList = function(val) {
        return val instanceof A.ModelList;
    },

    isSchedulerView = function(val) {
        return val instanceof A.SchedulerView;
    },

    TITLE_DT_FORMAT_ISO = '%H:%M',
    TITLE_DT_FORMAT_US_HOURS = '%l',
    TITLE_DT_FORMAT_US_MINUTES = '%M',

    getUSDateFormat = function(date) {
        var format = [TITLE_DT_FORMAT_US_HOURS];

        if (date.getMinutes() > 0) {
            format.push(_COLON);
            format.push(TITLE_DT_FORMAT_US_MINUTES);
        }

        if (date.getHours() >= 12) {
            format.push('pm');
        }

        return format.join(_EMPTY_STR);
    },

    DATA_VIEW_NAME = 'data-view-name',
    SCHEDULER_BASE = 'scheduler-base',
    SCHEDULER_CALENDAR = 'scheduler-calendar',
    SCHEDULER_VIEW = 'scheduler-view',

    ACTIVE_VIEW = 'activeView',
    ALL = 'all',
    ALL_DAY = 'allDay',
    BUTTON = 'button',
    COLOR = 'color',
    COLOR_BRIGHTNESS_FACTOR = 'colorBrightnessFactor',
    COLOR_SATURATION_FACTOR = 'colorSaturationFactor',
    CONTENT = 'content',
    CONTROLS = 'controls',
    CONTROLS_NODE = 'controlsNode',
    DATE = 'date',
    DAY = 'day',
    DISABLED = 'enabled',
    END_DATE = 'endDate',
    EVENT_RECORDER = 'eventRecorder',
    HD = 'hd',
    HEADER = 'header',
    HEADER_NODE = 'headerNode',
    HIDDEN = 'hidden',
    ICON = 'icon',
    ICON_NEXT_NODE = 'iconNextNode',
    ICON_PREV_NODE = 'iconPrevNode',
    ICONS = 'icons',
    ISO_TIME = 'isoTime',
    LOCALE = 'locale',
    MEETING = 'meeting',
    NAME = 'name',
    NAV = 'nav',
    NAV_NODE = 'navNode',
    NAVIGATION_DATE_FORMATTER = 'navigationDateFormatter',
    NEXT = 'next',
    NEXT_DATE = 'nextDate',
    NODE = 'node',
    NOSCROLL = 'noscroll',
    PALETTE = 'palette',
    PAST = 'past',
    PREV = 'prev',
    PREV_DATE = 'prevDate',
    REMINDER = 'reminder',
    RENDERED = 'rendered',
    REPEATED = 'repeated',
    SCHEDULER = 'scheduler',
    SCHEDULER_EVENT = 'scheduler-event',
    SCROLLABLE = 'scrollable',
    SHORT = 'short',
    START_DATE = 'startDate',
    STRINGS = 'strings',
    TITLE = 'title',
    TITLE_DATE_FORMAT = 'titleDateFormat',
    TODAY = 'today',
    TODAY_DATE = 'todayDate',
    TODAY_NODE = 'todayNode',
    TRIGGER_NODE = 'triggerNode',
    VIEW = 'view',
    VIEW_DATE_NODE = 'viewDateNode',
    VIEW_STACK = 'viewStack',
    VIEWS = 'views',
    VIEWS_NODE = 'viewsNode',
    VISIBLE = 'visible',
    RIGHT = 'right',
    ACTIVE = 'active',
    CHEVRON = 'chevron',
    BTN = 'btn',
    LEFT = 'left',

    getCN = A.getClassName,

    CSS_ICON = getCN(ICON),
    CSS_SCHEDULER_CONTROLS = getCN(SCHEDULER_BASE, CONTROLS),

    CSS_SCHEDULER_HD = getCN(SCHEDULER_BASE, HD),
    CSS_SCHEDULER_ICON_NEXT = getCN(SCHEDULER_BASE, ICON, NEXT),
    CSS_SCHEDULER_ICON_PREV = getCN(SCHEDULER_BASE, ICON, PREV),
    CSS_SCHEDULER_NAV = getCN(SCHEDULER_BASE, NAV),
    CSS_SCHEDULER_TODAY = getCN(SCHEDULER_BASE, TODAY),
    CSS_SCHEDULER_VIEW = getCN(SCHEDULER_BASE, VIEW),
    CSS_SCHEDULER_VIEW_ = getCN(SCHEDULER_BASE, VIEW, _EMPTY_STR),
    CSS_SCHEDULER_VIEW_DATE = getCN(SCHEDULER_BASE, VIEW, DATE),
    CSS_SCHEDULER_VIEW_NOSCROLL = getCN(SCHEDULER_VIEW, NOSCROLL),
    CSS_SCHEDULER_VIEW_SCROLLABLE = getCN(SCHEDULER_VIEW, SCROLLABLE),
    CSS_SCHEDULER_VIEW_SELECTED = getCN(ACTIVE),
    CSS_BTN = getCN(BTN),
    CSS_ICON_CHEVRON_RIGHT = getCN(ICON, CHEVRON, RIGHT),
    CSS_ICON_CHEVRON_LEFT = getCN(ICON, CHEVRON, LEFT),
    CSS_SCHEDULER_VIEWS = getCN(SCHEDULER_BASE, VIEWS),

    CSS_SCHEDULER_EVENT = getCN(SCHEDULER_EVENT),
    CSS_SCHEDULER_EVENT_ALL_DAY = getCN(SCHEDULER_EVENT, ALL, DAY),
    CSS_SCHEDULER_EVENT_CONTENT = getCN(SCHEDULER_EVENT, CONTENT),
    CSS_SCHEDULER_EVENT_DISABLED = getCN(SCHEDULER_EVENT, DISABLED),
    CSS_SCHEDULER_EVENT_HIDDEN = getCN(SCHEDULER_EVENT, HIDDEN),
    CSS_SCHEDULER_EVENT_ICON_DISABLED = getCN(SCHEDULER_EVENT, ICON, DISABLED),
    CSS_SCHEDULER_EVENT_ICON_MEETING = getCN(SCHEDULER_EVENT, ICON, MEETING),
    CSS_SCHEDULER_EVENT_ICON_REMINDER = getCN(SCHEDULER_EVENT, ICON, REMINDER),
    CSS_SCHEDULER_EVENT_ICON_REPEATED = getCN(SCHEDULER_EVENT, ICON, REPEATED),
    CSS_SCHEDULER_EVENT_ICONS = getCN(SCHEDULER_EVENT, ICONS),
    CSS_SCHEDULER_EVENT_MEETING = getCN(SCHEDULER_EVENT, MEETING),
    CSS_SCHEDULER_EVENT_PAST = getCN(SCHEDULER_EVENT, PAST),
    CSS_SCHEDULER_EVENT_REMINDER = getCN(SCHEDULER_EVENT, REMINDER),
    CSS_SCHEDULER_EVENT_REPEATED = getCN(SCHEDULER_EVENT, REPEATED),
    CSS_SCHEDULER_EVENT_SHORT = getCN(SCHEDULER_EVENT, SHORT),
    CSS_SCHEDULER_EVENT_TITLE = getCN(SCHEDULER_EVENT, TITLE),

    TPL_HTML_OPEN_SPAN = '<span>',
    TPL_HTML_CLOSE_SPAN = '</span>',
    TPL_SCHEDULER_CONTROLS = '<div class="span7 ' + CSS_SCHEDULER_CONTROLS + '"></div>',
    TPL_SCHEDULER_HD = '<div class="row-fluid ' + CSS_SCHEDULER_HD + '"></div>',
    TPL_SCHEDULER_ICON_NEXT = '<button type="button" class="' + [CSS_SCHEDULER_ICON_NEXT, CSS_BTN].join(_SPACE) +
        '"><i class="' + CSS_ICON_CHEVRON_RIGHT + '"></i></button>',
    TPL_SCHEDULER_ICON_PREV = '<button type="button" class="' + [CSS_SCHEDULER_ICON_PREV, CSS_BTN].join(_SPACE) +
        '"><i class="' + CSS_ICON_CHEVRON_LEFT + '"></i></button>',
    TPL_SCHEDULER_NAV = '<div class="btn-group"></div>',
    TPL_SCHEDULER_TODAY = '<button type="button" class="' + [CSS_SCHEDULER_TODAY, CSS_BTN].join(_SPACE) +
        '">{today}</button>',
    TPL_SCHEDULER_VIEW = '<button type="button" class="' + [CSS_SCHEDULER_VIEW, CSS_SCHEDULER_VIEW_].join(_SPACE) +
        '{name}" data-view-name="{name}">{label}</button>',
    TPL_SCHEDULER_VIEW_DATE = '<span class="' + CSS_SCHEDULER_VIEW_DATE + '"></span>',
    TPL_SCHEDULER_VIEWS = '<div class="span5 ' + CSS_SCHEDULER_VIEWS + '"></div>';

/**
 * A base class for SchedulerEvent.
 *
 * @class A.SchedulerEvent
 * @extends A.Model
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var SchedulerEvent = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property SchedulerEvent.NAME
     * @type String
     * @static
     */
    NAME: SCHEDULER_EVENT,

    /**
     * Static property used to define the default attribute
     * configuration for the SchedulerEvent.
     *
     * @property SchedulerEvent.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Determines whether a new event will take place all day. When enabled,
         * the event will not contain 24-hour clock date inputs.
         *
         * @attribute allDay
         * @default false
         * @type Boolean
         */
        allDay: {
            setter: A.DataType.Boolean.parse,
            value: false
        },

        /**
         * Determine the content of Scheduler event's body section.
         *
         * @attribute content
         */
        content: {
            setter: String,
            validator: isValue
        },

        /**
         * The `color` of a calendar event.
         *
         * @attribute color
         * @default '#D96666'
         * @type String
         */
        color: {
            lazyAdd: false,
            value: '#376cd9',
            validator: isString
        },

        /**
         * A color brightness factor is applied to the `color` attribute.
         *
         * @attribute colorBrightnessFactor
         * @default 1.4
         * @type Number
         */
        colorBrightnessFactor: {
            value: 1.4,
            validator: isNumber
        },

        /**
         * A color saturation factor is applied to the `color` attribute.
         *
         * @attribute colorSaturationFactor
         * @default 0.88
         * @type Number
         */
        colorSaturationFactor: {
            value: 0.88,
            validator: isNumber
        },

        /**
         * A formatted title date for this scheduler event, taking into account
         * ISO time. The value will not contain and `endDate` if this event is
         * `allDay`.
         *
         * @attribute titleDateFormat
         * @type Object
         */
        titleDateFormat: {
            getter: '_getTitleDateFormat',
            value: function() {
                var instance = this,
                    scheduler = instance.get(SCHEDULER),
                    isoTime = scheduler && scheduler.get(ACTIVE_VIEW).get(ISO_TIME),

                    format = {
                        endDate: TPL_HTML_OPEN_SPAN + _N_DASH + _SPACE + TITLE_DT_FORMAT_ISO + TPL_HTML_CLOSE_SPAN,
                        startDate: TITLE_DT_FORMAT_ISO
                    };

                if (!isoTime) {
                    format.endDate = TPL_HTML_OPEN_SPAN + _N_DASH + _SPACE + getUSDateFormat(instance.get(END_DATE)) +
                        TPL_HTML_CLOSE_SPAN;
                    format.startDate = getUSDateFormat(instance.get(START_DATE));
                }

                if (instance.getMinutesDuration() <= 30) {
                    delete format.endDate;
                }
                else if (instance.get(ALL_DAY)) {
                    format = {};
                }

                return format;
            }
        },

        /**
         * The date corresponding to the current ending date of a scheduled
         * event. By default, the value is one hour after the date set on the
         * user's computer.
         *
         * @attribute endDate
         * @type Date
         * @default Today's date as set on the user's computer.
         */
        endDate: {
            setter: '_setDate',
            valueFn: function() {
                var date = DateMath.clone(this.get(START_DATE));

                date.setHours(date.getHours() + 1);

                return date;
            }
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
         * @attribute meeting
         * @default false
         * @type Boolean
         */
        meeting: {
            value: false,
            validator: isBoolean
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute node
         */
        node: {
            valueFn: function() {
                return A.NodeList.create(A.Node.create(this.EVENT_NODE_TEMPLATE).setData(SCHEDULER_EVENT, this));
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute reminder
         * @default false
         * @type Boolean
         */
        reminder: {
            value: false,
            validator: isBoolean
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute repeated
         * @default false
         * @type Boolean
         */
        repeated: {
            value: false,
            validator: isBoolean
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @attribute scheduler
         */
        scheduler: {},

        /**
         * The date corresponding to the current starting date of a scheduled
         * event. By default, the value is the date set on the user's computer.
         *
         * @attribute startDate
         * @type Date
         */
        startDate: {
            setter: '_setDate',
            valueFn: function() {
                return new Date();
            }
        },

        /**
         * Indicates whether the event is visible.
         *
         * @attribute visible
         * @default true
         * @type Boolean
         */
        visible: {
            value: true,
            validator: isBoolean
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property SchedulerEvent.EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.Model,

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @property SchedulerEvent.PROPAGATE_ATTRS
     * @type Array
     * @static
     */
    PROPAGATE_ATTRS: [ALL_DAY, START_DATE, END_DATE, CONTENT, COLOR, COLOR_BRIGHTNESS_FACTOR,
        COLOR_SATURATION_FACTOR, TITLE_DATE_FORMAT, VISIBLE, DISABLED],

    prototype: {
        EVENT_NODE_TEMPLATE: '<div class="' + CSS_SCHEDULER_EVENT + '">' + '<div class="' + CSS_SCHEDULER_EVENT_TITLE + '"></div>' + '<div class="' + CSS_SCHEDULER_EVENT_CONTENT + '"></div>' + '<div class="' + CSS_SCHEDULER_EVENT_ICONS + '">' + '<span class="' + [
            CSS_ICON, CSS_SCHEDULER_EVENT_ICON_DISABLED].join(_SPACE) + '"></span>' + '<span class="' + [CSS_ICON,
            CSS_SCHEDULER_EVENT_ICON_MEETING].join(_SPACE) + '"></span>' + '<span class="' + [CSS_ICON,
            CSS_SCHEDULER_EVENT_ICON_REMINDER].join(_SPACE) + '"></span>' + '<span class="' + [CSS_ICON,
            CSS_SCHEDULER_EVENT_ICON_REPEATED].join(_SPACE) + '"></span>' + '</div>' + '</div>',

        /**
         * Construction logic executed during SchedulerEvent instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.bindUI();
            instance.syncUI();
        },

        /**
         * Bind the events on the SchedulerEvent UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance.after({
                allDayChange: instance._afterAllDayChange,
                colorChange: instance._afterColorChange,
                enabledChange: instance._afterEnabledChange,
                endDateChange: instance._afterEndDateChange,
                meetingChange: instance._afterMeetingChange,
                reminderChange: instance._afterReminderChange,
                repeatedChange: instance._afterRepeatedChange,
                visibleChange: instance._afterVisibleChange
            });
        },

        /**
         * Sync the SchedulerEvent UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance._uiSetAllDay(
                instance.get(ALL_DAY));

            instance._uiSetColor(
                instance.get(COLOR));

            instance._uiSetEnabled(
                instance.get(ENABLED));

            instance._uiSetEndDate(
                instance.get(END_DATE));

            instance._uiSetMeeting(
                instance.get(MEETING));

            instance._uiSetPast(
                instance._isPastEvent());

            instance._uiSetReminder(
                instance.get(REMINDER));

            instance._uiSetRepeated(
                instance.get(REPEATED));

            instance._uiSetVisible(
                instance.get(VISIBLE));

            instance.syncNodeTitleUI();
            instance.syncNodeContentUI();
        },

        /**
         * Does cleanup by removing the `node` from DOM.
         *
         * @method destroy
         * @protected
         */
        destroy: function() {
            var instance = this;

            instance.get(NODE).remove(true);
        },

        /**
         * Sometimes an event will require a padding node that mimics the
         * behavior of the scheduler `event`'s `node`. This can occur in the
         * week view when an event spans multiple days.

         * For example, an event beginning at 10pm on January 1 and ending on
         * 3am January 2nd would require a padding node. The `event`'s `node`
         * appears from January 1 from 10:00pm to 11:59pm and the `paddingNode`
         * is rendered on the table from January 2 from 12:00am to 3:00am.
         *
         * @method addPaddingNode
         */
        addPaddingNode: function() {
            var instance = this;

            instance.get(NODE).push(A.Node.create(instance.EVENT_NODE_TEMPLATE).setData(SCHEDULER_EVENT, instance));

            instance.syncUI();
        },

        /**
         * Clones the scheduler `event`.
         *
         * @method clone
         */
        clone: function() {
            var instance = this,
                cloned = null,
                scheduler = instance.get(SCHEDULER);

            if (scheduler) {
                cloned = new scheduler.eventModel();
                cloned.copyPropagateAttrValues(instance, true, {
                    silent: true
                });
            }

            return cloned;
        },

        /**
         * Copys the dates from the `event` parameter to the instance `event`.
         *
         * @method copyDates
         * @param {Object} evt Scheduler event.
         * @param [options] {Object} Zero or more options.
         */
        copyDates: function(evt, options) {
            var instance = this;

            instance.setAttrs({
                    endDate: DateMath.clone(evt.get(END_DATE)),
                    startDate: DateMath.clone(evt.get(START_DATE))
                },
                options);
        },

        /**
         * Copys the attribute vales from an `event` to this `event`.
         *
         * @method copyPropagateAttrValues
         * @param {Object} evt
         * @param {Boolean} copyMap
         * @param [options] {Object} Zero or more options.
         */
        copyPropagateAttrValues: function(evt, copyMap, options) {
            var instance = this,
                attrMap = {};

            instance.copyDates(evt, options);

            A.Array.each(instance.constructor.PROPAGATE_ATTRS, function(attrName) {
                if (!((!copyMap || {}).hasOwnProperty(attrName))) {
                    var value = evt.get(attrName);

                    if (!isObject(value)) {
                        attrMap[attrName] = value;
                    }
                }
            });

            instance.setAttrs(attrMap, options);
        },

        /**
         * Gets the number of days an `event` is scheduled to take place.
         *
         * @method getDaysDuration
         * @return {Number}
         */
        getDaysDuration: function() {
            var instance = this;

            return DateMath.getDayOffset(
                instance.get(END_DATE), instance.get(START_DATE));
        },

        /**
         * Gets the number of hours an `event` is scheduled to take place.
         *
         * @method getHoursDuration
         */
        getHoursDuration: function() {
            var instance = this;

            return DateMath.getHoursOffset(
                instance.get(END_DATE), instance.get(START_DATE));
        },

        /**
         * Gets the number of minutes an `event` is scheduled to take place.
         *
         * @method getMinutesDuration
         */
        getMinutesDuration: function() {
            var instance = this;

            return DateMath.getMinutesOffset(
                instance.get(END_DATE), instance.get(START_DATE));
        },

        /**
         * Gets the number of seconds an `event` is scheduled to take place.
         *
         * @method getSecondsDuration
         */
        getSecondsDuration: function() {
            var instance = this;

            return DateMath.getSecondsOffset(
                instance.get(END_DATE), instance.get(START_DATE));
        },

        /**
         * Determines if an `event`'s end date is this same as this `event`.
         *
         * @method sameEndDate
         * @param {Object} evt
         */
        sameEndDate: function(evt) {
            var instance = this;

            return DateMath.compare(instance.get(END_DATE), evt.get(END_DATE));
        },

        /**
         * Determines if an `event`'s start date is this same as this `event`.
         *
         * @method sameStartDate
         * @param {Object} evt
         */
        sameStartDate: function(evt) {
            var instance = this;

            return DateMath.compare(
                instance.get(START_DATE), evt.get(START_DATE));
        },

        /**
         * Determines if an `event` is after this `event`.
         *
         * @method isAfter
         * @param {Object} evt
         * @return {Boolean}
         */
        isAfter: function(evt) {
            var instance = this;
            var startDate = instance.get(START_DATE);
            var evtStartDate = evt.get(START_DATE);

            return DateMath.after(startDate, evtStartDate);
        },

        /**
         * Determines if an `event` is before this `event`.
         *
         * @method isBefore
         * @param {Object} evt
         * @return {Boolean}
         */
        isBefore: function(evt) {
            var instance = this;
            var startDate = instance.get(START_DATE);
            var evtStartDate = evt.get(START_DATE);

            return DateMath.before(startDate, evtStartDate);
        },

        /**
         * Determines if an `event` interescts with this `event`.
         *
         * @method intersects
         * @param {Object} evt
         * @return {Boolean}
         */
        intersects: function(evt) {
            var instance = this;
            var endDate = instance.get(END_DATE);
            var startDate = instance.get(START_DATE);
            var evtStartDate = evt.get(START_DATE);

            return (instance.sameStartDate(evt) ||
                DateMath.between(evtStartDate, startDate, endDate));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method intersectHours
         * @param {Object} evt
         * @return {Boolean}
         */
        intersectHours: function(evt) {
            var instance = this;
            var endDate = instance.get(END_DATE);
            var startDate = instance.get(START_DATE);
            var evtModifiedStartDate = DateMath.clone(startDate);

            DateMath.copyHours(evtModifiedStartDate, evt.get(START_DATE));

            return (DateMath.compare(startDate, evtModifiedStartDate) ||
                DateMath.between(evtModifiedStartDate, startDate, endDate));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method isDayBoundaryEvent
         * @return {Boolean}
         */
        isDayBoundaryEvent: function() {
            var instance = this;

            return DateMath.isDayBoundary(
                instance.get(START_DATE), instance.get(END_DATE));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method isDayOverlapEvent
         * @return {Boolean}
         */
        isDayOverlapEvent: function() {
            var instance = this;

            return DateMath.isDayOverlap(
                instance.get(START_DATE), instance.get(END_DATE));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method getClearEndDate
         */
        getClearEndDate: function() {
            var instance = this;

            return DateMath.safeClearTime(instance.get(END_DATE));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method getClearStartDate
         */
        getClearStartDate: function() {
            var instance = this;

            return DateMath.safeClearTime(instance.get(START_DATE));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method move
         * @param date
         * @param [options] {Object} Zero or more options.
         */
        move: function(date, options) {
            var instance = this;
            var duration = instance.getMinutesDuration();

            instance.setAttrs({
                    endDate: DateMath.add(DateMath.clone(date), DateMath.MINUTES, duration),
                    startDate: date
                },
                options);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method setContent
         * @param content
         */
        setContent: function(content) {
            var instance = this;

            instance.get(NODE).each(function(node) {
                var contentNode = node.one(_DOT + CSS_SCHEDULER_EVENT_CONTENT);

                contentNode.setContent(content);
            });
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method setTitle
         * @param content
         */
        setTitle: function(content) {
            var instance = this;

            instance.get(NODE).each(function(node) {
                var titleNode = node.one(_DOT + CSS_SCHEDULER_EVENT_TITLE);

                titleNode.setContent(content);
            });
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method syncNodeContentUI
         */
        syncNodeContentUI: function() {
            var instance = this;

            instance.setContent(instance.get(CONTENT));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method syncNodeTitleUI
         */
        syncNodeTitleUI: function() {
            var instance = this,
                format = instance.get(TITLE_DATE_FORMAT),
                startDate = instance.get(START_DATE),
                endDate = instance.get(END_DATE),
                title = [];

            if (format.startDate) {
                title.push(instance._formatDate(startDate, format.startDate));
            }

            if (format.endDate) {
                title.push(instance._formatDate(endDate, format.endDate));
            }

            instance.setTitle(title.join(_EMPTY_STR));
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method split
         */
        split: function() {
            var instance = this,
                s1 = DateMath.clone(instance.get(START_DATE)),
                e1 = DateMath.clone(instance.get(END_DATE));

            if (instance.isDayOverlapEvent() && !instance.isDayBoundaryEvent()) {
                var s2 = DateMath.clone(s1);
                s2.setHours(24, 0, 0, 0);

                return [[s1, DateMath.toMidnight(DateMath.clone(s1))], [s2, DateMath.clone(e1)]];
            }

            return [[s1, e1]];
        },

        /**
         * Handles `allday` events.
         *
         * @method _afterAllDayChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterAllDayChange: function(event) {
            var instance = this;

            instance._uiSetAllDay(event.newVal);
        },

        /**
         * Handles `color` events.
         *
         * @method _afterColorChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterColorChange: function(event) {
            var instance = this;

            instance._uiSetColor(event.newVal);
        },

        /**
         * Handles `enabled` events.
         *
         * @method _afterEnabledChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterEnabledChange: function(event) {
            var instance = this;

            instance._uiSetEnabled(event.newVal);
        },

        /**
         * Handles `enddate` events.
         *
         * @method _afterEndDateChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterEndDateChange: function(event) {
            var instance = this;

            instance._uiSetEndDate(event.newVal);
        },

        /**
         * Handles `meeting` events.
         *
         * @method _afterMeetingChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterMeetingChange: function(event) {
            var instance = this;

            instance._uiSetMeeting(event.newVal);
        },

        /**
         * Handles `reminder` events.
         *
         * @method _afterReminderChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterReminderChange: function(event) {
            var instance = this;

            instance._uiSetReminder(event.newVal);
        },

        /**
         * Handles `repeated` events.
         *
         * @method _afterRepeatedChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterRepeatedChange: function(event) {
            var instance = this;

            instance._uiSetRepeated(event.newVal);
        },

        /**
         * Handles `visible` events.
         *
         * @method _afterVisibleChange
         * @param {Event.Facade} event Event Facade object
         * @protected
         */
        _afterVisibleChange: function(event) {
            var instance = this;

            instance._uiSetVisible(event.newVal);
        },

        /**
         * Returns true if the event ends before the current date.
         *
         * @method _isPastEvent
         * @protected
         * @return {Boolean}
         */
        _isPastEvent: function() {
            var instance = this,
                endDate = instance.get(END_DATE);

            return (endDate.getTime() < (new Date()).getTime());
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _setDate
         * @param val
         * @protected
         */
        _setDate: function(val) {
            var instance = this;

            if (isNumber(val)) {
                val = new Date(val);
            }

            return val;
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _formatDate
         * @param date
         * @param format
         * @protected
         */
        _formatDate: function(date, format) {
            var instance = this;
            var locale = instance.get(LOCALE);

            return A.DataType.Date.format(date, {
                format: format,
                locale: locale
            });
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _getTitleDateFormat
         * @param {String|Function} val
         * @return {Mixed}
         * @protected
         */
        _getTitleDateFormat: function(val) {
            var instance = this;

            if (isString(val)) {
                val = {
                    endDate: val,
                    startDate: val
                };
            }
            else if (isFunction(val)) {
                val = val.call(instance);
            }

            return val;
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetAllDay
         * @param val
         * @protected
         */
        _uiSetAllDay: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_ALL_DAY, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetColor
         * @param val
         * @protected
         */
        _uiSetColor: function(val) {
            var instance = this;
            var node = instance.get(NODE);

            var color = Color.toHSL(val);
            var backgroundColor = Color.toArray(color);

            backgroundColor[1] *= instance.get(COLOR_SATURATION_FACTOR);
            backgroundColor[2] *= instance.get(COLOR_BRIGHTNESS_FACTOR);
            backgroundColor = Color.fromArray(backgroundColor, Color.TYPES.HSL);

            // Some browsers doesn't support HSL colors, convert to RGB for
            // compatibility.
            color = Color.toRGB(color);
            backgroundColor = Color.toRGB(backgroundColor);

            if (node) {
                node.setStyles({
                    backgroundColor: backgroundColor,
                    color: color
                });
            }
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetEnabled
         * @param val
         * @protected
         */
        _uiSetEnabled: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_DISABLED, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetEndDate
         * @param val
         * @protected
         */
        _uiSetEndDate: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_SHORT, instance.getMinutesDuration() <= 30);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetMeeting
         * @param val
         * @protected
         */
        _uiSetMeeting: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_MEETING, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetPast
         * @param val
         * @protected
         */
        _uiSetPast: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_PAST, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetReminder
         * @param val
         * @protected
         */
        _uiSetReminder: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_REMINDER, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetRepeated
         * @param val
         * @protected
         */
        _uiSetRepeated: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_REPEATED, !! val);
        },

        /**
         * TODO. Wanna help? Please send a Pull Request.
         *
         * @method _uiSetVisible
         * @param val
         * @protected
         */
        _uiSetVisible: function(val) {
            var instance = this;

            instance.get(NODE).toggleClass(CSS_SCHEDULER_EVENT_HIDDEN, !val);
        }
    }
});

A.SchedulerEvent = SchedulerEvent;
