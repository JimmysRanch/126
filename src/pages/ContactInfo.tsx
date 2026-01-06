import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Phone, Envelope, MapPin, User } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ContactInfo() {
  const navigate = useNavigate()
  const { clientId } = useParams()

  const contactInfo = {
    name: "George Moodys",
    phone: "(555) 123-4567",
    email: "george.moodys@email.com",
    address: {
      street: "123 Main Street",
      city: "Natalia",
      state: "Texas",
      zipCode: "78059"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary transition-all duration-200"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <User size={28} className="text-primary" weight="fill" />
              Contact Information
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{contactInfo.name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Phone size={24} className="text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Phone Number
                </h3>
                <p className="text-2xl font-bold">{contactInfo.phone}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    onClick={() => window.location.href = `tel:${contactInfo.phone}`}
                  >
                    <Phone size={16} className="mr-2" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="font-semibold"
                    onClick={() => window.location.href = `sms:${contactInfo.phone}`}
                  >
                    Text
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Envelope size={24} className="text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Email Address
                </h3>
                <p className="text-2xl font-bold break-all">{contactInfo.email}</p>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-3"
                  onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                >
                  <Envelope size={16} className="mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin size={24} className="text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Physical Address
                </h3>
                <div className="text-lg font-semibold space-y-1">
                  <p>{contactInfo.address.street}</p>
                  <p>{contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zipCode}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-3"
                  onClick={() => {
                    const addressString = `${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state} ${contactInfo.address.zipCode}`
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(addressString)}`, '_blank')
                  }}
                >
                  <MapPin size={16} className="mr-2" />
                  Open in Maps
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
