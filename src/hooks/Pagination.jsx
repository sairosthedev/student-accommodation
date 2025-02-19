import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const PaginationComponent = () => (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i + 1)}
            className={cn(
              "h-8 w-8 p-0",
              currentPage === i + 1 && "bg-black text-white hover:bg-black/90"
            )}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return {
    currentPage,
    totalPages,
    currentData: getCurrentData(),
    PaginationComponent,
  };
};

export default usePagination;
