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
import { InventoryItem, InventoryValueSnapshot, ReceiveHistoryEntry, InventoryLedgerEntry } from "@/lib/types"
import { ExpenseRecord } from "@/lib/finance-types"
import { Plus, MagnifyingGlass, PencilSimple, Trash, Package, Warning, TrendUp, ChartLine, CurrencyDollar, DownloadSimple, ClockCounterClockwise, Tag } from "@phosphor-icons/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

export function Inventory() {
  const navigate = useNavigate()
  const [inventory, setInventory] = useKV<InventoryItem[]>("inventory", [])
  const [valueHistory, setValueHistory] = useKV<InventoryValueSnapshot[]>("inventory-value-history", [])
  const [receiveHistory, setReceiveHistory] = useKV<ReceiveHistoryEntry[]>("inventory-receive-history", [])
  const [, setInventoryLedger] = useKV<InventoryLedgerEntry[]>("inventory-ledger", [])
  const [, setExpenses] = useKV<ExpenseRecord[]>("expenses", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<"all" | "retail" | "supply">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [retailPricingDialogOpen, setRetailPricingDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [receivingItem, setReceivingItem] = useState<InventoryItem | null>(null)
  const [pricingItem, setPricingItem] = useState<InventoryItem | null>(null)
  const [activeTab, setActiveTab] = useState<"inventory" | "reports">("inventory")
  const isMobile = useIsMobile()

  const [formData, setFormData] = useState({
    name: "",
    category: "retail" as "retail" | "supply",
    description: ""
  })

  const [receiveFormData, setReceiveFormData] = useState({
    qty: "",
    totalCost: "",
    costPerUnit: "",
    action: "" as "" | "receive" | "ordered"
  })

  const [retailPricingFormData, setRetailPricingFormData] = useState({
    retailPrice: "",
    commissionType: "" as "" | "fixed" | "percentage",
    commissionAmount: ""
  })

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
        description: item.description || ""
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        category: "retail",
        description: ""
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields")
      return
    }

    const itemData: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      sku: editingItem?.sku || "",
      quantity: editingItem?.quantity || 0,
      price: editingItem?.price || 0,
      cost: editingItem?.cost || 0,
      reorderLevel: editingItem?.reorderLevel || 0,
      supplier: editingItem?.supplier,
      description: formData.description,
      staffCompensationType: editingItem?.staffCompensationType,
      staffCompensationValue: editingItem?.staffCompensationValue
    }

    if (editingItem) {
      setInventory((current) => 
        (current || []).map(item => item.id === editingItem.id ? itemData : item)
      )
      toast.success("Item updated successfully")
      setDialogOpen(false)
    } else {
      setInventory((current) => [...(current || []), itemData])
      toast.success("Item added successfully")
      setDialogOpen(false)
      
      handleOpenReceiveDialog(itemData)
    }
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

  const handleOpenReceiveDialog = (item: InventoryItem) => {
    setReceivingItem(item)
    setReceiveFormData({
      qty: "",
      totalCost: "",
      costPerUnit: "",
      action: ""
    })
    setReceiveDialogOpen(true)
  }

  const handleReceiveFormChange = (field: 'qty' | 'totalCost' | 'costPerUnit', value: string) => {
    const numValue = value === "" ? "" : value
    const newFormData = { ...receiveFormData, [field]: numValue }

    if (numValue === "") {
      setReceiveFormData(newFormData)
      return
    }

    const qty = field === 'qty' ? parseFloat(numValue) : parseFloat(newFormData.qty)
    const totalCost = field === 'totalCost' ? parseFloat(numValue) : parseFloat(newFormData.totalCost)
    const costPerUnit = field === 'costPerUnit' ? parseFloat(numValue) : parseFloat(newFormData.costPerUnit)

    if (field === 'qty' && !isNaN(qty) && !isNaN(totalCost)) {
      newFormData.costPerUnit = (totalCost / qty).toFixed(2)
    } else if (field === 'qty' && !isNaN(qty) && !isNaN(costPerUnit)) {
      newFormData.totalCost = (qty * costPerUnit).toFixed(2)
    } else if (field === 'totalCost' && !isNaN(totalCost) && !isNaN(qty)) {
      newFormData.costPerUnit = (totalCost / qty).toFixed(2)
    } else if (field === 'totalCost' && !isNaN(totalCost) && !isNaN(costPerUnit)) {
      newFormData.qty = (totalCost / costPerUnit).toFixed(0)
    } else if (field === 'costPerUnit' && !isNaN(costPerUnit) && !isNaN(qty)) {
      newFormData.totalCost = (qty * costPerUnit).toFixed(2)
    } else if (field === 'costPerUnit' && !isNaN(costPerUnit) && !isNaN(totalCost)) {
      newFormData.qty = (totalCost / costPerUnit).toFixed(0)
    }

    setReceiveFormData(newFormData)
  }

  const handleReceiveSubmit = () => {
    if (!receiveFormData.qty || !receiveFormData.totalCost || !receiveFormData.costPerUnit || !receiveFormData.action || !receivingItem) {
      toast.error("Please fill in all fields")
      return
    }

    const qty = parseInt(receiveFormData.qty)
    const costPerUnit = parseFloat(receiveFormData.costPerUnit)
    const totalCost = parseFloat(receiveFormData.totalCost)

    const historyEntry: ReceiveHistoryEntry = {
      id: Date.now().toString(),
      itemId: receivingItem.id,
      itemName: receivingItem.name,
      timestamp: new Date().toISOString(),
      quantity: qty,
      totalCost: totalCost,
      costPerUnit: costPerUnit,
      action: receiveFormData.action
    }

    setReceiveHistory((current) => [historyEntry, ...(current || [])])

    let updatedItem: InventoryItem | null = null

    if (receiveFormData.action === 'receive') {
      const newQuantity = receivingItem.quantity + qty
      const today = new Date().toISOString().split('T')[0]
      
      // Create ledger entry for receiving inventory
      const ledgerEntry: InventoryLedgerEntry = {
        id: `${Date.now()}-${receivingItem.id}`,
        timestamp: new Date().toISOString(),
        itemId: receivingItem.id,
        itemName: receivingItem.name,
        change: qty,
        reason: 'Received',
        reference: `Received shipment`,
        user: 'System',
        resultingQuantity: newQuantity
      }
      
      setInventoryLedger((current) => [ledgerEntry, ...(current || [])])
      
      // Create expense entry for the inventory purchase
      const expenseEntry: ExpenseRecord = {
        id: `inv-${Date.now()}-${receivingItem.id}`,
        category: 'supplies',
        vendor: receivingItem.supplier || 'Inventory Purchase',
        date: today,
        status: 'Paid',
        amount: totalCost,
        description: `Received ${qty} units of ${receivingItem.name} @ $${costPerUnit.toFixed(2)} each`
      }
      
      setExpenses((current) => [...(current || []), expenseEntry])
      
      setInventory((current) => 
        (current || []).map(item => {
          if (item.id === receivingItem.id) {
            updatedItem = { ...item, quantity: newQuantity, cost: costPerUnit }
            return updatedItem
          }
          return item
        })
      )
      toast.success(`Received ${qty} units of ${receivingItem.name}`)
    } else if (receiveFormData.action === 'ordered') {
      toast.success(`Marked ${qty} units of ${receivingItem.name} as ordered`)
    }

    setReceiveDialogOpen(false)
    setReceivingItem(null)

    if (receivingItem.category === 'retail' && updatedItem) {
      handleOpenRetailPricingDialog(updatedItem)
    }
  }

  const handleOpenRetailPricingDialog = (item: InventoryItem) => {
    setPricingItem(item)
    setRetailPricingFormData({
      retailPrice: item.price ? item.price.toString() : "",
      commissionType: item.staffCompensationType || "",
      commissionAmount: item.staffCompensationValue ? item.staffCompensationValue.toString() : ""
    })
    setRetailPricingDialogOpen(true)
  }

  const handleRetailPricingSubmit = () => {
    if (!retailPricingFormData.retailPrice || !retailPricingFormData.commissionType || !retailPricingFormData.commissionAmount || !pricingItem) {
      toast.error("Please fill in all fields")
      return
    }

    const retailPrice = parseFloat(retailPricingFormData.retailPrice)
    const commissionAmount = parseFloat(retailPricingFormData.commissionAmount)

    setInventory((current) =>
      (current || []).map(item =>
        item.id === pricingItem.id
          ? {
              ...item,
              price: retailPrice,
              staffCompensationType: retailPricingFormData.commissionType,
              staffCompensationValue: commissionAmount
            }
          : item
      )
    )

    toast.success("Retail pricing updated successfully")
    setRetailPricingDialogOpen(false)
    setPricingItem(null)
  }

  const renderInventoryTable = (items: InventoryItem[], categoryLabel: string) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Item</th>
            <th className="text-right p-3 text-sm font-medium text-muted-foreground">In Stock</th>
            <th className="text-right p-3 text-sm font-medium text-muted-foreground">Cost</th>
            {categoryLabel === 'Retail' && (
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Price</th>
            )}
            {categoryLabel === 'Retail' && (
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">Commission</th>
            )}
            <th className="text-center p-3 text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={categoryLabel === 'Retail' ? 6 : 4} className="text-center py-12 text-muted-foreground">
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
                {categoryLabel === 'Retail' && (
                  <td className="p-3 text-right text-sm">
                    {item.staffCompensationType && item.staffCompensationValue !== undefined ? (
                      item.staffCompensationType === 'fixed' 
                        ? `$${item.staffCompensationValue.toFixed(2)}`
                        : `${item.staffCompensationValue}%`
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                )}
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenDialog(item)}
                      className="text-primary hover:opacity-80"
                    >
                      <PencilSimple size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenReceiveDialog(item)}
                      className="text-primary hover:opacity-80"
                    >
                      <DownloadSimple size={18} />
                    </button>
                    {categoryLabel === 'Retail' && (
                      <button
                        onClick={() => handleOpenRetailPricingDialog(item)}
                        className="text-primary hover:opacity-80"
                      >
                        <Tag size={18} />
                      </button>
                    )}
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
                placeholder="Search by name or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => navigate('/inventory/history')} variant="outline" className="w-full sm:w-auto">
              <ClockCounterClockwise className="mr-2" />
              History
            </Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
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
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v: any) => setFormData({ ...formData, category: v })}
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

      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Item</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty">QTY</Label>
                <Input
                  id="qty"
                  type="number"
                  value={receiveFormData.qty}
                  onChange={(e) => handleReceiveFormChange('qty', e.target.value)}
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCost">Total Cost (incl. shipping)</Label>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  value={receiveFormData.totalCost}
                  onChange={(e) => handleReceiveFormChange('totalCost', e.target.value)}
                  placeholder="10.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost Per Unit (my cost)</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  value={receiveFormData.costPerUnit}
                  onChange={(e) => handleReceiveFormChange('costPerUnit', e.target.value)}
                  placeholder="2"
                />
              </div>

              <div className="space-y-2">
                <Label>Choose One</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setReceiveFormData({ ...receiveFormData, action: 'receive' })}
                    variant={receiveFormData.action === 'receive' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Receive
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setReceiveFormData({ ...receiveFormData, action: 'ordered' })}
                    variant={receiveFormData.action === 'ordered' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    Ordered
                  </Button>
                </div>
              </div>
            </div>

            {receiveFormData.qty && receiveFormData.action === 'receive' && receivingItem && (
              <p className="text-sm text-muted-foreground text-center">
                Received to total stock: <span className="font-bold text-foreground">{parseInt(receiveFormData.qty) + receivingItem.quantity}</span>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReceiveSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={retailPricingDialogOpen} onOpenChange={setRetailPricingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Retail Pricing</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="perItemCost">Per Item (my price)</Label>
              <Input
                id="perItemCost"
                type="text"
                value={pricingItem ? `$${pricingItem.cost.toFixed(2)}` : ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retailPrice">Retail Price *</Label>
              <Input
                id="retailPrice"
                type="number"
                step="0.01"
                value={retailPricingFormData.retailPrice}
                onChange={(e) => setRetailPricingFormData({ ...retailPricingFormData, retailPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Commission Type *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setRetailPricingFormData({ ...retailPricingFormData, commissionType: 'fixed' })}
                  variant={retailPricingFormData.commissionType === 'fixed' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Fixed
                </Button>
                <Button
                  type="button"
                  onClick={() => setRetailPricingFormData({ ...retailPricingFormData, commissionType: 'percentage' })}
                  variant={retailPricingFormData.commissionType === 'percentage' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  Percentage
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionAmount">Commission Amount *</Label>
              <div className="relative">
                <Input
                  id="commissionAmount"
                  type="number"
                  step={retailPricingFormData.commissionType === 'percentage' ? '1' : '0.01'}
                  value={retailPricingFormData.commissionAmount}
                  onChange={(e) => setRetailPricingFormData({ ...retailPricingFormData, commissionAmount: e.target.value })}
                  placeholder="0"
                  className={retailPricingFormData.commissionType === 'percentage' ? 'pr-8' : 'pl-8'}
                />
                {retailPricingFormData.commissionType === 'fixed' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                )}
                {retailPricingFormData.commissionType === 'percentage' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRetailPricingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRetailPricingSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
