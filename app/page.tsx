"use client"

import { useState, useEffect } from "react"
import { Printer, Plus, Trash2 } from "lucide-react"

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  rate: number
  amount: number
}

interface ClientDetails {
  name: string
  address: string
  phone: string
  email: string
}

export default function InvoicePage() {
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")

  useEffect(() => {
    setInvoiceNumber(`INV-${Date.now()}`)
    setInvoiceDate(new Date().toISOString().split("T")[0])
  }, [])

  const [dueDate, setDueDate] = useState("")

  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: "",
    address: "",
    phone: "",
    email: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }])

  const [discountPercent, setDiscountPercent] = useState(0)
  const [notes, setNotes] = useState("")

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = (subtotal * discountPercent) / 100
  const total = subtotal - discountAmount

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .invoice-container {
            background: white !important;
            padding: 20px !important;
          }
          .invoice-card {
            box-shadow: none !important;
          }
          .invoice-header {
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-details, .client-details {
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          table {
            font-size: 12px;
          }
          .total-section {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      <div className="invoice-container min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 p-5">
        <div className="py-5 max-w-6xl mx-auto">
          <div className="invoice-card bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="invoice-header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
              <div className="text-4xl font-bold mb-2">KQ Construction Works</div>
              <p className="text-blue-100 text-lg">Professional Construction Services</p>
            </div>

            <div className="p-8">
              {/* Invoice Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">
                    Invoice Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="no-print">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                      </div>
                      <div className="print-only">
                        <strong>Invoice Number:</strong> {invoiceNumber}
                      </div>
                    </div>
                    <div>
                      <div className="no-print">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                          value={invoiceDate}
                          onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                      </div>
                      <div className="print-only">
                        <strong>Invoice Date:</strong> {invoiceDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-start">
                  <button
                    onClick={handlePrint}
                    className="no-print bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg flex items-center gap-2"
                  >
                    <Printer size={18} />
                    Print Invoice
                  </button>
                </div>
              </div>

              {/* Company and Client Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h5 className="text-lg font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">
                    From (Company Details)
                  </h5>
                  <div className="company-details bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
                    <div className="font-bold text-lg text-gray-800">KQ Construction Works</div>
                    <div className="text-gray-600 mt-2 leading-relaxed">
                      123 Construction Street,
                      <br />
                      Accra - Ghana.
                      <br />
                      Phone: +233 55 727 2031
                      <br />
                      Email: qkingsley436@gmail.com
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">
                    To (Client Details)
                  </h5>
                  <div className="client-details bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
                    <div className="no-print space-y-3">
                      <input
                        type="text"
                        placeholder="Client Name"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        value={clientDetails.name}
                        onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                      />
                      <textarea
                        rows={2}
                        placeholder="Client Address"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                        value={clientDetails.address}
                        onChange={(e) => setClientDetails({ ...clientDetails, address: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        value={clientDetails.phone}
                        onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        value={clientDetails.email}
                        onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                      />
                    </div>
                    <div className="print-only text-gray-600 leading-relaxed">
                      <div className="font-bold text-lg text-gray-800">{clientDetails.name}</div>
                      <div className="mt-2">
                        {clientDetails.address}
                        <br />
                        Phone: {clientDetails.phone}
                        <br />
                        Email: {clientDetails.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <h5 className="text-lg font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">Invoice Items</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-4 py-4 text-left font-semibold">Description</th>
                        <th className="px-4 py-4 text-center font-semibold w-24">Quantity</th>
                        <th className="px-4 py-4 text-center font-semibold w-32">Rate (GHS)</th>
                        <th className="px-4 py-4 text-center font-semibold w-32">Amount (GHS)</th>
                        <th className="no-print px-4 py-4 text-center font-semibold w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                          <td className="px-4 py-3">
                            <div className="no-print">
                              <input
                                type="text"
                                placeholder="Item description"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              />
                            </div>
                            <div className="print-only">{item.description}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="no-print">
                              <input
                                type="number"
                                min="1"
                                className="w-full px-2 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)
                                }
                              />
                            </div>
                            <div className="print-only">{item.quantity}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="no-print">
                              <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l">
                                  GHS
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="flex-1 px-2 py-2 border border-gray-300 rounded-r focus:border-blue-500 focus:outline-none text-center"
                                  value={item.rate}
                                  onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                            <div className="print-only">GHS {item.rate.toFixed(2)}</div>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">GHS {item.amount.toFixed(2)}</td>
                          <td className="no-print px-4 py-3 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                              className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="no-print mt-4">
                  <button
                    onClick={addItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Totals and Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="no-print">
                    <h5 className="text-lg font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">Notes</h5>
                    <textarea
                      rows={4}
                      placeholder="Additional notes or terms..."
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="print-only">
                    {notes && (
                      <>
                        <h5 className="text-lg font-bold text-blue-600 mb-4 border-b-2 border-gray-200 pb-2">Notes</h5>
                        <p className="text-gray-600">{notes}</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="total-section bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-green-100">Subtotal:</span>
                      <strong className="text-xl">GHS {subtotal.toFixed(2)}</strong>
                    </div>

                    <div className="flex justify-between items-center mb-3 no-print">
                      <span className="text-green-100">Discount (%):</span>
                      <div className="w-20">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full px-2 py-1 text-gray-800 rounded text-center text-sm"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="print-only flex justify-between items-center mb-3">
                      <span className="text-green-100">Discount ({discountPercent}%):</span>
                      <strong>- GHS {discountAmount.toFixed(2)}</strong>
                    </div>

                    <div className="no-print flex justify-between items-center mb-3">
                      <span className="text-green-100">Discount Amount:</span>
                      <strong>- GHS {discountAmount.toFixed(2)}</strong>
                    </div>

                    <hr className="my-4 border-green-400" />
                    <div className="flex justify-between items-center">
                      <h5 className="text-xl font-bold">Total:</h5>
                      <h5 className="text-2xl font-bold">GHS {total.toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 print-only">
                <hr className="my-4" />
                <p className="text-gray-500 text-sm">
                  Thank you for doing business with us! | KQ Construction Works | Phone: +233 55 727 2031 | 
                  <br />Email: qkingsley436@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
