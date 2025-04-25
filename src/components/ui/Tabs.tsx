'use client';

import * as React from 'react';
import * as TabsPrimitive from '@headlessui/react';
import { cn } from '@/utils/cn';

const Tabs = TabsPrimitive.Tab.Group;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tab.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab.List
    ref={ref}
    className={cn(
      'inline-flex w-full items-center justify-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.Tab.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[headlessui-state=selected]:bg-white data-[headlessui-state=selected]:text-gray-950 data-[headlessui-state=selected]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[headlessui-state=selected]:bg-gray-950 dark:data-[headlessui-state=selected]:text-gray-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Tab.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Tab.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab.Panel
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Tab.Panel.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };