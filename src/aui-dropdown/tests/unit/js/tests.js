YUI.add('aui-dropdown-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('aui-dropdown'),
        dropdown1 = new Y.Dropdown({
                srcNode: '#dropdown1'
            }).render(),
        dropdown2 = new Y.Dropdown({
            trigger: '#dropdown-toggle2',
            hideOnClickOutSide: false,
            contentBox: '#dropdown2',
            items: [
                        {label: 'Leroy! Who\'s the masta?!',
                          fn: function () {console.log('Sho\'nuff');}},
                        {label: 'May the Force be with you.'},
                        {divider: true},
                        {label: 'Rosebud.'}
                    ]
            }).render(),
        dropdown3 = new Y.Dropdown({
            trigger: '#dropdown-toggle3',
            hideOnEsc: false,
            contentBox: '#dropdown3',
            items: Y.one('#dropdown-menu3')
        }).render();

    suite.add(new Y.Test.Case({

        'should set attributes correctly': function() {
            Assert.areEqual(dropdown1.get('trigger'), Y.one('#dropdown-toggle1'));
            Assert.areEqual(dropdown1.get('items'), Y.one('#dropdown-menu1'));

            Assert.areEqual(dropdown2.get('trigger'), Y.one('#dropdown-toggle2'));
            Assert.areEqual(true, Y.instanceOf(dropdown2.get('items'), Y.Node));
            Assert.areEqual(false, dropdown2.get('hideOnClickOutSide'));

            Assert.areEqual(dropdown3.get('trigger'), Y.one('#dropdown-toggle3'));
            Assert.areEqual(true, Y.instanceOf(dropdown3.get('items'), Y.Node));
            Assert.areEqual(false, dropdown3.get('hideOnEsc'));
        },

        'should add css class "open" on contentBox after function open be called': function() {
            var contentBox = dropdown1.get('contentBox');

            dropdown1.open();
            Assert.areEqual(true, contentBox.hasClass('open'));
            dropdown1.close();
        },

        'should "remove" css class "open" on contentBox after function close be called': function() {
            var contentBox = dropdown1.get('contentBox');

            dropdown1.close();
            Assert.areEqual(false, contentBox.hasClass('open'));

            dropdown1.open();
            dropdown1.close();
            Assert.areEqual(false, contentBox.hasClass('open'));
        },

        'should add css class "open" on contentBox': function() {
            var trigger = dropdown1.get('trigger'),
                contentBox = dropdown1.get('contentBox');

            trigger.simulate('click');
            Assert.areEqual(true, contentBox.hasClass('open'));
            dropdown1.close();
        },

        'should add and "remove" css class "open" on contentBox': function() {
            var trigger = dropdown1.get('trigger'),
                contentBox = dropdown1.get('contentBox');

            trigger.simulate('click');
            Assert.areEqual(true, contentBox.hasClass('open'));

            trigger.simulate('click');
            Assert.areEqual(false, contentBox.hasClass('open'));

            dropdown1.toggle();
            Assert.areEqual(true, contentBox.hasClass('open'));

            dropdown1.toggle();
            Assert.areEqual(false, contentBox.hasClass('open'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: [ 'test', 'aui-dropdown', 'node-screen', 'node-event-simulate' ]
});
