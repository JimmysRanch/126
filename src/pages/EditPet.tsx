import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PawPrint, PencilSimple, Scissors, Trash } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { BreedCombobox } from "@/components/BreedCombobox"
import { DOG_BREEDS } from "@/lib/breeds"
import { Client, getWeightCategory } from "@/lib/types"

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

export function EditPet() {
  const navigate = useNavigate()
  const { clientId, petId } = useParams()
  const [clients, setClients] = useKV<Client[]>("clients", [])

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

  const client = useMemo(
    () => (clients || []).find(item => item.id === clientId),
    [clients, clientId]
  )
  const pet = useMemo(
    () => client?.pets.find(item => item.id === petId),
    [client, petId]
  )

  const [name, setName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [weight, setWeight] = useState("")
  const [gender, setGender] = useState("")
  const [breed, setBreed] = useState("")
  const [mixedBreed, setMixedBreed] = useState("")
  const [color, setColor] = useState("")
  const [temperament, setTemperament] = useState<string[]>([])
  const [breedError, setBreedError] = useState(false)
  const [mixedBreedError, setMixedBreedError] = useState(false)
  const [overallLength, setOverallLength] = useState("")
  const [faceStyle, setFaceStyle] = useState("")
  const [skipEarTrim, setSkipEarTrim] = useState(false)
  const [skipTailTrim, setSkipTailTrim] = useState(false)
  const [desiredStylePhoto, setDesiredStylePhoto] = useState("")
  const [groomingNotes, setGroomingNotes] = useState("")
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)

  useEffect(() => {
    if (!pet) {
      return
    }
    setName(pet.name ?? "")
    setBirthday(pet.birthday ?? "")
    setWeight(pet.weight ? String(pet.weight) : "")
    setGender(pet.gender ?? "")
    setBreed(pet.breed ?? "")
    setMixedBreed(pet.mixedBreed ?? "")
    setColor(pet.color ?? "")
    setTemperament(pet.temperament ?? [])
    setOverallLength(pet.overallLength ?? "")
    setFaceStyle(pet.faceStyle ?? "")
    setSkipEarTrim(Boolean(pet.skipEarTrim))
    setSkipTailTrim(Boolean(pet.skipTailTrim))
    setDesiredStylePhoto(pet.desiredStylePhoto ?? "")
    setGroomingNotes(pet.groomingNotes ?? "")
  }, [pet])

  if (!client || !pet) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
          <Button
            variant="ghost"
            className="mb-4 hover:bg-secondary transition-colors"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Client
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Pet Not Found</h1>
            <p className="text-muted-foreground">We couldn't find this pet in the client profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter a pet name')
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
    if (mixedBreed.trim() && !DOG_BREEDS.includes(mixedBreed as any)) {
      setMixedBreedError(true)
      toast.error('Please select a mixed breed from the list')
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const parsedWeight = Number.parseFloat(weight)
    if (Number.isNaN(parsedWeight)) {
      toast.error('Please enter a valid weight')
      return
    }

    setClients((current) =>
      (current || []).map((currentClient) => {
        if (currentClient.id !== clientId) return currentClient
        return {
          ...currentClient,
          pets: currentClient.pets.map((currentPet) => {
            if (currentPet.id !== petId) return currentPet
            return {
              ...currentPet,
              name: name.trim(),
              breed: breed.trim(),
              weight: parsedWeight,
              weightCategory: getWeightCategory(parsedWeight),
              birthday: birthday.trim(),
              gender: gender.trim(),
              mixedBreed: mixedBreed.trim(),
              color: color.trim(),
              temperament,
              overallLength,
              faceStyle,
              skipEarTrim,
              skipTailTrim,
              desiredStylePhoto: desiredStylePhoto || undefined,
              groomingNotes: groomingNotes.trim()
            }
          })
        }
      })
    )

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
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200 mt-1"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            <ArrowLeft size={24} />
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

        <Card className="bg-card border-border mb-6">
          <CardHeader className="pt-4 pb-3">
            <CardTitle className="flex items-center gap-2">
              <PawPrint size={20} weight="fill" className="text-primary" />
              Pet Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet-name">Pet Name *</Label>
                <Input
                  id="pet-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Charlie"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pet-weight">Weight *</Label>
                <Input
                  id="pet-weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="55"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pet-gender">Gender *</Label>
                <Select 
                  value={gender} 
                  onValueChange={setGender}
                >
                  <SelectTrigger id="pet-gender">
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
                <Label htmlFor="pet-breed">Breed *</Label>
                <BreedCombobox
                  id="pet-breed"
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
                <Label htmlFor="pet-mixed-breed">Mixed Breed (if applicable)</Label>
                <BreedCombobox
                  id="pet-mixed-breed"
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
                <Label htmlFor="pet-color">Color</Label>
                <Select 
                  value={color} 
                  onValueChange={setColor}
                >
                  <SelectTrigger id="pet-color">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet-birthday">Birthday</Label>
                <Input
                  id="pet-birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
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
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pt-4 pb-3">
            <CardTitle className="flex items-center gap-2">
              <Scissors size={20} weight="fill" className="text-primary" />
              Grooming Preferences {name ? `• ${name}` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3 pb-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Overall length</Label>
              <RadioGroup 
                value={overallLength} 
                onValueChange={setOverallLength}
              >
                <div className="grid grid-cols-4 gap-px">
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Short & neat" id="length-short" />
                    <Label htmlFor="length-short" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Short & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Medium & neat" id="length-medium" />
                    <Label htmlFor="length-medium" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Medium & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Long & fluffy" id="length-long" />
                    <Label htmlFor="length-long" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Long & fluffy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Breed standard" id="length-breed" />
                    <Label htmlFor="length-breed" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Breed standard
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Face style</Label>
              <RadioGroup 
                value={faceStyle} 
                onValueChange={setFaceStyle}
              >
                <div className="grid grid-cols-4 gap-px">
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Short & neat" id="face-short" />
                    <Label htmlFor="face-short" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Short & neat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Round / Teddy" id="face-round" />
                    <Label htmlFor="face-round" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Round / Teddy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Beard / Mustache" id="face-beard" />
                    <Label htmlFor="face-beard" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Beard / Mustache
                    </Label>
                  </div>
                  <div className="flex items-center space-x-px whitespace-nowrap">
                    <RadioGroupItem value="Breed Standard" id="face-breed" />
                    <Label htmlFor="face-breed" className="text-sm font-normal cursor-pointer whitespace-nowrap">
                      Breed Standard
                    </Label>
                  </div>
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

            <div className="space-y-2">
              <Label htmlFor="desired-style" className="text-sm font-medium">What I want</Label>
              <Input
                id="desired-style"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) {
                    setDesiredStylePhoto('')
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    setDesiredStylePhoto(typeof reader.result === 'string' ? reader.result : '')
                  }
                  reader.readAsDataURL(file)
                }}
              />
              <p className="text-xs text-muted-foreground">Upload a reference photo for the desired look.</p>
              {desiredStylePhoto && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-foreground">Preview uploaded photo</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setDesiredStylePhoto('')}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-md border border-border bg-background">
                    <img
                      src={desiredStylePhoto}
                      alt={`${name || 'Pet'} grooming reference`}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Image uploaded successfully.</p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <Label htmlFor="grooming-notes" className="text-sm font-medium mb-2 block">Additional Details</Label>
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
