
import { Transaction } from '@/types/transaction';

/**
 * Converts transaction data to a CSV format
 */
export const transactionsToCSV = (transactions: Transaction[]): string => {
  const header = ['Date', 'Title', 'Category', 'Amount', 'Type'];
  
  const rows = transactions.map(transaction => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.title,
    transaction.category,
    transaction.amount.toString(),
    transaction.type
  ]);
  
  const csvContent = [
    header.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Generates financial summary for reports
 */
export const generateFinancialSummary = (transactions: Transaction[]) => {
  let incomeTotal = 0;
  let expenseTotal = 0;
  
  // Calculate totals
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      incomeTotal += parseFloat(String(transaction.amount));
    } else {
      expenseTotal += parseFloat(String(transaction.amount));
    }
  });
  
  // Group by category
  const categorySummary: Record<string, number> = {};
  transactions.forEach(transaction => {
    if (!categorySummary[transaction.category]) {
      categorySummary[transaction.category] = 0;
    }
    if (transaction.type === 'expense') {
      categorySummary[transaction.category] += parseFloat(String(transaction.amount));
    }
  });
  
  // Group by month
  const monthSummary: Record<string, {income: number, expense: number}> = {};
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    if (!monthSummary[monthYear]) {
      monthSummary[monthYear] = { income: 0, expense: 0 };
    }
    
    const amount = parseFloat(String(transaction.amount));
    if (transaction.type === 'income') {
      monthSummary[monthYear].income += amount;
    } else {
      monthSummary[monthYear].expense += amount;
    }
  });
  
  return {
    totalIncome: incomeTotal,
    totalExpenses: expenseTotal,
    netBalance: incomeTotal - expenseTotal,
    categorySummary,
    monthSummary
  };
};

/**
 * Exports data as a downloadable JSON file
 */
export const downloadAsJson = (data: any, filename: string): void => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

/**
 * Exports data as a downloadable CSV file
 */
export const downloadAsCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  URL.revokeObjectURL(url);
};
