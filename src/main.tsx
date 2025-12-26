import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Recipes } from './pages/Recipes'
import { Planner } from './pages/Planner'
import { Pantry } from './pages/Pantry'
import { Shopping } from './pages/Shopping'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="planner" element={<Planner />} />
          <Route path="pantry" element={<Pantry />} />
          <Route path="shopping" element={<Shopping />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
