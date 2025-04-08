
import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
