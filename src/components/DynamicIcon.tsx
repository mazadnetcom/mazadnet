import * as Icons from 'lucide-react';

type IconName = keyof typeof Icons;

interface DynamicIconProps extends Icons.LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = Icons[name as IconName];

  if (!LucideIcon) {
    // Fallback icon
    return <Icons.Tag {...props} />;
  }

  return <LucideIcon {...props} />;
};
