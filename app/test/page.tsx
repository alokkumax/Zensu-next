import { client } from '@/sanity/lib/client';

export default async function TestPage() {
  try {
    const data = await client.fetch(`*[_type == "category"][0...2]`);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sanity Test Page</h1>
        <p className="mb-4">This page tests Sanity data fetching without any auth or redirects.</p>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Categories from Sanity:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>✅ If you can see this page and data above, Sanity is working correctly.</p>
          <p>✅ If this page loads without redirects, the issue is in specific pages, not Sanity.</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Sanity Test Page - Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold mb-2 text-red-800">Error fetching Sanity data:</h2>
          <pre className="text-sm text-red-700">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
