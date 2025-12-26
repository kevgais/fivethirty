export function Shopping() {
  const categories = [
    {
      name: 'Fresh',
      items: [
        { name: 'Milk (2L)', checked: false },
        { name: 'Eggs (12)', checked: true },
        { name: 'Chicken breast (500g)', checked: false },
      ],
    },
    {
      name: 'Bakery',
      items: [
        { name: 'Sliced bread', checked: false },
        { name: 'Burger buns (6)', checked: false },
      ],
    },
    {
      name: 'Cupboard',
      items: [
        { name: 'Pasta (500g)', checked: true },
        { name: 'Chopped tomatoes (2 tins)', checked: false },
        { name: 'Rice (1kg)', checked: false },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-charcoal">Shopping List</h1>
          <p className="text-mushroom text-sm">8 items remaining</p>
        </div>
        <button className="text-sm text-terracotta font-medium">Clear done</button>
      </header>

      {/* Trash Scanner */}
      <button className="card w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-sage hover:bg-sage/5">
        <span className="text-2xl">🗑️</span>
        <span className="text-sage font-medium">Scan empty packaging</span>
      </button>

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add item..."
          className="flex-1 px-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
                     focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
                     text-charcoal placeholder:text-mushroom"
        />
        <button className="btn-primary px-4">+</button>
      </div>

      {/* Shopping Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="card">
            <h2 className="font-display text-charcoal mb-3">{category.name}</h2>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.name} className="flex items-center gap-3">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-sage border-sage text-white'
                        : 'border-mushroom/30 hover:border-sage'
                    }`}
                  >
                    {item.checked && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 ${item.checked ? 'line-through text-mushroom' : 'text-charcoal'}`}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Share Button */}
      <button className="btn-secondary w-full py-3">
        Share with family
      </button>
    </div>
  )
}
