import { ItemGroup } from "./components/ui/item"
import { Button } from "./components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { FuelRegister } from "./lib/types"
import Registro from "./Registro"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./components/ui/drawer"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./components/ui/field"
import { Input } from "./components/ui/input"
import React from "react"

export function App({ data }: { data: FuelRegister[] }) {
  const [registers, setRegisters] = React.useState(data)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<FuelRegister | null>(null)

  function openDrawer(register: FuelRegister | null) {
    setSelected(register)
    setOpen(true)
  }

  function save(register: FuelRegister) {
    setRegisters((current) =>
      current.some((r) => r.id === register.id)
        ? current.map((r) => (r.id === register.id ? register : r))
        : [...current, register]
    )
    setOpen(false)
  }

  function remove(register: FuelRegister) {
    setRegisters((current) => current.filter((r) => r.id !== register.id))
    setOpen(false)
  }

  return (
    <div>
      <ItemGroup className="flex min-h-svh p-4">
        {registers.map((register) => (
          <Registro
            key={register.id}
            register={register}
            onClick={() => openDrawer(register)}
          />
        ))}
      </ItemGroup>
      <Button
        size="icon"
        className="fixed right-6 bottom-6 z-50 h-10 w-10 rounded-full shadow-lg"
        onClick={() => openDrawer(null)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <DetailDrawer
        open={open}
        setOpen={setOpen}
        register={selected}
        onSave={save}
        onDelete={remove}
      />
    </div>
  )
}

function DetailDrawer({
  open,
  setOpen,
  register,
  onSave,
  onDelete,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  register: FuelRegister | null
  onSave: (register: FuelRegister) => void
  onDelete: (register: FuelRegister) => void
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex">
        <DrawerHeader>
          <DrawerTitle>
            {register ? "Editar abastecimento" : "Novo abastecimento"}
          </DrawerTitle>
        </DrawerHeader>
        <RegisterForm
          key={register?.id ?? "new"}
          register={register}
          onSave={onSave}
          onDelete={onDelete}
        />
      </DrawerContent>
    </Drawer>
  )
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function RegisterForm({
  register,
  onSave,
  onDelete,
}: {
  register: FuelRegister | null
  onSave: (register: FuelRegister) => void
  onDelete: (register: FuelRegister) => void
}) {
  const [quantity, setQuantity] = React.useState(
    register ? String(register.quantity) : ""
  )
  const [price, setPrice] = React.useState(
    register ? String(register.price) : ""
  )
  const [total, setTotal] = React.useState(
    register ? String(register.total) : ""
  )

  function updateTotal(quantity: string, price: string) {
    if (quantity && price) {
      setTotal((Number(quantity) * Number(price)).toFixed(2))
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSave({
      id: register?.id ?? crypto.randomUUID(),
      date: new Date(form.get("date") as string),
      vehicle: (form.get("vehicle") as string).trim().toUpperCase(),
      fuelType: form.get("fuelType") as FuelRegister["fuelType"],
      distance: Number(form.get("distance")),
      quantity: Number(quantity),
      price: Number(price),
      total: Number(total),
      fullTank: form.get("fullTank") === "on",
      coordinates: {
        latitude: Number(form.get("latitude")),
        longitude: Number(form.get("longitude")),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="overflow-y-auto p-4">
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="date">Data</FieldLabel>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  required
                  defaultValue={toDateTimeLocal(register?.date ?? new Date())}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="vehicle">Veículo</FieldLabel>
                  <Input
                    id="vehicle"
                    name="vehicle"
                    placeholder="ABC-1D23"
                    required
                    defaultValue={register?.vehicle}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="fuelType">Combustível</FieldLabel>
                  <select
                    id="fuelType"
                    name="fuelType"
                    defaultValue={register?.fuelType ?? "gasolina"}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                  >
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                  </select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="distance">Hodômetro (km)</FieldLabel>
                <Input
                  id="distance"
                  name="distance"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  required
                  defaultValue={register?.distance}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Valores</FieldLegend>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="quantity">Litros</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="0"
                  required
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    updateTotal(e.target.value, price)
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="price">Preço/L</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  step="0.001"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                    updateTotal(quantity, e.target.value)
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="total">Total (R$)</FieldLabel>
                <Input
                  id="total"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  required
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </Field>
            </div>
            <Field orientation="horizontal">
              <input
                id="fullTank"
                name="fullTank"
                type="checkbox"
                defaultChecked={register?.fullTank}
                className="size-4 accent-primary"
              />
              <FieldLabel htmlFor="fullTank">Tanque cheio</FieldLabel>
            </Field>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Localização</FieldLegend>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="-90"
                  max="90"
                  defaultValue={register?.coordinates.latitude}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="-180"
                  max="180"
                  defaultValue={register?.coordinates.longitude}
                />
              </Field>
            </div>
          </FieldSet>
        </FieldGroup>
      </div>
      <DrawerFooter className="pt-4">
        <Button type="submit">Salvar</Button>
        <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
        {register && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (window.confirm("Excluir este abastecimento?")) {
                onDelete(register)
              }
            }}
          >
            <Trash2 />
            Excluir
          </Button>
        )}
      </DrawerFooter>
    </form>
  )
}

export default App
