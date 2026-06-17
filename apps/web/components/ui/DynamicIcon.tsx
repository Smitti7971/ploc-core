import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Box } from 'lucide-react';

interface DynamicIconProps extends Omit<React.ComponentProps<typeof Box>, 'name'> {
  name?: string | null;
}

import { getAssetUrl } from '@/lib/config';

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  if (!name) return <Box {...props} />;

  // Se for emoji
  if (name.length <= 4 && !/^[A-Za-z]+$/.test(name)) {
    return <span className="leading-none" style={{ fontSize: props.size || 18, color: props.color }}>{name}</span>;
  }
  
  // Se for URL externa ou nome de arquivo local com extensão
  if (name.startsWith('http') || name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    const url = name.startsWith('http') ? name : getAssetUrl(name);
    return <img src={url} alt="Icon" style={{ width: props.size || 18, height: props.size || 18 }} className="object-cover rounded-md" />;
  }

  // Tenta buscar no objeto exportado (Case-Insensitive)
  let IconComponent = (LucideIcons as any)[name];
  
  if (!IconComponent) {
    // Procura ignorando case (ex: 'apple' vira 'Apple', 'mappin' acha 'MapPin' se a busca tolerar)
    const iconName = Object.keys(LucideIcons).find(
      key => key.toLowerCase() === name.toLowerCase()
    );
    if (iconName) {
      IconComponent = (LucideIcons as any)[iconName];
    }
  }

  if (!IconComponent) {
    return <Box {...props} />;
  }

  return <IconComponent {...props} />;
}
