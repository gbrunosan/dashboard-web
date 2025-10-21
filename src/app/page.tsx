import { Button } from "@/components/ui/Button"

export default function Shadcn() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button variant="ghost">Ghost</Button>
      <div>
      </div>
    </div>
  )
}
