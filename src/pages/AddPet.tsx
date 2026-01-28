import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PawPrint } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { BreedCombobox } from "@/components/BreedCombobox"
import { DOG_BREEDS } from "@/lib/breeds"
import { useKV } from "@github/spark/hooks"

const DOG_COLORS = [
  'Black',
  'White',
  'Brown',
  'Golden',
  'Cream',
  'Red',
  'Blue',
  'Gray',
  'Silver',
  'Tan',
  'Yellow',
  'Apricot',
  'Chocolate',
  'Brindle',
  'Sable',
  'Merle',
  'Parti-color',
  'Tricolor',
  'Other'
]

export function AddPet() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  
  const [temperamentOptionsRaw] = useKV<string[]>("temperament-options", [
    "Friendly",
    "Energetic",
    "Calm",
    "Nervous",
    "Aggressive",
    "Playful",
    "Shy",
    "Loves treats"
  ])
  
  const temperamentOptions = Array.isArray(temperamentOptionsRaw) ? temperamentOptionsRaw : [
    "Friendly",
    "Energetic",
    "Calm",
    "Nervous",
    "Aggressive",
    "Playful",
    "Shy",
    "Loves treats"
  ]
  
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('')
  const [breed, setBreed] = useState('')
  const [mixedBreed, setMixedBreed] = useState('')
  const [color, setColor] = useState('')
  const [temperament, setTemperament] = useState<string[]>([])
  const [breedError, setBreedError] = useState(false)
  const [mixedBreedError, setMixedBreedError] = useState(false)
  const [overallLength, setOverallLength] = useState('')
  const [faceStyle, setFaceStyle] = useState('')
  const [skipEarTrim, setSkipEarTrim] = useState(false)
  const [skipTailTrim, setSkipTailTrim] = useState(false)
  const [groomingNotes, setGroomingNotes] = useState('')

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
    if (!breed.trim() || !DOG_BREEDS.includes(breed as any)) {
      setBreedError(true)
      toast.error('Please select a breed from the list')
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
      temperament,
      overallLength,
      faceStyle,
      skipEarTrim,
      skipTailTrim,
      groomingNotes
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
          <CardHeader className="pt-4 pb-3">
            <CardTitle className="flex items-center gap-2">
              <PawPrint size={20} weight="fill" className="text-primary" />
              Pet Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3 pb-6">
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
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday *</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <BreedCombobox
                  id="breed"
                  value={breed}
                  onChange={(value) => {
                    setBreed(value)
                    setBreedError(false)
                  }}
                  onBlur={(value) => {
                    if (!DOG_BREEDS.includes(value as any)) {
                      setBreedError(true)
                    }
                  }}
                  error={breedError}
                />
                <p className="text-xs text-muted-foreground">Select a breed from the list</p>
                {breedError && (
                  <p className="text-xs text-destructive">Please select a breed from the list.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mixed-breed">Mixed Breed (if applicable)</Label>
                <BreedCombobox
                  id="mixed-breed"
                  value={mixedBreed}
                  onChange={(value) => {
                    setMixedBreed(value)
                    setMixedBreedError(false)
                  }}
                  onBlur={(value) => {
                    if (value && !DOG_BREEDS.includes(value as any)) {
                      setMixedBreedError(true)
                    }
                  }}
                  error={mixedBreedError}
                />
                <p className="text-xs text-muted-foreground">Select a second breed if mixed</p>
                {mixedBreedError && (
                  <p className="text-xs text-destructive">Please select a breed from the list.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOG_COLORS.map((dogColor) => (
                      <SelectItem key={dogColor} value={dogColor}>
                        {dogColor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader className="pt-4 pb-3">
            <CardTitle className="flex items-center gap-2">
              <PawPrint size={20} weight="fill" className="text-primary" />
              Grooming Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3 pb-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Overall length</Label>
              <RadioGroup value={overallLength} onValueChange={setOverallLength}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Short & neat" id="length-short" />
                    <Label htmlFor="length-short" className="text-sm font-normal cursor-pointer">
                      Short & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Medium & neat" id="length-medium" />
                    <Label htmlFor="length-medium" className="text-sm font-normal cursor-pointer">
                      Medium & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Long & fluffy" id="length-long" />
                    <Label htmlFor="length-long" className="text-sm font-normal cursor-pointer">
                      Long & fluffy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Breed standard" id="length-breed" />
                    <Label htmlFor="length-breed" className="text-sm font-normal cursor-pointer">
                      Breed standard
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Face style</Label>
              <RadioGroup value={faceStyle} onValueChange={setFaceStyle}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Short & neat" id="face-short" />
                    <Label htmlFor="face-short" className="text-sm font-normal cursor-pointer">
                      Short & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Round / Teddy" id="face-round" />
                    <Label htmlFor="face-round" className="text-sm font-normal cursor-pointer">
                      Round / Teddy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Beard / Mustache" id="face-beard" />
                    <Label htmlFor="face-beard" className="text-sm font-normal cursor-pointer">
                      Beard / Mustache
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RadioGroupItem value="Breed Standard" id="face-breed" />
                    <Label htmlFor="face-breed" className="text-sm font-normal cursor-pointer">
                      Breed Standard
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Temperament</Label>
              <div className="flex flex-wrap gap-2">
                {temperamentOptions.map((option) => {
                  const isSelected = temperament.includes(option)
                  return (
                    <Badge
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => {
                        const newTemperament = isSelected
                          ? temperament.filter(t => t !== option)
                          : [...temperament, option]
                        setTemperament(newTemperament)
                      }}
                    >
                      {option}
                    </Badge>
                  )
                })}
              </div>
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
