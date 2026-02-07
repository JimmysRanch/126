import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { Appointment, Transaction, TransactionItem, InventoryItem, InventoryLedgerEntry } from "@/lib/types"
import { MagnifyingGlass, ShoppingCart, Trash, Plus, Minus, Receipt, CurrencyDollar, PawPrint, CreditCard } from "@phosphor-icons/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { getTodayInBusinessTimezone, getNowInBusinessTimezone } from "@/lib/date-utils"
import { useStripeContext, StripeElementsWrapper } from "@/lib/stripe-context"
import { StripePaymentForm, StripePaymentPlaceholder, StripePaymentResult } from "@/components/StripePaymentForm"

export function POS() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useKV<Appointment[]>("appointments", [])
  const [inventory, setInventory] = useKV<InventoryItem[]>("inventory", [])
  const [transactions, setTransactions] = useKV<Transaction[]>("transactions", [])
  const [inventoryLedger, setInventoryLedger] = useKV<InventoryLedgerEntry[]>("inventory-ledger", [])
  const [paymentMethods] = useKV<Array<{ id: string; name: string; enabled: boolean }>>("payment-methods", [
    { id: "cash", name: "Cash", enabled: true },
    { id: "credit", name: "Credit Card", enabled: true },
    { id: "debit", name: "Debit Card", enabled: true },
    { id: "check", name: "Check", enabled: true }
  ])
  
  const { isStripeReady, stripePromise } = useStripeContext()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cartItems, setCartItems] = useState<TransactionItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [discountDescription, setDiscountDescription] = useState("")
  const [additionalFees, setAdditionalFees] = useState(0)
  const [additionalFeesDescription, setAdditionalFeesDescription] = useState("")
  const [tipAmount, setTipAmount] = useState(0)
  const [tipPaymentMethod, setTipPaymentMethod] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [stripePaymentDialogOpen, setStripePaymentDialogOpen] = useState(false)
  const isMobile = useIsMobile()
  
  // Build payment methods list including Stripe if configured
  const enabledPaymentMethods = [
    ...(paymentMethods || []).filter(pm => pm.enabled),
    ...(isStripeReady ? [{ id: "stripe", name: "Pay with Stripe", enabled: true }] : [])
  ]
  const tipPaymentLabel = tipPaymentMethod === "cash" ? "Cash" : tipPaymentMethod === "card" ? "Card" : ""

  const todayAppointments = (appointments || []).filter(apt => {
    const today = getTodayInBusinessTimezone()
    return apt.date === today && apt.status === 'completed'
  })

  const retailProducts = (inventory || []).filter(item => item.category === 'retail')

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    const appointmentItems: TransactionItem[] = appointment.services.map(service => ({
      id: service.serviceId,
      name: service.serviceName,
      type: 'service',
      quantity: 1,
      price: service.price,
      total: service.price
    }))
    setCartItems(appointmentItems)
  }

  const handleAddProduct = (product: InventoryItem) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.type === 'product')
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id && item.type === 'product'
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        type: 'product',
        quantity: 1,
        price: product.price,
        total: product.price
      }])
    }
    toast.success(`Added ${product.name} to cart`)
  }

  const handleUpdateQuantity = (itemId: string, itemType: 'service' | 'product', delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId && item.type === itemType) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity, total: newQuantity * item.price }
      }
      return item
    }))
  }

  const handleRemoveItem = (itemId: string, itemType: 'service' | 'product') => {
    setCartItems(cartItems.filter(item => !(item.id === itemId && item.type === itemType)))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal - discount + additionalFees + tipAmount
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty")
      return
    }
    
    if (!paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    if (tipAmount > 0 && !tipPaymentMethod) {
      toast.error("Please select a tip payment method")
      return
    }

    // If Stripe is selected, show the Stripe payment dialog
    if (paymentMethod === "stripe") {
      setCheckoutDialogOpen(false)
      setStripePaymentDialogOpen(true)
      return
    }

    // Complete the transaction for non-Stripe payments
    completeTransaction()
  }

  const handleStripePaymentSuccess = (paymentResult: StripePaymentResult) => {
    completeTransaction({
      stripePaymentIntentId: paymentResult.paymentIntentId,
      cardBrand: paymentResult.cardBrand,
      cardLast4: paymentResult.cardLast4,
    })
    setStripePaymentDialogOpen(false)
  }

  const completeTransaction = (stripeDetails?: {
    stripePaymentIntentId?: string
    cardBrand?: string
    cardLast4?: string
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      appointmentId: selectedAppointment?.id,
      date: getNowInBusinessTimezone(),
      clientId: selectedAppointment?.clientId || "",
      clientName: selectedAppointment?.clientName || "Walk-in",
      items: cartItems,
      subtotal: calculateSubtotal(),
      discount,
      discountDescription,
      additionalFees,
      additionalFeesDescription,
      total: calculateTotal(),
      tipAmount,
      tipPaymentMethod: tipAmount > 0 ? (tipPaymentMethod as "cash" | "card") : undefined,
      paymentMethod,
      status: 'completed',
      type: selectedAppointment ? 'appointment' : 'retail',
      // Add Stripe details if present
      stripePaymentIntentId: stripeDetails?.stripePaymentIntentId,
      cardBrand: stripeDetails?.cardBrand,
      cardLast4: stripeDetails?.cardLast4,
    }

    setTransactions((current) => [...(current || []), newTransaction])

    if (selectedAppointment) {
      setAppointments((current) =>
        (current || []).map((apt) =>
          apt.id === selectedAppointment.id
            ? {
                ...apt,
                tipAmount,
                tipPaymentMethod: tipAmount > 0 ? (tipPaymentMethod as "cash" | "card") : undefined
              }
            : apt
        )
      )
    }
    
    cartItems.filter(item => item.type === 'product').forEach(item => {
      const product = (inventory || []).find(p => p.id === item.id)
      if (product) {
        const newQuantity = product.quantity - item.quantity
        
        const ledgerEntry: InventoryLedgerEntry = {
          id: `${Date.now()}-${item.id}`,
          timestamp: new Date().toISOString(),
          itemId: product.id,
          itemName: product.name,
          change: -item.quantity,
          reason: 'Sale',
          reference: `Invoice #${newTransaction.id.slice(-6)}`,
          user: 'System',
          resultingQuantity: newQuantity
        }

        setInventoryLedger((current) => [ledgerEntry, ...(current || [])])
        
        setInventory((current) => 
          (current || []).map(p => 
            p.id === item.id 
              ? { ...p, quantity: newQuantity }
              : p
          )
        )
      }
    })

    toast.success("Transaction completed!")
    setCheckoutDialogOpen(false)
    resetCart()
    navigate(`/receipts/${newTransaction.id}`)
  }

  const resetCart = () => {
    setSelectedAppointment(null)
    setCartItems([])
    setDiscount(0)
    setDiscountDescription("")
    setAdditionalFees(0)
    setAdditionalFeesDescription("")
    setTipAmount(0)
    setTipPaymentMethod("")
    setPaymentMethod("")
  }

  const filteredProducts = retailProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3">Today's Completed Appointments</h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
              {todayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed appointments today</p>
              ) : (
                todayAppointments.map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => handleSelectAppointment(apt)}
                    className={`w-full text-left p-3 border rounded-lg transition-colors ${
                      selectedAppointment?.id === apt.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <PawPrint size={12} weight="fill" className="text-primary shrink-0" />
                          <span>{apt.petName} - {apt.clientName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{apt.startTime}</div>
                      </div>
                      <div className="text-lg font-bold text-primary">${apt.totalPrice.toFixed(2)}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Retail Products</h2>
              <div className="relative w-64">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product)}
                    className="p-3 border border-border rounded-lg hover:border-primary transition-colors text-left"
                    disabled={product.quantity === 0}
                  >
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">Stock: {product.quantity}</div>
                    <div className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={20} className="text-primary" />
              <h2 className="text-lg font-semibold">Cart</h2>
              {cartItems.length > 0 && (
                <Badge variant="secondary">{cartItems.length}</Badge>
              )}
            </div>

            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto scrollbar-thin">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Cart is empty</p>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={`${item.id}-${item.type}-${idx}`} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <Badge variant="secondary" className="text-xs mt-1">{item.type}</Badge>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.type)}
                        className="text-destructive hover:opacity-80"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.type, -1)}
                          className="w-6 h-6 rounded border border-border hover:border-primary flex items-center justify-center"
                          disabled={item.quantity === 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.type, 1)}
                          className="w-6 h-6 rounded border border-border hover:border-primary flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="font-semibold">${item.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              
              {discount > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="discount-desc">Discount Description</Label>
                  <Input
                    id="discount-desc"
                    value={discountDescription}
                    onChange={(e) => setDiscountDescription(e.target.value)}
                    placeholder="e.g., Senior discount, Loyalty reward"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fees">Additional Fees ($)</Label>
                <Input
                  id="fees"
                  type="number"
                  min="0"
                  step="0.01"
                  value={additionalFees}
                  onChange={(e) => setAdditionalFees(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              
              {additionalFees > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="fees-desc">Fee Description</Label>
                  <Input
                    id="fees-desc"
                    value={additionalFeesDescription}
                    onChange={(e) => setAdditionalFeesDescription(e.target.value)}
                    placeholder="e.g., Rush service, Special handling"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tip">Tip Amount ($)</Label>
                <Input
                  id="tip"
                  type="number"
                  min="0"
                  step="0.01"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              {tipAmount > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="tip-method">Tip Payment Method</Label>
                  <Select value={tipPaymentMethod} onValueChange={setTipPaymentMethod}>
                    <SelectTrigger id="tip-method">
                      <SelectValue placeholder="Select tip payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledPaymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <span className="flex items-center gap-2">
                          {method.id === "stripe" && <CreditCard size={16} className="text-primary" />}
                          {method.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isStripeReady && paymentMethod === "stripe" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard size={12} />
                    Secure card payment powered by Stripe
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount {discountDescription && `(${discountDescription})`}
                  </span>
                  <span className="font-medium text-green-500">-${discount.toFixed(2)}</span>
                </div>
              )}
              {additionalFees > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Additional Fees {additionalFeesDescription && `(${additionalFeesDescription})`}
                  </span>
                  <span className="font-medium">+${additionalFees.toFixed(2)}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tip {tipPaymentLabel && `(${tipPaymentLabel})`}
                  </span>
                  <span className="font-medium">+${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary text-2xl">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => setCheckoutDialogOpen(true)}
              disabled={cartItems.length === 0}
              className="w-full mt-4"
              size="lg"
            >
              <Receipt className="mr-2" />
              Checkout
            </Button>

            {cartItems.length > 0 && (
              <Button
                onClick={resetCart}
                variant="outline"
                className="w-full mt-2"
              >
                Clear Cart
              </Button>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt size={24} className="text-primary" />
              Confirm Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAppointment && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Client</div>
                <div className="font-medium">{selectedAppointment.clientName}</div>
                <div className="text-sm flex items-center gap-2">
                  <PawPrint size={12} weight="fill" className="text-primary shrink-0" />
                  <span>{selectedAppointment.petName}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-medium">${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-green-500">
                  <span>
                    Discount {discountDescription && `(${discountDescription})`}
                  </span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {additionalFees > 0 && (
                <div className="flex items-center justify-between">
                  <span>
                    Additional Fees {additionalFeesDescription && `(${additionalFeesDescription})`}
                  </span>
                  <span>+${additionalFees.toFixed(2)}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span>
                    Tip {tipPaymentLabel && `(${tipPaymentLabel})`}
                  </span>
                  <span>+${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Payment Method</span>
                <span className="capitalize">
                  {enabledPaymentMethods.find(pm => pm.id === paymentMethod)?.name || paymentMethod}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckout}>
              {paymentMethod === "stripe" ? (
                <>
                  <CreditCard className="mr-2" />
                  Pay with Card
                </>
              ) : (
                <>
                  <CurrencyDollar className="mr-2" />
                  Complete Transaction
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stripe Payment Dialog */}
      <Dialog open={stripePaymentDialogOpen} onOpenChange={setStripePaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard size={24} className="text-primary" />
              Card Payment
            </DialogTitle>
          </DialogHeader>
          
          {isStripeReady && stripePromise ? (
            <StripeElementsWrapper>
              <StripePaymentForm
                amount={calculateTotal()}
                clientName={selectedAppointment?.clientName}
                onSuccess={handleStripePaymentSuccess}
                onCancel={() => {
                  setStripePaymentDialogOpen(false)
                  setCheckoutDialogOpen(true)
                }}
              />
            </StripeElementsWrapper>
          ) : (
            <StripePaymentPlaceholder
              onCancel={() => {
                setStripePaymentDialogOpen(false)
                setCheckoutDialogOpen(true)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
