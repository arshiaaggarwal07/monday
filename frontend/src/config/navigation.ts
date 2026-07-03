// frontend/src/config/navigation.ts

export interface NavItem {
  id:    string
  label: string
  icon:  string
  href:  string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Lists',
    items: [
      { id: 'personal',     label: 'Personal',     icon: '○', href: '/dashboard?list=personal'     },
      { id: 'professional', label: 'Professional', icon: '○', href: '/dashboard?list=professional' },
      { id: 'home',         label: 'Home',         icon: '○', href: '/dashboard?list=home'         },
      { id: 'school',       label: 'School',       icon: '○', href: '/dashboard?list=school'       },
      { id: 'work',         label: 'Work',         icon: '○', href: '/dashboard?list=work'         },
      { id: 'family',       label: 'Family',       icon: '○', href: '/dashboard?list=family'       },
    ],
  },
  {
    title: 'Tasks',
    items: [
      { id: 'upcoming',  label: 'Upcoming',  icon: '↑', href: '/dashboard?view=upcoming'  },
      { id: 'today',     label: 'Due Today', icon: '◈', href: '/dashboard?view=today'     },
      { id: 'calendar',  label: 'Calendar',  icon: '◷', href: '/dashboard?view=calendar'  },
      { id: 'board',     label: 'Board',     icon: '▤', href: '/dashboard?view=board'     },

    ],
  },
]