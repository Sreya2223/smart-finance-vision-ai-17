
import React from 'react';
import { Bell, Menu, User, Mail, FileExport } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type DashboardHeaderProps = {
  onMenuClick: () => void;
  onEmailData?: () => void;
  onExportData?: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onMenuClick,
  onEmailData,
  onExportData
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications at the moment.",
    });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleEmailData = () => {
    if (onEmailData) {
      onEmailData();
    } else {
      toast({
        title: "Email Data",
        description: "Your financial data will be emailed shortly.",
      });
    }
  };

  const handleExportData = () => {
    if (onExportData) {
      onExportData();
    } else {
      toast({
        title: "Export Data",
        description: "Your financial data is being exported.",
      });
    }
  };

  return (
    <header className="border-b border-border bg-background dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          
          {/* Email and Export buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmailData}
              className="flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportData}
              className="flex items-center gap-1"
            >
              <FileExport className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Notifications"
            onClick={handleNotificationsClick}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={handleProfileClick}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
