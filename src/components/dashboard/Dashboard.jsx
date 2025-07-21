import { useState } from "react";
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
  onSearch,
}) => {
  // the setter is attached to delete button and addnewjobapp function bttn
  const [refreshKey, setRefreshKey] = useState(0); // this is to trigger refresh in benchmark bento through  setter which will get passed to table, then form
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1); // set refresh

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 gap-4 pt-18">
        <div className="w-full md:w-2/3 order-1 md:order-none">
          <Search onSearch={onSearch} />
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
            onApplicationSubmit={triggerRefresh}
          />
        </div>
        <div className="w-full md:w-1/3 order-2 md:order-none">
          <BenchmarksBentoBox refreshKey={refreshKey} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
