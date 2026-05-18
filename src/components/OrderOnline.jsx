import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsData } from '../data/products';

// Enrich productsData with prices from the products config
const PRODUCTS_LIST = productsData.map((item) => {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    priceVal: item.numericPrice,
    priceStr: item.price
  };
});

// Append Custom Option
const CUSTOM_PRODUCT = {
  id: 99,
  name: 'Custom Special Order',
  image: null,
  priceVal: 0,
  priceStr: 'Quote on request'
};

const ALL_ITEMS = [...PRODUCTS_LIST, CUSTOM_PRODUCT];

const OrderOnline = ({ selectedProduct, clearSelectedProduct }) => {
  // Steps: 1 = Select Items & Quantities, 2 = Delivery Details
  const [step, setStep] = useState(1);
  
  // Store quantities in a dictionary state keyed by product name
  const [quantities, setQuantities] = useState({});

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [customDetails, setCustomDetails] = useState(''); // Custom order specifications

  // Submit handlers
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Getter & Setter helpers for quantities
  const getQty = (itemName) => quantities[itemName] || 0;
  
  const setQty = (itemName, val) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(0, val)
    }));
  };

  const toggleSelection = (itemName) => {
    const isSelected = getQty(itemName) > 0;
    setQuantities(prev => ({
      ...prev,
      [itemName]: isSelected ? 0 : 1
    }));
  };

  // Handle auto-prepopulation from menu clicks
  useEffect(() => {
    if (selectedProduct) {
      const match = ALL_ITEMS.find(item => item.name === selectedProduct);
      if (match) {
        if (match.name === 'Cold Coffee') {
          setQty('Cold Coffee (Large)', 1); // Default to 1 Large Cold Coffee
        } else {
          setQty(match.name, 1);
        }
      } else {
        setQty('Custom Special Order', 1);
        setCustomDetails(`Inquiry regarding: ${selectedProduct}`);
      }
      setStep(1); // Reset to selection step to review
      
      if (clearSelectedProduct) {
        clearSelectedProduct();
      }
    }
  }, [selectedProduct, clearSelectedProduct]);

  // Compute selected items list and order totals. Flatten Cold Coffee sizes.
  const selectedItems = [];
  
  ALL_ITEMS.forEach(item => {
    if (item.name === 'Cold Coffee') {
      const smallQty = getQty('Cold Coffee (Small)');
      const largeQty = getQty('Cold Coffee (Large)');
      
      if (smallQty > 0) {
        selectedItems.push({
          id: '6-small',
          name: 'Cold Coffee (Small)',
          image: item.image,
          priceVal: 59,
          qty: smallQty
        });
      }
      if (largeQty > 0) {
        selectedItems.push({
          id: '6-large',
          name: 'Cold Coffee (Large)',
          image: item.image,
          priceVal: 89,
          qty: largeQty
        });
      }
    } else {
      const qty = getQty(item.name);
      if (qty > 0) {
        selectedItems.push({
          id: item.id,
          name: item.name,
          image: item.image,
          priceVal: item.priceVal,
          qty: qty
        });
      }
    }
  });

  const totalItemsCount = selectedItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsSubtotal = selectedItems.reduce((acc, item) => acc + (item.priceVal * item.qty), 0);
  const deliveryFee = itemsSubtotal > 0 ? 49 : 0;
  const orderGrandTotal = itemsSubtotal + deliveryFee;

  const handleNextStep = () => {
    if (totalItemsCount === 0) {
      setErrorMsg('Please select a quantity for at least one item before proceeding.');
      return;
    }
    
    // Validate custom order details if selected
    if (getQty('Custom Special Order') > 0 && !customDetails.trim()) {
      setErrorMsg('Please add specification details for your Custom Special Order.');
      return;
    }

    setErrorMsg('');
    setStep(2);
    // Smooth scroll to details header
    const orderTitle = document.getElementById('order-title');
    if (orderTitle) {
      orderTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    const orderTitle = document.getElementById('order-title');
    if (orderTitle) {
      orderTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Basic Required Check
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your delivery address.');
      return;
    }

    // 2. Name Validation
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorMsg('Name must be at least 2 characters long.');
      return;
    }
    if (/^\d+$/.test(trimmedName) || !/[a-zA-Z]{2,}/.test(trimmedName)) {
      setErrorMsg('Please enter a valid name containing letters.');
      return;
    }

    // 3. Phone Number Validation
    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setErrorMsg('Please enter a valid phone number (between 10 and 15 digits).');
      return;
    }

    // 4. Address Length Validation
    const trimmedAddress = address.trim();
    if (trimmedAddress.length < 15) {
      setErrorMsg('Please specify a detailed delivery address (minimum 15 characters) for Mangalore dispatch.');
      return;
    }

    setErrorMsg('');
    setIsSending(true);

    // Format item summary for Formspree
    const itemsDescription = selectedItems
      .map(item => {
        if (item.name === 'Custom Special Order') {
          return `${item.name} (Specification: ${customDetails.trim()})`;
        }
        return `${item.name} (x${item.qty})`;
      })
      .join(', ');

    const orderId = `DOLC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt = {
      orderId,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      itemsList: selectedItems.map(item => ({
        name: item.name,
        qty: item.qty,
        totalPrice: item.priceVal > 0 ? `₹${item.priceVal * item.qty}` : 'Quote Pending'
      })),
      customNotes: getQty('Custom Special Order') > 0 ? customDetails.trim() : null,
      totalCostStr: itemsSubtotal > 0 ? `₹${orderGrandTotal}` : 'Quote Pending',
      notes: notes.trim() || 'No specific requests.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      readyIn: '35 - 50 minutes (Mangalore Limits Only)'
    };

    // Formspree API integration
    fetch('https://formspree.io/f/xzdwpwng', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        OrderId: orderId,
        Name: name.trim(),
        Phone: phone.trim(),
        DeliveryAddress: address.trim(),
        ItemsSummary: itemsDescription,
        CustomOrderSpecs: getQty('Custom Special Order') > 0 ? customDetails.trim() : 'N/A',
        TotalBill: newReceipt.totalCostStr,
        Instructions: notes.trim() || 'None',
        Date: newReceipt.date,
        Time: newReceipt.time
      })
    })
    .then((response) => {
      setIsSending(false);
      if (response.ok) {
        setReceipt(newReceipt);
        setIsSubmitted(true);
        // Reset state
        setName('');
        setPhone('');
        setAddress('');
        setQuantities({});
        setNotes('');
        setCustomDetails('');
        setStep(1);
      } else {
        console.warn('Formspree returned an error, using local fallback receipt.');
        setReceipt(newReceipt);
        setIsSubmitted(true);
        setName('');
        setPhone('');
        setAddress('');
        setQuantities({});
        setNotes('');
        setCustomDetails('');
        setStep(1);
      }
    })
    .catch((err) => {
      setIsSending(false);
      console.error('Formspree submit failed, utilizing local fallback receipt:', err);
      setReceipt(newReceipt);
      setIsSubmitted(true);
      setName('');
      setPhone('');
      setAddress('');
      setQuantities({});
      setNotes('');
      setCustomDetails('');
      setStep(1);
    });
  };

  return (
    <section id="order" className="py-24 bg-warmDark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-gold/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14" id="order-title">
            <span className="uppercase tracking-[0.3em] text-gold text-sm font-bold mb-3 block">
              Gourmet Delivery
            </span>
            <h2 className="text-4xl md:text-6xl font-serif gold-gradient mb-4">Order Online</h2>
            
            {/* Delivery Notice Alert Box */}
            <div className="inline-block mt-4 bg-gold/10 border border-gold/30 rounded-2xl px-6 py-3 shadow-[0_10px_30px_rgba(220,213,198,0.05)]">
              <span className="text-gold text-xs md:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                <span className="animate-pulse">📍</span> Online delivery available only in Mangalore.
              </span>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button 
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors duration-300 ${step === 1 ? 'text-gold' : 'text-white/30 hover:text-white'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans ${step === 1 ? 'bg-gold text-softBlack' : 'bg-white/10 text-white'}`}>1</span>
              Select Items & Qty
            </button>
            <div className="w-12 h-[1px] bg-white/10" />
            <button 
              disabled={totalItemsCount === 0}
              onClick={handleNextStep}
              className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors duration-300 disabled:opacity-30 ${step === 2 ? 'text-gold' : 'text-white/30 hover:text-white'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans ${step === 2 ? 'bg-gold text-softBlack' : 'bg-white/10 text-white'}`}>2</span>
              Details Form
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Step 1: Browse Rows Sheet */}
                <div>
                  <h3 className="font-serif text-xl text-gold mb-6 text-center lg:text-left flex items-center gap-2">
                    Adjust Quantities of Your Favorites:
                  </h3>
                  
                  <div className="space-y-3 max-w-2xl mx-auto glass-morphism p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    {ALL_ITEMS.map((item) => {
                      const qty = item.name === 'Cold Coffee'
                        ? getQty('Cold Coffee (Small)') + getQty('Cold Coffee (Large)')
                        : getQty(item.name);
                      const isCustom = item.name === 'Custom Special Order';
                      const isSelected = qty > 0;
                      return (
                        <div 
                          key={item.id}
                          onClick={() => {
                            if (isCustom) {
                              toggleSelection(item.name);
                            }
                          }}
                          className={`flex flex-col p-3 rounded-2xl transition-all duration-300 border ${
                            isCustom ? 'cursor-pointer' : ''
                          } ${
                            isSelected 
                              ? 'bg-gold/5 border-gold/30 shadow-[0_4px_20px_rgba(220,213,198,0.05)]' 
                              : 'bg-transparent border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            {/* Left: Image & Info */}
                            <div className="flex items-center text-left">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-14 h-14 rounded-xl object-cover bg-white/5 shadow-sm mr-4" 
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl border border-dashed border-gold/30 bg-gold/5 flex items-center justify-center mr-4 flex-shrink-0">
                                  <span className="text-xl">✨</span>
                                </div>
                              )}
                              <div>
                                <h4 className="font-serif text-sm md:text-base text-white font-bold leading-tight mb-1">
                                  {item.name}
                                </h4>
                                <span className="text-xs text-gold font-mono font-semibold">
                                  {item.priceStr}
                                </span>
                              </div>
                            </div>

                            {/* Right: Quantity Spinner (Standard) vs checked box (Custom) */}
                            <div>
                              {isCustom ? (
                                <div className="mr-2">
                                  {isSelected ? (
                                    <div className="w-7 h-7 rounded-full bg-gold text-softBlack flex items-center justify-center font-bold text-sm shadow-md border border-white/10">
                                      ✓
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-gold/50 transition-colors">
                                      <span className="text-xs text-white/30">+</span>
                                    </div>
                                  )}
                                </div>
                              ) : item.name === 'Cold Coffee' ? (
                                <div className="flex flex-col gap-2 bg-white/5 p-2 rounded-xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                                  {/* Small Spinner */}
                                  <div className="flex items-center gap-3 justify-between">
                                    <span className="text-[10px] uppercase font-bold text-gold tracking-wider min-w-[36px]">Small</span>
                                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-0.5 h-7 w-24">
                                      <button
                                        type="button"
                                        onClick={() => setQty('Cold Coffee (Small)', getQty('Cold Coffee (Small)') - 1)}
                                        className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 text-xs font-bold"
                                      >
                                        −
                                      </button>
                                      <span className="font-serif text-[10px] font-bold text-white select-none font-mono">
                                        {getQty('Cold Coffee (Small)')}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setQty('Cold Coffee (Small)', getQty('Cold Coffee (Small)') + 1)}
                                        className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 text-xs font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  {/* Large Spinner */}
                                  <div className="flex items-center gap-3 justify-between border-t border-white/5 pt-1.5">
                                    <span className="text-[10px] uppercase font-bold text-gold tracking-wider min-w-[36px]">Large</span>
                                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-0.5 h-7 w-24">
                                      <button
                                        type="button"
                                        onClick={() => setQty('Cold Coffee (Large)', getQty('Cold Coffee (Large)') - 1)}
                                        className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 text-xs font-bold"
                                      >
                                        −
                                      </button>
                                      <span className="font-serif text-[10px] font-bold text-white select-none font-mono">
                                        {getQty('Cold Coffee (Large)')}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setQty('Cold Coffee (Large)', getQty('Cold Coffee (Large)') + 1)}
                                        className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 text-xs font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-1 h-9 w-28">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQty(item.name, qty - 1);
                                    }}
                                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 active:scale-90 transition-all text-sm font-bold"
                                  >
                                    −
                                  </button>
                                  <span className="font-serif text-xs font-bold text-white select-none font-mono px-2">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQty(item.name, qty + 1);
                                    }}
                                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white hover:text-gold hover:bg-white/10 active:scale-90 transition-all text-sm font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expandable Custom Specification Input block */}
                          {isCustom && isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              onClick={(e) => e.stopPropagation()} // Prevent toggling selection on text field click
                              className="mt-4 pl-4 border-l border-gold/30 space-y-2 text-left"
                            >
                              <label className="text-[10px] uppercase tracking-widest text-gold font-bold block">
                                Custom Cake Request Details:
                              </label>
                              <textarea
                                required
                                value={customDetails}
                                onChange={(e) => setCustomDetails(e.target.value)}
                                className="w-full bg-softBlack/60 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold outline-none h-20 transition-all placeholder-white/20"
                                placeholder="Specify cake theme, size/weight (e.g. 1kg), flavor combinations, or eggless request..."
                              />
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-xs text-red-400 text-center">
                    {errorMsg}
                  </div>
                )}

                {/* Step 1 checkout totals bar */}
                {totalItemsCount > 0 && (
                  <div className="glass-morphism p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl mx-auto w-full mt-6">
                    <div className="text-left w-full sm:w-auto">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block mb-0.5">Pastries Selected</span>
                      <h4 className="font-serif text-sm md:text-base text-white font-bold leading-tight">
                        {totalItemsCount} treat{totalItemsCount > 1 ? 's' : ''} in sheet
                      </h4>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block mb-0.5">Subtotal</span>
                        <h3 className="text-lg md:text-xl font-serif text-gold font-bold font-mono leading-none">
                          ₹{itemsSubtotal}
                        </h3>
                      </div>
                      <button 
                        type="button"
                        onClick={handleNextStep}
                        className="gold-button px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 group shadow-[0_10px_25px_rgba(220,213,198,0.2)]"
                      >
                        Next Details 
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              >
                {/* Step 2 Form */}
                <div className="lg:col-span-8 glass-morphism p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
                  <h3 className="font-serif text-2xl text-gold mb-6 flex items-center gap-2">
                    Enter Delivery Details:
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white" 
                          placeholder="John Doe" 
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Block any character that is not a digit (0-9) or a leading plus sign (+)
                            const cleanValue = value.replace(/[^0-9+]/g, '');
                            setPhone(cleanValue);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-gold outline-none transition-all text-white" 
                          placeholder="+91 XXXXX XXXXX" 
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-xs uppercase tracking-widest text-white/40">Delivery Address</label>
                        <span className="text-[10px] text-gold/80 font-bold uppercase tracking-wider">
                          * Mangalore Only
                        </span>
                      </div>
                      <textarea 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:border-gold outline-none transition-all h-24 text-white" 
                        placeholder="Enter your street address, apartment number, and city..." 
                      />
                      <p className="text-[10px] pl-2 text-white/40 italic">
                        ⚠️ Online delivery available only in Mangalore. Orders outside Mangalore cannot be fulfilled.
                      </p>
                    </div>

                    {/* Notes/Instructions */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 ml-2">Notes / Instructions</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 focus:border-gold outline-none transition-all h-24 text-white" 
                        placeholder="E.g., Write 'Happy Birthday Sam' on the cheesecake, eggless, or delivery contact notes..." 
                      />
                    </div>

                    {errorMsg && (
                      <div className="text-xs text-red-400 pl-2">
                        {errorMsg}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={handlePrevStep}
                        className="border border-white/10 hover:border-gold/30 hover:bg-white/5 w-full sm:w-auto px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300"
                      >
                        ← Back to Pastries
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSending}
                        className="gold-button flex-1 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-60 shadow-[0_10px_25px_rgba(220,213,198,0.2)]"
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-softBlack" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Transmitting Order...
                          </>
                        ) : (
                          'Confirm & Place Order'
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Step 2 Right Summary Panel */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                  <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <h3 className="font-serif text-lg text-gold mb-4 pb-2 border-b border-white/5 font-semibold">Order Summary</h3>
                    
                    <div className="space-y-4 text-left">
                      <div className="max-h-48 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                        {selectedItems.map(item => (
                          <div key={item.id} className="flex flex-col gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-serif text-xs font-bold text-white leading-tight">{item.name}</h4>
                                <span className="text-white/40 text-[10px] font-mono">Qty: x{item.qty}</span>
                              </div>
                              <span className="text-xs font-semibold text-white/90 font-mono">
                                {item.priceVal > 0 ? `₹${item.priceVal * item.qty}` : 'Quote Pending'}
                              </span>
                            </div>
                            
                            {item.name === 'Custom Special Order' && customDetails.trim() && (
                              <div className="text-[10px] italic text-gold/80 pl-2 leading-relaxed bg-white/5 rounded-lg p-1.5 border border-gold/10">
                                Specs: {customDetails}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {itemsSubtotal > 0 && (
                        <div className="space-y-2 border-t border-dashed border-white/10 pt-3 text-[11px] text-white/40">
                          <div className="flex justify-between font-mono">
                            <span>Subtotal:</span>
                            <span className="text-white/80">₹{itemsSubtotal}</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span>Mangalore Delivery:</span>
                            <span className="text-white/80">₹{deliveryFee}</span>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Total Bill:</span>
                        <span className="text-lg font-serif text-gold font-bold font-mono">
                          {itemsSubtotal > 0 ? `₹${orderGrandTotal}` : 'Quote Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Online Order Success Ticket Modal */}
      <AnimatePresence>
        {isSubmitted && receipt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-warmDark border border-gold/30 rounded-[2.5rem] p-8 w-full max-w-md relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
            >
              {/* Success Tick */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10 text-gold mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif gold-gradient">Order Placed!</h3>
                <p className="text-white/40 text-xs tracking-widest uppercase mt-1">dolcetto mangalore</p>
              </div>

              {/* Physical Receipt Ticket Visual */}
              <div className="bg-softBlack border border-white/10 rounded-2xl p-5 font-mono text-[10px] text-white/80 space-y-3 relative overflow-hidden shadow-inner max-h-[260px] overflow-y-auto">
                <div className="flex justify-between text-gold">
                  <span>TICKET NO:</span>
                  <span className="font-bold">{receipt.orderId}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>DATE:</span>
                  <span>{receipt.date} @ {receipt.time}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>CUSTOMER:</span>
                  <span className="truncate max-w-[180px]">{receipt.name}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>CONTACT:</span>
                  <span>{receipt.phone}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>DELIVER TO:</span>
                  <span className="truncate max-w-[180px]">{receipt.address}</span>
                </div>
                
                <div className="border-t border-dashed border-white/15 my-2" />
                
                <div className="space-y-1.5">
                  <div className="text-white/40 font-bold">ITEMS SUMMARY:</div>
                  {receipt.itemsList.map((item, i) => (
                    <div key={i} className="flex flex-col text-white/80 pl-2">
                      <div className="flex justify-between">
                        <span>• {item.name} (x{item.qty})</span>
                        <span className="text-gold font-bold">{item.totalPrice}</span>
                      </div>
                      {item.name === 'Custom Special Order' && receipt.customNotes && (
                        <span className="text-[9px] italic text-gold pl-4 font-sans">Spec: {receipt.customNotes}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-left space-y-1 mt-2">
                  <div className="text-white/40">INSTRUCTIONS:</div>
                  <div className="pl-2 border-l border-gold/30 italic text-white/60">
                    {receipt.notes}
                  </div>
                </div>
                
                <div className="border-t border-dashed border-white/15 my-2" />
                
                <div className="flex justify-between text-gold">
                  <span>TOTAL PAID:</span>
                  <span className="font-bold">{receipt.totalCostStr}</span>
                </div>
                <div className="flex justify-between text-gold">
                  <span>DELIVERY NOTICE:</span>
                  <span className="font-bold">Mangalore Exclusive</span>
                </div>
                <div className="flex justify-between text-gold">
                  <span>EST. ARRIVAL:</span>
                  <span className="font-bold">35 - 55 mins</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-white/40 text-[11px] text-center leading-relaxed">
                  Your gourmet items are being hand-crafted. Our delivery courier will call you at <span className="text-white/75">{receipt.phone}</span> once dispatched.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="gold-button w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  Done, Thank You
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OrderOnline;
