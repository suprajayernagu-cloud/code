import React from 'react'

export default function Salaries(){
  const sample = [
    {role:'Frontend Engineer', avg: '₹8 LPA'},
    {role:'Backend Engineer', avg: '₹10 LPA'},
    {role:'Product Designer', avg: '₹7 LPA'}
  ]

  return (
    <div className="container">
      <h1>Salaries</h1>
      <p className="muted">Average reported salaries (sample data)</p>
      <ul>
        {sample.map(s => (
          <li key={s.role}>{s.role}: <strong>{s.avg}</strong></li>
        ))}
      </ul>
    </div>
  )
}
