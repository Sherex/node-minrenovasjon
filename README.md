# MinRenovasjon NodeJS module
A NodeJS library to get the trash-emptying days for an address in Norway.

## Usage
Install and import
```ts
import { MinRenovasjonClient } from '@sherex/minrenovasjon'

;(async () => {
  const client = new MinRenovasjonClient({ 'A_SUPER_SECRET_KEY' })
  console.log(await client.getFractions({ municipalityNumber: '0301' }))
})().catch(console.error)
```

## LICENSE
[MIT](LICENSE)