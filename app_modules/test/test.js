import chai from 'chai';
import spies from 'chai-spies';
var {
  expect
} = chai;

import DLC from 'app/DependentListController';

import {
  createDLC
}
from 'test/fixtures';


describe('DLC', () => {

  it('should topologically order its links graph', () => {
    var dlc = createDLC();
    expect(dlc.linksOrder).to.eql({
      'app': 0,
      'net': 1,
      'cluster': 2,
      'affiliate': 3
    });
  });

  it('should set state', () => {
    var dlc = createDLC();
    dlc.setState({
      app: 'a1',
    });
  });



});
