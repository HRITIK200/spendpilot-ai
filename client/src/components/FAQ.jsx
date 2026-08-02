import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How does SpendPilot AI calculate optimization savings?",
      answer: "We compare your team's active seat count, current subscription plans, and development workflows against standard vendor pricing schemas (e.g. ChatGPT Team/Plus, Claude Pro/Team, Cursor, Windsurf, Copilot). Using our cost engine rules, we identify overlapping subscriptions and right-size recommendations.",
    },
    {
      question: "Is my organization's subscription data secure?",
      answer: "Yes, entirely. SpendPilot AI requires no API access or credentials to your actual SaaS admin panels. You only enter anonymous seats and plan tiers. All evaluations are computed client-side, and results are stored securely in a sandboxed document database.",
    },
    {
      question: "What is a public shareable report link?",
      answer: "Once your spend audit is calculated, a unique record is created. Clicking 'Copy Public Report Link' copies a secure, anonymous URL to your clipboard. You can share this link with colleagues, department leads, or management to justify software budget consolidation.",
    },
    {
      question: "Which AI tools are supported by the platform?",
      answer: "We currently support audit analysis for ChatGPT Plus/Team/Enterprise, Claude Pro/Team, Cursor Pro/Business, GitHub Copilot Individual/Business/Enterprise, Gemini Advanced, Windsurf, as well as pay-as-you-go API consumption layers for OpenAI and Anthropic models.",
    },
  ];

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-950 text-white py-16 md:py-24 px-4 md:px-6 relative overflow-hidden border-t border-gray-900 no-print">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to know about optimizing your team's AI infrastructure budget.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? "bg-gray-900/60 border-gray-800 shadow-xl" 
                    : "bg-gray-900/20 border-gray-900 hover:border-gray-800"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 focus:outline-none"
                >
                  <span className="font-semibold text-gray-200 text-base md:text-lg hover:text-white transition-colors duration-200">
                    {item.question}
                  </span>
                  <span className={`p-1.5 rounded-lg bg-gray-800/50 text-gray-400 transition-all duration-300 ${
                    isOpen ? "rotate-180 text-blue-400 bg-blue-500/10" : ""
                  }`}>
                    <ChevronDown size={18} />
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 border-t border-gray-800/40" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 py-5 text-gray-400 text-sm md:text-base leading-relaxed bg-gray-950/20">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
