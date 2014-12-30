import TopoSort from 'topo-sort';

export default class DependentListController {
  constructor(config) {
    this.state = {};
    this.items = config.items;
    this.links = config.links;
    this.linksGraph = linksToGraph(this.links);
    this.linksOrder = linksGraphTopoSort(linksGraphToPureGraph(this.linksGraph));
    this.onStateUpdate = config.onStateUpdate;
  }

  setState(state) {
    var changes = getChangedFields(this, state);
    applyChanges(this, changes).then(() => {
      console.log('changes applied successfully');
    });
  }
}

function applyChanges(me, changes) {

}

function getChangedFields(me, state) {
  return me.items
    .map((item) => [item.id, state[item.id], me.state[item.id]])
    .filter(([id, newValue, oldValue]) => state.hasOwnProperty(id) && newValue !== oldValue)
    .sort(([field0], [field1]) => me.linksOrder[field0] - me.linksOrder[field1]);
}



//-----------topology related-----------------------------------------

function linksToGraph(links) {
  var linksGraph = {};

  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    let {
      src, dest
    } = link;

    for (let i = 0; i < src.length; i++) {
      let srcItem = src[i];
      if (!linksGraph.hasOwnProperty(srcItem)) {
        linksGraph[srcItem] = {};
      }
      linksGraph[srcItem][dest] = link;
    }
  }

  return linksGraph;
}

function linksGraphTopoSort(graphNodes) {
  let topo = new TopoSort();
  for (let i = 0; i < graphNodes.length; i++) {
    let [vertex, children] = graphNodes[i];
    topo.add(vertex, children);
  }
  return topo.sort().reduce((acc, item, i) => {
    acc[item] = i;
    return acc;
  }, {});
}

function linksGraphToPureGraph(linksGraph) {
  return Object.keys(linksGraph)
    .map((src) => [src, linksGraph[src]])
    .map(([src, destLinksIndex]) => [src, Object.keys(destLinksIndex)]);
}
