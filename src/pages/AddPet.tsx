import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function AddPet() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('')
  const [breed, setBreed] = useState('')
  const [mixedBreed, setMixedBreed] = useState('')
  const [color, setColor] = useState('')
  const [haircut, setHaircut] = useState('')
  const [shampoo, setShampoo] = useState('')
  const [favoriteGroomer, setFavoriteGroomer] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [notes, setNotes] = useState('')
  const [temperament, setTemperament] = useState('')

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter a pet name')
      return false
    }
    if (!birthday.trim()) {
      toast.error('Please enter a birthday')
      return false
    }
    if (!weight.trim()) {
      toast.error('Please enter a weight')
      return false
    }
    if (!gender.trim()) {
      toast.error('Please select a gender')
      return false
    }
    if (!breed.trim()) {
      toast.error('Please enter a breed')
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    console.log('Saving pet:', {
      name,
      birthday,
      weight,
      gender,
      breed,
      mixedBreed,
      color,
      haircut,
      shampoo,
      favoriteGroomer,
      specialInstructions,
      notes,
      temperament
    })
    
    toast.success('Pet added successfully!')
    navigate(`/clients/${clientId}`)
  }

  const handleCancel = () => {
    navigate(`/clients/${clientId}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200"
            onClick={handleCancel}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Add New Pet</h1>
        </div>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint size={20} weight="fill" className="text-primary" />
              Pet Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Buddy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday *</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Labrador Retriever"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mixed-breed">Mixed Breed (if applicable)</Label>
                <Input
                  id="mixed-breed"
                  value={mixedBreed}
                  onChange={(e) => setMixedBreed(e.target.value)}
                  placeholder="Poodle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Yellow"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperament">Temperament (comma-separated)</Label>
              <Input
                id="temperament"
                value={temperament}
                onChange={(e) => setTemperament(e.target.value)}
                placeholder="Friendly, Energetic, Loves treats"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint size={20} weight="fill" className="text-primary" />
              Grooming Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="haircut">Preferred Haircut</Label>
                <Input
                  id="haircut"
                  value={haircut}
                  onChange={(e) => setHaircut(e.target.value)}
                  placeholder="Short summer cut"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shampoo">Shampoo Preference</Label>
                <Input
                  id="shampoo"
                  value={shampoo}
                  onChange={(e) => setShampoo(e.target.value)}
                  placeholder="Hypoallergenic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favorite-groomer">Favorite Groomer</Label>
                <Input
                  id="favorite-groomer"
                  value={favoriteGroomer}
                  onChange={(e) => setFavoriteGroomer(e.target.value)}
                  placeholder="Sarah J."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-instructions">Special Instructions</Label>
              <Textarea
                id="special-instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special handling instructions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Save Pet
          </Button>
        </div>
      </div>
    </div>
  )
}
