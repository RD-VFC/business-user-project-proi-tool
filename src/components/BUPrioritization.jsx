import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Download, Info } from 'lucide-react'

const frequencies = [
  { label: 'One-time', value: 0.1 },
  { label: 'Yearly', value: 0.25 },
  { label: 'Quarterly', value: 0.33 },
  { label: 'Bi-monthly', value: 0.5 },
  { label: 'Monthly', value: 1 },
  { label: 'Weekly', value: 4 },
  { label: 'Daily', value: 20 }
]

const defaultProject = (i = 1) => ({
  id: Date.now() + i,
  title: `Project ${i}`,
  durationHours: 40,
  workforce: 2,
  frequency: 'Monthly',
  impact: 5,
  strategicAlignment: 5
})

const STORAGE_KEY = 'bu_projects_v1'

export default function BUPrioritization(){
  const [projects, setProjects] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
      // ignore and fall back to default
    }
    return [defaultProject(1)]
  })
  const [showGuide, setShowGuide] = useState(false)

  const addProject = () => setProjects(prev => [...prev, { ...defaultProject(prev.length + 1), id: Date.now() }])
  const deleteProject = (id) => { if(projects.length>1) setProjects(projects.filter(p=>p.id!==id)) }
  const updateProject = (id, field, value) => setProjects(projects.map(p => p.id===id ? { ...p, [field]: value } : p))

  const getFrequencyValue = (label) => frequencies.find(f=>f.label===label)?.value || 1

  const calculateBUScore = (p) => {
    const freq = getFrequencyValue(p.frequency)
    const numerator = (p.impact || 0) * (p.strategicAlignment || 0) * freq
    const denominator = Math.max(1, (p.durationHours || 1) * (p.workforce || 1))
    const score = (numerator / denominator) * 10
    return Number(score.toFixed(2))
  }

  const sorted = [...projects].sort((a,b)=>calculateBUScore(b)-calculateBUScore(a))

  const exportCSV = () => {
    const headers = ['Rank','Project Title','DurationHours','Workforce','Frequency','Impact','StrategicAlignment','BU Score']
    const rows = sorted.map((p,idx)=>[idx+1,p.title,p.durationHours,p.workforce,p.frequency,p.impact,p.strategicAlignment, calculateBUScore(p)])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bu_prioritization.csv'
    a.click()
  }

  // persist to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (e) {
      // storage write failed (quota?), ignore silently
      console.warn('Failed to save projects to localStorage', e)
    }
  }, [projects])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">BU Project Prioritization</h1>
            <p className="text-sm text-slate-500">Business Value Assessment</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2"><Download className="w-4 h-4"/>Export CSV</button>
            <button onClick={addProject} className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"><Plus className="w-4 h-4"/>Add Project</button>
            <button onClick={()=>setShowGuide(g=>!g)} title="Show scoring help" className="px-3 py-2 bg-slate-100 text-slate-800 rounded flex items-center gap-2"><Info className="w-4 h-4"/>Help</button>
          </div>
        </div>

        {showGuide && (
          <div className="mt-4 p-4 bg-slate-50 border rounded">
            <div className="font-semibold mb-2">How to use this tool</div>
            <div className="text-sm text-slate-700 space-y-2">
              <div><strong>Duration (hrs):</strong> Total estimated person-hours to deliver the project (planning, development, QA, deployment).</div>
              <div><strong>Workforce:</strong> Number of people working concurrently (FTEs). Use 1 if a single person will do the work.</div>
              <div><strong>Frequency:</strong> How often the benefit occurs. Choices map to multipliers (One-time, Yearly, Quarterly, Monthly, Weekly, Daily).</div>
              <div><strong>Impact (1-10):</strong> Business benefit if delivered — 1 low, 10 transformational.</div>
              <div><strong>Strategic (1-10):</strong> How closely the project maps to strategic priorities — 1 low, 10 critical.</div>
              <div className="pt-2 text-xs text-slate-500">Score formula: (Impact × Strategic Alignment × Frequency) / (Duration × Workforce) × 10</div>
              <div className="pt-2"><a className="text-blue-600 underline" href="https://github.com/RD-VFC/business-user-project-proi-tool/blob/main/docs/input-metrics.md" target="_blank" rel="noreferrer">Full input guide & examples</a></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-600">
              <th className="p-2">Project</th>
              <th className="p-2">Duration (hrs)</th>
              <th className="p-2">Workforce</th>
              <th className="p-2">Frequency</th>
              <th className="p-2">Impact (1-10)</th>
              <th className="p-2">Strategic (1-10)</th>
              <th className="p-2">Score</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2"><input value={p.title} onChange={e=>updateProject(p.id,'title', e.target.value)} className="w-full p-1 border rounded"/></td>
                <td className="p-2"><input type="number" value={p.durationHours} onChange={e=>updateProject(p.id,'durationHours', parseFloat(e.target.value)||0)} className="w-20 p-1 border rounded"/></td>
                <td className="p-2"><input type="number" value={p.workforce} onChange={e=>updateProject(p.id,'workforce', parseFloat(e.target.value)||0)} className="w-16 p-1 border rounded"/></td>
                <td className="p-2">
                  <select value={p.frequency} onChange={e=>updateProject(p.id,'frequency', e.target.value)} className="p-1 border rounded">
                    {frequencies.map(f=> <option key={f.label} value={f.label}>{f.label}</option>)}
                  </select>
                </td>
                <td className="p-2"><input type="number" min="1" max="10" value={p.impact} onChange={e=>updateProject(p.id,'impact', Math.min(10, Math.max(1, parseFloat(e.target.value)||1)))} className="w-20 p-1 border rounded"/></td>
                <td className="p-2"><input type="number" min="1" max="10" value={p.strategicAlignment} onChange={e=>updateProject(p.id,'strategicAlignment', Math.min(10, Math.max(1, parseFloat(e.target.value)||1)))} className="w-20 p-1 border rounded"/></td>
                <td className="p-2 font-bold">{calculateBUScore(p)}</td>
                <td className="p-2"><button onClick={()=>deleteProject(p.id)} className="text-red-600"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Priority Ranking</h2>
        <div className="space-y-2">
          {sorted.map((p, idx)=> (
            <div key={p.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{idx+1}. {p.title}</div>
                <div className="text-sm text-slate-500">{p.durationHours} hrs • {p.workforce} people • {p.frequency}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{calculateBUScore(p)}</div>
                <div className="text-sm text-slate-500">BU Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
