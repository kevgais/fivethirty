export function Home() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center py-4">
        <h1 className="text-3xl font-display text-charcoal">
          Five<span className="text-terracotta">:</span>Thirty
        </h1>
        <p className="text-mushroom mt-1">Kill the 5:30 panic</p>
      </header>

      {/* Today's Plan Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display text-charcoal">Tonight's Dinner</h2>
          <span className="tag-quick">Quick</span>
        </div>
        <p className="text-charcoal font-medium">No meal planned yet</p>
        <p className="text-mushroom text-sm mt-1">Tap to choose from your recipes</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="card flex flex-col items-center py-6 hover:border-terracotta border-2 border-transparent">
          <span className="text-2xl mb-2">🍳</span>
          <span className="text-sm font-medium text-charcoal">What's for dinner?</span>
        </button>
        <button className="card flex flex-col items-center py-6 hover:border-sage border-2 border-transparent">
          <span className="text-2xl mb-2">🛒</span>
          <span className="text-sm font-medium text-charcoal">Shopping list</span>
        </button>
      </div>

      {/* This Week Summary */}
      <div className="card">
        <h2 className="text-lg font-display text-charcoal mb-3">This Week</h2>
        <div className="space-y-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-mushroom/10 last:border-0">
              <span className="text-sm text-mushroom w-10">{day}</span>
              <span className="text-sm text-charcoal flex-1">Not planned</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
