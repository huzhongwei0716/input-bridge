export default function TemplatesPage() {
  // Mock data for MVP
  const templates = [
    { id: '1', name: 'Salesforce Lead Form', mappingCount: 5, lastUsed: '2 days ago' },
    { id: '2', name: 'HubSpot Contact', mappingCount: 3, lastUsed: '5 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Templates</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + New Template
          </button>
        </div>

        <div className="grid gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.mappingCount} mappings • Last used {template.lastUsed}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50">Edit</button>
                  <button className="px-3 py-1 text-sm text-red-600 border border-gray-200 rounded-md hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
