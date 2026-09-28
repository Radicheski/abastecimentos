import { Fuel } from "lucide-react"
import { Badge } from "./components/ui/badge"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "./components/ui/item"
import type { FuelRegister } from "./lib/types"

interface FuelRegisterProp {
  register: FuelRegister
  onClick?: () => void
}

function Registro({ register, onClick }: FuelRegisterProp) {
  const date = register.date.toLocaleDateString("pt-BR")
  const time = register.date.toLocaleTimeString("pt-BR", { timeStyle: "short" })
  const distance = register.distance.toLocaleString("pt-BR")
  const quantity = register.quantity.toLocaleString("pt-BR")
  const price = register.price.toLocaleString("pt-BR")
  const total = register.total.toLocaleString("pt-BR")
  return (
    <Item variant="outline" onClick={onClick}>
      <ItemMedia>
        <Fuel />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {date} {time}
          {" \u00b7 "}
          {register.vehicle.toUpperCase()}
        </ItemTitle>
        <ItemDescription>
          {distance} km{" \u00b7 "}
          {quantity} l
        </ItemDescription>
        <ItemDescription>
          {register.fuelType}
          {" \u00b7 "}R$ {price}/l
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        <ItemTitle>R$ {total}</ItemTitle>
        <ItemDescription className="text-right">
          {register.fullTank ? (
            <Badge>Cheio</Badge>
          ) : (
            <Badge variant="outline">Parcial</Badge>
          )}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}

export default Registro
