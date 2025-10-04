'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Heart, Zap, Moon } from 'lucide-react'

export default function GunaDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const gunaData = [
    {
      name: 'Sattva',
      subtitle: 'Purity & Balance',
      icon: <Heart className="h-6 w-6" />,
      color: 'blue',
      characteristics: [
        'Clear and focused thinking',
        'Emotional regulation and stability',
        'Motivated by selfless service',
        'Guided by ethical principles'
      ]
    },
    {
      name: 'Rajas',
      subtitle: 'Passion & Ambition', 
      icon: <Zap className="h-6 w-6" />,
      color: 'red',
      characteristics: [
        'Strong desire for material goods',
        'Highly reactive to criticism',
        'Goal-oriented and achievement-focused',
        'Natural leadership tendencies'
      ]
    },
    {
      name: 'Tamas',
      subtitle: 'Inertia & Resistance',
      icon: <Moon className="h-6 w-6" />,
      color: 'gray',
      characteristics: [
        'Tendency to avoid challenges',
        'Struggles with motivation',
        'Resistant to change',
        'Prone to sluggishness'
      ]
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Know the Triguṇā
        <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
              The Three Guṇās
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {gunaData.map((guna, index) => (
                <div key={index} className="text-center">
                  <div className={`flex flex-col items-center mb-4 text-${guna.color}-600`}>
                    <div className={`p-3 rounded-full bg-${guna.color}-100 mb-3`}>
                      {guna.icon}
                    </div>
                    <h4 className={`font-bold text-${guna.color}-900 text-lg`}>{guna.name}</h4>
                    <p className={`text-sm text-${guna.color}-700 mb-3`}>{guna.subtitle}</p>
                  </div>
                  <ul className="space-y-2">
                    {guna.characteristics.map((char, charIndex) => (
                      <li key={charIndex} className="flex items-start text-sm text-gray-600">
                        <span className={`w-1.5 h-1.5 bg-${guna.color}-400 rounded-full mt-2 mr-2 flex-shrink-0`}></span>
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Everyone has all three guṇās in different proportions. Understanding your dominant guṇā helps in personal growth.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}