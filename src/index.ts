import axios, { AxiosInstance } from 'axios'
import {
  MissingParameterError,
  MinRenovasjonClientOptions,
  MinRenovasjonGetFractionsOptions,
  MinRenovasjonFractions
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
    const response = await this._api.get('fraksjoner', {
      headers: {
        Kommunenr: options.municipalityNumber
      }
    })
    return response.data
  }
}
