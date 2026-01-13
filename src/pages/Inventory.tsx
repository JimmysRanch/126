import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { InventoryItem } from "@/lib/types"
import { Plus, Minus, MagnifyingGlass, PencilSimple, Trash, Package, Warning } from "@phosphor-icons/react"
import { useIsMobile } from "@/hooks/use-mobile"

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: "1",
    name: "Premium Dog Shampoo",
    category: "supply",
    sku: "SUP-001",
    quantity: 45,
    price: 0,
    cost: 12.50,
    reorderLevel: 10,
    supplier: "Pet Supply Co",
    description: "Hypoallergenic shampoo for sensitive skin"
  },
  {
    id: "2",
    name: "Luxury Pet Cologne",
    category: "retail",
    sku: "RET-001",
    quantity: 28,
    price: 24.99,
    cost: 10.00,
    reorderLevel: 5,
    supplier: "Luxury Pet Products",
    description: "Long-lasting pet fragrance"
  },
  {
    id: "3",
    name: "Microfiber Towels",
    category: "supply",
    sku: "SUP-002",
    quantity: 120,
    price: 0,
    cost: 3.50,
    reorderLevel: 20,
    supplier: "Grooming Supplies Inc",
    description: "Quick-dry towels for bathing"
  },
  {
    id: "4",
    name: "Dog Treats - Gourmet Mix",
    category: "retail",
    sku: "RET-002",
    quantity: 65,
    price: 12.99,
    cost: 5.00,
    reorderLevel: 15,
    supplier: "Treat Factory",
    description: "Assorted premium dog treats"
  },
  {
    id: "5",
    name: "Nail Clippers - Professional",
    category: "supply",
    sku: "SUP-003",
    quantity: 8,
    price: 0,
    cost: 18.00,
    reorderLevel: 3,
    supplier: "Professional Grooming Tools",
    description: "Heavy-duty nail clippers"
  },
  {
    id: "6",
    name: "Pet Bow Ties (Assorted)",
    category: "retail",
    sku: "RET-003",
    quantity: 42,
    price: 8.99,
    cost: 3.50,
    reorderLevel: 10,
    supplier: "Pet Fashion Co",
    description: "Fashionable bow ties in various colors"
  }
]

export function Inventory() {
  const [inventory, setInventory] = useKV<InventoryItem[]>("inventory", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<"all" | "retail" | "supply">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    name: "",
    category: "retail" as "retail" | "supply",
    sku: "",
    quantity: "",
    price: "",
    cost: "",
    reorderLevel: "",
    supplier: "",
    description: ""
  })

  // Initialize inventory with default items if empty (Critical Issue #1 from AUDIT_REPORT.md)
  // setInventory is stable from useKV hook, safe to omit from dependencies
  useEffect(() => {
    if (!inventory || inventory.length === 0) {
      setInventory(DEFAULT_INVENTORY)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredInventory = (inventory || []).filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = activeCategory === "all" || item.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const lowStockItems = (inventory || []).filter(item => item.quantity <= item.reorderLevel)
  const retailItems = (inventory || []).filter(item => item.category === 'retail')
  const supplyItems = (inventory || []).filter(item => item.category === 'supply')

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        category: item.category,
        sku: item.sku,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        cost: item.cost.toString(),
        reorderLevel: item.reorderLevel.toString(),
        supplier: item.supplier || "",
        description: item.description || ""
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        category: "retail",
        sku: "",
        quantity: "",
        price: "",
        cost: "",
        reorderLevel: "",
        supplier: "",
        description: ""
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.sku || !formData.quantity || !formData.cost) {
      toast.error("Please fill in all required fields")
      return
    }

    const itemData: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      sku: formData.sku,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost),
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      supplier: formData.supplier,
      description: formData.description
    }

    if (editingItem) {
      setInventory((current) => 
        (current || []).map(item => item.id === editingItem.id ? itemData : item)
      )
      toast.success("Item updated successfully")
    } else {
      setInventory((current) => [...(current || []), itemData])
      toast.success("Item added successfully")
    }

    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setInventory((current) => (current || []).filter(item => item.id !== id))
    toast.success("Item deleted")
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setInventory((current) =>
      (current || []).map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Items</div>
              <div className="text-2xl font-bold mt-1">{(inventory || []).length}</div>
            </div>
            <Package size={32} className="text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Retail Products</div>
              <div className="text-2xl font-bold mt-1">{retailItems.length}</div>
            </div>
            <Package size={32} className="text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Low Stock</div>
              <div className="text-2xl font-bold mt-1 text-destructive">{lowStockItems.length}</div>
            </div>
            <Warning size={32} className="text-destructive opacity-50" />
          </div>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="p-4 mb-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3">
            <Warning size={24} className="text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-2">Low Stock Alert</h3>
              <div className="space-y-1">
                {lowStockItems.map(item => (
                  <div key={item.id} className="text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground"> - {item.quantity} remaining (reorder at {item.reorderLevel})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name, SKU, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="retail">Retail</TabsTrigger>
              <TabsTrigger value="supply">Supply</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Item</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">SKU</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Cost</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Package size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No items found</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-sm">{item.sku}</td>
                    <td className="p-3">
                      <Badge variant={item.category === 'retail' ? 'default' : 'secondary'}>
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-border hover:border-primary flex items-center justify-center"
                        >
                          <Minus size={12} />
                        </button>
                        <span className={`font-medium min-w-[40px] text-center ${
                          item.quantity <= item.reorderLevel ? 'text-destructive' : ''
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border border-border hover:border-primary flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-right text-sm">${item.cost.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium">
                      {item.category === 'retail' ? `$${item.price.toFixed(2)}` : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(item)}
                          className="text-primary hover:opacity-80"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:opacity-80"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Premium Dog Shampoo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SUP-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v: any) => setFormData({ ...formData, category: v })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail (For Sale)</SelectItem>
                  <SelectItem value="supply">Supply (For Use)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost (per unit) *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Retail Price {formData.category === 'supply' && '(optional)'}
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder">Reorder Level</Label>
              <Input
                id="reorder"
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Pet Supply Co"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Item description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
