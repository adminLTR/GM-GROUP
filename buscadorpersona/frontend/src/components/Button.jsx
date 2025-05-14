
export function Button({
    children, 
    onCLick,
    type='normal'
}) {
    return <button
        onClick={onCLick}
        className={`${type=='outline' ? 'bg-white text-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}
        text-white 
        font-semibold py-3 px-6 rounded-lg shadow cursor-pointer transition-colors`}
    >
        {children}
    </button>
}