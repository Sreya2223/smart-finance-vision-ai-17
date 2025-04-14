
import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
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

  return (
    <header className="border-b border-border bg-background dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
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
