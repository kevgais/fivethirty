export function Pantry() {
  const categories = [
    { name: 'Fridge', icon: '🧊', count: 12 },
    { name: 'Freezer', icon: '❄️', count: 8 },
    { name: 'Cupboard', icon: '🗄️', count: 24 },
    { name: 'Spices', icon: '🌶️', count: 15 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-charcoal">Pantry</h1>
        <button className="btn-primary text-sm">+ Add Item</button>
      </header>

      {/* Scan Button */}
      <button className="card w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-sage hover:bg-sage/5">
        <span className="text-2xl">📷</span>
        <span className="text-sage font-medium">Scan barcode to add</span>
      </button>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button key={cat.name} className="card flex flex-col items-center py-4 hover:border-terracotta border-2 border-transparent">
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="font-medium text-charcoal">{cat.name}</span>
            <span className="text-sm text-mushroom">{cat.count} items</span>
          </button>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="card border-l-4 border-clock-gold">
        <h2 className="text-lg font-display text-charcoal mb-2">Running Low</h2>
        <ul className="space-y-2">
          {['Milk', 'Eggs', 'Butter'].map((item) => (
            <li key={item} className="flex items-center justify-between py-1">
              <span className="text-charcoal">{item}</span>
              <button className="text-xs text-terracotta font-medium">Add to list</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Expiring Soon */}
      <div className="card border-l-4 border-terracotta">
        <h2 className="text-lg font-display text-charcoal mb-2">Use Soon</h2>
        <ul className="space-y-2">
          {[
            { name: 'Chicken breast', days: 2 },
            { name: 'Spinach', days: 3 },
          ].map((item) => (
            <li key={item.name} className="flex items-center justify-between py-1">
              <span className="text-charcoal">{item.name}</span>
              <span className="text-xs text-terracotta">{item.days} days</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
