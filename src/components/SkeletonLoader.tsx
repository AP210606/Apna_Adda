import React from 'react';

export function PageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-8 animate-pulse" aria-hidden="true">
      <div className="h-6 w-1/4 bg-stone-200 dark:bg-stone-800"></div>
      <div className="h-10 w-1/2 bg-stone-200 dark:bg-stone-800"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800"></div>
        <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800"></div>
        <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800"></div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-12 animate-pulse" aria-hidden="true">
      <div className="md:col-span-7 aspect-[4/5] bg-stone-200 dark:bg-stone-800"></div>
      <div className="md:col-span-5 space-y-6">
        <div className="h-4 w-1/3 bg-stone-200 dark:bg-stone-800"></div>
        <div className="h-10 w-3/4 bg-stone-200 dark:bg-stone-800"></div>
        <div className="h-6 w-1/4 bg-stone-200 dark:bg-stone-800"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-200 dark:bg-stone-800"></div>
          <div className="h-4 w-full bg-stone-200 dark:bg-stone-800"></div>
          <div className="h-4 w-2/3 bg-stone-200 dark:bg-stone-800"></div>
        </div>
        <div className="h-12 w-full bg-stone-200 dark:bg-stone-800"></div>
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-8 animate-pulse" aria-hidden="true">
      <div className="flex justify-between items-center">
        <div className="h-8 w-1/3 bg-stone-200 dark:bg-stone-800"></div>
        <div className="h-8 w-1/6 bg-stone-200 dark:bg-stone-800"></div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4 hidden md:block">
          <div className="h-6 w-3/4 bg-stone-200 dark:bg-stone-800"></div>
          <div className="h-32 bg-stone-200 dark:bg-stone-800"></div>
        </div>
        <div className="col-span-4 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="aspect-square bg-stone-200 dark:bg-stone-800"></div>
          <div className="aspect-square bg-stone-200 dark:bg-stone-800"></div>
          <div className="aspect-square bg-stone-200 dark:bg-stone-800"></div>
        </div>
      </div>
    </div>
  );
}
