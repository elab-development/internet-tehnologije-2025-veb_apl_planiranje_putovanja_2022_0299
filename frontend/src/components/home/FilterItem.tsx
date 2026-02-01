import { useFilter } from '../../hooks/useFilter.hook';
interface FilterItemProps {
    name: string;
    icon: any;
  }
  
  const FilterItem = ({ name, icon }: FilterItemProps) => {
     const { filter, setFilter } = useFilter();

      return (
      <div 
      className={`flex items-center bg-slate-800 p-2 rounded-lg cursor-pointer text-green-400 gap-2 
        hover:text-slate-800 hover:bg-transparent hover:border-2 hover:border-slate-800 ${
          filter === name && 'activefilter'
        }`}
          onClick={() => setFilter(name)}
      >
        {icon}
        <h2 className='capitalize font-semibold'>{name}</h2>
      </div>
    );
  };
  
  export default FilterItem;