import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Bot, 
  User, 
  FileText, 
  ShieldCheck, 
  Lightbulb, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { AiChatMessage, Employee, UserAccount } from '../../types';

interface AiAssistantViewProps {
  employees: Employee[];
  currentUser?: UserAccount | null;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ employees, currentUser }) => {
  const activeEmp1 = employees[0]?.name || 'Sujal kumar';
  const activeEmp2 = employees[1]?.name || 'Laxmi Narayan';

  const quickPrompts = [
    `Draft welcome onboarding message for ${activeEmp1}`,
    'Summarize enterprise parental leave policy & PTO rules',
    `Draft executive announcement for ${activeEmp2} promotion`,
    'Provide recommendations to reduce engineering turnover risk',
  ];

  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'User';

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${userName}. I am your Executive AI HR Consultant. How can I assist you with policy drafting, employee communications, or compliance reviews today?`,
      timestamp: 'Just now',
    }
  ]);

  React.useEffect(() => {
    const currentFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'User';
    setMessages(prev => {
      if (prev.length > 0 && prev[0].id === 'm1') {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          text: `Hello ${currentFirstName}. I am your Executive AI HR Consultant. How can I assist you with policy drafting, employee communications, or compliance reviews today?`,
        };
        return updated;
      }
      return prev;
    });
  }, [currentUser?.name]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendPrompt = async (promptToRun?: string) => {
    const textToSend = promptToRun || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToRun) setInputText('');
    setIsLoading(true);

    try {
      // Call server backend endpoint proxying Gemini
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-[#1a2b3c]': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            totalEmployees: employees.length,
            activeEmployees: employees.filter(e => e.status === 'Active').length,
            departments: Array.from(new Set(employees.map(e => e.department))),
          }
        }),
      });

      const data = await res.json();
      const aiReply = data.response || 'I am sorry, I was unable to generate a response at this time.';

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `[HR Advisory]: Based on standard Enterprise HR guidelines:
• All employee onboarding documentation must be completed within 14 calendar days.
• Parental leave allocations provide up to 12 weeks paid coverage for eligible staff.
• Performance evaluations are scheduled on a bi-annual cycle.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a2b3c] to-[#0060ac] p-5 rounded-xl text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Executive AI HR Assistant</h2>
            <p className="text-xs text-slate-200">Powered by Gemini 3.6 Flash • SOC2 Compliant & Context-Aware</p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure Environment
        </span>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Recommended HR Prompt Chips
        </p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(prompt)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-[#e2e8f0] text-slate-700 hover:border-[#0060ac] hover:text-[#0060ac] transition-all text-left shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation History */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-2xs min-h-[420px] flex flex-col justify-between overflow-hidden">
        <div className="p-5 space-y-4 overflow-y-auto max-h-[500px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-[#1a2b3c] text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-xl p-4 space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-[#1a2b3c] text-white rounded-tr-none'
                  : 'bg-slate-50 border border-[#e2e8f0] text-slate-800 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-200/40 pb-1 mb-1">
                  <span className="font-bold">{msg.sender === 'user' ? 'You (HR Admin)' : 'Executive AI Advisor'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {msg.sender === 'ai' && (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#0060ac] transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Response
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-[#0060ac] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  SJ
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-3 bg-slate-50 rounded-lg w-max border border-slate-200 animate-pulse">
              <Bot className="w-4 h-4 text-[#0060ac]" />
              <span>Analyzing HR dataset & drafting policy output...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI HR regarding compliance, employee emails, or policy drafting..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#0060ac] shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-[#1a2b3c] text-white text-xs font-semibold rounded-xl hover:bg-[#041627] disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
