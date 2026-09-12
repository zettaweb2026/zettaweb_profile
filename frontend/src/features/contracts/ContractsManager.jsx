import React, { useState, useRef, useMemo, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import {
  Download,
  Eraser,
  Shield,
  Sparkles,
  FileCode,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Sliders,
  X,
  FileText,
  RotateCcw,
  Zap,
  MousePointerClick,
  Eye
} from 'lucide-react';
import { UIverseButton } from '@/components/ui/uiverse';
import ContractPDF from './ContractPDF';
import { generateContractLatex, parseContractLatexLive, findLatexLineNumber } from '../../lib/latexGenerator';

export const ContractsManager = () => {
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientEmail, setClientEmail] = useState('legal@acme.com');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [service, setService] = useState('Full-Stack Enterprise Portal Development');
  const [amount, setAmount] = useState('75000');
  
  // Pictures & Branding State
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyStamp, setCompanyStamp] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  // Editable LaTeX State & Overleaf Mode
  const [customLatex, setCustomLatex] = useState('');
  const [isManualLatexMode, setIsManualLatexMode] = useState(false);

  // Left Pane View Mode: 'latex' | 'pictures' | 'form'
  const [activeTab, setActiveTab] = useState('latex');
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Right Pane View Mode: 'sync' (0ms instant interactive) | 'pdf' (pdf engine)
  const [previewMode, setPreviewMode] = useState('sync');

  // SyncTeX Inverse Search Highlight state
  const [highlightedLine, setHighlightedLine] = useState(null);
  const editorRef = useRef(null);

  const sigPad = useRef(null);
  const [contractNo] = useState(() => `ZW-SA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleSignatureEnd = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      setSignatureImage(sigPad.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      setSignatureImage(null);
    }
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Base Data object from visual form
  const baseContractData = useMemo(() => ({
    contractNo,
    date,
    clientName,
    clientEmail,
    service,
    amount,
    signature: signatureImage,
    companyLogo,
    companyStamp,
  }), [contractNo, date, clientName, clientEmail, service, amount, signatureImage, companyLogo, companyStamp]);

  // Keep LaTeX code initialized
  useEffect(() => {
    if (!isManualLatexMode) {
      setCustomLatex(generateContractLatex(baseContractData));
    }
  }, [baseContractData, isManualLatexMode]);

  // Parse LaTeX source string in real time whenever user types in the editor
  // Uses robust line-by-line tokenizer so every keystroke updates the preview instantly
  const compiledContractData = useMemo(() => {
    if (customLatex) {
      return parseContractLatexLive(customLatex, baseContractData);
    }
    return baseContractData;
  }, [customLatex, baseContractData]);

  const handleLatexChange = (e) => {
    const text = e.target.value;
    setCustomLatex(text);
    setIsManualLatexMode(true);
  };

  const handleResetLatex = () => {
    const freshLatex = generateContractLatex(baseContractData);
    setCustomLatex(freshLatex);
    setIsManualLatexMode(false);
    setHighlightedLine(null);
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(customLatex);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleDownloadLatex = () => {
    const element = document.createElement('a');
    const file = new Blob([customLatex], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${compiledContractData.contractNo}_Agreement.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Overleaf Inverse Search / SyncTeX: Clicking section in Preview jumps to exact LaTeX code line!
  const jumpToLatexSection = (sectionKey) => {
    setActiveTab('latex');
    const lineNumber = findLatexLineNumber(customLatex, sectionKey);
    setHighlightedLine(lineNumber);

    if (editorRef.current) {
      const lineHeight = 19; // approximate line height in px
      const scrollPos = (lineNumber - 1) * lineHeight;
      editorRef.current.scrollTop = Math.max(0, scrollPos - 80);
    }

    setTimeout(() => {
      setHighlightedLine(null);
    }, 2500);
  };

  // Calculate line numbers for the editor
  const lineNumbers = useMemo(() => {
    const totalLines = (customLatex.match(/\n/g) || []).length + 1;
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [customLatex]);

  return (
    <div className="w-full space-y-6 p-4 md:p-6 bg-slate-950 text-white min-h-screen">
      {/* Top Header & Actions Strip */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              Contract Studio (Overleaf View & SyncTeX)
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time LaTeX editor with bidirectional SyncTeX: Click any PDF section to jump directly to its code line!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyLatex}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
          >
            {copiedLatex ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
            <span>{copiedLatex ? 'LaTeX Copied!' : 'Copy LaTeX'}</span>
          </button>

          <button
            onClick={handleDownloadLatex}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
          >
            <FileCode className="h-3.5 w-3.5 text-indigo-400" />
            <span>Download .tex</span>
          </button>

          <PDFDownloadLink
            document={<ContractPDF {...compiledContractData} />}
            fileName={`${compiledContractData.contractNo}_Agreement.pdf`}
          >
            {({ loading }) => (
              <UIverseButton variant="neon" icon={Download} isLoading={loading}>
                Download PDF
              </UIverseButton>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Side-by-Side 50/50 Overleaf Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE (6 cols / 50% width): Controls & Code Editor */}
        <div className="lg:col-span-6 space-y-4 overflow-y-auto max-h-[82vh] pr-1 scrollbar-thin">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('latex')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'latex'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>LaTeX Code Editor</span>
              {isManualLatexMode && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
            </button>

            <button
              onClick={() => setActiveTab('pictures')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pictures'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Pictures & Branding</span>
              {(companyLogo || companyStamp || signatureImage) && (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'form'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Form Controls</span>
            </button>
          </div>

          {/* TAB 1: Overleaf LaTeX Code Editor with Line Numbers & Line Highlight */}
          {activeTab === 'latex' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="h-4 w-4" /> Overleaf Code Editor
                </h3>
                
                <div className="flex items-center gap-2">
                  {highlightedLine && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded font-mono animate-pulse">
                      Synced to Line {highlightedLine}
                    </span>
                  )}
                  {isManualLatexMode && (
                    <button
                      onClick={handleResetLatex}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-sans"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Template
                    </button>
                  )}
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Live Compiler 0ms
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400">
                Type directly in the LaTeX code below to update the preview live. Click any section in the right preview pane to jump directly to its code line!
              </p>

              {/* Code Editor Container with Line Numbers Gutter */}
              <div className="relative flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
                {/* Line Numbers Column */}
                <div className="w-10 bg-slate-900/90 py-4 text-right pr-3 select-none text-slate-600 border-r border-slate-800/80 space-y-0.5">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className={`h-[19px] leading-[19px] ${
                        highlightedLine === num ? 'text-cyan-400 font-bold bg-cyan-500/20 px-1 rounded' : ''
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* Editable Textarea */}
                <textarea
                  ref={editorRef}
                  value={customLatex}
                  onChange={handleLatexChange}
                  rows={20}
                  spellCheck={false}
                  placeholder="Type LaTeX code here..."
                  className="flex-1 bg-transparent p-4 text-emerald-300 outline-none resize-none leading-[19px] whitespace-pre font-mono scrollbar-thin"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Pictures & Branding */}
          {activeTab === 'pictures' && (
            <div className="space-y-4">
              
              {/* Company Logo Picture */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Company Logo Picture
                  </h3>
                  {companyLogo && (
                    <button
                      onClick={() => setCompanyLogo(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> Remove Logo
                    </button>
                  )}
                </div>

                {companyLogo ? (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
                    <img src={companyLogo} alt="Company Logo" className="h-12 max-w-[150px] object-contain rounded" />
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Logo Loaded
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl bg-slate-950 cursor-pointer transition-all">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">Click to upload Company Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setCompanyLogo)}
                    />
                  </label>
                )}
              </div>

              {/* Official Stamp Picture */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Official Company Stamp / Seal Image
                  </h3>
                  {companyStamp && (
                    <button
                      onClick={() => setCompanyStamp(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> Remove Stamp
                    </button>
                  )}
                </div>

                {companyStamp ? (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
                    <img src={companyStamp} alt="Company Stamp" className="h-16 w-16 object-contain rounded" />
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Official Stamp Attached
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl bg-slate-950 cursor-pointer transition-all">
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">Upload Company Seal / Stamp Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setCompanyStamp)}
                    />
                  </label>
                )}
              </div>

              {/* Signature Pad */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Client Signature Picture
                  </h3>
                  {signatureImage && (
                    <button
                      onClick={clearSignature}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Eraser className="h-3.5 w-3.5" /> Clear Signature
                    </button>
                  )}
                </div>
                
                <div className="border border-slate-700 rounded-xl bg-white overflow-hidden">
                  <SignatureCanvas
                    penColor="#0f172a"
                    canvasProps={{ className: 'w-full h-32' }}
                    ref={sigPad}
                    onEnd={handleSignatureEnd}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="text-xs text-cyan-400 hover:underline cursor-pointer flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Or Upload Signature Image File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setSignatureImage)}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Visual Form Controls */}
          {activeTab === 'form' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Form Parameters
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Contract Ref #</label>
                  <input
                    type="text"
                    readOnly
                    value={contractNo}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-cyan-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Client Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        setIsManualLatexMode(false);
                      }}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Client Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => {
                        setClientEmail(e.target.value);
                        setIsManualLatexMode(false);
                      }}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Service Scope Description</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      setIsManualLatexMode(false);
                    }}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Agreed Consideration (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setIsManualLatexMode(false);
                      }}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Effective Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setIsManualLatexMode(false);
                      }}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANE (6 cols / 50% width): Sticky Real-time Overleaf Preview & SyncTeX */}
        <div className="lg:col-span-6 sticky top-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[82vh]">
            
            {/* Right Pane Mode Header */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-300">Overleaf Live Compiled Preview</span>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewMode('sync')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    previewMode === 'sync'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MousePointerClick className="h-3 w-3" />
                  <span>SyncTeX Live View (0ms)</span>
                </button>
                <button
                  onClick={() => setPreviewMode('pdf')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    previewMode === 'pdf'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>PDF Engine Output</span>
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="flex-1 w-full bg-slate-950 overflow-y-auto p-4 scrollbar-thin">
              {previewMode === 'sync' ? (
                /* Instant 0ms Interactive SyncTeX Paper Document */
                <div className="max-w-[595px] mx-auto bg-white text-slate-900 p-8 shadow-2xl rounded-sm min-h-[750px] font-sans text-xs space-y-6 select-none relative overflow-hidden">
                  
                  {/* Permanent ZettaWeb Logo Background Watermark */}
                  <img
                    src="/logo.png"
                    alt="ZettaWeb Logo Watermark"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.06] pointer-events-none object-contain select-none z-0"
                  />

                  {/* Top Strip */}
                  <div className="h-1 bg-sky-600 -mx-8 -mt-8 mb-6 relative z-10" />

                  {/* Header Section (Clickable) */}
                  <div
                    onClick={() => jumpToLatexSection('header')}
                    className="p-3 rounded-lg border border-transparent hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative"
                    title="Click to jump to Header code in LaTeX editor"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" /> Jump to Code
                    </div>
                    {compiledContractData.companyLogo && (
                      <img src={compiledContractData.companyLogo} alt="Logo" className="h-10 max-w-[140px] object-contain mb-3" />
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">MASTER SERVICE AGREEMENT</h2>
                        <p className="text-[11px] text-sky-700 font-bold mt-0.5">
                          Contract Ref #: {compiledContractData.contractNo}
                        </p>
                        <p className="text-[10px] text-slate-500">Effective Date: {compiledContractData.date}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-600">
                        <p className="font-bold text-sky-700 text-xs">ZettaWeb Pvt. Ltd.</p>
                        <p>support@zetta-web.in</p>
                        <p>www.zetta-web.in</p>
                      </div>
                    </div>
                  </div>

                  {/* Parties Block (Clickable) */}
                  <div
                    onClick={() => jumpToLatexSection('client')}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative grid grid-cols-2 gap-4"
                    title="Click to jump to Client details in LaTeX code"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" /> Jump to Code
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Service Provider</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">ZettaWeb Pvt. Ltd.</p>
                      <p className="text-[10px] text-slate-600">Authorized Digital Provider</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Client / Recipient</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{compiledContractData.clientName || 'Valued Client'}</p>
                      <p className="text-[10px] text-slate-600">{compiledContractData.clientEmail || 'Client Contact'}</p>
                    </div>
                  </div>

                  {/* Clause 1: Scope of Work (Clickable) */}
                  <div
                    onClick={() => jumpToLatexSection('scope')}
                    className="p-3 rounded-lg border border-transparent hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative"
                    title="Click to jump to Scope of Work in LaTeX code"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" /> Jump to Code
                    </div>
                    <h3 className="text-xs font-bold text-sky-700 border-b border-slate-200 pb-1 mb-2">
                      1. Scope of Work & Deliverables
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      The Service Provider agrees to perform design, engineering, and deployment services for{' '}
                      <span className="font-bold text-slate-900">{compiledContractData.service}</span> as requested by{' '}
                      <span className="font-bold text-slate-900">{compiledContractData.clientName || 'Client'}</span>. All deliverables shall comply with standard performance benchmarks and security requirements.
                    </p>
                  </div>

                  {/* Clause 2: Compensation (Clickable) */}
                  <div
                    onClick={() => jumpToLatexSection('compensation')}
                    className="p-3 rounded-lg border border-transparent hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative"
                    title="Click to jump to Compensation terms in LaTeX code"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" /> Jump to Code
                    </div>
                    <h3 className="text-xs font-bold text-sky-700 border-b border-slate-200 pb-1 mb-2">
                      2. Compensation & Financial Terms
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      The Client agrees to pay the fixed consideration of{' '}
                      <span className="font-bold text-slate-900">
                        ₹{Number(compiledContractData.amount || 0).toLocaleString('en-IN')}
                      </span>{' '}
                      for the execution of the services detailed above. Payments shall be disbursed according to the agreed milestone structure.
                    </p>
                  </div>

                  {/* Clause 3: IP Rights */}
                  <div
                    onClick={() => jumpToLatexSection('ip')}
                    className="p-3 rounded-lg border border-transparent hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative"
                    title="Click to jump to IP Rights in LaTeX code"
                  >
                    <h3 className="text-xs font-bold text-sky-700 border-b border-slate-200 pb-1 mb-2">
                      3. Intellectual Property Rights
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Upon receipt of full financial settlement, all source code, assets, and documentation created specifically under this Agreement shall belong exclusively to the Client.
                    </p>
                  </div>

                  {/* Signatures Box (Clickable) */}
                  <div
                    onClick={() => jumpToLatexSection('signatures')}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-cyan-500/60 hover:bg-cyan-500/5 cursor-pointer transition-all group relative flex justify-between items-end mt-8"
                    title="Click to jump to Signature block in LaTeX code"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-600 bg-cyan-100 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3" /> Jump to Code
                    </div>

                    {/* Company Sign */}
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">For ZettaWeb Pvt. Ltd.</p>
                      {compiledContractData.companyStamp ? (
                        <img src={compiledContractData.companyStamp} alt="Stamp" className="h-12 w-12 object-contain mb-1" />
                      ) : (
                        <div className="h-10 border-b border-slate-300 mb-1 flex items-center">
                          <span className="text-xs font-bold text-sky-700">ZettaWeb Founder</span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-600">Authorized Officer</p>
                      <p className="text-[9px] text-slate-500">Date: {compiledContractData.date}</p>
                    </div>

                    {/* Client Sign */}
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        For {compiledContractData.clientName || 'Client'}
                      </p>
                      {compiledContractData.signature ? (
                        <img src={compiledContractData.signature} alt="Client Signature" className="h-12 max-w-[140px] object-contain ml-auto mb-1" />
                      ) : (
                        <div className="h-10 border-b border-slate-300 mb-1 flex items-center justify-end">
                          <span className="text-[10px] text-slate-400 italic">[ Digital Signature ]</span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-600">Client Acceptance Signature</p>
                      <p className="text-[9px] text-slate-500">Date: {compiledContractData.date}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-200 text-center text-[9px] text-slate-400">
                    ZettaWeb Pvt. Ltd. • Legally binding digital contract generated via ZettaWeb Enterprise Portal.
                  </div>

                </div>
              ) : (
                /* Heavy Raw PDF Engine Output View */
                <PDFViewer width="100%" height="100%" className="border-0 rounded-b-2xl min-h-[750px]">
                  <ContractPDF {...compiledContractData} />
                </PDFViewer>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ContractsManager;
