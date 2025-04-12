
// Add at the very end of the file or modify the existing addTransaction function

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: userData.user.id,
    } as any); // Use type assertion to bypass TypeScript error
  
  if (error) {
    throw error;
  }
  
  return;
};
