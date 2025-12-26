export function Planner() {
  const days = [
    { name: 'Monday', date: 'Dec 30' },
    { name: 'Tuesday', date: 'Dec 31' },
    { name: 'Wednesday', date: 'Jan 1' },
    { name: 'Thursday', date: 'Jan 2' },
    { name: 'Friday', date: 'Jan 3' },
    { name: 'Saturday', date: 'Jan 4' },
    { name: 'Sunday', date: 'Jan 5' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-charcoal">Meal Planner</h1>
          <p className="text-mushroom text-sm">Week of Dec 30</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-mushroom hover:text-charcoal">←</button>
          <button className="p-2 text-mushroom hover:text-charcoal">→</button>
        </div>
      </header>

      {/* Week Grid */}
      <div className="space-y-3">
        {days.map((day) => (
          <div key={day.name} className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-charcoal">{day.name}</h3>
                <span className="text-xs text-mushroom">{day.date}</span>
              </div>
              <button className="text-terracotta text-sm font-medium">+ Add</button>
            </div>
            <div className="h-16 border-2 border-dashed border-mushroom/20 rounded-soft flex items-center justify-center text-mushroom text-sm">
              Tap to add a meal
            </div>
          </div>
        ))}
      </div>

      {/* Generate List Button */}
      <button className="btn-primary w-full py-3">
        Generate Shopping List
      </button>
    </div>
  )
}
