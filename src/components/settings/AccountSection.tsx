
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AccountSectionProps {
  handleLogout: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ handleLogout }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Get user's transactions
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Not authenticated');
      }
      
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.user.id);
      
      // Convert to CSV format
      const headers = ['id', 'title', 'amount', 'category', 'date', 'type', 'payment_method'];
      const csvContent = [
        headers.join(','),
        ...(transactions || []).map(t => 
          headers.map(header => JSON.stringify(t[header] || '')).join(',')
        )
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Data exported successfully",
        description: "Your financial data has been downloaded as a CSV file.",
      });
    } catch (error: any) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Not authenticated');
      }
      
      // Delete user data from tables
      await supabase.from('transactions').delete().eq('user_id', userData.user.id);
      await supabase.from('tax_calculations').delete().eq('user_id', userData.user.id);
      await supabase.from('budget_categories').delete().eq('user_id', userData.user.id);
      
      // Delete user authentication
      const { error } = await supabase.auth.admin.deleteUser(userData.user.id);
      if (error) throw error;
      
      // Sign out
      await supabase.auth.signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Export All Data</h3>
          <p className="text-sm text-gray-500">Download all your financial data</p>
        </div>
        <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            'Export Data'
          )}
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Logout</h3>
          <p className="text-sm text-gray-500">Sign out from your account</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-red-600">Delete Account</h3>
          <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
        </div>
        <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Account</Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and all data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, delete my account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountSection;
