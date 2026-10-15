import PaginationComponent from '@/components/molecules/PaginationComponent/PaginationComponent';
import type { ListFilters } from '../../types/index';

export default function FinancialPagination({filters,total,totalPages,onChange}: {
  filters:ListFilters;
  total:number;
  totalPages:number;
  onChange:(changes:Partial<ListFilters>) => void;
}) {
  const changePage = (page:number) => onChange({page:Math.max(1,Math.min(totalPages,page))});
  return <div className="flex flex-wrap gap-3 items-center">
    <p>{total} records · Page {filters.page} of {totalPages}</p>
    <PaginationComponent totalPages={totalPages} currentPage={filters.page} limit={filters.limit}
      setLimit={limit => onChange({limit})}
      prevPage={() => changePage(filters.page-1)} nextPage={() => changePage(filters.page+1)}
      goToFirstPage={() => changePage(1)} goToLastPage={() => changePage(totalPages)}
      isFirstPage={() => filters.page <= 1} isLastPage={() => filters.page >= totalPages}
      setCurrentPage={changePage}
    />
  </div>;
}
