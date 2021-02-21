<h1 align=center >MinRenovasjon NodeJS Module</h1>
<div align="center">
  <img src="https://img.shields.io/github/workflow/status/sherex/node-minrenovasjon/Tests?label=Tests&style=for-the-badge"/><img src="https://img.shields.io/github/workflow/status/sherex/node-minrenovasjon/Publish?label=Publish&style=for-the-badge"/><img src="https://img.shields.io/npm/v/@sherex/minrenovasjon?style=for-the-badge&color=success"/>
</div>
<div align="center">
  <a href="https://github.com/Sherex/node-minrenovasjon"><img src="https://img.shields.io/static/v1?logo=github&label=&message=GITHUB&color=black&style=for-the-badge"/></a><a href="https://npmjs.com/package/@sherex/minrenovasjon"><img src="https://img.shields.io/static/v1?logo=npm&label=&message=NPM&color=red&style=for-the-badge"/></a>
</div>

<br>
<p align=center >A NodeJS library to get the trash-emptying days for an address in Norway.</p>
<br>

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