type FuelType = "gasolina" | "etanol"

interface Coordinate {
  latitude: number
  longitude: number
}

export interface FuelRegister {
  id: string
  date: Date
  vehicle: string
  fuelType: FuelType
  distance: number
  quantity: number
  price: number
  total: number
  fullTank: boolean
  coordinates: Coordinate
}
