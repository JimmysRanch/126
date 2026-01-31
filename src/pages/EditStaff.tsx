import { ArrowLeft } from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Staff } from "@/lib/types"

interface StaffAppointmentSummary {
  id: string
  client: string
  pet: string
  service: string
  date: string
  time: string
  duration?: string
  status?: string
  cost?: string
  tip?: string
  rating?: number
  notes?: string
}

interface StaffProfileDetail {
  name: string
  role: string
  email: string
  phone: string
  address: string
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  hireDate: string
  status: "Active" | "On Leave" | "Inactive"
  hourlyRate: number
  specialties: string[]
  stats: {
    totalAppointments: number
    revenue: string
    avgTip: string
    noShows: number
    lateArrivals: number
  }
  upcomingAppointments: StaffAppointmentSummary[]
  recentAppointments: StaffAppointmentSummary[]
  notes?: string
}

interface StaffFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: "Active" | "On Leave" | "Inactive"
  streetAddress: string
  city: string
  state: string
  zipCode: string
  notes: string
  emergencyFirstName: string
  emergencyLastName: string
  emergencyPhone: string
  emergencyRelation: string
}

const formatDateForInput = (value?: string) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ""
  return parsed.toISOString().slice(0, 10)
}

const parseAddress = (address?: string) => {
  if (!address) {
    return { street: "", city: "", state: "TX", zip: "" }
  }
  const [street = "", city = "", stateZip = ""] = address.split(",").map((part) => part.trim())
  const [state = "TX", zip = ""] = stateZip.split(" ").filter(Boolean)
  return {
    street,
    city,
    state: state || "TX",
    zip
  }
}

export function EditStaff() {
  const navigate = useNavigate()
  const { staffId } = useParams()
  const [staffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])
  const [staffMembers, setStaffMembers] = useKV<Staff[]>("staff", [])
  const [staffProfiles, setStaffProfiles] = useKV<Record<string, StaffProfileDetail>>(
    "staff-profile-details",
    {}
  )

  const staffFromList = (staffMembers || []).find((member) => member.id === staffId)
  const staffProfileEntry = staffId ? staffProfiles?.[staffId] : undefined
  const parsedAddress = useMemo(() => parseAddress(staffProfileEntry?.address), [staffProfileEntry?.address])
  const availablePositions = staffPositions && staffPositions.length > 0
    ? staffPositions
    : ["Owner", "Groomer", "Front Desk", "Bather"]
  const defaultRole = staffFromList?.role ?? staffProfileEntry?.role ?? availablePositions[0]
  const defaultStatus = staffFromList?.status ?? staffProfileEntry?.status ?? "Active"
  const hireDateValue = formatDateForInput(staffFromList?.hireDate ?? staffProfileEntry?.hireDate)
  const [formData, setFormData] = useState<StaffFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: defaultRole,
    status: defaultStatus,
    streetAddress: "",
    city: "",
    state: "TX",
    zipCode: "",
    notes: "",
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyPhone: "",
    emergencyRelation: ""
  })

  useEffect(() => {
    const nameParts = (staffFromList?.name ?? staffProfileEntry?.name ?? "").split(" ").filter(Boolean)
    const [firstName = "", ...lastNameParts] = nameParts
    const lastName = lastNameParts.join(" ")
    const emergencyName = staffProfileEntry?.emergencyContact?.name ?? ""
    const emergencyParts = emergencyName.split(" ").filter(Boolean)
    const [emergencyFirst = "", ...emergencyLastParts] = emergencyParts
    const emergencyLast = emergencyLastParts.join(" ")

    setFormData({
      firstName,
      lastName,
      email: staffFromList?.email ?? staffProfileEntry?.email ?? "",
      phone: staffFromList?.phone ?? staffProfileEntry?.phone ?? "",
      role: defaultRole,
      status: defaultStatus,
      streetAddress: parsedAddress.street,
      city: parsedAddress.city,
      state: parsedAddress.state,
      zipCode: parsedAddress.zip,
      notes: staffProfileEntry?.notes ?? "",
      emergencyFirstName: emergencyFirst,
      emergencyLastName: emergencyLast,
      emergencyPhone: staffProfileEntry?.emergencyContact?.phone ?? "",
      emergencyRelation: staffProfileEntry?.emergencyContact?.relation ?? ""
    })
  }, [defaultRole, defaultStatus, parsedAddress, staffFromList, staffProfileEntry])

  const handleChange = (field: keyof StaffFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!staffId) {
      toast.error("Staff member not found")
      return
    }
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("Please complete the required staff details")
      return
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
    const addressParts = [
      formData.streetAddress.trim(),
      formData.city.trim(),
      `${formData.state.trim()} ${formData.zipCode.trim()}`.trim()
    ].filter((part) => part.length > 0)
    const address = addressParts.length > 0 ? addressParts.join(", ") : "—"
    const emergencyName = `${formData.emergencyFirstName.trim()} ${formData.emergencyLastName.trim()}`.trim()
    const hireDate = staffFromList?.hireDate || staffProfileEntry?.hireDate || ""

    const updatedStaff: Staff = {
      id: staffId,
      name: fullName,
      role: formData.role,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
      isGroomer: staffFromList?.isGroomer ?? true,
      specialties: staffFromList?.specialties ?? staffProfileEntry?.specialties ?? [],
      hourlyRate: staffFromList?.hourlyRate ?? staffProfileEntry?.hourlyRate?.toString(),
      totalAppointments: staffFromList?.totalAppointments ?? staffProfileEntry?.stats?.totalAppointments ?? 0,
      hireDate
    }

    setStaffMembers((current) => {
      const list = Array.isArray(current) ? current : []
      const existingIndex = list.findIndex((member) => member.id === staffId)
      if (existingIndex >= 0) {
        const updated = [...list]
        updated[existingIndex] = updatedStaff
        return updated
      }
      return [...list, updatedStaff]
    })

    const baseStats = staffProfileEntry?.stats ?? {
      totalAppointments: updatedStaff.totalAppointments ?? 0,
      revenue: "$0",
      avgTip: "$0",
      noShows: 0,
      lateArrivals: 0
    }

    const updatedProfile: StaffProfileDetail = {
      name: fullName,
      role: formData.role,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address,
      emergencyContact: {
        name: emergencyName || "—",
        relation: formData.emergencyRelation.trim() || "—",
        phone: formData.emergencyPhone.trim() || "—"
      },
      hireDate: hireDate || "—",
      status: formData.status,
      hourlyRate: staffProfileEntry?.hourlyRate ?? 0,
      specialties: staffProfileEntry?.specialties ?? updatedStaff.specialties ?? [],
      stats: baseStats,
      upcomingAppointments: staffProfileEntry?.upcomingAppointments ?? [],
      recentAppointments: staffProfileEntry?.recentAppointments ?? [],
      notes: formData.notes.trim()
    }

    setStaffProfiles((current) => ({
      ...(current || {}),
      [staffId]: updatedProfile
    }))

    toast.success("Staff information updated successfully")
    navigate(`/staff/${staffId}`)
  }

  if (!staffId || (!staffFromList && !staffProfileEntry)) {
    return (
      <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
        <div className="max-w-[1000px] mx-auto space-y-4 sm:space-y-6">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200"
            onClick={() => navigate("/staff")}
          >
            <ArrowLeft size={24} />
          </Button>
          <Card className="p-6 text-center text-muted-foreground">
            Staff member not found.
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[1000px] mx-auto space-y-4 sm:space-y-6">
        <header className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200"
            onClick={() => navigate(`/staff/${staffId}`)}
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight leading-none">
              Edit Staff Member
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {formData.firstName} {formData.lastName}
            </p>
          </div>
        </header>

        <div className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(event) => handleChange("firstName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(event) => handleChange("lastName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hired Date</Label>
                <p className="text-sm text-muted-foreground">
                  {hireDateValue || "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  placeholder="1234 Bark Lane"
                  value={formData.streetAddress}
                  onChange={(event) => handleChange("streetAddress", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Scruffyville"
                  value={formData.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="12345"
                  value={formData.zipCode}
                  onChange={(event) => handleChange("zipCode", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add context about certifications, specialties, or scheduling preferences."
                  rows={3}
                  value={formData.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyFirstName">First Name</Label>
                <Input
                  id="emergencyFirstName"
                  placeholder="Jane"
                  value={formData.emergencyFirstName}
                  onChange={(event) => handleChange("emergencyFirstName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyLastName">Last Name</Label>
                <Input
                  id="emergencyLastName"
                  placeholder="Doe"
                  value={formData.emergencyLastName}
                  onChange={(event) => handleChange("emergencyLastName", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="(555) 123-4567"
                  value={formData.emergencyPhone}
                  onChange={(event) => handleChange("emergencyPhone", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelation">Relation</Label>
                <Input
                  id="emergencyRelation"
                  placeholder="Spouse, Parent, Sibling, etc."
                  value={formData.emergencyRelation}
                  onChange={(event) => handleChange("emergencyRelation", event.target.value)}
                />
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/staff/${staffId}`)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto w-full"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
