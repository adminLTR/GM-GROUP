import Select from 'react-select';

export function MultipleSelect({values, label, filtros, setFiltros}) {
    const options = values.map(val => ({
        value: val,
        label: val
    }));

    return (
        <div className="w-full p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none">
            
            <Select
                options={options}
                onChange={(selected) => {
                    setFiltros({ ...filtros, [label.toLowerCase()]: selected.map(opt => opt.value).join('|') });
                }}
                placeholder={"Seleccionar " + label.toLowerCase() + "..."}
                isSearchable
                isMulti
            />
        </div>
    );
}
export function SearchSelect({values, label, onChange}) {
    const options = values.map(val => ({
        value: val,
        label: val
    }));

    return (
        <div className="w-full p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none">
            
            <Select
                options={options}
                onChange={(selected) => {
                    onChange(selected)
                }}
                placeholder={"Seleccionar " + label.toLowerCase() + "..."}
                isSearchable
            />
        </div>
    );
}