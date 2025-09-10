import { useState } from "react";
import FormInput from "../common/FormInput";
import apis from "../../apis/main";
export default function CompanyCreationComponent() {
    const [formData, setFormData] = useState<any>({
        name: "",
        id: "",
        type: "",
        branchID: "",
        country: "",
        governate: "",
        regionCity: "",
        street: "",
        buildingNumber: "",
        postalCode: "",
        floor: "",
        room: "",
        landmark: "",
        additionalInformation: "",
    });
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validate required fields
        const newErrors: any = {};
        [...companyInfo, ...companyAddress].forEach(field => {
            if (field.required && !formData[field.name]?.trim()) {
                newErrors[field.name] = "هذا الحقل مطلوب";
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        apis.saveTheIssuerData(formData);
    };
    const companyInfo = [
        { label: "اسم الشركة", name: "name", required: true },
        { label: "الرقم الضريبي", name: "id", required: true },
        { label: "نوع الشركة", name: "type", type: "text", required: true },
    ];
    const companyAddress = [
        { label: "كود الفرع", name: "branchID", required: true },
        { label: "البلد", name: "country", type: "text", required: true },
        { label: "المحافظه", name: "governate", required: true },
        { label: "المدينه / المنطقه", name: "regionCity", required: true },
        { label: "الشارع", name: "street", required: true },
        { label: "رقم المبني", name: "buildingNumber", required: true },
        { label: "الرمز البريدي", name: "postalCode", required: true },
        { label: "الطابق", name: "floor", required: true },
        { label: "الغرفه", name: "room", required: true },
        { label: "المعلم البارز", name: "landmark", required: true },
        { label: "معلومات اضافيه", name: "additionalInformation", required: true },
    ];

    return (
        <div>
            <div className="bg-gray-200 w-full p-10 h-screen font-medium rounded-lg min-w-[40%]">
                <h1 className="text-2xl font-bold mb-4">انشاء شركه</h1>
                <div className="flex flex-row w-full">
                    <div className="rounded-xl mt-5 pb-20 overflow-hidden w-full flex flex-col gap-[2px] ">
                        <form
                            onSubmit={handleSubmit}
                            className=""
                        >
                            <div className="flex flex-row gap-5">

                                <div className="w-[50%] bg-white p-5 h-fit rounded-lg">
                                    <p className="mb-3">معلومات الشركه</p>
                                    {companyInfo.map((field) => (
                                        <div key={field.name} className="mb-2">
                                            <FormInput
                                                label={field.label}
                                                name={field.name}
                                                type={field.type || "text"}
                                                required={field.required}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                            />
                                            {errors[field.name] && (
                                                <span className="text-xs text-red-600">{errors[field.name]}</span>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        انشاء الشركة
                                    </button>
                                </div>
                                <div className="w-[50%] bg-white p-5 rounded-lg">
                                    <p className="mb-3">معلومات العنوان</p>
                                    {companyAddress.map((field) => (
                                        <div key={field.name} className="mb-2">
                                            <FormInput
                                                label={field.label}
                                                name={field.name}
                                                type={field.type || "text"}
                                                required={field.required}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                            />
                                            {errors[field.name] && (
                                                <span className="text-xs text-red-600">{errors[field.name]}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}
