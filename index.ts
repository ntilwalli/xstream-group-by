import xs, {Operator, Stream} from 'xstream';

class GroupByOperator<T> implements Operator<T, Stream<T>> {
  public type = 'groupBy';
  public out: Stream<Stream<T>> = undefined as any
  private dict: any = {} 


  constructor(public selector: (arg0: T) => any, public ins: Stream<T>) {
  }

  public _start(out: Stream<Stream<T>>): void {
    this.out = out
    this.ins._add(this);
  }

  public _stop(): void {
    this.dict = {}
    this.ins._remove(this);
    this.out = undefined as any;

  }

  public _n(t: T) {
    const key: string = `${this.selector(t)}`
    let obs = this.dict[key]
    if (!obs) {
      obs = xs.create()
      this.dict[key] = obs
      this.out._n(obs)
    }

    setTimeout(() => obs.shamefullySendNext(t))
  }

  public _e(err: any) {
    this.out._e(err);
  }

  public _c() {
    this.out._c();
  }
}

/**
 * 
 * Emits streams grouped by requested key
 * 
 * ```js
 * import xs from 'xstream'
 * import fromDiagram from 'xstream/extra/fromDiagram'
 * import flattenConcurrently from 'xstream/extra/flattenConcurrently';
 * import groupBy from 'xstream-group-by'
 *
 * xs.of(
 *   { id: 1, name: 'JavaScript' },
 *   { id: 2, name: 'Parcel' },
 *   { id: 2, name: 'webpack' },
 *   { id: 1, name: 'TypeScript' },
 *   { id: 3, name: 'TSLint' }
 * )
 * .compose(groupBy(p => p.id))
 * .map(group$ => group$.map(x => [x.id, x]))
 * .compose(flattenConcurrently)
 * .addListener({
 *   next: p => console.log('group: ' + p[0] + ', ' + p[1].name),
 *   error: err => console.error(err),
 *  complete: () => console.log('completed')
 * });

 * ```text
 * > starting
 * > group 1: Javascript
 * > group 2: Parcel
 * > group 2: webpack
 * > group 1: Typescript
 * > group 3: TSLint
 * > completed
 * ```
 * Emits buffered values over a set time-interval
 *
 * @param {Function} selector The interval over which to buffer values;
 * @return {Stream}
 */
export default function groupBy<T>(
  selector: (arg0: T) => any
): (ins: Stream<T>) => Stream<Stream<T>> {
  return function groupByOperator(ins: Stream<T>): Stream<Stream<T>> {
    return new Stream<Stream<T>>(new GroupByOperator(selector, ins));
  };
}
