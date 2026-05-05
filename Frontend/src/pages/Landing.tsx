import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Star, Zap, Shield, Smartphone } from 'lucide-react'

const FEATURES = [
  { icon: '😊', title: 'Face Attendance',      desc: 'AI camera-based attendance. Confidence score recorded. Works instantly.',         color: 'from-primary-600 to-primary-800' },
  { icon: '👆', title: 'Fingerprint Auth',      desc: 'Device biometric sensor. SHA-256 hash stored. Privacy-first approach.',         color: 'from-cyan-600 to-cyan-800' },
  { icon: '📸', title: 'AI Result Scan',        desc: 'Photo of answer sheet → Gemini Vision extracts marks. Zero manual entry.',      color: 'from-emerald-600 to-emerald-800' },
  { icon: '🤖', title: 'AI Doubt Solver',       desc: 'Students ask doubts in Hindi/English. AI explains step-by-step.',              color: 'from-violet-600 to-violet-800' },
  { icon: '🔮', title: 'ML Fail Prediction',    desc: 'Machine learning predicts at-risk students. Low/Medium/High risk levels.',      color: 'from-pink-600 to-pink-800' },
  { icon: '⚡', title: 'Full Automation',       desc: 'Absent → parent SMS. Fee due → auto reminder. All notifications automated.',   color: 'from-amber-600 to-amber-800' },
  { icon: '💰', title: 'Fee Management',        desc: 'Razorpay integration, auto receipts, late fee, partial payments tracking.',    color: 'from-green-600 to-green-800' },
  { icon: '📱', title: 'Android App',           desc: 'Flutter APK with face attendance, fingerprint, push notifications.',           color: 'from-blue-600 to-blue-800' },
  { icon: '⚙️', title: 'Super Admin Control',  desc: 'Toggle any feature institute-wide. Face on/off, AI on/off, SMS on/off.',       color: 'from-slate-600 to-slate-800' },
]

const PLANS = [
  { name: 'Free',       price: '₹0',    sub: '/month',   desc: 'Get started',       color: 'text-gray-400',    features: ['100 students', 'Manual attendance', 'Basic notices', '5 AI queries/day'], cta: 'Start Free' },
  { name: 'Pro',        price: '₹999',  sub: '/month',   desc: 'Growing schools',   color: 'text-primary-400', popular: true,
    features: ['Unlimited students', 'Face + Fingerprint', 'AI Result Scan', 'Unlimited AI', 'WhatsApp alerts', 'ML Predictions', 'Android app'], cta: 'Start Trial' },
  { name: 'Enterprise', price: 'Custom', sub: '',        desc: 'Large institutes',  color: 'text-accent-amber', features: ['Multi-institute', 'Custom branding', 'SLA 99.9%', 'Custom AI training', 'API access', 'Priority support'], cta: 'Contact Sales' },
]

const TESTIMONIALS = [
  { name: 'Rajesh Kumar',  role: 'Principal, DPS', text: 'Face attendance ne hamara 2 ghante ka kaam 5 minute mein kar diya. Parents ko auto SMS jata hai.', stars: 5 },
  { name: 'Priya Sharma',  role: 'Teacher, KV',    text: 'AI question paper generator is amazing. 2 hours ka kaam 2 minutes mein. Answer key bhi auto.', stars: 5 },
  { name: 'Anita Singh',   role: 'Administrator',  text: 'Photo se marks extract karna — actually works! Result entry time reduced by 80%.', stars: 5 },
]

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen mesh-bg overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-[5%] h-16 bg-dark-900/85 backdrop-blur-xl border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5 font-display font-800 text-lg">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-base">🧠</div>
          EduBrain AI
        </Link>
        <div className="hidden md:flex items-center gap-7 ml-10 text-sm text-gray-400">
          {['#features','#ai','#pricing','#contact'].map((h, i) => (
            <a key={h} href={h} className="hover:text-white transition-colors capitalize">{h.slice(1)}</a>
          ))}
        </div>
        <div className="flex items-center gap-2.5 ml-auto">
          <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          <Link to="/register" className="btn btn-accent btn-sm">Get Started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16 px-[5%] relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary-600/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent-cyan/5 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 text-xs font-600 text-primary-300 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              AI-Powered School Management Platform
            </div>
            <h1 className="font-display font-800 text-6xl lg:text-7xl leading-[1.05] tracking-[-3px] mb-5">
              Manage Your School<br />with <span className="gradient-text">EduBrain AI</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Complete ERP — attendance by face, fingerprint or QR, AI-generated results, study plans, ML predictions, and full automation. One platform for everyone.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/register" className="btn btn-accent btn-xl">Get Started Free <ArrowRight className="w-5 h-5" /></Link>
              <a href="#features" className="btn btn-outline btn-xl">See Features</a>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/[0.06]">
              {[['500+', 'Schools'], ['2L+', 'Students'], ['98%', 'Uptime']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display font-800 text-2xl">{v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[48%] max-w-2xl"
        >
          <div className="glass rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 px-4 py-3 bg-dark-700/80 border-b border-white/[0.06]">
              {['#ef4444','#f59e0b','#10b981'].map(c=><div key={c} className="w-3 h-3 rounded-full" style={{background:c}} />)}
              <span className="ml-2 text-xs text-gray-600">Admin Dashboard — EduBrain AI</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {[['1,248','Students','+12 this month','text-primary-400'],['94%','Today Attendance','-2% vs yesterday','text-accent-green'],['₹4.2L','Fee Collected','This month','text-accent-amber']].map(([v,l,c,col])=>(
                <div key={l} className="bg-dark-700/60 rounded-xl p-3">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">{l}</div>
                  <div className={`font-display font-800 text-xl ${col}`}>{v}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{c}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="bg-dark-700/60 rounded-xl p-3">
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">Class-wise Attendance</div>
                {[['Class 10', 96, '#10b981'],['Class 9', 91, '#10b981'],['Class 8', 79, '#f59e0b'],['Class 7', 94, '#10b981']].map(([cls, pct, col]) => (
                  <div key={cls as string} className="flex items-center gap-2 mb-2 text-[11px]">
                    <span className="w-14 text-gray-500 text-right">{cls}</span>
                    <div className="flex-1 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{background: col as string}} initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.8, duration:1}} />
                    </div>
                    <span className="w-8 font-600" style={{color: col as string}}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-[5%]">
        <RevealSection>
          <div className="text-center mb-14">
            <div className="section-tag mb-3">Platform Features</div>
            <h2 className="font-display font-800 text-5xl tracking-[-2px] mb-4">Everything your institute needs</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built specifically for Indian schools and colleges — complete ERP with AI superpowers.</p>
          </div>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <RevealSection key={f.title} delay={i * 0.06}>
              <div className="glass glass-hover p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
                <h3 className="font-display font-700 text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai" className="py-24 px-[5%] bg-dark-800/50 border-y border-white/[0.05]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <RevealSection>
            <div className="section-tag mb-4">AI Tools</div>
            <h2 className="font-display font-800 text-5xl tracking-[-2px] mb-6">Powered by<br /><span className="gradient-text">Gemini AI</span></h2>
            <div className="space-y-5">
              {[
                { icon: '🤖', title: 'AI Doubt Solver', desc: 'Students ask doubts in Hindi/English. Step-by-step explanations.' },
                { icon: '📸', title: 'AI Result from Photo', desc: 'Teacher clicks answer sheet photo → AI extracts marks. No manual entry.' },
                { icon: '📝', title: 'Question Paper Generator', desc: 'Class + chapter + marks = complete paper with answer key. PDF export.' },
                { icon: '🔮', title: 'ML Risk Prediction', desc: 'Analyze attendance + marks + behavior → predict fail/dropout risk.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/12 border border-primary-500/20 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="font-600 text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>

          {/* Chat preview */}
          <RevealSection delay={0.15}>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-primary-600 to-accent-cyan">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🤖</div>
                <div className="text-sm font-700 text-white">EduBrain AI Assistant</div>
                <div className="ml-auto w-2 h-2 bg-accent-green rounded-full" />
              </div>
              <div className="p-4 space-y-3">
                {[
                  { role: 'user', msg: 'Mujhe Class 10 Maths ka study plan chahiye. Score 68% hai.' },
                  { role: 'bot',  msg: '📅 Aarav ka Study Plan:\n\nMon–Wed: Algebra (45 min daily)\nThu: Geometry revision\nFri: Mock test\nWeekend: NCERT examples\n\n🎯 Target: 68% → 85% in 4 weeks' },
                  { role: 'user', msg: 'Class 9 Science Atoms notes generate karo' },
                  { role: 'bot',  msg: '✅ Notes ready!\n📄 Summary · 15 MCQs · 10 Q&A · Formulas\n\nPDF download ready!' },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-dark-700 text-gray-300 border border-white/[0.06] rounded-bl-sm'}`}>
                      {m.msg}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 p-3 border-t border-white/[0.06]">
                <div className="flex-1 bg-dark-700 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-600">Ask me anything...</div>
                <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs">→</div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-[5%]">
        <RevealSection>
          <div className="text-center mb-14">
            <div className="section-tag mb-3">Pricing</div>
            <h2 className="font-display font-800 text-5xl tracking-[-2px] mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 text-lg">Start free. Scale as you grow. No hidden charges.</p>
          </div>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <RevealSection key={plan.name} delay={i * 0.1}>
              <div className={`glass p-7 relative ${plan.popular ? 'border-primary-500/60 bg-primary-500/[0.04]' : ''}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-700 px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                <div className="text-xs font-700 text-gray-500 uppercase tracking-widest mb-3">{plan.name}</div>
                <div className="font-display font-800 text-4xl mb-1">{plan.price}<span className="text-base font-400 text-gray-500">{plan.sub}</span></div>
                <div className="text-sm text-gray-500 mb-6">{plan.desc}</div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-accent-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`btn w-full justify-center ${plan.popular ? 'btn-accent' : 'btn-outline'} btn-md`}>
                  {plan.cta}
                </Link>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-[5%] bg-dark-800/50 border-y border-white/[0.05]">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="font-display font-800 text-4xl tracking-[-1.5px]">Trusted by 500+ institutes</h2>
          </div>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <RevealSection key={t.name} delay={i * 0.1}>
              <div className="glass p-6">
                <div className="flex gap-0.5 mb-3">{Array(t.stars).fill(0).map((_,i)=><Star key={i} className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />)}</div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-sm font-700">{t.name[0]}</div>
                  <div><div className="text-sm font-600">{t.name}</div><div className="text-xs text-gray-600">{t.role}</div></div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-[5%]">
        <RevealSection>
          <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-cyan/60 rounded-3xl p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-noise-overlay" />
            <h2 className="font-display font-800 text-5xl tracking-[-2px] mb-4 relative z-10">Ready to transform your institute?</h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">Join 500+ schools. Setup in 30 minutes. Free to start.</p>
            <div className="flex gap-4 justify-center flex-wrap relative z-10">
              <Link to="/register" className="btn btn-lg bg-white text-primary-700 font-700 hover:bg-white/90">Start Free Today →</Link>
              <a href="#contact" className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20">Book Demo</a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-[5%] bg-dark-800/50 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <RevealSection>
            <div className="section-tag mb-4">Contact Us</div>
            <h2 className="font-display font-800 text-4xl tracking-[-1.5px] mb-4">Get in touch</h2>
            <p className="text-gray-400 text-sm mb-8">Demo booking, pricing queries, or technical support.</p>
            {[['📧', 'hello@edubrain.in'],['📱', '+91 98765 43210'],['📍', 'New Delhi, India'],['⏰', 'Mon–Sat, 9AM–6PM IST']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">{icon}</div>
                <span className="text-sm text-gray-400">{text}</span>
              </div>
            ))}
          </RevealSection>
          <RevealSection delay={0.1}>
            <div className="glass p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="label">Name *</label><input className="input input-md" placeholder="Your name" /></div>
                <div><label className="label">Phone</label><input className="input input-md" type="tel" placeholder="+91..." /></div>
                <div className="col-span-2"><label className="label">Email *</label><input className="input input-md" type="email" placeholder="your@school.com" /></div>
                <div><label className="label">Institute</label><input className="input input-md" placeholder="School name" /></div>
                <div><label className="label">Type</label><select className="input input-md appearance-none"><option>School</option><option>College</option><option>Coaching</option></select></div>
                <div className="col-span-2"><label className="label">Message</label><textarea className="input input-md min-h-[90px] resize-none" placeholder="How can we help?" /></div>
              </div>
              <button onClick={() => alert('Message sent! We will contact you within 24 hours.')} className="btn btn-accent btn-lg w-full justify-center">Send Message →</button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-[5%] bg-dark-900 border-t border-white/[0.06]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display font-800 text-base mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-sm">🧠</div>
              EduBrain AI
            </Link>
            <p className="text-gray-600 text-xs leading-relaxed">Smart School & College Management. AI-powered, made for India.</p>
          </div>
          {[['Platform', ['Features', 'AI Tools', 'Attendance', 'Pricing']],['Product', ['Login', 'Register', 'Android App', 'API Docs']],['Company', ['About', 'Contact', 'Privacy Policy', 'Terms']]].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="font-display font-700 text-sm mb-4">{title as string}</h4>
              <ul className="space-y-2">
                {(links as string[]).map(l => <li key={l}><a href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-6 text-xs text-gray-700">
          <span>© 2026 EduBrain AI. Made with ❤️ in India 🇮🇳</span>
          <div className="flex gap-3">
            {['𝕏', 'in', '💬', '▶'].map(s => <a key={s} href="#" className="w-7 h-7 rounded-lg bg-dark-700 border border-white/[0.06] flex items-center justify-center hover:border-primary-500/40 transition-colors">{s}</a>)}
          </div>
        </div>
      </footer>
    </div>
  )
}
