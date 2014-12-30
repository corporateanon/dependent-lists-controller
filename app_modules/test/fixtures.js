import DLC from 'app/DependentListController';

export function createDLC() {
  return new DLC({
    items: [{
      id: 'app',
      fetch: () - > Promise.resolve(apps),
    }, {
      id: 'net',
      fetch: getNetsFromApps,
    }, {
      id: 'cluster',
      fetch: getClustersFromNets,
    }, {
      id: 'affiliate',
      fetch: () - > Promise.resolve(clusters), //<---TODO
    }, ],
    links: [{
      src: ['app'],
      dest: 'net',
    }, {
      src: ['net'],
      dest: 'cluster',
    }, {
      src: ['app', 'net', 'cluster'],
      dest: 'affiliate',
    }, ]
  });
}

var apps = [{
  id: 'a0',
  children: ['n0', 'n1', ],
}, {
  id: 'a1',
  children: ['n1', 'n2', ],
}, {
  id: 'a2',
  children: ['n2', 'n3', ],
}, {
  id: 'a3',
  children: [],
}, ];

var nets = [{
  id: 'n0',
  children: ['c0', 'c1'],
}, {
  id: 'n1',
  children: ['c1', 'c2'],
}, {
  id: 'n2',
  children: ['c2', 'c3'],
}, {
  id: 'n3',
  children: [],
}, ];

var clusters = [{
  id: 'c0',
}, {
  id: 'c1',
}, {
  id: 'c2',
}, {
  id: 'c3',
}, ];

function getChildrenFromParentIds(parentList, childrenList, ids) {
  var idsSet = new Set(ids);
  var childrenSet = parentList
    .filter((item) => idsSet.has(item.id))
    .reduce(function(childIds, item) {
      item.children.forEach(childIds.add.bind(childIds));
      return childIds;
    }, new Set());
  var children = childrenList
    .filter((item) => childIds.has(item.id));
  return Promise.resolve(children);
}

export var getNetsFromApps = getChildrenFromParentIds.bind(null, apps, nets);
export var getClustersFromNets = getChildrenFromParentIds.bind(null, nets, clusters);
