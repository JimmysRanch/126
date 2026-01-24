import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { InventoryItem, InventoryValueSnapshot } from "@/lib/types"
import { Plus, MagnifyingGlass, PencilSimple, Trash, Package, Warning, TrendUp, ChartLine, CurrencyDollar } from "@phosphor-icons/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

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
  const [valueHistory, setValueHistory] = useKV<InventoryValueSnapshot[]>("inventory-value-history", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<"all" | "retail" | "supply">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [activeTab, setActiveTab] = useState<"inventory" | "reports">("inventory")
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
    description: "",
    staffCompensationType: "" as "" | "fixed" | "percentage",
    staffCompensationValue: ""
  })

  // Initialize inventory with default items if empty (Critical Issue #1 from AUDIT_REPORT.md)
  // setInventory is stable from useKV hook, safe to omit from dependencies
  useEffect(() => {
    if (!inventory || inventory.length === 0) {
      setInventory(DEFAULT_INVENTORY)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate and track inventory value snapshots
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      const retailItems = inventory.filter(item => item.category === 'retail')
      const supplyItems = inventory.filter(item => item.category === 'supply')
      
      const retailValue = retailItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
      const supplyValue = supplyItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
      const totalValue = retailValue + supplyValue
      const retailPotentialProfit = retailItems.reduce((sum, item) => sum + ((item.price - item.cost) * item.quantity), 0)

      const snapshot: InventoryValueSnapshot = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        totalValue,
        retailValue,
        supplyValue,
        retailPotentialProfit,
        itemCount: inventory.length,
        retailCount: retailItems.length,
        supplyCount: supplyItems.length
      }

      setValueHistory((current) => {
        const history = current || []
        const lastSnapshot = history[history.length - 1]
        
        // Only add if value changed or it's been more than 24 hours
        if (!lastSnapshot || 
            Math.abs(lastSnapshot.totalValue - totalValue) > 0.01 ||
            (new Date().getTime() - new Date(lastSnapshot.timestamp).getTime()) > 24 * 60 * 60 * 1000) {
          return [...history, snapshot].slice(-90) // Keep last 90 days
        }
        return history
      })
    }
  }, [inventory, setValueHistory])

  const currentValue = inventory ? {
    retail: inventory.filter(i => i.category === 'retail').reduce((sum, item) => sum + (item.cost * item.quantity), 0),
    supply: inventory.filter(i => i.category === 'supply').reduce((sum, item) => sum + (item.cost * item.quantity), 0),
    total: inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0),
    potentialProfit: inventory.filter(i => i.category === 'retail').reduce((sum, item) => sum + ((item.price - item.cost) * item.quantity), 0),
    potentialRevenue: inventory.filter(i => i.category === 'retail').reduce((sum, item) => sum + (item.price * item.quantity), 0)
  } : { retail: 0, supply: 0, total: 0, potentialProfit: 0, potentialRevenue: 0 }

  const filteredInventory = (inventory || []).filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = activeCategory === "all" || item.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const lowStockItems = (inventory || []).filter(item => item.quantity <= item.reorderLevel)
  const retailItems = filteredInventory.filter(item => item.category === 'retail')
  const supplyItems = filteredInventory.filter(item => item.category === 'supply')

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
        description: item.description || "",
        staffCompensationType: item.staffCompensationType || "",
        staffCompensationValue: item.staffCompensationValue?.toString() || ""
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
        description: "",
        staffCompensationType: "",
        staffCompensationValue: ""
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
      description: formData.description,
      staffCompensationType: formData.category === "retail" && formData.staffCompensationType ? formData.staffCompensationType : undefined,
      staffCompensationValue: formData.category === "retail" && formData.staffCompensationValue
        ? parseFloat(formData.staffCompensationValue)
        : undefined
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
    setDeleteDialogOpen(false)
    setDialogOpen(false)
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const renderInventoryTable = (items: InventoryItem[], categoryLabel: string) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Item</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">SKU</th>
            <th className="text-right p-3 text-sm font-medium text-muted-foreground">In Stock</th>
            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Cost</th>
            {categoryLabel === 'Retail' && (
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Price</th>
            )}
            <th className="text-center p-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={categoryLabel === 'Retail' ? 6 : 5} className="text-center py-12 text-muted-foreground">
                <Package size={48} className="mx-auto mb-3 opacity-50" />
                <p>No items found</p>
              </td>
            </tr>
          ) : (
            items.map(item => (
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
                <td className="p-3 text-right">
                  <span className={`font-medium ${
                    item.quantity <= item.reorderLevel ? 'text-destructive' : ''
                  }`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="p-3 text-right text-sm">${item.cost.toFixed(2)}</td>
                {categoryLabel === 'Retail' && (
                  <td className="p-3 text-right font-medium">
                    ${item.price.toFixed(2)}
                  </td>
                )}
                <td className="p-3">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleOpenDialog(item)}
                      className="text-primary hover:opacity-80"
                    >
                      <PencilSimple size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "inventory")} className="w-full">
        <TabsContent value="inventory" className="space-y-4">
          {lowStockItems.length > 0 && (
            <Card className="p-4 border-destructive/50 bg-destructive/5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="p-2 md:p-2.5 border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">TOTAL VALUE</p>
                  <p className="text-lg md:text-xl font-bold mt-0.5">${currentValue.total.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2 md:p-2.5 border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">RETAIL VALUE</p>
                  <p className="text-lg md:text-xl font-bold mt-0.5">${currentValue.retail.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2 md:p-2.5 border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">SUPPLY VALUE</p>
                  <p className="text-lg md:text-xl font-bold mt-0.5">${currentValue.supply.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-2 md:p-2.5 border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">POTENTIAL PROFIT</p>
                  <p className="text-lg md:text-xl font-bold mt-0.5">${currentValue.potentialProfit.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name, SKU, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto bg-primary text-primary-foreground">
              <Plus className="mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Retail Products</h3>
                  <p className="text-sm text-muted-foreground">Items for sale to customers</p>
                </div>
                <Package size={32} className="text-primary opacity-50" />
              </div>
              {renderInventoryTable(retailItems, 'Retail')}
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Supplies</h3>
                  <p className="text-sm text-muted-foreground">Items for business use</p>
                </div>
                <Package size={32} className="text-secondary opacity-50" />
              </div>
              {renderInventoryTable(supplyItems, 'Supply')}
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
              <Select
                value={formData.category}
                onValueChange={(v: "retail" | "supply") => setFormData({
                  ...formData,
                  category: v,
                  staffCompensationType: v === "retail" ? formData.staffCompensationType : "",
                  staffCompensationValue: v === "retail" ? formData.staffCompensationValue : ""
                })}
              >
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

            {formData.category === 'retail' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="staff-comp-type">Staff Compensation</Label>
                  <Select
                    value={formData.staffCompensationType}
                    onValueChange={(value) => setFormData({ ...formData, staffCompensationType: value as "fixed" | "percentage" | "" })}
                  >
                    <SelectTrigger id="staff-comp-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed amount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-comp-value">
                    Staff Compensation {formData.staffCompensationType === "percentage" ? "(%)" : "($)"}
                  </Label>
                  <Input
                    id="staff-comp-value"
                    type="number"
                    min="0"
                    step={formData.staffCompensationType === "percentage" ? "0.1" : "0.01"}
                    value={formData.staffCompensationValue}
                    onChange={(e) => setFormData({ ...formData, staffCompensationValue: e.target.value })}
                    placeholder={formData.staffCompensationType === "percentage" ? "10" : "5.00"}
                    disabled={!formData.staffCompensationType}
                  />
                </div>
              </>
            )}

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
            {editingItem && (
              <Button 
                variant="destructive" 
                onClick={handleOpenDeleteDialog}
                className="mr-auto"
              >
                <Trash className="mr-2" />
                Delete Item
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{editingItem?.name}" from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => editingItem && handleDelete(editingItem.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
