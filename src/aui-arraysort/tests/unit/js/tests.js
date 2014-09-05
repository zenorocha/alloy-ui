YUI.add('aui-arraysort-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-arraysort');

    suite.add(new Y.Test.Case({
        name: 'Array Sort Tests',

        'should ignorer white space from space': function() {
            Y.ArraySort.compareIgnoreWhiteSpace('a', '', false);
            Y.Assert.areNotEqual(
                Y.ArraySort.compare('a', '', false),
                Y.ArraySort.compareIgnoreWhiteSpace('a', '', false)
            );
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-arraysort', 'test']
});
