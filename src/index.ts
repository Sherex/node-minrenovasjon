import axios, { AxiosInstance } from 'axios'
import {
  MissingParameterError,
  UnexpectedAPIResponseError,
  MinRenovasjonClientOptions,
  MinRenovasjonGetFractionsOptions,
  MinRenovasjonFractions,
  _GetFractionsRawResponse,
  isGetFractionRawResponse
} from './lib/types'

export class MinRenovasjonClient {
  private readonly _api: AxiosInstance

  constructor (options: MinRenovasjonClientOptions) {
    if (typeof options.appKey !== 'string') throw new MissingParameterError('appKey')

    this._api = axios.create({
      headers: {
        RenovasjonAppKey: options.appKey
      },
      baseURL: options.norkartBaseUrl ?? 'https://komteksky.norkart.no/komtek.renovasjonwebapi/api'
    })
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
}
