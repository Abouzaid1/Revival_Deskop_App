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

    useEffect(() => {
        // Assume company data is stored as JSON string under 'companyData'
        const data = apis.getTheIssuerData();
        if (data) {
            setCompany(data);
        }
    }, []);

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-gray-400 text-lg">لا توجد بيانات شركة محفوظة</span>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="w-full bg-white rounded-xl shadow-lg p-8 mt-8">
                <h1 className="text-2xl font-bold mb-8 text-gray-700">تفاصيل الشركة</h1>
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
            </div>
        </div>
    );
}
