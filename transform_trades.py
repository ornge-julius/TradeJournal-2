import csv
import re
from datetime import datetime
from typing import Dict, List, Tuple, Optional

def parse_option_description(description: str) -> Dict[str, str]:
    """
    Parse the option description to extract symbol, strike, expiration, type, and price
    Example: "BOT +1 SPY 100 (Weeklys) 8 APR 25 510 CALL @2.56 CBOE"
    """
    # Pattern to match option descriptions
    pattern = r'(BOT|SOLD)\s+([+-]\d+)\s+(\w+)\s+(\d+)\s*\(?([^)]*)\)?\s*(\d+)\s+(\w+)\s+(\d+)\s+(\d+)\s+(CALL|PUT)\s+@([\d.]+)'
    
    match = re.search(pattern, description)
    if not match:
        return {}
    
    return {
        'action': match.group(1),  # BOT or SOLD
        'quantity': match.group(2),  # +1 or -1
        'symbol': match.group(3),  # SPY, MSFT, etc.
        'contract_size': match.group(4),  # 100
        'expiry_type': match.group(5),  # Weeklys, Quarterlys, etc.
        'day': match.group(6),  # 8
        'month': match.group(7),  # APR
        'year': match.group(8),  # 25
        'strike': match.group(9),  # 510
        'option_type': match.group(10),  # CALL or PUT
        'price': match.group(11)  # 2.56
    }

def parse_date(date_str: str) -> str:
    """Convert date from M/D/YY format to YYYY-MM-DD format"""
    try:
        # Parse date like "4/9/25" to "2025-04-09"
        date_obj = datetime.strptime(date_str, "%m/%d/%y")
        return date_obj.strftime("%Y-%m-%d")
    except ValueError:
        return date_str

def group_trades_by_symbol_and_expiry(trades: List[Dict]) -> List[Dict]:
    """
    Group trades by symbol, expiration, and strike to create complete trade pairs
    """
    trade_groups = {}
    
    for trade in trades:
        if trade['TYPE'] != 'TRD':
            continue
            
        parsed = parse_option_description(trade['DESCRIPTION'])
        if not parsed:
            continue
            
        # Create a unique key for grouping
        key = f"{parsed['symbol']}_{parsed['strike']}_{parsed['option_type']}_{parsed['day']}_{parsed['month']}_{parsed['year']}"
        
        if key not in trade_groups:
            trade_groups[key] = []
        
        trade_groups[key].append({
            'trade': trade,
            'parsed': parsed
        })
    
    return trade_groups

def create_complete_trades(trade_groups: Dict) -> List[Dict]:
    """
    Create complete trade records from grouped trades
    """
    complete_trades = []
    
    for key, trades in trade_groups.items():
        # Sort trades by time
        trades.sort(key=lambda x: x['trade']['TIME'])
        
        # Find buy and sell trades
        buy_trades = [t for t in trades if t['parsed']['action'] == 'BOT']
        sell_trades = [t for t in trades if t['parsed']['action'] == 'SOLD']
        
        # Create copies to avoid modification issues
        buy_trades_copy = buy_trades.copy()
        sell_trades_copy = sell_trades.copy()
        
        # Match buy and sell trades
        for buy_trade in buy_trades_copy:
            if buy_trade not in buy_trades:  # Skip if already used
                continue
                
            for sell_trade in sell_trades_copy:
                if sell_trade not in sell_trades:  # Skip if already used
                    continue
                    
                # Check if quantities match
                buy_qty = abs(int(buy_trade['parsed']['quantity']))
                sell_qty = abs(int(sell_trade['parsed']['quantity']))
                
                if buy_qty == sell_qty:
                    # Create complete trade record
                    complete_trade = {
                        'symbol': buy_trade['parsed']['symbol'],
                        'position_type': 1 if buy_trade['parsed']['option_type'] == 'CALL' else 2,  # 1=CALL, 2=PUT
                        'entry_price': float(buy_trade['parsed']['price']),
                        'exit_price': float(sell_trade['parsed']['price']),
                        'quantity': round((buy_qty * int(buy_trade['parsed']['contract_size']))/100),
                        'entry_date': parse_date(buy_trade['trade']['DATE']),
                        'exit_date': parse_date(sell_trade['trade']['DATE']),
                        'source': f"{buy_trade['trade']['REF #']}_{sell_trade['trade']['REF #']}",
                        'reasoning': f"ORB",
                        'result': None,  # Will need to be calculated or set manually
                        'notes': f"Entry: {buy_trade['trade']['TIME']}, Exit: {sell_trade['trade']['TIME']}",
                        'account_id': "f5bf8559-5779-47ce-ba65-75737aed3622",  # Set as needed
                        'user_id': "7c2bb6e3-c000-4c1d-8402-d83c96bfadd0",  # Set as needed
                        'profit': None  # Will be calculated
                    }
                    
                    # Calculate profit
                    entry_cost = complete_trade['entry_price'] * complete_trade['quantity']
                    exit_proceeds = complete_trade['exit_price'] * complete_trade['quantity']
                    profit = (exit_proceeds - entry_cost) * 100  # Multiply by 100
                    complete_trade['profit'] = int(round(profit))  # Round to nearest integer
                    complete_trade['result'] = 1 if complete_trade['profit'] > 0 else 0
                    
                    complete_trades.append(complete_trade)
                    
                    # Remove used trades to avoid double-counting
                    if buy_trade in buy_trades:
                        buy_trades.remove(buy_trade)
                    if sell_trade in sell_trades:
                        sell_trades.remove(sell_trade)
                    break
    
    return complete_trades

def write_database_csv(complete_trades: List[Dict], output_file: str):
    """
    Write the transformed trades to a CSV file suitable for database import
    """
    fieldnames = [
        'symbol', 'position_type', 'entry_price', 'exit_price', 'quantity',
        'entry_date', 'exit_date', 'source', 'reasoning', 'result',
        'notes', 'account_id', 'user_id', 'profit'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for trade in complete_trades:
            writer.writerow(trade)

def main():
    # Read the original CSV
    trades = []
    with open('cash_balance.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        trades = list(reader)
    
    print(f"Read {len(trades)} rows from cash_balance.csv")
    
    # Group trades
    trade_groups = group_trades_by_symbol_and_expiry(trades)
    print(f"Found {len(trade_groups)} unique trade groups")
    
    # Create complete trades
    complete_trades = create_complete_trades(trade_groups)
    print(f"Created {len(complete_trades)} complete trade records")
    
    # Write to new CSV
    output_file = 'trades_for_database.csv'
    write_database_csv(complete_trades, output_file)
    print(f"Wrote {len(complete_trades)} trades to {output_file}")
    
    # Show sample of transformed data
    if complete_trades:
        print("\nSample transformed trade:")
        sample = complete_trades[0]
        for key, value in sample.items():
            print(f"  {key}: {value}")

if __name__ == "__main__":
    main()
