import { AxiosResponse } from 'axios'

export class MissingParameterError extends Error {
  constructor (parameter: string) {
    super(`Required parameter "${parameter}" is missing or of the wrong type!`)
  }
}

export class UnexpectedAPIResponseError extends Error {
  readonly axiosResponse: AxiosResponse
  constructor (response: AxiosResponse, url?: string) {
    if (typeof response.config.baseURL === 'string' && typeof response.config.url === 'string') {
      const separator = response.config.baseURL.endsWith('/') ? '' : '/'
      url = url ?? `${response.config.baseURL}${separator}${response.config.url}`
    }
    super(`Received an unexpected response from "${url ?? 'Invalid URL'}"! More details in "error.axiosResponse"`)
    this.axiosResponse = response
  }
}

export class InvalidFractionIdInResponseError extends Error {
  constructor (fractionId: number) {
    super(`Couldn't find a fraction with the ID of "${fractionId}"! This is probably a temporary problem with the API..`)
  }
}

// Client Types

export interface MinRenovasjonClientOptions {
  /** An appKey is required, you can get one by requesting it here: https://www.norkart.no/product/api-for-utviklere/ */
  appKey: string
  /** The base URL for the Norkart API. Default: 'https://komteksky.norkart.no/komtek.renovasjonwebapi/api' */
  norkartBaseUrl?: string
  /** The base URL for the Geonorge API. Default: 'https://ws.geonorge.no/adresser/v1' */
  geonorgeBaseUrl?: string
}

export interface MinRenovasjonGetFractionsOptions {
  /** The code for the wanted municipality, get one from the `.getAddressInfo(options)` method. AKA "Kommunenummer" */
  municipalityNumber: string
}

export interface MinRenovasjonFractions {
  /** The ID for this fraction */
  id: number
  /** The name for this fraction */
  name: string
  /** The icon URL for this fraction */
  iconUrl: string
}

export interface MinRenovasjonEmptyingDates {
  /** The ID for the fraction of these emptying dates */
  fractionId: number
  /** The name for the fraction of these emptying dates */
  fraction: string
  /** The icon URL for the fraction of these emptying dates */
  fractionIconUrl: string
  /** The emptying dates as a JS Date object */
  dates: Date[]
}

export interface MinRenovasjonGetEmptyingDatesOptions {
  /** The code for the wanted municipality, get one from the `.getAddressInfo(options)` method. AKA "Kommunenummer". Ex. `Skien` = `3807` */
  municipalityNumber: string
  /** A specific code for the address (addressName), get one from the `.getAddressInfo(options)` method. AKA "Adressekode". Ex. `Fylkesbakken, Skien` = `31700` */
  addressCode: string
  /** The streetname without the housenumber. Ex. `Fylkesbakken` */
  addressName: string
  /** A house's number on the specified street, can include the houseletter too. Ex. `23A` */
  houseNumber: string
}

export type MinRenovasjonGetAddressInfo = MinRenovasjonGetEmptyingDatesOptions

export interface MinRenovasjonGetAddressInfoOptions {
  /** The streetname without the housenumber. Ex. `Fylkesbakken` */
  addressName: string
  /** A house's number on the specified street, can include the houseletter too. Ex. `23A` */
  houseNumber: string
  /** The municipality to search for the address in. AKA "Kommune". Ex. `Skien` */
  municipality: string
}

// API Types

export interface _GetFractionsRawResponse {
  Id: number
  Navn: string
  Ikon: string
}

export function isGetFractionRawResponse (data: _GetFractionsRawResponse): data is _GetFractionsRawResponse {
  if (typeof data.Id !== 'number') return false
  if (typeof data.Navn !== 'string') return false
  if (typeof data.Ikon !== 'string') return false
  return true
}

export interface _GetEmptyingDatesRawResponse {
  FraksjonId: number
  Tommedatoer: string[]
}

export function isGetEmptyingDatesRawResponse (data: _GetEmptyingDatesRawResponse): data is _GetEmptyingDatesRawResponse {
  if (typeof data.FraksjonId !== 'number') return false
  if (!Array.isArray(data.Tommedatoer)) return false
  if (data.Tommedatoer.map(isDateString).includes(false)) return false
  return true
}

export function isDateString (data: string): boolean {
  const date = new Date(data)
  if (date.toString() === 'Invalid Date') return false
  return true
}

export interface _GetAddressInfoRawResponse {
  adresser: Array<{
    kommunenummer: string
    adressekode: number
    adressenavn: string
    bokstav: string
    nummer: number
  }>
}

export function isGetAddressInfoRawResponse (data: _GetAddressInfoRawResponse): data is _GetAddressInfoRawResponse {
  if (!Array.isArray(data.adresser)) return false
  if (data.adresser.map(adresse => {
    if (typeof adresse.kommunenummer !== 'string') return false
    if (typeof adresse.adressekode !== 'number') return false
    if (typeof adresse.adressenavn !== 'string') return false
    if (typeof adresse.nummer !== 'number') return false
    return true
  }).includes(false)) return false
  return true
}
