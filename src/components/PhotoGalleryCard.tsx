import { useState, useRef } from "react"
import { Images, Plus, X, ArrowsLeftRight, PawPrint, Upload, Trash } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useKV } from "@github/spark/hooks"
import { useIsMobile } from "@/hooks/use-mobile"

interface Photo {
  id: string
  beforeUrl: string
  afterUrl: string
  date: string
  service: string
  groomer: string
}

interface PhotoGalleryCardProps {
  petName: string
  petId: string
  photos: Photo[]
}

export function PhotoGalleryCard({ petName, petId, photos: initialPhotos }: PhotoGalleryCardProps) {
  const [photos, setPhotos] = useKV<Photo[]>(`pet-photos-${petId}`, initialPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [beforePreview, setBeforePreview] = useState<string>("")
  const [afterPreview, setAfterPreview] = useState<string>("")
  const [service, setService] = useState("")
  const [groomer, setGroomer] = useState("")
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  const handleFileChange = (file: File | null, type: 'before' | 'after') => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      if (type === 'before') {
        setBeforePreview(result)
      } else {
        setAfterPreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (!beforePreview || !afterPreview) {
      toast.error('Please select both before and after photos')
      return
    }

    if (!service.trim()) {
      toast.error('Please enter a service name')
      return
    }

    if (!groomer.trim()) {
      toast.error('Please enter a groomer name')
      return
    }

    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      beforeUrl: beforePreview,
      afterUrl: afterPreview,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      service: service.trim(),
      groomer: groomer.trim()
    }

    setPhotos((currentPhotos) => [newPhoto, ...(currentPhotos || [])])
    toast.success('Photos uploaded successfully!')
    resetUploadForm()
    setUploadDialogOpen(false)
  }

  const resetUploadForm = () => {
    setBeforePreview("")
    setAfterPreview("")
    setService("")
    setGroomer("")
    if (beforeInputRef.current) beforeInputRef.current.value = ""
    if (afterInputRef.current) afterInputRef.current.value = ""
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((currentPhotos) => (currentPhotos || []).filter(p => p.id !== photoId))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
    toast.success('Photo deleted')
  }

  const currentPhotos = photos || []

  return (
    <>
      <motion.div className="relative">
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 blur-xl pointer-events-none"
          animate={{
            opacity: [0.07, 0.11, 0.07],
            background: [
              "radial-gradient(circle at 30% 30%, oklch(0.75 0.15 195 / 0.28), transparent 65%)",
              "radial-gradient(circle at 70% 70%, oklch(0.75 0.15 195 / 0.33), transparent 65%)",
              "radial-gradient(circle at 50% 50%, oklch(0.75 0.15 195 / 0.3), transparent 65%)",
              "radial-gradient(circle at 30% 30%, oklch(0.75 0.15 195 / 0.28), transparent 65%)"
            ]
          }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <Card className="p-3 border-border bg-card relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Images size={18} className="text-primary" weight="fill" />
              Photo Gallery - 
              <span className="flex items-center gap-1.5">
                <PawPrint size={16} weight="fill" className="text-primary" />
                {petName}
              </span>
            </h3>
            <Button
              size="sm"
              variant="secondary"
              className="font-semibold text-xs transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Plus size={14} className="mr-1" />
              Add Photos
            </Button>
          </div>

          {currentPhotos.length === 0 ? (
            <div className="bg-secondary/30 rounded-md p-8 border border-dashed border-border text-center">
              <Images size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No grooming photos yet</p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Plus size={14} className="mr-1" />
                Upload First Photos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {currentPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div 
                    className="relative aspect-square rounded-md overflow-hidden border border-border bg-secondary/30 hover:border-primary/50 transition-all duration-200 mb-2"
                    onClick={() => {
                      setSelectedPhoto(photo)
                      setShowComparison(true)
                    }}
                  >
                    <img
                      src={photo.afterUrl}
                      alt={`${photo.service} - After`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <ArrowsLeftRight size={24} className="text-white" weight="bold" />
                      </motion.div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePhoto(photo.id)
                      }}
                    >
                      <Trash size={12} weight="bold" />
                    </Button>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">{photo.service}</p>
                    <p className="text-[10px] text-muted-foreground">{photo.date}</p>
                    <p className="text-[10px] text-muted-foreground">{photo.groomer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        setUploadDialogOpen(open)
        if (!open) resetUploadForm()
      }}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className={`${isMobile ? "text-base" : "text-lg"} font-bold flex items-center gap-2`}>
              <Upload size={20} className="text-primary" weight="fill" />
              Upload Before & After Photos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="before-photo" className="text-sm font-semibold">Before Photo</Label>
                <div 
                  className="relative aspect-square rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 overflow-hidden bg-secondary/30 cursor-pointer group"
                  onClick={() => beforeInputRef.current?.click()}
                >
                  {beforePreview ? (
                    <>
                      <img src={beforePreview} alt="Before preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            setBeforePreview("")
                            if (beforeInputRef.current) beforeInputRef.current.value = ""
                          }}
                        >
                          <X size={14} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <Upload size={isMobile ? 24 : 32} weight="fill" className="mb-2" />
                      <p className="text-xs font-medium">Click to upload</p>
                    </div>
                  )}
                </div>
                <Input
                  ref={beforeInputRef}
                  id="before-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'before')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="after-photo" className="text-sm font-semibold">After Photo</Label>
                <div 
                  className="relative aspect-square rounded-md border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 overflow-hidden bg-secondary/30 cursor-pointer group"
                  onClick={() => afterInputRef.current?.click()}
                >
                  {afterPreview ? (
                    <>
                      <img src={afterPreview} alt="After preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAfterPreview("")
                            if (afterInputRef.current) afterInputRef.current.value = ""
                          }}
                        >
                          <X size={14} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <Upload size={isMobile ? 24 : 32} weight="fill" className="mb-2" />
                      <p className="text-xs font-medium">Click to upload</p>
                    </div>
                  )}
                </div>
                <Input
                  ref={afterInputRef}
                  id="after-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'after')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm font-semibold">Service</Label>
              <Input
                id="service"
                placeholder="e.g., Full Groom Package"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-secondary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groomer" className="text-sm font-semibold">Groomer</Label>
              <Input
                id="groomer"
                placeholder="e.g., Sarah J."
                value={groomer}
                onChange={(e) => setGroomer(e.target.value)}
                className="bg-secondary/30"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={() => setUploadDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={handleUpload}
            >
              <Upload size={16} className="mr-2" />
              Upload Photos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedPhoto && (
              <motion.div
                key={showComparison ? "comparison" : "individual"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader className="p-3 sm:p-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <DialogTitle className={`${isMobile ? "text-base" : "text-lg"} font-bold truncate`}>{selectedPhoto.service}</DialogTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {selectedPhoto.date} • {selectedPhoto.groomer}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant={showComparison ? "default" : "secondary"}
                        onClick={() => setShowComparison(!showComparison)}
                        className="font-semibold text-xs flex-1 sm:flex-none"
                      >
                        <ArrowsLeftRight size={14} className="mr-1" />
                        {showComparison ? "Split" : "Compare"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                        className="font-semibold text-xs flex-1 sm:flex-none"
                      >
                        <Trash size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-3 sm:p-4">
                  {showComparison ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <img
                            src={selectedPhoto.beforeUrl}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                            <Badge className="bg-black/70 text-white border-white/20 text-xs">Before</Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <img
                            src={selectedPhoto.afterUrl}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <Badge className="bg-primary text-primary-foreground text-xs">After</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border-2 border-primary rounded-full p-1.5 sm:p-2 shadow-lg">
                        <ArrowsLeftRight size={isMobile ? 16 : 20} className="text-primary" weight="bold" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                        <img
                          src={selectedPhoto.beforeUrl}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                          <Badge className="bg-black/70 text-white border-white/20 text-xs">Before</Badge>
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                        <img
                          src={selectedPhoto.afterUrl}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                          <Badge className="bg-primary text-primary-foreground text-xs">After</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}
