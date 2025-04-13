import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from '@/lib/utils';

interface ProfileSectionProps {
  user: User | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || '';
  const userAvatar = user?.user_metadata?.avatar_url || '';
  
  const [profileData, setProfileData] = useState({
    name: userName || 'John Doe',
    email: userEmail || 'john.doe@example.com',
    avatar: userAvatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
        avatar: user.user_metadata?.avatar_url || prev.avatar,
      }));
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      let updates = {};
      
      if (profileData.name && profileData.name !== userName) {
        updates = {
          ...updates,
          data: { 
            full_name: profileData.name 
          }
        };
      }
      
      if (profileData.currentPassword && profileData.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: profileData.newPassword
        });
        
        if (error) throw error;
        
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile information",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or GIF image.",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploadingImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
      
      const avatarUrl = data.publicUrl;
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });
      
      if (updateError) throw updateError;
      
      setProfileData({
        ...profileData,
        avatar: avatarUrl
      });
      
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profileData.avatar} />
          <AvatarFallback className="text-2xl">
            {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="relative">
          <input
            type="file"
            id="avatar-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploadingImage}
          />
          <Button variant="outline" className="relative">
            {isUploadingImage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={profileData.name}
              onChange={e => setProfileData({...profileData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={profileData.email}
              readOnly
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password" 
            placeholder="Enter current password" 
            value={profileData.currentPassword}
            onChange={e => setProfileData({...profileData, currentPassword: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              placeholder="Enter new password" 
              value={profileData.newPassword}
              onChange={e => setProfileData({...profileData, newPassword: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm new password" 
              value={profileData.confirmPassword}
              onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleProfileUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
