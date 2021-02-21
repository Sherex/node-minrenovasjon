export class MissingParameterError extends Error {
  constructor (parameter: string) {
    super(`Required parameter "${parameter}" is missing or of the wrong type!`)
  }
}

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
