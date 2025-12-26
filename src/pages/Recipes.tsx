export function Recipes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-charcoal">Recipes</h1>
        <button className="btn-primary text-sm">+ Add</button>
      </header>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full px-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
                     focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
                     text-charcoal placeholder:text-mushroom"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button className="tag bg-terracotta/20 text-terracotta whitespace-nowrap">All</button>
        <button className="tag bg-mushroom/10 text-mushroom whitespace-nowrap hover:bg-mushroom/20">Quick</button>
        <button className="tag bg-mushroom/10 text-mushroom whitespace-nowrap hover:bg-mushroom/20">Kid-friendly</button>
        <button className="tag bg-mushroom/10 text-mushroom whitespace-nowrap hover:bg-mushroom/20">Vegetarian</button>
      </div>

      {/* Recipe Grid */}
      <div className="space-y-3">
        {/* Placeholder recipes */}
        {[
          { name: 'Spaghetti Bolognese', time: '45 min', tags: ['kid-friendly'] },
          { name: 'Fish Finger Sandwiches', time: '15 min', tags: ['quick', 'kid-friendly'] },
          { name: 'Chicken Stir Fry', time: '25 min', tags: ['quick'] },
        ].map((recipe) => (
          <div key={recipe.name} className="card flex items-center gap-4">
            <div className="w-16 h-16 bg-butter rounded-soft flex items-center justify-center text-2xl">
              🍽️
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-charcoal">{recipe.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-clock-gold">{recipe.time}</span>
                {recipe.tags.map((tag) => (
                  <span key={tag} className={`tag-${tag === 'quick' ? 'quick' : 'kid-friendly'} text-[10px]`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
