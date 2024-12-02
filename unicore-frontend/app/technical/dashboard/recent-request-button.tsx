import React from 'react';
import { Button } from '@/components/ui/button';

interface RecentRequestsButtonProps {
    buttonVariant: "default" | "outline";
    text: string;
    onClick: () => void;
}

const RecentRequestButton: React.FC<RecentRequestsButtonProps> = ({ buttonVariant, text, onClick }) => {
    return (
        <Button 
            variant={buttonVariant}
            onClick={onClick}
        >
            {text}
        </Button>
    );
};

export default RecentRequestButton;