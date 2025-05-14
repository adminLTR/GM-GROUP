
export default function Button({
    children, 
    onClick,
    type = 'normal',
    disabled = false
}) {
    return <button
        onClick={onClick}
        className={`${type=='outline' ? 'bg-white text-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
        font-semibold py-3 px-6 rounded-lg shadow cursor-pointer transition-colors
        flex items-center gap-2 disabled:opacity-50`}
        disabled={disabled}
    >
        {children}
    </button>
}