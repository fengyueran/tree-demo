
/*
let m = 0;
const recuse = () => {
  console.log('start');
  if (m < 3) {
    m++;
    recuse();
  }
  console.log('end', m);
};
=>
let t = 0;
const func = () => {
  console.log('start');
  if (t < 3) {
    t++;
    console.log('start');
    if (t < 3) {
      t++;
      console.log('start');
      if (t < 3) {
        t++;
      }
      console.log('end', t);
    }
    console.log('end', t);
  }
  console.log('end', t);
};
*/

// func();
// https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
class Queue {
  constructor() {
    this.dataStore = [];
  }
  
  add(element) {
    this.dataStore.push(element);
  }

  pop() {
    return this.dataStore.shift();
  }
}


class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
  }
}

class Tree {
  constructor(data) {
    this._root = new Node(data);
  }

  traverseDF(callback) {
    const recuseNode = (node) => {
      for (let i = 0; i < node.children.length; i++) {
        recuseNode(node.children[i]);
      }
      callback(node);
    };
    recuseNode(this._root);
  }

  traverseBF(callback) {
    let currentTree = this._root;
    const queue = new Queue();
    while (currentTree) {
      for (let i = 0; i < currentTree.children.length; i++) {
        queue.add(currentTree.children[i]);
      }
      callback(currentTree);
      currentTree = queue.pop();
    }
  }

  contains(callback, traversalType) {
    const traverse = this[traversalType];
    traverse.call(this, callback);
  }

  add(data, toData, traversalType) {
    let parent = null;
    this.contains((node) => {
      if (node.data === toData) {
        parent = node.parent;
      }
    }, traversalType);
    if (parent) {
      const newNode = new Node(data);
      newNode.parent = parent;
      parent.children.push(newNode);
    } else {
      throw new Error(`can't find the target node`);
    }
  }

  remove(fromData, traversalType) {
    let parent = null;
    let deleteNode = null;
    this.contains((node) => {
      if (node.data === fromData) {
        parent = node.parent;
        deleteNode = node;
      }
    }, traversalType);

    if (parent) {
      const findIndex = parent.children.findIndex(node => deleteNode.data === node.data);
      if (findIndex >= 0) {
        parent.children.splice(findIndex, 1);
      }
    } else {
      throw new Error(`can't find the target node`);
    }
  }
}


/*
遍历文件夹
RootDir
   ┆------DirA
   ┆       ┆──DirA1
   ┆       └──DirA2 
   ┆            └──DirA21            
   ┆------DirB
   ┆        └──DirB1
   └──------DirC
    
*/

const tree = new Tree('RootDir');

const nodeDirA = new Node('DirA');
const nodeDirA1 = new Node('DirA1');
const nodeDirA2 = new Node('DirA2');
const nodeDirA21 = new Node('DirA21');
nodeDirA.children.push(nodeDirA1);
nodeDirA1.parent = nodeDirA;
nodeDirA.children.push(nodeDirA2);
nodeDirA2.parent = nodeDirA;
nodeDirA2.children.push(nodeDirA21);
nodeDirA21.parent = nodeDirA2;
nodeDirA.parent = tree._root;
tree._root.children.push(nodeDirA);

const nodeDirB = new Node('DirB');
const nodeDirB1 = new Node('DirB1');
nodeDirB.children.push(nodeDirB1);
nodeDirB1.parent = nodeDirB;
nodeDirB.parent = tree._root;
tree._root.children.push(nodeDirB);

const nodeDirC = new Node('DirC');
nodeDirC.parent = tree._root;
tree._root.children.push(nodeDirC);

tree.traverseDF((node) => {
  console.log(node.data);
  /*
  => 
      DirA1
        DirA21
      DirA2
    DirA
      DirB1
    DirB
    DirC
  RootDir
  */
});

tree.traverseBF((node) => {
  console.log(node.data);
  /*
  => 
  RootDir
    DirA
    DirB
    DirC
      DirA1
      DirA2
      DirB1
        DirA21
  */
});

tree.contains((node) => {
  if (node.data === 'DirA1') {
    console.log(node);
  }
}, 'traverseDF');

tree.add('DirC1', 'DirC', 'traverseBF');
tree.traverseDF((node) => {
  console.log(node.data);
});
tree.remove('DirC1', 'traverseBF');
tree.traverseDF((node) => {
  console.log(node.data);
});
