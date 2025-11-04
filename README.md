# Trading Journal App

A professional React application for tracking and analyzing options trading performance. Built with modern React patterns, reducers for state management, and a clean component architecture.

## Features

- **Trade Management**: Add, edit, and view detailed trade information
- **Performance Analytics**: Real-time calculation of win rate, P&L, and account balance
- **Data Visualization**: Interactive charts for account balance, cumulative P&L, and win/loss ratios
- **Professional UI**: Dark theme with modern design using Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **React 18+** - Modern React with hooks
- **JavaScript (JSX)** - No TypeScript, pure JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - React charting library
- **Lucide React** - Modern icon library
- **Custom Hooks** - For state management and business logic
- **Reducer Pattern** - For complex state management
- **Supabase** - Hosted Postgres database and auth

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components (Recharts)
│   ├── forms/          # Form components
│   ├── tables/         # Table components
│   └── ui/             # General UI components
├── hooks/               # Custom React hooks
├── reducers/            # State management reducers
├── utils/               # Utility functions and calculations
├── App.jsx              # Main application component
├── index.js             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Key Components

### State Management
- **Trade Reducer**: Manages trade data and operations
- **Settings Reducer**: Handles app configuration
- **Custom Hooks**: Encapsulate business logic

### UI Components
- **Metrics Cards**: Display key performance indicators
- **Trade Form**: Add/edit trade information
- **Charts**: Visualize trading performance
- **Trade Table**: List all trades with actions

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
```

### Supabase Configuration

1. Create a project at [Supabase](https://supabase.com/) and note the Project URL and anon key.
2. Copy `app/.env.example` to `app/.env` and fill in your credentials:

   ```env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Ensure the following tables exist in your database:
   - `trades` for trade history
   - `accounts` with a `starting_balance` column

## SnapTrade Synchronization (Robinhood)

The project includes a command-line importer that pulls executed Robinhood option trades from your SnapTrade connection and stores them in the Supabase `trades` table. The script lives at `app/scripts/syncRobinhoodSnaptrade.js` and can be executed with the bundled npm script:

```bash
cd app
npm run sync:robinhood
```

### Required Environment Variables

Configure the following values in `app/.env` (or your shell) before running the sync:

| Variable | Description |
| --- | --- |
| `SNAPTRADE_CLIENT_ID` | SnapTrade partner client ID. |
| `SNAPTRADE_CONSUMER_KEY` | SnapTrade consumer key used to sign requests. |
| `SNAPTRADE_USER_ID` | SnapTrade user ID for the connected Robinhood account. |
| `SNAPTRADE_USER_SECRET` | SnapTrade user secret associated with the user ID. |
| `SNAPTRADE_TARGET_ACCOUNT_ID` | Supabase `accounts` table ID that imported trades should be linked to. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (used for server-side inserts). |

Optional variables:

- `SNAPTRADE_TARGET_USER_ID` – associates inserted trades with a Supabase user.
- `SNAPTRADE_BROKERAGE_NAME` – defaults to `Robinhood`; override to filter by a different brokerage label in SnapTrade.
- `SNAPTRADE_ACCOUNT_IDS` – comma-separated list of SnapTrade account IDs to sync (skips brokerage name filtering).
- `SNAPTRADE_START_DATE` – limits activity retrieval to transactions on/after the provided date (YYYY-MM-DD).
- `SNAPTRADE_ENV_PATH` – custom path to an additional `.env` file.

The importer performs the following steps:

1. Authenticates with SnapTrade using the partner credentials and user secret.
2. Locates Robinhood accounts and retrieves historical activities.
3. Matches option open/close legs into completed trades, computing position details and P&L.
4. Inserts only new trades into Supabase (based on a deterministic `source` identifier).

Because the script uses the Supabase service role key, run it in a secure environment and avoid committing secrets to version control.

## Data Structure

### Trade Object
```javascript
{
  id: number,           // Unique identifier
  symbol: string,       // Stock symbol (e.g., "AAPL")
  position_type: 1 | 2, // Option type (1=CALL, 2=PUT)
  entryPrice: number,   // Entry price per contract
  exitPrice: number,    // Exit price per contract
  quantity: number,     // Number of contracts
  entry_date: string,    // Entry date (YYYY-MM-DD)
  exit_date: string,     // Exit date (YYYY-MM-DD)
  profit: number,       // Calculated profit/loss
  notes: string,        // Extended notes/observations
  reasoning: string,       // Reason for entering trade
  result: 1 | 0, // Fixed trade outcome (1=WIN, 0=LOSS)
  option: string,       // Option contract description
  source: string        // Trade idea source
}
```

## Architecture Patterns

### Component Design
- **Single Responsibility**: Each component has a clear, focused purpose
- **Props Interface**: Clean prop passing between components
- **Event Handling**: Consistent event handling patterns

### State Management
- **Reducer Pattern**: Complex state logic in reducers
- **Custom Hooks**: Business logic encapsulation
- **Performance Optimization**: useMemo for expensive calculations

### Styling
- **Tailwind CSS**: Utility-first approach
- **Dark Theme**: Professional trading interface aesthetic
- **Responsive Design**: Mobile-first responsive approach

## Performance Features

- **Memoized Calculations**: useMemo for expensive operations
- **Efficient Re-rendering**: Proper dependency arrays
- **Responsive Charts**: Charts adapt to container size
- **Optimized State Updates**: Minimal re-renders

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Gray backgrounds (900, 800, 700)
- Blue accents for primary actions
- Emerald for positive values
- Red for negative values
- Purple and yellow for additional accents

### Styling
- All styling is done through Tailwind CSS classes
- Custom color palette extends Tailwind's default colors
- Consistent spacing and typography scales

## Future Enhancements

- **Data Persistence**: localStorage/sessionStorage integration
- **Import/Export**: CSV and JSON data handling
- **Advanced Analytics**: More sophisticated trading metrics
- **Filtering/Sorting**: Enhanced trade history management
- **Trade Categories**: Grouping by strategy or sector
- **Performance Benchmarking**: Compare against market indices

## Development Notes

### Code Quality
- Consistent naming conventions
- Proper error handling
- Performance considerations
- Clean component separation

### Testing
- Component testing ready
- Reducer testing support
- Utility function testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React and modern web technologies**
