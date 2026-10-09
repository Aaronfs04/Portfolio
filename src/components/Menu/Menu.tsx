import { motion } from 'framer-motion'
import './Menu.css'

export type Category = 'project' | 'achievement' | 'publication'

interface MenuProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  isVisible: boolean;
  delay?: number;
}

export function Menu({ activeCategory, setActiveCategory, isVisible, delay = 0 }: MenuProps) {
  const categories: { id: Category; label: string }[] = [
    { id: 'project', label: 'Project' },
    { id: 'achievement', label: 'Achievement' },
    { id: 'publication', label: 'Publication' }
  ]

  return (
    <motion.div 
      className="category-selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: isVisible ? delay : 0 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {categories.map((cat) => (
        <div key={cat.id} className="category-tab-container" onClick={() => setActiveCategory(cat.id)}>
          <span className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}>{cat.label}</span>
          {activeCategory === cat.id && (
            <motion.div layoutId="categoryArrow" className="category-arrow" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  )
}

