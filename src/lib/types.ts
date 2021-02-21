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
  appKey: string
  norkartBaseUrl?: string
}

export interface MinRenovasjonGetFractionsOptions {
  municipalityNumber: string
}

export interface MinRenovasjonFractions {
  id: number
  name: string
  iconUrl: string
}

export interface MinRenovasjonEmptyingDates {
  fractionId: number
  fraction: string
  fractionIconUrl: string
  dates: Date[]
}

export interface MinRenovasjonGetEmptyingDatesOptions {
  municipalityNumber: string
  addressCode: string
  streetName: string
  houseNumber: string
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
