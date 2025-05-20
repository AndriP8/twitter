export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Tweet Composer */}
      <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
        <textarea
          className="w-full border-none focus:ring-0"
          rows={3}
          placeholder="What's happening?"
        ></textarea>
        <button className="bg-blue-500 text-white rounded-full px-4 py-2 mt-2">
          Tweet
        </button>
      </div>

      {/* List of Tweets */}
      <div className="space-y-4">
        {[1, 2, 3].map((tweet) => (
          <div
            key={tweet}
            className="border border-gray-300 p-4 rounded-lg shadow-sm"
          >
            <div className="font-bold">User {tweet}</div>
            <div className="text-gray-700">
              This is a tweet example content from user {tweet}.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
