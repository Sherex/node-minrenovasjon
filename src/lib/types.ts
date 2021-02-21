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
  typeId: string
  type: string
  typeIconUrl: string
  dates: Date[]
}

export interface MinRenovasjonGetEmptyingDatesOptions {
  streetCode: string
  streetName: string
  houseNumber: string
}

// API Types

export interface _GetFractionsRawResponse {
  Id: number
  Navn: string
  Ikon: string
}

export function isGetFractionRawResponse (data: any): data is _GetFractionsRawResponse {
  if (typeof data.Id !== 'number') return false
  if (typeof data.Navn !== 'string') return false
  if (typeof data.Ikon !== 'string') return false
  return true
}
