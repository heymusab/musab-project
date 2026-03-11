'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, FlaskConical, TestTube, Thermometer, ShoppingCart, Home, CheckCircle2, Search } from 'lucide-react';
import { toast } from 'sonner';

const labTests = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 45, icon: <Beaker size={24} />, description: 'Includes hemoglobin, red blood cells, and platelets.' },
  { id: 'sugar', name: 'HbA1c / Sugar Level', price: 30, icon: <TestTube size={24} />, description: 'Checks your average blood sugar levels over the past 3 months.' },
  { id: 'lipid', name: 'Lipid Profile', price: 60, icon: <FlaskConical size={24} />, description: 'Measures cholesterol and triglyceride levels.' },
  { id: 'thyroid', name: 'Thyroid Panel (T3, T4, TSH)', price: 55, icon: <Thermometer size={24} />, description: 'Evaluates thyroid gland function.' },
  { id: 'covid', name: 'COVID-19 PCR Test', price: 80, icon: <FlaskConical size={24} />, description: 'Rapid results for international travel and symptoms.' },
  { id: 'liver', name: 'Liver Function Test (LFT)', price: 50, icon: <Beaker size={24} />, description: 'Checks enzymes and proteins for liver health.' },
  { id: 'kidney', name: 'Kidney Function Test (KFT)', price: 50, icon: <FlaskConical size={24} />, description: 'Includes creatinine and urea levels.' },
  { id: 'vitamin', name: 'Vitamin D3 Level', price: 70, icon: <TestTube size={24} />, description: 'Essential for bone health and immune function.' },
];

export default function LabTestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingTest, setBookingTest] = useState<string | null>(null);

  const filteredTests = labTests.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBooking = (testName: string) => {
    setBookingTest(testName);
    setTimeout(() => {
      setBookingTest(null);
      toast.success(`Home Sample Request sent for ${testName}!`, {
        description: "Our lab technician will contact you shortly.",
        icon: <Home className="text-primary" />,
      });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Lab Marketplace</h1>
          <p className="text-muted-foreground font-medium mt-1">Book diagnostic tests with home sample collection</p>
        </div>
        <div className="glass-card flex items-center px-6 py-1 rounded-2xl w-full max-w-md border border-border group focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search for CBC, Sugar, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none px-4"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTests.map((test) => (
          <motion.div
            key={test.id}
            whileHover={{ y: -8 }}
            className="glass-card rounded-[3rem] p-10 group relative overflow-hidden flex flex-col h-full border border-border hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                {test.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-foreground text-xl group-hover:text-primary transition-colors tracking-tighter leading-tight">{test.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-foreground tracking-tighter">${test.price}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded">USD</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium flex-1">
              {test.description}
            </p>

            <button
              onClick={() => handleBooking(test.name)}
              disabled={bookingTest === test.name}
              className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                {bookingTest === test.name ? (
                  <motion.div
                    key="booking"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Home size={16} />
                    <span>Book Home Sample</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-24 glass-card rounded-[3rem] border-dashed">
          <div className="text-5xl mb-6 opacity-20">🧪</div>
          <p className="text-muted-foreground text-lg font-bold">No tests found matching your search.</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold hover:underline">View all tests</button>
        </div>
      )}
    </motion.div>
  );
}
