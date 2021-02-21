import axios, { AxiosInstance } from 'axios'
import {
  MissingParameterError,
  UnexpectedAPIResponseError,
  InvalidFractionIdInResponseError,
  MinRenovasjonClientOptions,
  MinRenovasjonGetFractionsOptions,
  MinRenovasjonFractions,
  MinRenovasjonGetEmptyingDatesOptions,
  MinRenovasjonEmptyingDates,
  MinRenovasjonGetAddressInfoOptions,
  MinRenovasjonGetAddressInfo,
  _GetFractionsRawResponse,
  isGetFractionRawResponse,
  _GetEmptyingDatesRawResponse,
  isGetEmptyingDatesRawResponse,
  _GetAddressInfoRawResponse,
  isGetAddressInfoRawResponse
} from './lib/types'

export class MinRenovasjonClient {
  private readonly _api: AxiosInstance
  private readonly _geonorgeBaseUrl: string

  constructor (options: MinRenovasjonClientOptions) {
    if (typeof options.appKey !== 'string') throw new MissingParameterError('appKey')

    this._api = axios.create({
      headers: {
        RenovasjonAppKey: options.appKey
      },
      baseURL: options.norkartBaseUrl ?? 'https://komteksky.norkart.no/komtek.renovasjonwebapi/api'
    })

    this._geonorgeBaseUrl = options.geonorgeBaseUrl?.replace(/\/$/, '') ?? 'https://ws.geonorge.no/adresser/v1'
  }

  async getFractions (options: MinRenovasjonGetFractionsOptions): Promise<MinRenovasjonFractions[]> {
    if (typeof options.municipalityNumber !== 'string') throw new MissingParameterError('municipalityNumber')
    const response = await this._api.get<_GetFractionsRawResponse[]>('fraksjoner', {
      headers: {
        Kommunenr: options.municipalityNumber
      }
    })

    if (!Array.isArray(response.data) || response.data.map(isGetFractionRawResponse).includes(false)) {
      throw new UnexpectedAPIResponseError(response)
    }

    const formattedData: MinRenovasjonFractions[] = response.data.map(entry => ({
      id: entry.Id,
      name: entry.Navn,
      iconUrl: entry.Ikon
    }))

    return formattedData
  }

  async getEmptyingDates (options: MinRenovasjonGetEmptyingDatesOptions): Promise<MinRenovasjonEmptyingDates[]> {
    if (typeof options.municipalityNumber !== 'string') throw new MissingParameterError('municipalityNumber')
    if (typeof options.addressCode !== 'string') throw new MissingParameterError('addressCode')
    if (typeof options.addressName !== 'string') throw new MissingParameterError('addressName')
    if (typeof options.houseNumber !== 'string') throw new MissingParameterError('houseNumber')

    const streetCode = options.municipalityNumber + options.addressCode

    const response = await this._api.get<_GetEmptyingDatesRawResponse[]>('tommekalender', {
      headers: {
        Kommunenr: options.municipalityNumber
      },
      params: {
        gatekode: streetCode,
        gatenavn: options.addressName,
        husnr: options.houseNumber
      }
    })

    if (!Array.isArray(response.data) || response.data.map(isGetEmptyingDatesRawResponse).includes(false)) {
      throw new UnexpectedAPIResponseError(response)
    }

    const fractions = await this.getFractions({ municipalityNumber: options.municipalityNumber })

    const formattedData: MinRenovasjonEmptyingDates[] = response.data.map(entry => {
      const fraction = fractions.find(fraction => fraction.id === entry.FraksjonId)
      if (typeof fraction === 'undefined') throw new InvalidFractionIdInResponseError(entry.FraksjonId)
      return {
        fractionId: entry.FraksjonId,
        fraction: fraction.name,
        fractionIconUrl: fraction.iconUrl,
        dates: entry.Tommedatoer.map(date => new Date(date))
      }
    })

    return formattedData
  }

  async getAddressInformation (options: MinRenovasjonGetAddressInfoOptions): Promise<MinRenovasjonGetAddressInfo[]> {
    if (typeof options.municipality !== 'string') throw new MissingParameterError('municipalityNumber')
    if (typeof options.addressName !== 'string') throw new MissingParameterError('addressName')
    if (typeof options.houseNumber !== 'string') throw new MissingParameterError('houseNumber')

    const filter = [
      'adresser.adressekode',
      'adresser.adressenavn',
      'adresser.nummer',
      'adresser.bokstav',
      'adresser.kommunenummer'
    ]

    const response = await axios.get<_GetAddressInfoRawResponse>(this._geonorgeBaseUrl + '/sok', {
      params: {
        sok: `${options.addressName} ${options.houseNumber}, ${options.municipality}`,
        filtrer: filter.join(',')
      }
    })

    if (!isGetAddressInfoRawResponse(response.data)) {
      throw new UnexpectedAPIResponseError(response)
    }

    const formattedData: MinRenovasjonGetAddressInfo[] = response.data.adresser.map(adresse => ({
      municipalityNumber: adresse.kommunenummer,
      addressCode: adresse.adressekode.toString(),
      addressName: adresse.adressenavn,
      houseNumber: `${adresse.nummer}${adresse.bokstav}`
    }))

    return formattedData
  }
}
