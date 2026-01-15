import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserCircle } from "@phosphor-icons/react"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"

interface StaffProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  staffEmail: string
  address: string
  city: string
  state: string
  zip: string
  emergencyContactFirstName: string
  emergencyContactLastName: string
  emergencyContactRelation: string
  emergencyContactPhone: string
}

export function StaffProfileSetup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [staffProfiles, setStaffProfiles] = useKV<StaffProfile[]>("staff-onboarding-profiles", [])
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    staffEmail: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: ''
  })
  
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const validateForm = () => {
    const requiredFields: Array<keyof typeof formData> = [
      'firstName',
      'lastName',
      'phone',
      'staffEmail',
      'address',
      'city',
      'state',
      'zip',
      'emergencyContactFirstName',
      'emergencyContactLastName',
      'emergencyContactRelation',
      'emergencyContactPhone'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        return false
      }
    }
    
    return true
  }
  
  const handleSaveProfile = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    const newProfile: StaffProfile = {
      email,
      ...formData
    }
    
    setStaffProfiles(current => {
      const profiles = Array.isArray(current) ? current : []
      const existingIndex = profiles.findIndex(p => p.email === email)
      if (existingIndex >= 0) {
        const updated = [...profiles]
        updated[existingIndex] = newProfile
        return updated
      }
      return [...profiles, newProfile]
    })
    
    toast.success("Profile saved successfully!")
    
    setTimeout(() => {
      navigate('/settings?tab=dev-pages')
    }, 1500)
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.35_0.15_195),transparent_50%)] opacity-30"></div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/settings')}
        className="fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-border text-xs"
      >
        <ArrowLeft size={14} className="mr-1" />
        Back to App
      </Button>
      
      <Card className="w-full max-w-2xl p-8 my-8 relative z-10 bg-card/90 backdrop-blur-sm border-primary/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <UserCircle size={32} className="text-primary" weight="duotone" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm">
            Just a few more details and you're all set!
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-sm font-medium flex items-center gap-1">
                First Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first-name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-sm font-medium flex items-center gap-1">
                Last Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last-name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                Phone Number
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-email" className="text-sm font-medium flex items-center gap-1">
                Email
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="staff-email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.staffEmail}
                onChange={(e) => handleChange('staffEmail', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
              Address
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="city" className="text-sm font-medium flex items-center gap-1">
                City
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Springfield"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium flex items-center gap-1">
                State
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                placeholder="CA"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip" className="text-sm font-medium flex items-center gap-1">
                ZIP Code
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zip"
                placeholder="12345"
                value={formData.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
              />
            </div>
          </div>
          
          <div className="border-t border-border pt-6 mt-8">
            <h3 className="text-base font-semibold mb-4">Emergency Contact</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency-first-name" className="text-sm font-medium flex items-center gap-1">
                    First Name
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emergency-first-name"
                    placeholder="Jane"
                    value={formData.emergencyContactFirstName}
                    onChange={(e) => handleChange('emergencyContactFirstName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency-last-name" className="text-sm font-medium flex items-center gap-1">
                    Last Name
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emergency-last-name"
                    placeholder="Doe"
                    value={formData.emergencyContactLastName}
                    onChange={(e) => handleChange('emergencyContactLastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency-relation" className="text-sm font-medium flex items-center gap-1">
                    Relation
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emergency-relation"
                    placeholder="Spouse, Parent, Sibling, Friend, etc."
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency-phone" className="text-sm font-medium flex items-center gap-1">
                    Phone Number
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emergency-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleSaveProfile}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 text-base mt-8"
          >
            Save Profile
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            All fields marked with <span className="text-destructive">*</span> are required
          </p>
        </div>
      </Card>
    </div>
  )
}
