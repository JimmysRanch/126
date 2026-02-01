import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, PawPrint, Scissors, User } from "@phosphor-icons/react"
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
import { Client, getWeightCategory } from "@/lib/types"
import { getNowInBusinessTimezone } from "@/lib/date-utils"

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
  'Wisconsin', 'Wyoming'
]

const REFERRAL_SOURCES = [
  'Facebook',
  'Google',
  'Nextdoor',
  'Word-of-mouth',
  'Other'
]

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

interface PetInfo {
  id: string
  name: string
  birthday: string
  weight: string
  gender: string
  breed: string
  mixedBreed: string
  color: string
  breedError?: boolean
  mixedBreedError?: boolean
  overallLength: string
  faceStyle: string
  skipEarTrim: boolean
  skipTailTrim: boolean
  desiredStylePhoto: string
  groomingNotes: string
  temperament: string[]
}

export function AddClient() {
  const navigate = useNavigate()
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
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Texas')
  const [zipCode, setZipCode] = useState('')
  const [referralSource, setReferralSource] = useState('')
  
  const [pets, setPets] = useState<PetInfo[]>([
    {
      id: '1',
      name: '',
      birthday: '',
      weight: '',
      gender: '',
      breed: '',
      mixedBreed: '',
      color: '',
      breedError: false,
      mixedBreedError: false,
      overallLength: '',
      faceStyle: '',
      skipEarTrim: false,
      skipTailTrim: false,
      desiredStylePhoto: '',
      groomingNotes: '',
      temperament: []
    }
  ])

  const addPet = () => {
    const newPet: PetInfo = {
      id: Date.now().toString(),
      name: '',
      birthday: '',
      weight: '',
      gender: '',
      breed: '',
      mixedBreed: '',
      color: '',
      breedError: false,
      mixedBreedError: false,
      overallLength: '',
      faceStyle: '',
      skipEarTrim: false,
      skipTailTrim: false,
      desiredStylePhoto: '',
      groomingNotes: '',
      temperament: []
    }
    setPets((prevPets) => [...prevPets, newPet])
  }

  const removePet = (id: string) => {
    setPets((prevPets) => prevPets.filter(pet => pet.id !== id))
  }

  const updatePet = (id: string, field: keyof PetInfo, value: string | boolean | string[]) => {
    setPets((prevPets) => prevPets.map(pet => 
      pet.id === id ? { ...pet, [field]: value } : pet
    ))
  }

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '')
    
    if (phoneNumber.length === 0) {
      return ''
    }
    
    if (phoneNumber.length <= 3) {
      return `(${phoneNumber}`
    }
    
    if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const validateForm = () => {
    if (!firstName.trim()) {
      toast.error('Please enter a first name')
      return false
    }
    if (!lastName.trim()) {
      toast.error('Please enter a last name')
      return false
    }
    if (!email.trim()) {
      toast.error('Please enter an email address')
      return false
    }
    if (!phone.trim()) {
      toast.error('Please enter a phone number')
      return false
    }
    if (!streetAddress.trim()) {
      toast.error('Please enter a street address')
      return false
    }
    if (!city.trim()) {
      toast.error('Please enter a city')
      return false
    }
    if (!state.trim()) {
      toast.error('Please select a state')
      return false
    }
    if (!zipCode.trim()) {
      toast.error('Please enter a ZIP code')
      return false
    }
    if (!referralSource.trim()) {
      toast.error('Please select how you heard about us')
      return false
    }

    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i]
      if (!pet.name.trim()) {
        toast.error(`Please enter a name for pet ${i + 1}`)
        return false
      }
      if (!pet.weight.trim()) {
        toast.error(`Please enter a weight for ${pet.name || `pet ${i + 1}`}`)
        return false
      }
      if (!pet.gender.trim()) {
        toast.error(`Please select a gender for ${pet.name || `pet ${i + 1}`}`)
        return false
      }
      if (!pet.breed.trim() || !DOG_BREEDS.includes(pet.breed as any)) {
        setPets((prevPets) => prevPets.map(p => p.id === pet.id ? { ...p, breedError: true } : p))
        toast.error(`Please select a breed from the list for ${pet.name || `pet ${i + 1}`}`)
        return false
      }
    }

    return true
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const clientId = Date.now().toString()
    const formattedPets = pets.map((pet, index) => {
      const weight = Number.parseFloat(pet.weight)
      return {
        id: `${clientId}-pet-${index + 1}`,
        name: pet.name.trim(),
        breed: pet.breed.trim(),
        weight,
        weightCategory: getWeightCategory(weight),
        ownerId: clientId,
        birthday: pet.birthday.trim(),
        gender: pet.gender.trim(),
        mixedBreed: pet.mixedBreed.trim(),
        color: pet.color.trim(),
        overallLength: pet.overallLength,
        faceStyle: pet.faceStyle,
        skipEarTrim: pet.skipEarTrim,
        skipTailTrim: pet.skipTailTrim,
        desiredStylePhoto: pet.desiredStylePhoto || undefined,
        groomingNotes: pet.groomingNotes.trim(),
        temperament: pet.temperament
      }
    })
    const newClient: Client = {
      id: clientId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim(),
      phone: phone.trim(),
      pets: formattedPets,
      createdAt: getNowInBusinessTimezone(),
      address: {
        street: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zipCode.trim()
      },
      referralSource: referralSource.trim()
    }

    setClients((current) => [...(current || []), newClient])
    
    toast.success('Client saved successfully!')
    navigate('/clients')
  }

  const handleCancel = () => {
    navigate('/clients')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Client</h1>

        <Card className="bg-card border-border mb-6">
          <CardHeader className="pt-4 pb-3">
            <CardTitle className="flex items-center gap-2">
              <User size={20} weight="fill" className="text-primary" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3 pb-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name *</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name *</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street-address">Street Address *</Label>
                <Input
                  id="street-address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Natalia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((stateName) => (
                      <SelectItem key={stateName} value={stateName}>
                        {stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip-code">ZIP Code *</Label>
                <Input
                  id="zip-code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-source">How did you hear about us? *</Label>
              <Select value={referralSource} onValueChange={setReferralSource}>
                <SelectTrigger id="referral-source">
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {pets.map((pet, index) => (
          <div key={pet.id} className="mb-6 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pt-4 pb-3">
                <CardTitle className="flex items-center gap-2">
                  <PawPrint size={20} weight="fill" className="text-primary" />
                  Pet Information {pets.length > 1 && `#${index + 1}`}
                </CardTitle>
                {pets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePet(pet.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X size={16} className="mr-1" />
                    Delete Pet
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-3 pb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`pet-name-${pet.id}`}>Pet Name *</Label>
                    <Input
                      id={`pet-name-${pet.id}`}
                      value={pet.name}
                      onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                      placeholder="Charlie"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-weight-${pet.id}`}>Weight *</Label>
                    <Input
                      id={`pet-weight-${pet.id}`}
                      value={pet.weight}
                      onChange={(e) => updatePet(pet.id, 'weight', e.target.value)}
                      placeholder="55"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-gender-${pet.id}`}>Gender *</Label>
                    <Select 
                      value={pet.gender} 
                      onValueChange={(value) => updatePet(pet.id, 'gender', value)}
                    >
                      <SelectTrigger id={`pet-gender-${pet.id}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`pet-breed-${pet.id}`}>Breed *</Label>
                    <BreedCombobox
                      id={`pet-breed-${pet.id}`}
                      value={pet.breed}
                      onChange={(value) => {
                        updatePet(pet.id, 'breed', value)
                        setPets((prevPets) => prevPets.map(p => p.id === pet.id ? { ...p, breedError: false } : p))
                      }}
                      onBlur={(value) => {
                        if (!DOG_BREEDS.includes(value as any)) {
                          setPets((prevPets) => prevPets.map(p => p.id === pet.id ? { ...p, breedError: true } : p))
                        }
                      }}
                      error={pet.breedError}
                    />
                    <p className="text-xs text-muted-foreground">Select a breed from the list</p>
                    {pet.breedError && (
                      <p className="text-xs text-destructive">Please select a breed from the list.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-mixed-breed-${pet.id}`}>Mixed Breed (if applicable)</Label>
                    <BreedCombobox
                      id={`pet-mixed-breed-${pet.id}`}
                      value={pet.mixedBreed}
                      onChange={(value) => {
                        updatePet(pet.id, 'mixedBreed', value)
                        setPets((prevPets) => prevPets.map(p => p.id === pet.id ? { ...p, mixedBreedError: false } : p))
                      }}
                      onBlur={(value) => {
                        if (value && !DOG_BREEDS.includes(value as any)) {
                          setPets((prevPets) => prevPets.map(p => p.id === pet.id ? { ...p, mixedBreedError: true } : p))
                        }
                      }}
                      error={pet.mixedBreedError}
                    />
                    <p className="text-xs text-muted-foreground">Select a second breed if mixed</p>
                    {pet.mixedBreedError && (
                      <p className="text-xs text-destructive">Please select a breed from the list.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`pet-color-${pet.id}`}>Color</Label>
                    <Select 
                      value={pet.color} 
                      onValueChange={(value) => updatePet(pet.id, 'color', value)}
                    >
                      <SelectTrigger id={`pet-color-${pet.id}`}>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOG_COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`pet-birthday-${pet.id}`}>Birthday</Label>
                    <Input
                      id={`pet-birthday-${pet.id}`}
                      type="date"
                      value={pet.birthday}
                      onChange={(e) => updatePet(pet.id, 'birthday', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2 block">Temperament</Label>
                  <div className="flex flex-wrap gap-2">
                    {temperamentOptions.map((option) => {
                      const isSelected = pet.temperament.includes(option)
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
                              ? pet.temperament.filter(t => t !== option)
                              : [...pet.temperament, option]
                            updatePet(pet.id, 'temperament', newTemperament)
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
                Grooming Preferences {pet.name ? `• ${pet.name}` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-3 pb-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Overall length</Label>
                <RadioGroup 
                  value={pet.overallLength} 
                  onValueChange={(value) => updatePet(pet.id, 'overallLength', value)}
                >
                  <div className="flex flex-wrap gap-1">
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Short & neat" id={`${pet.id}-length-short`} />
                      <Label htmlFor={`${pet.id}-length-short`} className="text-sm font-normal cursor-pointer">
                        Short & neat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Medium & neat" id={`${pet.id}-length-medium`} />
                      <Label htmlFor={`${pet.id}-length-medium`} className="text-sm font-normal cursor-pointer">
                        Medium & neat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Long & fluffy" id={`${pet.id}-length-long`} />
                      <Label htmlFor={`${pet.id}-length-long`} className="text-sm font-normal cursor-pointer">
                        Long & fluffy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Breed standard" id={`${pet.id}-length-breed`} />
                      <Label htmlFor={`${pet.id}-length-breed`} className="text-sm font-normal cursor-pointer">
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
                  value={pet.faceStyle} 
                  onValueChange={(value) => updatePet(pet.id, 'faceStyle', value)}
                >
                  <div className="flex flex-wrap gap-1">
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Short & neat" id={`${pet.id}-face-short`} />
                      <Label htmlFor={`${pet.id}-face-short`} className="text-sm font-normal cursor-pointer">
                        Short & neat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Round / Teddy" id={`${pet.id}-face-round`} />
                      <Label htmlFor={`${pet.id}-face-round`} className="text-sm font-normal cursor-pointer">
                        Round / Teddy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Beard / Mustache" id={`${pet.id}-face-beard`} />
                      <Label htmlFor={`${pet.id}-face-beard`} className="text-sm font-normal cursor-pointer">
                        Beard / Mustache
                      </Label>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      <RadioGroupItem value="Breed Standard" id={`${pet.id}-face-breed`} />
                      <Label htmlFor={`${pet.id}-face-breed`} className="text-sm font-normal cursor-pointer">
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
                      id={`${pet.id}-skip-ear-trim`}
                      checked={pet.skipEarTrim}
                      onCheckedChange={(checked) => updatePet(pet.id, 'skipEarTrim', checked as boolean)}
                    />
                    <Label htmlFor={`${pet.id}-skip-ear-trim`} className="text-sm font-normal cursor-pointer">
                      Skip Ear Trim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id={`${pet.id}-skip-tail-trim`}
                      checked={pet.skipTailTrim}
                      onCheckedChange={(checked) => updatePet(pet.id, 'skipTailTrim', checked as boolean)}
                    />
                    <Label htmlFor={`${pet.id}-skip-tail-trim`} className="text-sm font-normal cursor-pointer">
                      Skip Tail Trim
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${pet.id}-desired-style`} className="text-sm font-medium">What I want</Label>
                <Input
                  id={`${pet.id}-desired-style`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) {
                      updatePet(pet.id, 'desiredStylePhoto', '')
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      updatePet(
                        pet.id,
                        'desiredStylePhoto',
                        typeof reader.result === 'string' ? reader.result : ''
                      )
                    }
                    reader.readAsDataURL(file)
                  }}
                />
                <p className="text-xs text-muted-foreground">Upload a reference photo for the desired look.</p>
              </div>

              <Separator />

              <div>
                <Label htmlFor={`${pet.id}-grooming-notes`} className="text-sm font-medium mb-2 block">Additional Details</Label>
                <Textarea
                  id={`${pet.id}-grooming-notes`}
                  value={pet.groomingNotes}
                  onChange={(e) => updatePet(pet.id, 'groomingNotes', e.target.value)}
                  placeholder="Any special grooming instructions..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        ))}

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={addPet}
            className="w-full border-dashed border-2 hover:bg-primary/10 hover:border-primary transition-all duration-200"
          >
            <Plus size={18} className="mr-2" />
            Add Additional Pet
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
