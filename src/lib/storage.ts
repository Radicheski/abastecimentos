import type { FuelRegister } from "./types"

const STORAGE_KEY = "abastecimentos:registros"

type StoredFuelRegister = Omit<FuelRegister, "date"> & { date: string }

function read(): FuelRegister[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const stored = JSON.parse(raw) as StoredFuelRegister[]
    return stored.map((r) => ({ ...r, date: new Date(r.date) }))
  } catch {
    return []
  }
}

function write(registers: FuelRegister[]) {
  const stored: StoredFuelRegister[] = registers.map((r) => ({
    ...r,
    date: r.date.toISOString(),
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function listRegisters(): FuelRegister[] {
  return read()
}

export function saveRegister(register: FuelRegister): FuelRegister[] {
  const current = read()
  const registers = current.some((r) => r.id === register.id)
    ? current.map((r) => (r.id === register.id ? register : r))
    : [...current, register]
  write(registers)
  return registers
}

export function deleteRegister(id: string): FuelRegister[] {
  const registers = read().filter((r) => r.id !== id)
  write(registers)
  return registers
}
