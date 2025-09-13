import { useEffect, useState } from 'react';
import apis from '../../apis/main';

const fields = [
    { label: "اسم الشركة", name: "name" },
    { label: "الرقم الضريبي", name: "id" },
    { label: "نوع الشركة", name: "type" },
    { label: "كود الفرع", name: "branchID" },
    { label: "البلد", name: "country" },
    { label: "المحافظه", name: "governate" },
    { label: "المدينه / المنطقه", name: "regionCity" },
    { label: "الشارع", name: "street" },
    { label: "رقم المبني", name: "buildingNumber" },
    { label: "الرمز البريدي", name: "postalCode" },
    { label: "الطابق", name: "floor" },
    { label: "الغرفه", name: "room" },
    { label: "المعلم البارز", name: "landmark" },
    { label: "معلومات اضافيه", name: "additionalInformation" },
];

export default function CompanyDetails() {
    const [company, setCompany] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const data = apis.getTheIssuerData();
        if (data) {
            setCompany(data);
            setForm(data);
        }
    }, []);

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-gray-400 text-lg">لا توجد بيانات شركة محفوظة</span>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        await apis.saveTheIssuerData(form);
        setCompany(form);
        setEditMode(false);
        setSaving(false);
    };

    return (
        <div className="w-full">
            <div className="w-full bg-white rounded-xl p-8 mt-8">
                <h1 className="text-2xl font-bold mb-8 text-gray-700 flex items-center justify-between">
                    تفاصيل الشركة
                    {!editMode && (
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold" onClick={() => setEditMode(true)}>
                            تعديل
                        </button>
                    )}
                </h1>
                {editMode ? (
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                        {fields.map(field => (
                            <div key={field.name} className="flex flex-col gap-1 border-b pb-3 border-gray-100">
                                <label className="text-gray-500 text-xs font-semibold" htmlFor={field.name}>{field.label}</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={form[field.name] || ''}
                                    onChange={handleChange}
                                    className="text-gray-800 text-base font-bold break-words border rounded px-2 py-1 bg-gray-50"
                                />
                            </div>
                        ))}
                        <div className="col-span-full flex gap-4 mt-4">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-bold" disabled={saving}>
                                {saving ? 'جاري الحفظ...' : 'حفظ'}
                            </button>
                            <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition text-sm font-bold" onClick={() => { setEditMode(false); setForm(company); }}>
                                إلغاء
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.map(field => (
                            <div key={field.name} className="flex flex-col gap-1 border-b pb-3 border-gray-100">
                                <span className="text-gray-500 text-xs font-semibold">{field.label}</span>
                                <span className="text-gray-800 text-base font-bold break-words">
                                    {company[field.name] || <span className="text-gray-300">—</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
