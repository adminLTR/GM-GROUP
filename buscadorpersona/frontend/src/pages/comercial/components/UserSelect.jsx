// components/UserSelect.jsx
import Select from 'react-select';

export default function UserSelect({ users, onChange, value, isDisabled = false }) {
  const options = users.map(user => ({
    value: user.username,
    label: user.username
  }));

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar Usuario
      </label>
      <Select
        options={options}
        value={options.find(opt => opt.value === value)}
        onChange={(selected) => onChange(selected.value)}
        placeholder="Buscar usuario..."
        isSearchable
        isDisabled={isDisabled}
      />
    </div>
  );
}
