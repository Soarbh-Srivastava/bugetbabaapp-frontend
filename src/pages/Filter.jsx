import Dashboard from "../components/Dashboard";
import FilterTransactions from "../components/FilterTransactions";

const Filter = () => {
  return (
    <Dashboard activeMenu="Filter">
      <FilterTransactions />
    </Dashboard>
  );
};
export default Filter;
