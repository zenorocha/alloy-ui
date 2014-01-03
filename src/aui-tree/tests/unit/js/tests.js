YUI.add('aui-tree-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-tree');

    var createNewTreeView = function() {

        return new Y.TreeView({
            children: [
                {
                    children: [
                        {
                            id: 'one-one'
                        },
                        {
                            id: 'one-two'
                        },
                        {
                            id: 'one-three'
                        },
                        {
                            id: 'one-four'
                        }
                    ],
                    id: 'one'
                },
                {
                    id: 'two'
                },
                {
                    id: 'three'
                }
            ]
        });
    };

    suite.add(new Y.Test.Case({
        name: 'Tree View',

        'TreeView constructor should work without a config object': function() {
            var treeView = new Y.TreeView();

            Y.Assert.isInstanceOf(Y.TreeView, treeView, 'treeView should be an instance of Y.TreeView.');
        },

        'TreeNode constructor should work without a config object': function() {
            var treeNode = new Y.TreeNode();

            Y.Assert.isInstanceOf(Y.TreeNode, treeNode, 'treeNode should be an instance of Y.TreeNode.');
        },

        'getNodeById() should return a valid TreeNode': function() {
            var childNode,
                tree;

            tree = createNewTreeView();

            childNode = tree.getNodeById('one');

            Y.Assert.isInstanceOf(Y.TreeNode, childNode, 'childNode should be an instance of Y.TreeNode.');
        },

        'getNodeById() should not return a valid TreeNode': function() {
            var childNode,
                tree;

            tree = createNewTreeView();

            childNode = tree.getNodeById('bogey');

            Y.Assert.isUndefined(childNode, 'childNode should be undefined.');
        },

        'TreeNode should have children': function() {
            var tree,
                node;

            tree = createNewTreeView();

            node = tree.getNodeById('one');

            Y.Assert.areSame(4, node.childrenLength, 'node.childrenLength should return 4.');
        },

        'TreeNode should not have children': function() {
            var tree,
                node;

            tree = createNewTreeView();

            node = tree.getNodeById('two');

            Y.Assert.areSame(0, node.childrenLength, 'node.childrenLength should return 0.');
        },

        'appendChild() should register the TreeNode in the Parent TreeNode and Owner TreeView index attribute': function() {
            var childTreeNode,
                rootTreeNode,
                rootTreeNodeIndex,
                treeView,
                treeViewIndex;

            treeView = new Y.TreeView();

            childTreeNode = new Y.TreeNode({
                id: 'child'
            });

            rootTreeNode = new Y.TreeNode({
                id: 'root'
            });

            treeView.appendChild(rootTreeNode);
            rootTreeNode.appendChild(childTreeNode);

            treeViewIndex = treeView.get('index');
            rootTreeNodeIndex = rootTreeNode.get('index');

            Y.Assert.isTrue(
                treeViewIndex.hasOwnProperty('root'),
                'treeViewIndex object should have a "root" property');
            Y.Assert.isTrue(
                treeViewIndex.hasOwnProperty('child'),
                'treeViewIndex object should have a "child" property');
            Y.Assert.isTrue(
                rootTreeNodeIndex.hasOwnProperty('child'),
                'rootTreeNodeIndex object should have a "child" property');
        },

        'removeChild() should remove child TreeNode': function() {
            var node,
                tree;

            tree = createNewTreeView();

            node = tree.getNodeById('two');

            tree.removeChild(node);

            Y.Assert.areSame(2, tree.getChildrenLength(), 'rootNode should have 2 children.');

            node = tree.getNodeById('two');

            Y.Assert.isUndefined(node, 'node should be undefined.');

            Y.Assert.areSame('three', tree.getChildren()[1].get('id'), 'Second node id should be `three`.');
        },

        'removeChild() should not remove child TreeNode': function() {
            var node,
                tree;

            tree = createNewTreeView();

            node = tree.getNodeById('bogey');

            tree.removeChild(node);

            Y.Assert.areSame(3, tree.getChildrenLength(), 'rootNode should have 3 children');

            Y.Assert.areSame('three', tree.getChildren()[2].get('id'), 'second node id should be `three`');
        },

        'isRegistered() should find TreeNode': function() {
            var node,
                tree;

            tree = createNewTreeView();

            node = tree.getNodeById('two');

            Y.Assert.isTrue(tree.isRegistered(node), 'TreeNode should be registered in TreeView');
        },

        'isRegistered() should find child TreeNode': function() {
            var childTreeNode,
                rootTreeNode,
                treeView;

            treeView = new Y.TreeView();

            childTreeNode = new Y.TreeNode({
                id: 'child'
            });

            rootTreeNode = new Y.TreeNode({
                id: 'root'
            });

            treeView.appendChild(rootTreeNode);
            rootTreeNode.appendChild(childTreeNode);

            Y.Assert.isTrue(
                treeView.isRegistered(childTreeNode),
                'childTreeNode should be registered in treeView');
            Y.Assert.isTrue(
                rootTreeNode.isRegistered(childTreeNode),
                'childTreeNode should be registered in Parent rootTreeNode');
        },

        'isRegistered() should not find TreeNode': function() {
            var node,
                tree;

            tree = createNewTreeView();

            node = new Y.TreeNode();

            Y.Assert.isFalse(tree.isRegistered(node), 'TreeNode should be registered in TreeView');
        },

        'TreeNodeRadio should only have one treeNode selected': function() {
            var childTreeNode,
                rootTreeNode,
                treeView;

            treeView = new Y.TreeView();

            childTreeNode = new Y.TreeNodeRadio({
                id: 'one'
            });

            rootTreeNode = new Y.TreeNodeRadio({
                id: 'root'
            });

            treeView.appendChild(rootTreeNode);
            rootTreeNode.appendChild(childTreeNode);

            rootTreeNode.check();

            Y.Assert.isTrue(
                rootTreeNode.isChecked(),
                'rootTreeNode should be checked.');

            Y.Assert.isFalse(
                childTreeNode.isChecked(),
                'childTreeNode should not be checked.');
        },

        'TreeNodeTask should select all child treeNode': function() {
            var childTreeNode,
                rootTreeNode,
                treeView;

            treeView = new Y.TreeView();

            childTreeNode = new Y.TreeNodeTask({
                id: 'one'
            });

            rootTreeNode = new Y.TreeNodeTask({
                id: 'root'
            });

            treeView.appendChild(rootTreeNode);
            rootTreeNode.appendChild(childTreeNode);

            rootTreeNode.check();

            Y.Assert.isTrue(
                rootTreeNode.isChecked(),
                'rootTreeNode should be checked.');

            Y.Assert.isTrue(
                childTreeNode.isChecked(),
                'childTreeNode should be checked.');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-tree', 'test']
});
