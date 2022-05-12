/// <reference types="mocha"/>
/// <reference types="node" />
import xs, {Stream} from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';
import groupBy from './index';
import * as assert from 'assert';

describe('sample', () => {
  it('should create group streams based on selector key', (done: any) => {
    let index = 0
    xs.of(
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Parcel' },
      { id: 2, name: 'webpack' },
      { id: 1, name: 'TypeScript' },
      { id: 3, name: 'TSLint' }
    )
    .compose(groupBy(p => p.id))
    .map(group$ => group$.map(x => ([x.id, x] as [number, {id: number, name: string}])))
    .compose(flattenConcurrently)
    .addListener({
      next: p => {
        switch (index) {
          case 0: 
            assert(p[0] === 1 && p[1].name === 'JavaScript')
            break
          case 1:
            assert(p[0] === 2 && p[1].name === 'Parcel')
            break
          case 2:
            assert(p[0] === 2 && p[1].name === 'webpack')
            break
          case 3:
            assert(p[0] === 1 && p[1].name === 'TypeScript')
            break
          case 4:
            assert(p[0] === 3 && p[1].name === 'TSLint')
            done()
          default:
            return;
        }

        index++
      },
      error: err => console.error(err),
      complete: () => console.log('completed')
    });
  });
});
