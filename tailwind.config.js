/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      // ─── Colors ───────────────────────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#f97316',  // orange — buttons, active states, highlights
          fg: '#ffffff',       // text/icons on primary backgrounds
          hover: '#ea6c0a',    // hover state
        },
        bg: {
          DEFAULT: '#ffffff',  // page background
          card: '#f5f5f5',     // card backgrounds, panels
          'card-alt': '#f9f9f9',
          secondary: '#f0f0f0', // input backgrounds, secondary fills
          muted: '#e8e8e8',    // image placeholders, empty states
        },
        border: {
          DEFAULT: '#e0e0e0',  // borders, dividers
        },
        text: {
          primary: '#111111',  // body text, headings
          muted: '#666666',    // secondary text, labels, metadata
        },
        // Semantic
        success: '#16a34a',    // completed transactions, verified badges
        warning: '#ca8a04',    // pending states, deposit holds
        error: '#dc2626',      // form errors, destructive actions
        info: '#2563eb',       // informational messages
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        exile: ['Exile', 'serif'],
      },

      fontSize: {
        xs:   ['11px', { lineHeight: '1.5' }],  // badges, timestamps, fine print
        sm:   ['13px', { lineHeight: '1.5' }],  // secondary labels, metadata
        base: ['15px', { lineHeight: '1.5' }],  // body text, form inputs
        md:   ['17px', { lineHeight: '1.4' }],  // card titles, section labels
        lg:   ['20px', { lineHeight: '1.3' }],  // page section headings
        xl:   ['24px', { lineHeight: '1.2' }],  // screen titles, hero headings
        '2xl':['32px', { lineHeight: '1.1' }],  // hero / landing headline
      },

      // ─── Spacing (4px base grid) ──────────────────────────────────────────
      spacing: {
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '20px',
        6:  '24px',
        8:  '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:   '4px',     // input fields, small chips
        md:   '8px',     // cards, buttons, panels
        lg:   '12px',    // modal dialogs, large cards
        xl:   '16px',    // large panels
        '2xl':'20px',    // confirmation cards
        full: '9999px',  // avatar circles, pill badges
      },

      // ─── Max Width ────────────────────────────────────────────────────────
      maxWidth: {
        content: '1200px',
        nav: '1440px',
      },

      // ─── Box Shadow ───────────────────────────────────────────────────────
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06)',
        modal: '0 4px 24px rgba(0,0,0,0.10)',
      },
    },
  },

  plugins: [],
};
