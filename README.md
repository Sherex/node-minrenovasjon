<h1 align=center >MinRenovasjon NodeJS Module</h1>
<div align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/sherex/node-minrenovasjon/node.js.yml?branch=main&label=Tests&style=for-the-badge"/><img src="https://img.shields.io/github/actions/workflow/status/sherex/node-minrenovasjon/npm-publish.yml?branch=main&label=Publish&style=for-the-badge"/><img src="https://img.shields.io/npm/v/@sherex/minrenovasjon?style=for-the-badge&color=success"/>
</div>
<div align="center">
  <a href="https://github.com/Sherex/node-minrenovasjon"><img src="https://img.shields.io/static/v1?logo=github&label=&message=GITHUB&color=black&style=for-the-badge"/></a><a href="https://npmjs.com/package/@sherex/minrenovasjon"><img src="https://img.shields.io/static/v1?logo=npm&label=&message=NPM&color=red&style=for-the-badge"/></a>
</div>

<br>
<p align=center >A NodeJS library to get the trash-emptying days for an address in Norway.</p>
<br>

## Usage
### Applying for an API key
You can apply for an API key at [https://www.norkart.no/product/api-for-utviklere/](https://www.norkart.no/product/api-for-utviklere/).

### Installation
```sh
npm i @sherex/minrenovasjon
```

### TS Example:
Simple example using `.getEmptyingDatesFromAddress` to get the emptying days for a specified address.
```ts
import { MinRenovasjonClient } from '@sherex/minrenovasjon'

;(async () => {
  const client = new MinRenovasjonClient({ 'A_SUPER_SECRET_KEY' })

  const emptyingDates = await client.getEmptyingDatesFromAddress({
    municipality: 'Skien',
    addressName: 'Fylkesbakken',
    houseNumber: '5'
  })

  console.log(emptyingDates)
})().catch(console.error)
```
Will output:
```typescript
[
  {
    fractionId: 1,
    fraction: 'Rest, mat og plast',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/matrestavfallplast.png',
    dates: [ 2021-02-21T23:00:00.000Z, 2021-02-28T23:00:00.000Z ]
  },
  {
    fractionId: 2,
    fraction: 'Papp og papir',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/papppapirdrikkekartong.png',
    dates: [ 2021-02-22T23:00:00.000Z, 2021-03-22T23:00:00.000Z ]
  },
  {
    fractionId: 4,
    fraction: 'Glass- og metallemballasje',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/glassogmetallemballasje.png',
    dates: [ 2021-03-28T22:00:00.000Z, 2021-05-24T22:00:00.000Z ]
  }
]
```

<details>
  <summary>More examples</summary>

```typescript
import { MinRenovasjonClient } from '@sherex/minrenovasjon'

;(async () => {
  // Create the client
  const client = new MinRenovasjonClient({ 'A_SUPER_SECRET_KEY' })

  // Get all fractions for a municipality
  const fractions = await client.getFractions({ municipalityNumber: '3807' })
  console.log(fractions)

  // Get the emptying dates with direct address information (no address search)
  const emptyingDates = await client.getEmptyingDates({
    municipalityNumber: '3807',
    addressCode: '31700',
    addressName: 'Fylkesbakken',
    houseNumber: '5'
  })
  console.log(emptyingDates)

  // Use the address information from getAddressInformation() in getEmptyingDates()
  const addresses = await client.getAddressInformation({
    municipality: 'Skien',
    addressName: 'Fylkesbakken',
    houseNumber: '5'
  })
  console.log(addresses)

  const emptyingDates = await client.getEmptyingDates(addresses[0])
})().catch(console.error)
```

</details>

## API

### MinRenovasjonClient(options)
Creates the client to interact with the APIs.

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| options.appKey | string | true | undefined | The key for the Norkart APIs. [Applying for an API key](#Applying-for-an-API-key) |
| options.norkartBaseUrl  | string | false | `https://komteksky.norkart.no/komtek.renovasjonwebapi/api` | Base-url for Norkart's APIs |
| options.geonorgeBaseUrl  | string | false | `https://ws.geonorge.no/adresser/v1` | Base-url for Geonorge's APIs |

### MinRenovasjonClient#getEmptyingDatesFromAddress(options)
Gets the emptying dates for the specified address.

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| options.municipality | string | true | undefined | The municipality for the chosen house. Eg. `Skien` |
| options.addressName  | string | true | undefined | The name of the street excluding the housenumber. Eg. `Fylkesbakken` |
| options.houseNumber  | string | true | undefined | The housenumber of that house, including the letter if any. Eg. `2C` |

<details>
  <summary>Response</summary>

```typescript
[
  {
    fractionId: 1,
    fraction: 'Rest, mat og plast',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/matrestavfallplast.png',
    dates: [ 2021-02-21T23:00:00.000Z, 2021-02-28T23:00:00.000Z ]
  },
  {
    fractionId: 2,
    fraction: 'Papp og papir',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/papppapirdrikkekartong.png',
    dates: [ 2021-02-22T23:00:00.000Z, 2021-03-22T23:00:00.000Z ]
  },
  {
    fractionId: 4,
    fraction: 'Glass- og metallemballasje',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/glassogmetallemballasje.png',
    dates: [ 2021-03-28T22:00:00.000Z, 2021-05-24T22:00:00.000Z ]
  }
]
```

</details>

### MinRenovasjonClient#getFractions(options)
> Used internally in `.getEmptyingDatesFromAddress()`.

Gets the different fractions that can be recycled in this municipality.

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| options.municipalityNumber | string | true | undefined | The municipalitynumber for the chosen house. You can find this using `.get` Eg. `3807` |

<details>
  <summary>Response</summary>

```typescript
[
  {
    id: 1,
    name: 'Rest, mat og plast',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/matrestavfallplast.png'
  },
  {
    id: 2,
    name: 'Papp og papir',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/papppapirdrikkekartong.png'
  },
  {
    id: 3,
    name: 'Matavfall',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/matavfall.png'
  },
  {
    id: 4,
    name: 'Glass- og metallemballasje',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/glassogmetallemballasje.png'
  },
  {
    id: 5,
    name: 'Drikkekartonger',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 6,
    name: 'Farlig avfall (Må bestilles på rig.no/farlig)',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/farligavfall.png'
  },
  {
    id: 7,
    name: 'Plastemballasje',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/plastemballasje.png'
  },
  {
    id: 8,
    name: 'Trevirke',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 9,
    name: 'Tekstiler',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 10,
    name: 'Hageavfall (Må bestilles på rig.no/hage)',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/hageavfall.png'
  },
  {
    id: 11,
    name: 'Metaller',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 12,
    name: 'Hvitevarer/EE-avfall',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 13,
    name: 'Papp',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/pappogkartong.png'
  },
  {
    id: 14,
    name: 'Grovavfall (Må bestilles på rig.no/grovavfall)',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/gjenstandertilombruk.png'
  },
  {
    id: 15,
    name: 'Hjemmekompostering',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/brush.png'
  },
  {
    id: 16,
    name: 'Usortert restavfall',
    iconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/restavfall.png'
  }
]
```

</details>

### MinRenovasjonClient#getEmptyingDates(options)
> Used internally in `.getEmptyingDatesFromAddress()`.

Gets the emptying dates for the address details gotten from `.getAddressInfo()`.

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| options.municipalityNumber | string | true | undefined | The municipalitynumber for the chosen house. You can find this using `.get` Eg. `3807` |
| options.addressCode | string | true | undefined | The addresscode gotten from `.getAddressInfo()` |
| options.addressName | string | true | undefined | The name of the street excluding the housenumber. Eg. `Fylkesbakken` |
| options.houseNumber | string | true | undefined | The housenumber of that house, including the letter if any. Eg. `2C` |

<details>
  <summary>Response</summary>

```typescript
[
  {
    fractionId: 1,
    fraction: 'Rest, mat og plast',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/matrestavfallplast.png',
    dates: [ 2021-02-21T23:00:00.000Z, 2021-02-28T23:00:00.000Z ]
  },
  {
    fractionId: 2,
    fraction: 'Papp og papir',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/papppapirdrikkekartong.png',
    dates: [ 2021-02-22T23:00:00.000Z, 2021-03-22T23:00:00.000Z ]
  },
  {
    fractionId: 4,
    fraction: 'Glass- og metallemballasje',
    fractionIconUrl: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/Ikoner/glassogmetallemballasje.png',
    dates: [ 2021-03-28T22:00:00.000Z, 2021-05-24T22:00:00.000Z ]
  }
]
```

</details>

### MinRenovasjonClient#getAddressInformation(options)
> Used internally in `.getEmptyingDatesFromAddress()`.

Search for address details used in other methods.

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| options.municipality | string | true | undefined | The municipality for the chosen house. Eg. `Skien` |
| options.addressName  | string | true | undefined | The name of the street excluding the housenumber. Eg. `Fylkesbakken` |
| options.houseNumber  | string | true | undefined | The housenumber of that house, including the letter if any. Eg. `2C` |

<details>
  <summary>Response</summary>

```typescript
[
  {
    municipalityNumber: '3807',
    addressCode: '31700',
    addressName: 'Fylkesbakken',
    houseNumber: '2C'
  }
]
```

</details>

## LICENSE
[MIT](LICENSE)
