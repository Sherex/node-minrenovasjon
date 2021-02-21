# MinRenovasjon NodeJS module
A NodeJS library to get the trash-emptying days for an address in Norway.

## Usage
### Installation
```sh
npm i @sherex/minrenovasjon
```

### TS Example:
```ts
import { MinRenovasjonClient } from '@sherex/minrenovasjon'

;(async () => {
  const client = new MinRenovasjonClient({ 'A_SUPER_SECRET_KEY' })

  const fractions = await client.getFractions({ municipalityNumber: '3807' })
  console.log(fractions)

  const emptyingDates = await client.getEmptyingDates({
    municipalityNumber: '3807',
    addressCode: '31700',
    addressName: 'Fylkesbakken',
    houseNumber: '5'
  })

  console.log(emptyingDates)

  const address = await client.getAddressInformation({
    municipality: 'Skien',
    addressName: 'Fylkesbakken',
    houseNumber: '5'
  })

  console.log(address)
})().catch(console.error)
```

## LICENSE
[MIT](LICENSE)