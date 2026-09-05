import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, MessageSquare, Send, AlertTriangle, 
  ShieldCheck, Download, Clock, ArrowLeft, Building2, Lock
} from 'lucide-react';

export default function CustomerPortalView({ onBackToWorkspace }) {
  const [isSigned, setIsSigned] = useState(false);
  const [signatoryName, setSignatoryName] = useState('Sarah Jenkins (VP Ops)');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [counterDiscount, setCounterDiscount] = useState(20);
  const [counterNote, setCounterNote] = useState('We need 20% on Setup Service to close before Friday.');
  const [quoteStatus, setQuoteStatus] = useState('Awaiting Client Acceptance');
  const [toastMessage, setToastMessage] = useState('');

  // Timeline comments
  const [comments, setComments] = useState([
    {
      id: 1,
      sender: 'J. Rao (Sales Rep)',
      role: 'DealFlow360 Team',
      time: 'Yesterday at 4:15 PM',
      text: 'Hi Sarah, here is the updated quotation Q-1042 including the enterprise discount tier for Acme Corp. Let me know if you need any adjustments.'
    },
    {
      id: 2,
      sender: 'Sarah Jenkins (Acme Corp)',
      role: 'Procurement',
      time: 'Today at 10:20 AM',
      text: 'Reviewing the setup service and laptop hardware with IT leadership now.'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'Sarah Jenkins (Acme Corp)',
        role: 'Client',
        time: 'Just now',
        text: newComment.trim()
      }
    ]);
    setNewComment('');
    showToast('Comment posted to negotiation thread');
  };

  const handleSendCounterOffer = () => {
    setQuoteStatus('Returned to Internal Approval Queue (Finance Escalation)');
    setIsNegotiating(false);
    showToast('⚠️ Counter-proposal submitted! Quote returned to Finance review queue.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Top Client View Banner */}
      <div className="bg-neutral-900 text-white px-5 py-3 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-mono text-neutral-300">Secure Client Portal View</span>
          <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">
            acme-corp.dealflow360.com/portal/q-1042
          </span>
        </div>
        {onBackToWorkspace && (
          <button
            onClick={onBackToWorkspace}
            className="text-neutral-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer underline text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Internal Workspace</span>
          </button>
        )}
      </div>

      {/* Main Quotation Paper Document */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-md p-8 sm:p-10 relative">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-lg">
                DF
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-neutral-950 tracking-tight">DealFlow360 Technologies</h1>
                <p className="text-xs text-neutral-400">Enterprise Cloud & Infrastructure Services</p>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">PREPARED FOR</span>
              <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-neutral-500" />
                <span>Acme Corporation</span>
              </div>
              <div className="text-xs text-neutral-500">100 Enterprise Way, Suite 400 · San Francisco, CA</div>
              <div className="text-xs text-neutral-500">Attn: Sarah Jenkins (VP Operations)</div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">PROPOSAL DETAILS</span>
            <div className="text-lg font-black font-mono text-neutral-950">QUOTE #Q-1042</div>
            <div className="text-xs text-neutral-500">Issue Date: Sept 5, 2026</div>
            <div className="text-xs text-neutral-500">Valid Until: Sept 12, 2026 (7 days)</div>
            
            <div className="pt-2">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full border ${
                isSigned 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : quoteStatus.includes('Returned')
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-neutral-100 text-neutral-800 border-neutral-300'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{isSigned ? 'Proposal Executed & Confirmed' : quoteStatus}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Warning if Counter-Offer Submitted */}
        {quoteStatus.includes('Returned') && (
          <div className="my-6 p-4 rounded-xl border border-rose-200 bg-rose-50 flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-rose-900">Quotation Locked for Review</div>
              <p className="text-rose-700">
                Your requested <strong>{counterDiscount}% discount</strong> on Setup Service exceeds standard pricing guidelines. 
                Sales Rep J. Rao and Finance Approver R. Iyer have been automatically notified to approve this exception.
              </p>
            </div>
          </div>
        )}

        {/* Line Items Table */}
        <div className="my-8">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px]">
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Type</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price</th>
                <th className="py-3 text-right">Discount</th>
                <th className="py-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              <tr>
                <td className="py-4">
                  <div className="font-bold text-neutral-900 font-sans text-xs">Laptop Pro 14</div>
                  <div className="text-[10px] text-neutral-400">HW-LP14 · Core i7 / 32GB RAM / 1TB SSD</div>
                </td>
                <td className="py-4 text-center text-neutral-500 font-sans">Hardware</td>
                <td className="py-4 text-center text-neutral-900 font-bold">2</td>
                <td className="py-4 text-right text-neutral-600">$1,200.00</td>
                <td className="py-4 text-right text-neutral-600">12%</td>
                <td className="py-4 text-right font-bold text-neutral-950">$2,112.00</td>
              </tr>

              <tr>
                <td className="py-4">
                  <div className="font-bold text-neutral-900 font-sans text-xs">Setup Service</div>
                  <div className="text-[10px] text-neutral-400">SRV-SETUP · Rapid on-boarding & imaging</div>
                </td>
                <td className="py-4 text-center text-neutral-500 font-sans">Service</td>
                <td className="py-4 text-center text-neutral-900 font-bold">1</td>
                <td className="py-4 text-right text-neutral-600">$450.00</td>
                <td className="py-4 text-right text-neutral-600">
                  {quoteStatus.includes('Returned') ? `${counterDiscount}% (Pending)` : '13%'}
                </td>
                <td className="py-4 text-right font-bold text-neutral-950">
                  ${quoteStatus.includes('Returned') ? (450 * (1 - counterDiscount / 100)).toFixed(2) : '391.50'}
                </td>
              </tr>

              <tr>
                <td className="py-4">
                  <div className="font-bold text-neutral-900 font-sans text-xs">Enterprise SaaS Platform</div>
                  <div className="text-[10px] text-neutral-400">SUB-SAAS · Monthly recurring license</div>
                </td>
                <td className="py-4 text-center text-neutral-500 font-sans">Recurring</td>
                <td className="py-4 text-center text-neutral-900 font-bold">1 seat</td>
                <td className="py-4 text-right text-neutral-600">$300.00/mo</td>
                <td className="py-4 text-right text-neutral-600">10%</td>
                <td className="py-4 text-right font-bold text-neutral-950">$270.00/mo</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing Summary & Payment Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
          <div className="space-y-2 text-xs text-neutral-500">
            <span className="font-bold text-neutral-900 uppercase text-[10px]">TERMS & CONDITIONS</span>
            <p>1. Payment terms: Net 30 days upon invoice issuance.</p>
            <p>2. Hardware delivery: 2-4 business days from standard inventory.</p>
            <p>3. SaaS access provisioned immediately upon digital signature.</p>
          </div>

          <div className="space-y-2 bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs font-mono">
            <div className="flex justify-between text-neutral-600">
              <span>One-Time Charges:</span>
              <span>${quoteStatus.includes('Returned') ? (2112 + 450 * (1 - counterDiscount/100)).toFixed(2) : '2,503.50'}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Monthly SaaS (Recurring):</span>
              <span>$270.00 / mo</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Sales Tax (0% Exempt):</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-black text-neutral-950 pt-2 border-t border-neutral-200">
              <span>Total First Bill:</span>
              <span>${quoteStatus.includes('Returned') ? (2382 + 450 * (1 - counterDiscount/100)).toFixed(2) : '2,773.50'}</span>
            </div>
          </div>
        </div>

        {/* Digital Signature Execution Section */}
        <div className="mt-10 pt-8 border-t border-neutral-200">
          {isSigned ? (
            <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-950">Digitally Executed by {signatoryName}</div>
                  <div className="text-xs text-emerald-700 font-mono">Cryptographic Hash: 0x8a92...f71c · Verified Timestamp</div>
                </div>
              </div>
              <button 
                onClick={() => showToast('✓ Downloading Official Executed Agreement PDF...')}
                className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Executed PDF</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-950">Accept & Execute Proposal</h3>
                  <p className="text-xs text-neutral-500">Enter your authorized name below to sign digitally.</p>
                </div>

                {!quoteStatus.includes('Returned') && (
                  <button
                    onClick={() => setIsNegotiating(!isNegotiating)}
                    className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer"
                  >
                    {isNegotiating ? 'Cancel Counter Proposal' : 'Request Discount Revision'}
                  </button>
                )}
              </div>

              {/* Counter-Offer Negotiation Box */}
              {isNegotiating && (
                <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Propose Counter-Discount</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Target: Setup Service</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase">Proposed Discount</label>
                      <div className="relative mt-1">
                        <input 
                          type="number"
                          value={counterDiscount}
                          onChange={(e) => setCounterDiscount(Number(e.target.value))}
                          className="w-full text-xs font-mono font-bold bg-white border border-neutral-300 rounded-lg px-3 py-1.5 focus:border-black focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">%</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase">Procurement Justification</label>
                      <input 
                        type="text"
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                        className="w-full mt-1 text-xs bg-white border border-neutral-300 rounded-lg px-3 py-1.5 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-neutral-500">
                      Proposals exceeding 10% ceiling route back to internal Sales & Finance approval.
                    </p>
                    <button
                      onClick={handleSendCounterOffer}
                      className="px-4 py-1.5 text-xs font-bold bg-black text-white rounded-lg hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                      Submit Counter Offer
                    </button>
                  </div>
                </div>
              )}

              {/* Signature Input & Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input 
                  type="text" 
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  placeholder="Authorized Signatory Full Name"
                  disabled={quoteStatus.includes('Returned')}
                  className="flex-1 text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-black disabled:opacity-50"
                />
                <button
                  onClick={() => {
                    setIsSigned(true);
                    showToast('🎉 Proposal executed successfully! Order Q-1042 activated.');
                  }}
                  disabled={quoteStatus.includes('Returned') || !signatoryName.trim()}
                  className="px-6 py-2.5 text-xs font-bold bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                >
                  Sign & Accept Quotation
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Real-time Collaboration Comments Feed */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-neutral-900" />
            <h3 className="text-sm font-bold text-neutral-950">Proposal Activity & Negotiation Thread</h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">{comments.length} updates</span>
        </div>

        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">{c.sender}</span>
                  <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded font-mono">{c.role}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">{c.time}</span>
              </div>
              <p className="text-xs text-neutral-600">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Add comment input */}
        <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
          <input 
            type="text"
            placeholder="Type a message or negotiation note..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold bg-neutral-900 text-white rounded-lg hover:bg-black transition-all cursor-pointer flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Post</span>
          </button>
        </form>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
