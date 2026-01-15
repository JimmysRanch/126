import { ArrowLeft } from "@phosphor-icons/react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"

export function EditStaff() {
  const navigate = useNavigate()
  const { staffId } = useParams()
  const [staffPositions] = useKV<string[]>("staff-positions", ["Owner", "Groomer", "Front Desk", "Bather"])

  const staffData = {
    "1": {
      name: "Sarah Johnson",
      role: "Senior Groomer",
      email: "sarah.j@pawhub.com",
      phone: "(555) 123-4567",
      hireDate: "Mar 15, 2022",
      status: "Active"
    },
    "2": {
      name: "Mike Torres",
      role: "Groomer",
      email: "mike.t@pawhub.com",
      phone: "(555) 234-5678",
      hireDate: "Aug 20, 2022",
      status: "Active"
    }
  }

  const staff = staffData[staffId as keyof typeof staffData] || staffData["1"]

  const handleSave = () => {
    toast.success("Staff information updated successfully")
    navigate(`/staff/${staffId}`)
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
              {staff.name}
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
                <Input id="firstName" defaultValue={staff.name.split(' ')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={staff.name.split(' ')[1]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select defaultValue={staff.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(staffPositions || []).map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={staff.status}>
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={staff.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={staff.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input id="streetAddress" placeholder="1234 Bark Lane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Scruffyville" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select defaultValue="TX">
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
                <Input id="zipCode" placeholder="12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hiredDate">Hired Date</Label>
                <Input id="hiredDate" type="date" />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add context about certifications, specialties, or scheduling preferences."
                  rows={3}
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
                <Input id="emergencyFirstName" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyLastName">Last Name</Label>
                <Input id="emergencyLastName" placeholder="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input id="emergencyPhone" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelation">Relation</Label>
                <Input id="emergencyRelation" placeholder="Spouse, Parent, Sibling, etc." />
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
