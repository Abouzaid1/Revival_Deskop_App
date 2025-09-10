// components/common/FormInput.jsx
export default function FormInput({ label, name, type = "text", required = false, value, onChange }: { label: string, name: string, type?: string, required?: boolean, value: string, onChange: (e: any) => void }) {
    return (
        <div className="flex flex-col mb-4">
            <label htmlFor={name} className="mb-1 font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={` bg-gray-100 focus:bg-gray-200 transition-all rounded px-3 py-2 focus:outline-none ${required ? "border-gray-400 focus:border-gray-900" : "border-gray-300 focus:ring-gray-400"
                    }`}
                required={required}
            />
        </div>
    );
}
