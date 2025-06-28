import Search from "./Search";
import Table from "./Table";
import BenchmarksBentoBox from "./BenchmarksBentoBox";

const Dashboard = ({
  jobApps,
  setJobApps,
  currentPage,
  itemsPerPage,
  totalItems,
  setTotalItems,
  onPageChange,
  onItemsPerPageChange,
  isLoading,
  sortConfig,
  onSort,
}) => {
  return (
    <>
      <div className="flex w-full p-4 gap-4 pt-18">
        <div className="w-2/3">
          <Search />
          <Table
            jobApps={jobApps}
            setJobApps={setJobApps}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            isLoading={isLoading}
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>
        <div className="w-1/3">
          <BenchmarksBentoBox />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
