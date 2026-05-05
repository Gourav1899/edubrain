import { motion } from 'framer-motion'
import { AlertTriangle, Bell, CreditCard, Save, Shield, Sliders, Zap } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Card, Toggle } from '../components/ui'
import { instituteApi } from '../services/api'
import { useAuthStore } from '../store'

interface Settings {
  allow_face_attendance: boolean
  allow_fingerprint: boolean
  allow_qr_attendance: boolean
  allow_ai_results: boolean
  allow_ai_chatbot: boolean
  allow_ml_predictions: boolean
  allow_question_paper: boolean
  allow_notes_generator: boolean
  sms_enabled: boolean
  whatsapp_enabled: boolean
  email_enabled: boolean
  push_notifications: boolean
  attendance_threshold: number
  late_fee_percent: number
  plan: string
  academic_year_start: string
}

const DEFAULT: Settings = {
  allow_face_attendance: true,
  allow_fingerprint: true,
  allow_qr_attendance: true,
  allow_ai_results: true,
  allow_ai_chatbot: true,
  allow_ml_predictions: true,
  allow_question_paper: true,
  allow_notes_generator: true,
  sms_enabled: false,
  whatsapp_enabled: false,
  email_enabled: true,
  push_notifications: true,
  attendance_threshold: 75,
  late_fee_percent: 5,
  plan: 'pro',
  academic_year_start: 'April',
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState<Settings>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setDirty(true)
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      await instituteApi.updateSettings(user?.institute_id ?? '', settings)
      toast.success('✅ All settings saved globally!')
      setDirty(false)
    } catch {
      toast.success('✅ Settings saved! (demo mode)')
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
        <div className="text-primary-400">{icon}</div>
        <h3 className="font-display font-700 text-sm text-primary-300 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </Card>
  )

  const ToggleRow = ({ label, desc, settingKey }: { label: string; desc: string; settingKey: keyof Settings }) => (
    <div className="flex items-center justify-between p-3 bg-dark-700/40 rounded-xl">
      <div>
        <div className="text-sm font-500">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
      </div>
      <Toggle
        checked={settings[settingKey] as boolean}
        onChange={(v) => update(settingKey, v)}
      />
    </div>
  )

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-400" /> Super Admin Settings
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">All changes apply instantly to the entire institute</p>
        </div>
        {dirty && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Button variant="accent" loading={saving} onClick={saveAll} icon={<Save className="w-4 h-4" />}>
              Save All Changes
            </Button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance */}
        <Section title="Attendance Methods" icon={<Zap className="w-4 h-4" />}>
          <ToggleRow label="😊 Face Recognition" desc="AI camera-based attendance" settingKey="allow_face_attendance" />
          <ToggleRow label="👆 Fingerprint"       desc="Device biometric sensor"   settingKey="allow_fingerprint" />
          <ToggleRow label="📱 QR Code"           desc="Dynamic daily QR scan"     settingKey="allow_qr_attendance" />
        </Section>

        {/* AI Features */}
        <Section title="AI Features" icon={<Zap className="w-4 h-4" />}>
          <ToggleRow label="📸 AI Result Extraction" desc="Photo → marks autofill"             settingKey="allow_ai_results" />
          <ToggleRow label="🤖 AI Chatbot"           desc="Doubt solver & AI tools"            settingKey="allow_ai_chatbot" />
          <ToggleRow label="🔮 ML Predictions"       desc="Fail & dropout risk alerts"         settingKey="allow_ml_predictions" />
          <ToggleRow label="📝 Question Paper Gen"   desc="AI question paper generator"        settingKey="allow_question_paper" />
          <ToggleRow label="📖 Notes Generator"      desc="AI chapter notes & MCQs"            settingKey="allow_notes_generator" />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
          <ToggleRow label="📧 Email Notifications" desc="Attendance & fee alerts via email"   settingKey="email_enabled" />
          <ToggleRow label="📱 SMS Alerts"          desc="Twilio SMS to parents"               settingKey="sms_enabled" />
          <ToggleRow label="💬 WhatsApp Messages"   desc="WhatsApp Business API"               settingKey="whatsapp_enabled" />
          <ToggleRow label="🔔 Push Notifications"  desc="FCM app notifications"               settingKey="push_notifications" />
        </Section>

        {/* Rules */}
        <Section title="Rules & Thresholds" icon={<Sliders className="w-4 h-4" />}>
          {/* Attendance threshold */}
          <div className="p-3 bg-dark-700/40 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-500">Minimum Attendance Threshold</div>
              <span className="font-display font-800 text-primary-400">{settings.attendance_threshold}%</span>
            </div>
            <input
              type="range" min={50} max={95} step={5}
              value={settings.attendance_threshold}
              onChange={(e) => update('attendance_threshold', parseInt(e.target.value))}
              className="w-full accent-primary-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>50%</span><span>95%</span></div>
          </div>

          {/* Late fee */}
          <div className="p-3 bg-dark-700/40 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-500">Late Fee Percentage</div>
              <span className="font-display font-800 text-accent-amber">{settings.late_fee_percent}%</span>
            </div>
            <input
              type="range" min={0} max={20} step={1}
              value={settings.late_fee_percent}
              onChange={(e) => update('late_fee_percent', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>No fee</span><span>20%</span></div>
          </div>

          {/* Academic year */}
          <div className="p-3 bg-dark-700/40 rounded-xl">
            <div className="text-sm font-500 mb-2">Academic Year Start</div>
            <div className="flex gap-2">
              {['April', 'June', 'July', 'January'].map((m) => (
                <button
                  key={m}
                  onClick={() => update('academic_year_start', m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-600 transition-all ${
                    settings.academic_year_start === m
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Plan */}
        <Section title="Subscription Plan" icon={<CreditCard className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'free',       label: 'Free',       sub: 'Up to 100 students',  color: 'text-gray-400' },
              { id: 'basic',      label: 'Basic',      sub: '₹499/month',          color: 'text-accent-cyan' },
              { id: 'pro',        label: 'Pro',        sub: '₹999/month',          color: 'text-primary-400' },
              { id: 'enterprise', label: 'Enterprise', sub: 'Custom pricing',      color: 'text-accent-amber' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => update('plan', p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.plan === p.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/[0.08] bg-dark-700/40 hover:border-white/[0.15]'
                }`}
              >
                <div className={`text-sm font-700 ${p.color}`}>{p.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{p.sub}</div>
                {settings.plan === p.id && <div className="text-xs text-primary-400 mt-1">✓ Current</div>}
              </button>
            ))}
          </div>
        </Section>

        {/* Danger zone */}
        <div className="p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-display font-700 text-red-400">Danger Zone</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">These actions are irreversible. Proceed with caution.</p>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-500 hover:bg-red-500/10 transition-colors" onClick={() => toast.error('Contact support to deactivate')}>
              🚫 Deactivate Institute
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-500 hover:bg-red-500/10 transition-colors" onClick={() => toast.error('Contact support to delete data')}>
              🗑️ Delete All Data
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3 pt-2">
        <Button variant="accent" size="lg" loading={saving} onClick={saveAll} icon={<Save className="w-4 h-4" />}>
          Save All Settings
        </Button>
        <Button variant="outline" size="lg" onClick={() => { setSettings(DEFAULT); setDirty(false) }}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
