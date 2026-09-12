import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import {
  Plus,
  Trash2,
  Download,
  FileText,
  Sparkles,
  FileCode,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Sliders,
  X,
  Shield,
  RotateCcw,
  Zap,
  MousePointerClick,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { UIverseButton } from '@/components/ui/uiverse';
import InvoicePDF from './InvoicePDF';
import { generateInvoiceLatex, parseInvoiceLatexLive, findLatexLineNumber } from '../../lib/latexGenerator';

export const InvoicesManager = () => {
  const [invoiceNo, setInvoiceNo] = useState('ZW-2026-0508');
  const [date, setDate] = useState('23 May, 2026');
  const [dueDate, setDueDate] = useState('14 Days');
  const [client, setClient] = useState('TechNova Solutions Pvt. Ltd.');
  const [clientEmail, setClientEmail] = useState('info@technova.com');
  const [advancePayment, setAdvancePayment] = useState(2500);
  const [remarks, setRemarks] = useState('Thank you for choosing ZettaWeb. We appreciate your business and look forward to working with you again.');
  
  // Dynamic Line Items State
  const [items, setItems] = useState([
    { name: 'Website Design & Development', qty: 1, price: 35000, discount: 0 },
    { name: 'Frontend Development', qty: 1, price: 25000, discount: 0 },
    { name: 'Backend Development', qty: 1, price: 20000, discount: 0 },
    { name: 'Testing & QA', qty: 1, price: 7500, discount: 0 },
    { name: 'Deployment & Support (30 Days)', qty: 1, price: 5000, discount: 0 },
  ]);

  // Branding & Picture Attachments State
  const [companyLogo, setCompanyLogo] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  // Editable LaTeX State & Overleaf Mode
  const [customLatex, setCustomLatex] = useState('');
  const [isManualLatexMode, setIsManualLatexMode] = useState(false);

  // Left Pane View Mode: 'latex' | 'pictures' | 'form'
  const [activeTab, setActiveTab] = useState('latex');
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Right Pane View Mode: 'sync' (0ms instant interactive) | 'pdf' (pdf engine)
  const [previewMode, setPreviewMode] = useState('sync');

  // Fullscreen Workspace & Preview Zoom State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Sync with browser native fullscreen and handle Esc key
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // SyncTeX Inverse Search Highlight state
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [syncedWord, setSyncedWord] = useState('');
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const editorContainerRef = useRef(null);
  const invoicePaperRef = useRef(null);
  // Pending scroll: stored across renders so the useEffect can apply it after tab switch
  const pendingScrollRef = useRef(null);

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0, discount: 0 }]);
    setIsManualLatexMode(false);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setIsManualLatexMode(false);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    setIsManualLatexMode(false);
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

  // Base Data calculations
  const subtotal = useMemo(() => items.reduce((acc, item) => {
    const q = Number(item.qty) || 0;
    const p = Number(item.price) || 0;
    const d = Number(item.discount) || 0;
    return acc + q * p * (1 - d / 100);
  }, 0), [items]);

  const finalTotal = Math.max(0, subtotal - Number(advancePayment || 0));

  const baseInvoiceData = useMemo(() => ({
    invoiceNo,
    date,
    dueDate,
    client,
    clientEmail,
    items,
    subtotal,
    advancePayment: Number(advancePayment) || 0,
    finalTotal,
    remarks,
    companyLogo,
    signature: signatureImage,
  }), [invoiceNo, date, dueDate, client, clientEmail, items, subtotal, advancePayment, finalTotal, remarks, companyLogo, signatureImage]);

  // Keep LaTeX code initialized
  useEffect(() => {
    if (!isManualLatexMode) {
      setCustomLatex(generateInvoiceLatex(baseInvoiceData));
    }
  }, [baseInvoiceData, isManualLatexMode]);

  // Parse LaTeX source string in real time whenever user types in the editor
  // Uses robust line-by-line tokenizer so every keystroke updates the preview instantly
  const compiledInvoiceData = useMemo(() => {
    if (customLatex) {
      return parseInvoiceLatexLive(customLatex, baseInvoiceData);
    }
    return baseInvoiceData;
  }, [customLatex, baseInvoiceData]);

  const handleLatexChange = (e) => {
    const text = e.target.value;
    setCustomLatex(text);
    setIsManualLatexMode(true);
  };

  const handleResetLatex = () => {
    const freshLatex = generateInvoiceLatex(baseInvoiceData);
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
    element.download = `${compiledInvoiceData.invoiceNo}_Invoice.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // After every render: if there's a pending scroll (from clicking preview), apply it now that the textarea is in the DOM.
  useEffect(() => {
    const pending = pendingScrollRef.current;
    if (!pending || activeTab !== 'latex') return;
    pendingScrollRef.current = null;

    const apply = () => {
      const el = editorRef.current;
      if (!el) return;
      const { targetIndex, matchLength, lineNumber } = pending;
      const lineHeight = 19;
      const textareaHeight = el.clientHeight || 580;
      // Line 1 is at top padding (16px from py-4). Each subsequent line is +19px.
      const targetY = 16 + (lineNumber - 1) * lineHeight;
      const scrollPos = Math.max(0, targetY - textareaHeight / 2 + lineHeight / 2);

      // Scroll textarea and gutter in sync
      el.scrollTop = scrollPos;
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollPos;

      // Focus and highlight the exact word/match in the textarea
      el.focus();
      try {
        el.setSelectionRange(targetIndex, targetIndex + matchLength);
      } catch (err) {
        // ignore range error
      }

      // Ensure editor container is visible within the left panel
      if (editorContainerRef.current) {
        editorContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Lock in scrollTop after browser's native selection scroll finishes
      requestAnimationFrame(() => {
        el.scrollTop = scrollPos;
        if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollPos;
      });
    };

    const id = setTimeout(apply, 40);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, highlightedLine]);

  // Robust Search Engine: Finds the exact word or phrase inside the LaTeX document body,
  // scoped to the clicked section (e.g. signatures, branding, totals) to avoid false matches on duplicate words like "ZettaWeb"
  const findBestMatchInLatex = (source, clickedWord, fullTargetText, fallbackSectionKey = 'header') => {
    if (!source) return null;

    // Clean clickedWord: strip surrounding quotes, punctuation, currency symbols
    const cleanWord = (clickedWord || '')
      .replace(/^[^\w\d@#.-]+|[^\w\d@#.-]+$/g, '')
      .trim();

    // Clean fullTargetText: collapse whitespace, remove currency symbols
    const cleanFull = (fullTargetText || '')
      .replace(/[₹$]/g, '')
      .replace(/INR/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const searchIn = (haystack, offset, needle) => {
      if (!needle || needle.length < 2) return -1;
      const idx = haystack.toLowerCase().indexOf(needle.toLowerCase());
      return idx !== -1 ? offset + idx : -1;
    };

    let targetIndex = -1;
    let matchLength = 0;
    let matchedSnippet = '';

    // PRIORITY 1: If fallbackSectionKey is provided and specific (e.g. 'signatures', 'branding', 'remarks', 'totals', 'items', 'client'),
    // search within that section's LaTeX block first! This disambiguates repeated words like "ZettaWeb" or "Technologies".
    if (fallbackSectionKey && fallbackSectionKey !== 'header') {
      const secLine = findLatexLineNumber(source, fallbackSectionKey);
      if (secLine > 1) {
        const linesArr = source.split('\n');
        let secStart = 0;
        for (let i = 0; i < secLine - 1; i++) {
          secStart += linesArr[i].length + 1;
        }
        // Section window: from section line to next 2500 characters
        const secWindow = source.substring(secStart, secStart + 2500);

        // 1a. Full phrase in section window
        if (cleanFull && cleanFull.length >= 2) {
          const fullLatex = cleanFull.replace(/&/g, '\\&').replace(/%/g, '\\%');
          let idx = searchIn(secWindow, secStart, fullLatex);
          if (idx === -1) idx = searchIn(secWindow, secStart, cleanFull);
          if (idx !== -1) {
            targetIndex = idx;
            matchLength = cleanFull.length;
            matchedSnippet = cleanFull;
            if (cleanWord && cleanWord.length >= 2) {
              const wIdx = cleanFull.toLowerCase().indexOf(cleanWord.toLowerCase());
              if (wIdx !== -1) {
                targetIndex = idx + wIdx;
                matchLength = cleanWord.length;
                matchedSnippet = cleanWord;
              }
            }
          }
        }

        // 1b. Exact clicked word in section window
        if (targetIndex === -1 && cleanWord && cleanWord.length >= 2) {
          const wordLatex = cleanWord.replace(/&/g, '\\&').replace(/%/g, '\\%');
          let idx = searchIn(secWindow, secStart, wordLatex);
          if (idx === -1) idx = searchIn(secWindow, secStart, cleanWord);
          if (idx !== -1) {
            targetIndex = idx;
            matchLength = cleanWord.length;
            matchedSnippet = cleanWord;
          }
        }
      }
    }

    // PRIORITY 2: Document body search (after \begin{document})
    const docStart = source.indexOf('\\begin{document}');
    const body = docStart !== -1 ? source.substring(docStart) : source;
    const bodyOffset = docStart !== -1 ? docStart : 0;

    // Strategy 2a: Exact full phrase/sentence in document body
    if (targetIndex === -1 && cleanFull && cleanFull.length >= 2) {
      const fullLatex = cleanFull.replace(/&/g, '\\&').replace(/%/g, '\\%');
      let idx = searchIn(body, bodyOffset, fullLatex);
      if (idx === -1) idx = searchIn(body, bodyOffset, cleanFull);
      if (idx === -1) idx = searchIn(source, 0, fullLatex);
      if (idx === -1) idx = searchIn(source, 0, cleanFull);

      if (idx !== -1) {
        targetIndex = idx;
        matchLength = cleanFull.length;
        matchedSnippet = cleanFull;

        if (cleanWord && cleanWord.length >= 2) {
          const wordInPhrase = cleanFull.toLowerCase().indexOf(cleanWord.toLowerCase());
          if (wordInPhrase !== -1) {
            targetIndex = idx + wordInPhrase;
            matchLength = cleanWord.length;
            matchedSnippet = cleanWord;
          }
        }
      }
    }

    // Strategy 2b: Exact clicked word in document body
    if (targetIndex === -1 && cleanWord && cleanWord.length >= 2) {
      const wordLatex = cleanWord.replace(/&/g, '\\&').replace(/%/g, '\\%');
      let idx = searchIn(body, bodyOffset, wordLatex);
      if (idx === -1) idx = searchIn(body, bodyOffset, cleanWord);
      if (idx === -1) idx = searchIn(source, 0, wordLatex);
      if (idx === -1) idx = searchIn(source, 0, cleanWord);

      if (idx !== -1) {
        targetIndex = idx;
        matchLength = cleanWord.length;
        matchedSnippet = cleanWord;
      }
    }

    // Strategy 3: Significant words from fullTargetText (longest first, >= 4 chars)
    if (targetIndex === -1 && cleanFull) {
      const words = cleanFull
        .split(/\s+/)
        .map(w => w.replace(/[^\w\d-]/g, ''))
        .filter(w => w.length >= 4)
        .sort((a, b) => b.length - a.length);

      for (const w of words) {
        let idx = searchIn(body, bodyOffset, w);
        if (idx === -1) idx = searchIn(source, 0, w);
        if (idx !== -1) {
          targetIndex = idx;
          matchLength = w.length;
          matchedSnippet = w;
          break;
        }
      }
    }

    // Strategy 4: Fallback section line
    let lineNumber = 1;
    if (targetIndex !== -1) {
      const textBefore = source.substring(0, targetIndex);
      lineNumber = (textBefore.match(/\n/g) || []).length + 1;
    } else if (fallbackSectionKey) {
      lineNumber = findLatexLineNumber(source, fallbackSectionKey);
      const linesArr = source.split('\n');
      let pos = 0;
      for (let i = 0; i < Math.min(lineNumber - 1, linesArr.length); i++) {
        pos += linesArr[i].length + 1;
      }
      targetIndex = pos;
      matchLength = linesArr[lineNumber - 1] ? linesArr[lineNumber - 1].length : 0;
      matchedSnippet = linesArr[lineNumber - 1] ? linesArr[lineNumber - 1].trim() : '';
    }

    if (targetIndex === -1) return null;

    return { targetIndex, matchLength, lineNumber, matchedSnippet };
  };

  // Word/Element-level SyncTeX: Click any text/word/row in Preview to jump directly to that exact word in the LaTeX editor!
  const jumpToTextInLatex = (clickedText, fallbackSectionKey = 'header', fullContextText = '') => {
    const source = customLatex || '';
    if (!source) return;

    const match = findBestMatchInLatex(source, clickedText, fullContextText || clickedText, fallbackSectionKey);
    if (!match) return;

    const { targetIndex, matchLength, lineNumber, matchedSnippet } = match;

    // Store the scroll intent — the useEffect will apply it once the textarea is in the DOM
    pendingScrollRef.current = { targetIndex, matchLength, lineNumber, matchedSnippet };
    setHighlightedLine(lineNumber);
    setSyncedWord(matchedSnippet);
    setActiveTab('latex');

    setTimeout(() => {
      setHighlightedLine(null);
      setSyncedWord('');
    }, 4500);
  };

  // Global handler for clicking anywhere inside the paper invoice preview
  const handleInvoiceWordClick = (e) => {
    // 1. Detect section from nearest data-section ancestor
    const sectionEl = e.target.closest('[data-section]');
    const sectionKey = sectionEl?.dataset?.section || 'header';

    // 2. Check if the user highlighted text with the cursor
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length >= 2) {
      jumpToTextInLatex(selection, sectionKey, e.target.innerText || '');
      return;
    }

    // 3. Extract the exact word directly under mouse coordinates using Caret Range / Position API
    let clickedWord = '';
    try {
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range && range.startContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
          const text = range.startContainer.textContent || '';
          const offset = range.startOffset;
          let start = offset;
          if (start > 0 && /\s/.test(text[start]) && !/\s/.test(text[start - 1])) start--;
          while (start > 0 && /[^\s,;:"'()[\]{}]/.test(text[start - 1])) start--;
          let end = offset;
          while (end < text.length && /[^\s,;:"'()[\]{}]/.test(text[end])) end++;
          clickedWord = text.substring(start, end).trim();
        }
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos && pos.offsetNode && pos.offsetNode.nodeType === Node.TEXT_NODE) {
          const text = pos.offsetNode.textContent || '';
          const offset = pos.offset;
          let start = offset;
          if (start > 0 && /\s/.test(text[start]) && !/\s/.test(text[start - 1])) start--;
          while (start > 0 && /[^\s,;:"'()[\]{}]/.test(text[start - 1])) start--;
          let end = offset;
          while (end < text.length && /[^\s,;:"'()[\]{}]/.test(text[end])) end++;
          clickedWord = text.substring(start, end).trim();
        }
      }
    } catch (err) {
      // ignore
    }

    const fullText = (e.target.innerText || e.target.textContent || '').trim();
    const word = clickedWord || fullText;
    jumpToTextInLatex(word, sectionKey, fullText);
  };

  // Line numbers array
  const lineNumbers = useMemo(() => {
    const totalLines = (customLatex.match(/\n/g) || []).length + 1;
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [customLatex]);

  const content = (
    <div className={`w-full text-white transition-all duration-300 ${
      isFullscreen
        ? 'fixed inset-0 z-[999999] bg-slate-950 p-4 md:p-6 overflow-hidden flex flex-col h-screen w-screen'
        : 'space-y-6 p-2 md:p-4 bg-slate-950 min-h-screen'
    }`}>
      {/* Top Header Strip & Overleaf Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              Invoice Studio (Overleaf View & SyncTeX)
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time LaTeX editor with bidirectional SyncTeX: Click any Invoice section to jump directly to its code line!
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 ring-2 ring-rose-500/20'
                : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
            title={isFullscreen ? "Exit Fullscreen Workspace (Esc)" : "Enter Fullscreen Workspace"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Studio'}</span>
          </button>

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
            document={<InvoicePDF {...compiledInvoiceData} />}
            fileName={`${compiledInvoiceData.invoiceNo}_${compiledInvoiceData.client || 'Invoice'}.pdf`}
          >
            {({ loading }) => (
              <UIverseButton variant="neon" icon={Download} isLoading={loading}>
                Download PDF
              </UIverseButton>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Side-by-Side Overleaf Split Workspace */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ${isFullscreen ? 'flex-1 h-[calc(100vh-90px)] overflow-hidden' : ''}`}>
        
        {/* LEFT PANE: Controls & Code Editor */}
        <div className={`lg:col-span-6 space-y-4 overflow-y-auto pr-1 scrollbar-thin ${isFullscreen ? 'h-full max-h-[calc(100vh-90px)]' : 'max-h-[82vh]'}`}>
          
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
              {(companyLogo || signatureImage) && (
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

          {/* TAB 1: Overleaf LaTeX Code Editor with Line Numbers */}
          {activeTab === 'latex' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="h-4 w-4" /> Overleaf Code Editor
                </h3>

                <div className="flex items-center gap-2">
                  {highlightedLine && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono animate-pulse flex items-center gap-1.5 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Synced to Line {highlightedLine}
                      {syncedWord ? `: "${syncedWord}"` : ''}
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
              <div
                ref={editorContainerRef}
                className={`relative flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner font-mono text-xs ${
                  isFullscreen ? 'h-[calc(100vh-230px)]' : 'h-[620px]'
                }`}
              >
                {/* Line Numbers Column */}
                <div
                  ref={lineNumbersRef}
                  className="w-12 bg-slate-900/95 py-4 text-right pr-2.5 select-none text-slate-600 border-r border-slate-800/80 overflow-hidden font-mono text-xs shrink-0 pointer-events-none"
                  style={{ lineHeight: '19px', fontSize: '12px' }}
                >
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      id={`line-num-${num}`}
                      style={{ height: '19px', lineHeight: '19px' }}
                      className={`transition-colors truncate ${
                        highlightedLine === num
                          ? 'text-cyan-300 font-bold bg-cyan-500/30 px-1 rounded shadow-sm'
                          : ''
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* Editable Textarea */}
                <textarea
                  ref={editorRef}
                  wrap="off"
                  value={customLatex}
                  onChange={handleLatexChange}
                  onScroll={(e) => {
                    if (lineNumbersRef.current) {
                      lineNumbersRef.current.scrollTop = e.target.scrollTop;
                    }
                  }}
                  spellCheck={false}
                  placeholder="Type LaTeX code here..."
                  className="flex-1 h-full bg-transparent py-4 px-3 text-emerald-300 outline-none resize-none whitespace-pre font-mono scrollbar-thin overflow-y-auto overflow-x-auto"
                  style={{ lineHeight: '19px', fontSize: '12px' }}
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
                    <span className="text-xs font-semibold text-slate-300">Click to upload Invoice Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setCompanyLogo)}
                    />
                  </label>
                )}
              </div>

              {/* Authorized Signature Picture */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Authorized Signatory Image
                  </h3>
                  {signatureImage && (
                    <button
                      onClick={() => setSignatureImage(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> Remove Signature
                    </button>
                  )}
                </div>

                {signatureImage ? (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
                    <img src={signatureImage} alt="Signature" className="h-14 object-contain rounded" />
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Signature Attached
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl bg-slate-950 cursor-pointer transition-all">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-300">Click to upload Signature / Stamp Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setSignatureImage)}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Visual Invoice Form Controls */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Form Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Invoice #</label>
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => {
                        setInvoiceNo(e.target.value);
                        setIsManualLatexMode(false);
                      }}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Invoice Date</label>
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

                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase">Client Name</label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => {
                        setClient(e.target.value);
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
              </div>

              {/* Dynamic Line Items */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Itemized Billing Lines</span>
                  <span className="text-xs text-slate-400 font-normal">{items.length} Line Items</span>
                </h3>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800"
                    >
                      <div className="col-span-12 sm:col-span-5">
                        <input
                          type="text"
                          placeholder="Item Description"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="Rate ₹"
                          value={item.price}
                          onChange={(e) => updateItem(idx, 'price', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Disc %"
                          value={item.discount}
                          onChange={(e) => updateItem(idx, 'discount', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex justify-end">
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addItem}
                    className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs font-medium transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Item Line
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANE: Sticky Real-time Overleaf Preview & SyncTeX */}
        <div className={`lg:col-span-6 sticky top-4 ${isFullscreen ? 'h-full max-h-[calc(100vh-90px)]' : ''}`}>
          <div className={`rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col ${isFullscreen ? 'h-full max-h-[calc(100vh-90px)]' : 'h-[82vh]'}`}>
            
            {/* Right Pane Header Mode Switch & Zoom Controls */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-slate-300">Overleaf Live Invoice Compiled Preview</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Zoom Controls */}
                {previewMode === 'sync' && (
                  <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 text-xs">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0.65, Number((prev - 0.05).toFixed(2))))}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] font-mono text-cyan-400 px-1 font-bold min-w-[34px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(1.4, Number((prev + 0.05).toFixed(2))))}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1.0)}
                      className="px-1.5 py-0.5 text-[9px] rounded text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                      title="Reset Zoom to 100%"
                    >
                      100%
                    </button>
                  </div>
                )}

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
                    <span>SyncTeX Live View</span>
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
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="flex-1 w-full bg-slate-950 overflow-x-auto overflow-y-auto p-2 sm:p-4 scrollbar-thin">
              {previewMode === 'sync' ? (
                /* Instant 0ms Interactive SyncTeX Paper Invoice (Split Layout Navy + Gold) */
                <div
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                  className="transition-transform duration-150 ease-out flex justify-center w-full"
                >
                  <div
                    id="invoice-paper-container"
                    ref={invoicePaperRef}
                    onClick={handleInvoiceWordClick}
                    onDoubleClick={handleInvoiceWordClick}
                    style={{ fontFamily: "'NotoSans', sans-serif" }}
                    className="invoice-paper-canvas w-[595px] h-[842px] min-h-[842px] max-h-[842px] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm select-text relative overflow-hidden flex flex-row justify-between cursor-pointer leading-[1.2]"
                  >
                  
                  {/* Watermark Logo in background */}
                  <img
                    src="/logo.png"
                    alt="ZettaWeb Watermark"
                    className="absolute top-[190px] right-[30px] w-[240px] h-[240px] opacity-[0.04] pointer-events-none object-contain select-none z-0"
                  />

                  {/* LEFT BRANDING PANEL (33% width) */}
                  <div
                    data-section="branding"
                    style={{ width: '33%', height: '842px' }}
                    className="bg-[#061B33] text-white p-[18px] flex flex-col justify-between border-r-[3px] border-[#D99A22] shrink-0 z-10 box-border"
                  >
                    <div>
                      {/* Logo & Company Name */}
                      <div
                        onClick={() => jumpToTextInLatex('ZETTAWEB', 'branding')}
                        className="cursor-pointer text-center"
                      >
                        <img
                          src={compiledInvoiceData.companyLogo || '/logo.png'}
                          alt="Logo"
                          className="w-full max-h-[55px] object-contain mb-[8px] mx-auto"
                        />
                        <div className="text-[18px] font-bold text-center leading-none text-white tracking-normal font-['NotoSans']">
                          ZETTA<span className="text-[#F0B943]">WEB</span>
                        </div>
                        <p className="text-[6.5px] text-[#CBD5E1] text-center mt-[2px] tracking-[0.5px] uppercase font-normal leading-tight">
                          BUILDING IDEAS. EMPOWERING DIGITAL.
                        </p>
                      </div>

                      {/* Company Details */}
                      <div className="mt-[15px] pt-[12px] border-t border-[#334155] space-y-[9px]">
                        <div>
                          <p className="text-[7px] font-bold text-[#F0B943] mb-[2px] tracking-[0.5px] uppercase leading-none">LOCATION</p>
                          <p className="text-[7.5px] text-[#E2E8F0] leading-[1.25]">ZettaWeb Technologies Pvt. Ltd.</p>
                          <p className="text-[7.5px] text-[#E2E8F0] leading-[1.25]">Bhubaneswar, Odisha - 751024</p>
                        </div>

                        <div>
                          <p className="text-[7px] font-bold text-[#F0B943] mb-[2px] tracking-[0.5px] uppercase leading-none">EMAIL</p>
                          <p className="text-[7.5px] text-[#E2E8F0] leading-[1.25]">hello@zettaweb.in</p>
                        </div>

                        <div>
                          <p className="text-[7px] font-bold text-[#F0B943] mb-[2px] tracking-[0.5px] uppercase leading-none">WEBSITE</p>
                          <p className="text-[7.5px] text-[#E2E8F0] leading-[1.25]">www.zettaweb.in</p>
                        </div>

                        <div>
                          <p className="text-[7px] font-bold text-[#F0B943] mb-[2px] tracking-[0.5px] uppercase leading-none">PHONE</p>
                          <p className="text-[7.5px] text-[#E2E8F0] leading-[1.25]">+91 78478 01234</p>
                        </div>
                      </div>
                    </div>

                    {/* Tagline Footer in Left Sidebar */}
                    <div className="pt-[10px] border-t border-[#334155]">
                      <p className="text-[6.5px] font-bold text-white tracking-[0.3px] uppercase leading-tight">
                        BUILDING DIGITAL EXPERIENCES
                      </p>
                      <p className="text-[6.5px] font-bold text-[#F0B943] tracking-[0.3px] uppercase leading-tight">
                        THAT DRIVE GROWTH.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT CONTENT AREA (67% width) */}
                  <div
                    style={{ width: '67%', height: '842px' }}
                    className="flex flex-col justify-between relative bg-white shrink-0 z-10 box-border"
                  >
                    {/* Right Inner Content: flex-1 flex flex-col justify-between */}
                    <div className="pt-[18px] px-[20px] pb-[8px] flex-1 flex flex-col justify-between box-border">
                      <div>
                        {/* Header Title & Invoice No */}
                        <div data-section="header" className="flex flex-row justify-between items-start mb-[8px]">
                          <div
                            onClick={(e) => jumpToTextInLatex(e.target.innerText || 'INVOICE', 'header')}
                            onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'INVOICE', 'header')}
                            className="cursor-pointer"
                          >
                            <div className="text-[22px] font-bold text-[#061B33] tracking-[0.5px] leading-none font-['NotoSans']">INVOICE</div>
                            <div className="w-[38px] h-[3px] bg-[#D99A22] mt-[3px] rounded-[1.5px]"></div>
                          </div>
                          <div className="text-right">
                            <p className="text-[7px] font-bold text-[#64748B] text-right tracking-[0.5px] leading-none">INVOICE NO.</p>
                            <p className="text-[13px] font-bold text-[#1677C8] text-right mt-[2px] leading-none">{compiledInvoiceData.invoiceNo}</p>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div
                          onClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.date, 'ref')}
                          onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.date, 'ref')}
                          className="flex flex-row border-t border-[#E2E8F0] pt-[6px] mb-[10px] cursor-pointer"
                        >
                          <div className="flex-1 space-y-[2.5px] pr-[8px]">
                            <div className="flex justify-between leading-tight">
                              <span className="text-[7.5px] text-[#64748B]">Invoice Date :</span>
                              <span className="text-[7.5px] font-bold text-[#1E293B]">{compiledInvoiceData.date}</span>
                            </div>
                            <div className="flex justify-between leading-tight">
                              <span className="text-[7.5px] text-[#64748B]">Due Date :</span>
                              <span className="text-[7.5px] font-bold text-[#1E293B]">{compiledInvoiceData.dueDate || '14 Days'}</span>
                            </div>
                            <div className="flex justify-between leading-tight">
                              <span className="text-[7.5px] text-[#64748B]">Issue Date :</span>
                              <span className="text-[7.5px] font-bold text-[#1E293B]">{compiledInvoiceData.date}</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-[2.5px] pr-[8px]">
                            <div className="flex justify-between leading-tight">
                              <span className="text-[7.5px] text-[#64748B]">Payment Terms :</span>
                              <span className="text-[7.5px] font-bold text-[#1E293B]">{compiledInvoiceData.dueDate || '14 Days'}</span>
                            </div>
                            <div className="flex justify-between leading-tight">
                              <span className="text-[7.5px] text-[#64748B]">Currency :</span>
                              <span className="text-[7.5px] font-bold text-[#1E293B]">INR</span>
                            </div>
                          </div>
                        </div>

                        {/* Bill To & Project Card */}
                        <div className="flex flex-row justify-between mb-[10px]">
                          <div
                            data-section="client"
                            style={{ width: '56%' }}
                            onClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.client, 'client')}
                            onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.client, 'client')}
                            className="cursor-pointer"
                          >
                            <p className="text-[7.5px] font-bold text-[#D99A22] mb-[2px] tracking-[0.5px] uppercase leading-none">BILL TO</p>
                            <p className="text-[10px] font-bold text-[#0F172A] leading-tight">{compiledInvoiceData.client || 'Valued Client'}</p>
                            <p className="text-[7.5px] text-[#475569] mt-[1.5px] leading-tight">{compiledInvoiceData.clientEmail || 'billing@acme.com'}</p>
                          </div>

                          <div
                            data-section="ref"
                            style={{ width: '40%' }}
                            onClick={(e) => jumpToTextInLatex(e.target.innerText || 'Digital Solutions', 'ref')}
                            onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'Digital Solutions', 'ref')}
                            className="bg-[#F1F6FB] p-[7px] rounded-[4px] border border-[#E2E8F0] cursor-pointer"
                          >
                            <p className="text-[7.5px] font-bold text-[#1677C8] mb-[2px] leading-none">PROJECT / REFERENCE</p>
                            <p className="text-[7.5px] font-bold text-[#1E293B] leading-tight">Digital Solutions</p>
                            <div className="w-[20px] h-[1.5px] bg-[#D99A22] my-[2px]"></div>
                            <p className="text-[6.5px] text-[#64748B] leading-none">Project ID: ZW-REF-0426</p>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div
                          data-section="items"
                          onClick={(e) => jumpToTextInLatex(e.target.innerText || 'Services', 'items')}
                          onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'Services', 'items')}
                          className="mb-[8px] border border-[#E2E8F0] rounded-[4px] overflow-hidden cursor-pointer"
                        >
                          {/* Table Header */}
                          <div className="bg-[#061B33] py-[4px] px-[4px] flex flex-row text-[7px] font-bold text-white leading-none">
                            <div style={{ width: '8%' }} className="text-center">#</div>
                            <div style={{ width: '42%' }} className="text-left">DESCRIPTION</div>
                            <div style={{ width: '10%' }} className="text-center">QTY</div>
                            <div style={{ width: '16%' }} className="text-right">RATE (INR)</div>
                            <div style={{ width: '10%' }} className="text-center">TAX</div>
                            <div style={{ width: '14%' }} className="text-right">AMOUNT (INR)</div>
                          </div>

                          {/* Table Rows */}
                          {(compiledInvoiceData.items || []).map((item, idx) => {
                            const q = Number(item.qty) || 1;
                            const p = Number(item.price) || 0;
                            const d = Number(item.discount) || 0;
                            const rowAmt = q * p * (1 - d / 100);

                            return (
                              <div
                                key={idx}
                                onClick={(e) => jumpToTextInLatex(e.target.innerText || item.name, 'items')}
                                onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || item.name, 'items')}
                                style={{ backgroundColor: idx % 2 === 1 ? '#F8FAFC' : '#FFFFFF' }}
                                className="flex flex-row py-[3.5px] px-[4px] border-b border-[#E2E8F0] text-[7.5px] items-center last:border-b-0 hover:bg-cyan-50/50 transition-colors leading-none"
                              >
                                <div style={{ width: '8%' }} className="text-center font-bold text-[#1677C8]">{String(idx + 1).padStart(2, '0')}</div>
                                <div style={{ width: '42%' }} className="text-left font-bold text-[#1E293B] truncate pr-1">{item.name || `Service ${idx + 1}`}</div>
                                <div style={{ width: '10%' }} className="text-center text-[#475569]">{q}</div>
                                <div style={{ width: '16%' }} className="text-right text-[#475569]">{p.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <div style={{ width: '10%' }} className="text-center text-[7px] text-[#64748B]">18% GST</div>
                                <div style={{ width: '14%' }} className="text-right font-bold text-[#1677C8]">{rowAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Payment Details & Totals Breakdown */}
                        <div className="flex flex-row justify-between mb-[8px]">
                          {/* Payment Details Card */}
                          <div
                            data-section="totals"
                            style={{ width: '48%' }}
                            onClick={(e) => jumpToTextInLatex(e.target.innerText || 'PAYMENT DETAILS', 'totals')}
                            onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'PAYMENT DETAILS', 'totals')}
                            className="bg-[#F1F6FB] p-[7px] rounded-[4px] border border-[#E2E8F0] cursor-pointer"
                          >
                            <p className="text-[7.5px] font-bold text-[#1677C8] mb-[3px] leading-none">PAYMENT DETAILS</p>
                            <div className="flex justify-between mb-[1.5px] leading-tight"><span className="text-[7px] text-[#64748B]">Bank Name :</span><span className="text-[7px] font-bold text-[#1E293B]">HDFC Bank</span></div>
                            <div className="flex justify-between mb-[1.5px] leading-tight"><span className="text-[7px] text-[#64748B]">Account No. :</span><span className="text-[7px] font-bold text-[#1E293B]">50200012345678</span></div>
                            <div className="flex justify-between mb-[1.5px] leading-tight"><span className="text-[7px] text-[#64748B]">IFSC Code :</span><span className="text-[7px] font-bold text-[#1E293B]">HDFC0001234</span></div>
                            <div className="flex justify-between leading-tight"><span className="text-[7px] text-[#64748B]">UPI ID :</span><span className="text-[7px] font-bold text-[#1E293B]">zettaweb@oksbi</span></div>
                          </div>

                          {/* Totals Breakdown */}
                          <div
                            data-section="totals"
                            style={{ width: '48%' }}
                            onClick={(e) => jumpToTextInLatex(e.target.innerText || 'GRAND TOTAL', 'totals')}
                            onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'GRAND TOTAL', 'totals')}
                            className="border border-[#E2E8F0] rounded-[4px] overflow-hidden cursor-pointer"
                          >
                            {(() => {
                              const sub = Number(compiledInvoiceData.subtotal || 0);
                              const disc = Number(compiledInvoiceData.advancePayment || 0);
                              const tax = Math.max(0, sub - disc);
                              const cgst = tax * 0.09;
                              const sgst = tax * 0.09;
                              const gTotal = tax + cgst + sgst;

                              return (
                                <div>
                                  <div className="p-[5px] space-y-[2px] text-[7.5px] text-[#475569] bg-white">
                                    <div className="flex justify-between leading-tight"><span>Subtotal</span><span>₹{sub.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between leading-tight text-[#E53935]"><span>Discount</span><span>-₹{disc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between leading-tight"><span>Taxable Amount</span><span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between leading-tight"><span>CGST (9%)</span><span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between leading-tight"><span>SGST (9%)</span><span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                                  </div>
                                  <div className="bg-[#061B33] py-[4px] px-[6px] flex flex-row justify-between items-center text-white">
                                    <span className="text-[7.5px] font-bold tracking-[0.5px] leading-none">GRAND TOTAL</span>
                                    <span className="text-[11px] font-bold text-[#F0B943] leading-none">₹{gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Footer Notes & Signature & QR */}
                      <div className="flex flex-row justify-between items-end pt-[6px] border-t border-[#E2E8F0]">
                        {/* Notes */}
                        <div
                          data-section="remarks"
                          style={{ width: '40%' }}
                          onClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.remarks, 'remarks')}
                          onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || compiledInvoiceData.remarks, 'remarks')}
                          className="cursor-pointer"
                        >
                          <p className="text-[7.5px] font-bold text-[#1677C8] mb-[2px] leading-none">NOTES</p>
                          <p className="text-[7px] text-[#475569] leading-[1.25]">
                            {compiledInvoiceData.remarks || 'Thank you for choosing ZettaWeb. We appreciate your business and look forward to working with you again.'}
                          </p>
                        </div>

                        {/* Signature Block */}
                        <div
                          data-section="signatures"
                          style={{ width: '36%' }}
                          onClick={(e) => jumpToTextInLatex(e.target.innerText || 'Authorized Signatory', 'signatures')}
                          onDoubleClick={(e) => jumpToTextInLatex(e.target.innerText || 'Authorized Signatory', 'signatures')}
                          className="text-center flex flex-col items-center cursor-pointer"
                        >
                          <p className="text-[7px] text-[#475569] mb-[2px] text-center leading-none">
                            For {compiledInvoiceData.signatureCompany || 'ZettaWeb Technologies Pvt. Ltd.'}
                          </p>
                          {compiledInvoiceData.signature ? (
                            <img src={compiledInvoiceData.signature} alt="Signature" className="h-[25px] max-h-[25px] object-contain my-[2px] mx-auto" />
                          ) : (
                            <p style={{ fontFamily: 'Times New Roman, Times, serif' }} className="text-[13px] italic text-[#1677C8] my-[2px] leading-none text-center">
                              ZettaWeb
                            </p>
                          )}
                          <div className="w-[75px] h-[1px] bg-[#D99A22] my-[2px]"></div>
                          <p className="text-[7.5px] font-bold text-[#0F172A] text-center leading-none">Authorized Signatory</p>
                        </div>

                        {/* Scan to Pay QR */}
                        <div data-section="qr" style={{ width: '20%' }} className="text-center flex flex-col items-center">
                          <div className="bg-[#061B33] p-[3px] rounded-[4px] inline-flex items-center justify-center">
                            <div className="w-[32px] h-[32px] bg-white rounded-[2px] flex items-center justify-center text-[9px] font-bold text-[#061B33] leading-none">
                              QR
                            </div>
                          </div>
                          <p className="text-[6.5px] font-bold text-[#1E293B] mt-[2px] leading-none">Scan to Pay</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Footer Bar */}
                    <div className="bg-[#061B33] border-t-[1.5px] border-[#D99A22] h-[22px] px-[12px] flex justify-between items-center shrink-0">
                      <p className="text-[6.5px] text-white tracking-[0.3px] leading-none">
                        • BUILDING DIGITAL EXPERIENCES <span className="text-[#F0B943] font-bold">THAT DRIVE GROWTH.</span>
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            ) : (
                /* Raw PDF Engine Output View */
                <div className="w-full h-full min-h-[850px] bg-slate-900 rounded-xl overflow-hidden p-2">
                  <PDFViewer width="100%" height="100%" className="w-full h-[850px] border-0 rounded-lg">
                    <InvoicePDF {...compiledInvoiceData} />
                  </PDFViewer>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return isFullscreen ? createPortal(content, document.body) : content;
};

export default InvoicesManager;
