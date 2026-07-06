"use client";

import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export type ProfileField = {
  name: string;
  label: string;
  type: "text" | "number" | "date";
  required?: boolean;
  placeholder?: string;
  section?: string;
};

type ProfileFormProps = {
  title: string;
  subtitle?: string;
  fields: ProfileField[];
  values: Record<string, any>;
  loading?: boolean;
  message?: string;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
};

export default function ProfileForm({
  title,
  subtitle,
  fields,
  values,
  loading,
  message,
  onChange,
  onSubmit,
}: ProfileFormProps) {
  const groupedFields = fields.reduce<Record<string, ProfileField[]>>(
    (groups, field) => {
      const section = field.section || "Application Information";
      groups[section] = groups[section] || [];
      groups[section].push(field);
      return groups;
    },
    {}
  );

  return (
    <OnboardingLayout
      title={title}
      subtitle={
        subtitle ||
        "Complete the required information to continue your application."
      }
      badge="Profile information"
    >
      <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-4">
        <div className="grid grid-cols-1 gap-3 text-sm font-medium text-green-800 md:grid-cols-2">
          <div>✓ Mobile number verified</div>
          <div>✓ Identity verification completed</div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedFields).map(([section, sectionFields]) => (
          <section key={section}>
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {section}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Please provide accurate information for this section.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {sectionFields.map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  <input
                    type={field.type}
                    value={values[field.name] || ""}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder || field.label}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 text-sm font-bold text-white shadow-md transition hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : "Submit Application"}
        </button>

        {message && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {message}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}