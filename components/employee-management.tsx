"use client"

import { useState } from "react"
import { Plus, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Employee {
  id: number
  name: string
  position: string
  skills: string[]
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "João Silva", position: "Desenvolvedor", skills: ["React", "TypeScript", "Node.js"] },
    { id: 2, name: "Maria Santos", position: "Designer", skills: ["UI/UX", "Figma", "Adobe XD"] },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [newSkill, setNewSkill] = useState("")

  const handleAddEmployee = () => {
    setCurrentEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const handleSaveEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const skills = formData.get("skills") as string

    if (currentEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === currentEmployee.id
            ? { ...emp, name, position, skills: skills.split(",").map((skill) => skill.trim()) }
            : emp
        )
      )
    } else {
      const newEmployee: Employee = {
        id: employees.length + 1,
        name,
        position,
        skills: skills.split(",").map((skill) => skill.trim()),
      }
      setEmployees([...employees, newEmployee])
    }
    setIsDialogOpen(false)
  }

  const handleAddSkill = () => {
    if (newSkill && currentEmployee) {
      setCurrentEmployee({
        ...currentEmployee,
        skills: [...currentEmployee.skills, newSkill],
      })
      setNewSkill("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Funcionários</h1>
      <Button onClick={handleAddEmployee} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Habilidades</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.skills.join(", ")}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEmployee ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentEmployee?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="position"
                  name="position"
                  defaultValue={currentEmployee?.position}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">
                  Habilidades
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  defaultValue={currentEmployee?.skills.join(", ")}
                  className="col-span-3"
                />
              </div>
              {currentEmployee && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newSkill" className="text-right">
                    Nova Habilidade
                  </Label>
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="col-span-2"
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Adicionar
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}