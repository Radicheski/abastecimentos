import { ItemGroup } from "./components/ui/item"
import type { FuelRegister } from "./lib/types"
import Registro from "./Registro"

export function App({ data }: { data: FuelRegister[] }) {
  return (
    <ItemGroup className="flex min-h-svh p-4">
      {data.map((register) => (
        <Registro key={register.id} register={register} />
      ))}
    </ItemGroup>
  )
}

export default App
