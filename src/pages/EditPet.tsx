import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PawPrint, PencilSimple, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export function EditPet() {
  const navigate = useNavigate()
  const { clientId, petId } = useParams()

  const [name, setName] = useState("Trying")
  const [breed, setBreed] = useState("Labrador Retriever")
  const [weight, setWeight] = useState("65")
  const [color, setColor] = useState("Yellow")
  const [sex, setSex] = useState("Male")
  const [age, setAge] = useState("3 yrs")
  const [haircut, setHaircut] = useState("Short summer cut")
  const [shampoo, setShampoo] = useState("Hypoallergenic")
  const [favoriteGroomer, setFavoriteGroomer] = useState("Sarah J.")
  const [specialInstructions, setSpecialInstructions] = useState("Prefers gentle handling around ears. Give treats frequently during grooming.")
  const [temperamentStr, setTemperamentStr] = useState("Friendly, Energetic, Loves treats")
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [overallLength, setOverallLength] = useState("Short & neat")
  const [faceStyle, setFaceStyle] = useState("Short & neat")
  const [skipEarTrim, setSkipEarTrim] = useState(false)
  const [skipTailTrim, setSkipTailTrim] = useState(false)
  const [groomingNotes, setGroomingNotes] = useState("")

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a pet name')
      return
    }
    if (!breed.trim()) {
      toast.error('Please enter a breed')
      return
    }
    if (!weight.trim()) {
      toast.error('Please enter a weight')
      return
    }

    console.log('Updating pet:', {
      petId,
      name,
      breed,
      weight,
      color,
      sex,
      age,
      haircut,
      shampoo,
      favoriteGroomer,
      specialInstructions,
      temperament: temperamentStr.split(',').map(t => t.trim()).filter(Boolean),
      overallLength,
      faceStyle,
      skipEarTrim,
      skipTailTrim,
      groomingNotes
    })

    toast.success('Pet information updated!')
    navigate(`/clients/${clientId}`)
  }

  const handleDeactivate = () => {
    console.log('Deactivating pet:', petId)
    toast.success('Pet has been deactivated')
    setDeactivateDialogOpen(false)
    navigate(`/clients/${clientId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            className="mb-3 sm:mb-4 hover:bg-secondary transition-colors"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Client
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <PawPrint size={24} weight="fill" className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Edit Pet Information</h1>
              <p className="text-sm text-muted-foreground">Update {name}'s details</p>
            </div>
          </div>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Pet Name *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Buddy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-breed">Breed *</Label>
                <Input
                  id="edit-breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Labrador Retriever"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Weight (lbs) *</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Yellow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sex">Gender</Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger id="edit-sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="3 yrs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-temperament">Temperament (comma-separated)</Label>
              <Input
                id="edit-temperament"
                value={temperamentStr}
                onChange={(e) => setTemperamentStr(e.target.value)}
                placeholder="Friendly, Energetic, Loves treats"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Grooming Preferences</h3>

              <div>
                <Label className="text-sm font-medium mb-2 block">Overall length</Label>
                <RadioGroup value={overallLength} onValueChange={setOverallLength}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Short & neat", "Medium & neat", "Long & fluffy", "Breed standard"].map((option) => (
                      <div key={option} className="flex items-center space-x-1.5">
                        <RadioGroupItem value={option} id={`length-${option}`} />
                        <Label htmlFor={`length-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Face style</Label>
                <RadioGroup value={faceStyle} onValueChange={setFaceStyle}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Short & neat", "Round / Teddy", "Beard / Mustache", "Breed Standard"].map((option) => (
                      <div key={option} className="flex items-center space-x-1.5">
                        <RadioGroupItem value={option} id={`face-${option}`} />
                        <Label htmlFor={`face-${option}`} className="text-sm font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">Trim preferences</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="skip-ear-trim"
                      checked={skipEarTrim}
                      onCheckedChange={(checked) => setSkipEarTrim(checked as boolean)}
                    />
                    <Label htmlFor="skip-ear-trim" className="text-sm font-normal cursor-pointer">
                      Skip Ear Trim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="skip-tail-trim"
                      checked={skipTailTrim}
                      onCheckedChange={(checked) => setSkipTailTrim(checked as boolean)}
                    />
                    <Label htmlFor="skip-tail-trim" className="text-sm font-normal cursor-pointer">
                      Skip Tail Trim
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="grooming-notes" className="text-sm font-medium mb-2 block">Additional notes</Label>
                <Textarea
                  id="grooming-notes"
                  value={groomingNotes}
                  onChange={(e) => setGroomingNotes(e.target.value)}
                  placeholder="Any special grooming instructions..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-haircut">Preferred Haircut</Label>
                <Input
                  id="edit-haircut"
                  value={haircut}
                  onChange={(e) => setHaircut(e.target.value)}
                  placeholder="Short summer cut"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-shampoo">Shampoo Preference</Label>
                <Input
                  id="edit-shampoo"
                  value={shampoo}
                  onChange={(e) => setShampoo(e.target.value)}
                  placeholder="Hypoallergenic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-groomer">Favorite Groomer</Label>
              <Input
                id="edit-groomer"
                value={favoriteGroomer}
                onChange={(e) => setFavoriteGroomer(e.target.value)}
                placeholder="Sarah J."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instructions">Special Instructions</Label>
              <Textarea
                id="edit-instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special handling instructions..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="destructive"
              className="sm:w-auto w-full order-2 sm:order-1"
              onClick={() => setDeactivateDialogOpen(true)}
            >
              <Trash size={16} className="mr-2" />
              Deactivate Pet
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/clients/${clientId}`)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                onClick={handleSave}
              >
                <PencilSimple size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash size={24} className="text-destructive" />
              Deactivate Pet?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to deactivate <span className="font-semibold text-foreground">{name}</span>? 
              <br /><br />
              <span className="text-destructive font-medium">This action is permanent and cannot be undone.</span> The pet's history will be preserved but they will no longer appear in active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate Pet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
