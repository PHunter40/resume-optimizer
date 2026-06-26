import React, { useState } from 'react';
import { Download, Loader, Check, AlertCircle } from 'lucide-react';

export default function ResumeOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const optimizeResume = async () => {
    if (!input.trim()) {
      setError('Please paste your resume content first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2500,
          messages: [
            {
              role: 'user',
              content: `You are an expert resume optimizer and ATS specialist. Transform this resume into a high-impact, ATS-friendly version that maximizes recruiter attention and passes through applicant tracking systems.

OPTIMIZATION RULES:
1. Use strong action verbs (Led, Spearheaded, Architected, Accelerated, Transformed)
2. Add quantifiable metrics to EVERY achievement (%, $, #, time saved)
3. Keywords: Include industry-relevant keywords naturally throughout
4. Format: Use bullet points, consistent spacing, clear hierarchy
5. Impact-first: Lead with business outcomes, not duties
6. Length: Condense to 1 page if possible (2 max)
7. Remove: Objectives, personal pronouns, generic statements, irrelevant skills

ORIGINAL RESUME:
${input}

OUTPUT FORMAT:
Return ONLY the optimized resume in clean text format with:
- [Name] - Contact info at top
- [Professional Summary] (2-3 lines, impact-focused)
- [Experience] - Organized by role with quantified bullets
- [Education]
- [Key Skills] - Relevant to target roles

NO PREAMBLE. START WITH THE RESUME.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const optimized = data.content[0].text;
      setOutput(optimized);
      setSuccess(true);
      setActiveTab('output');
    } catch (err) {
      setError(err.message || 'Failed to optimize resume. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'optimized-resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Resume copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-500/20 border border-blue-400/50 rounded-full text-sm font-medium text-blue-300">
            Powered by AI
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Resume Optimizer
          </h1>
          <p className="text-lg text-slate-400">
            Transform your resume into an ATS-friendly, high-impact masterpiece
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-slate-700/50 bg-slate-900/30">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'input'
                  ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Your Resume
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'output'
                  ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              disabled={!output}
            >
              Optimized Version
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'input' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Paste your current resume or CV
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="John Doe&#10;Senior Product Manager | 5+ years experience&#10;&#10;EXPERIENCE&#10;Product Manager, TechCorp (2020-2024)&#10;- Led team of 3 engineers&#10;- Launched new feature..."
                    className="w-full h-96 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-300 text-sm">Resume optimized successfully! Check the "Optimized Version" tab.</span>
                  </div>
                )}

                <button
                  onClick={optimizeResume}
                  disabled={loading || !input.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    'Optimize Resume'
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  ✨ AI-powered optimization • ATS-optimized • Ready to download
                </p>
              </div>
            )}

            {activeTab === 'output' && output && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Your Optimized Resume
                  </label>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-96 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={downloadResume}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <strong>Pro tip:</strong> Customize the optimized resume further by adding company-specific keywords from job descriptions. This maximizes your chances of passing ATS filters.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'output' && !output && (
              <div className="text-center py-16">
                <p className="text-slate-400 mb-4">No optimized resume yet</p>
                <button
                  onClick={() => setActiveTab('input')}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  ← Go back and optimize your resume
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Built with AI • Optimized for ATS • No data stored</p>
        </div>
      </div>
    </div>
  );
}
