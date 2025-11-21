<img width="800" height="800" alt="FullLogo_Transparent" src="https://github.com/user-attachments/assets/9c636134-6144-411d-a2d2-ee71d99d4757" /> 

# ProfitPath
A  React application for tracking and analyzing options trading performance.

## Features

- **Trade Management**: Add, edit, and view detailed trade information
- **Performance Analytics**: Real-time calculation of win rate, P&L, and account balance
- **Data Visualization**: Interactive charts for account balance, cumulative P&L, and win/loss ratios
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **React 18+** - Modern React with hooks
- **JavaScript (JSX)** - No TypeScript, pure JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **MUI React** - Material React component library
- **Recharts** - React charting library
- **Lucide React** - Modern icon library
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
npm run build
```

### Docker Setup

You can run the application using Docker Compose, which simplifies the setup process.

1.  **Prerequisites**:
    - Docker and Docker Compose installed on your machine.

2.  **Environment Variables**:
    - Ensure you have a `.env` file in the **root directory** of the project (same level as `docker-compose.yml`).
    - This file must contain your Supabase credentials:
      ```env
      REACT_APP_SUPABASE_URL=your-supabase-url
      REACT_APP_SUPABASE_ANON_KEY=your-anon-key
      ```

3.  **Run with Docker**:
    - Start the application in detached mode:
      ```bash
      docker compose up --build -d
      ```
    - The application will be available at [http://localhost](http://localhost).

4.  **Stop the Application**:
    ```bash
    docker compose down
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
