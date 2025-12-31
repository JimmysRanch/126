import { useState } from "react"
import { Images, Plus, X, ArrowsLeftRight, PawPrint } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

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
  photos: Photo[]
}

export function PhotoGalleryCard({ petName, photos }: PhotoGalleryCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  return (
    <>
      <Card className="p-3 border-border bg-card">
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
          >
            <Plus size={14} className="mr-1" />
            Add Photos
          </Button>
        </div>

        {photos.length === 0 ? (
          <div className="bg-secondary/30 rounded-md p-8 border border-dashed border-border text-center">
            <Images size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No grooming photos yet</p>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs"
            >
              <Plus size={14} className="mr-1" />
              Upload First Photos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group cursor-pointer"
                onClick={() => {
                  setSelectedPhoto(photo)
                  setShowComparison(false)
                }}
              >
                <div className="relative aspect-square rounded-md overflow-hidden border border-border bg-secondary/30 hover:border-primary/50 transition-all duration-200">
                  <div className="absolute inset-0 grid grid-cols-2 gap-px bg-border">
                    <div className="relative overflow-hidden bg-background">
                      <img
                        src={photo.beforeUrl}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                        <p className="text-[10px] text-white font-semibold uppercase tracking-wide">Before</p>
                      </div>
                    </div>
                    <div className="relative overflow-hidden bg-background">
                      <img
                        src={photo.afterUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                        <p className="text-[10px] text-white font-semibold uppercase tracking-wide">After</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ArrowsLeftRight size={24} className="text-white" weight="bold" />
                    </motion.div>
                  </div>
                </div>
                
                <div className="mt-1">
                  <p className="text-xs font-semibold">{photo.service}</p>
                  <p className="text-[10px] text-muted-foreground">{photo.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

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
                <DialogHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-lg font-bold">{selectedPhoto.service}</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedPhoto.date} • {selectedPhoto.groomer}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={showComparison ? "default" : "secondary"}
                        onClick={() => setShowComparison(!showComparison)}
                        className="font-semibold text-xs"
                      >
                        <ArrowsLeftRight size={14} className="mr-1" />
                        {showComparison ? "Split View" : "Compare"}
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-4">
                  {showComparison ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <img
                            src={selectedPhoto.beforeUrl}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-black/70 text-white border-white/20">Before</Badge>
                          </div>
                        </div>
                        <div className="relative">
                          <img
                            src={selectedPhoto.afterUrl}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-primary text-primary-foreground">After</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border-2 border-primary rounded-full p-2 shadow-lg">
                        <ArrowsLeftRight size={20} className="text-primary" weight="bold" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                        <img
                          src={selectedPhoto.beforeUrl}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/70 text-white border-white/20">Before</Badge>
                        </div>
                      </div>
                      <div className="relative aspect-video rounded-md overflow-hidden bg-secondary/30">
                        <img
                          src={selectedPhoto.afterUrl}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-primary-foreground">After</Badge>
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
