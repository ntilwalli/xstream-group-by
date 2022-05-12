# `xstream-group-by`

```
pnpm install --save xstream-group-by
```

Emits streams grouped by requested key

## usage

```js
import xs from 'xstream'
import fromDiagram from 'xstream/extra/fromDiagram'
import flattenConcurrently from 'xstream/extra/flattenConcurrently'
import groupBy from 'xstream-group-by'
 
xs.of(
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Parcel' },
  { id: 2, name: 'webpack' },
  { id: 1, name: 'TypeScript' },
  { id: 3, name: 'TSLint' }
)
.compose(groupBy(p => p.id))
.map(group$ => group$.map(x => [x.id, x]))
.compose(flattenConcurrently)
.addListener({
  next: p => console.log('group: ' + p[0] + ', ' + p[1].name),
  error: err => console.error(err),
  complete: () => console.log('completed')
});
```

```text
> starting
> group 1: Javascript
> group 2: Parcel
> group 2: webpack
> group 1: Typescript
> group 3: TSLint
> completed
```

## License

MIT


