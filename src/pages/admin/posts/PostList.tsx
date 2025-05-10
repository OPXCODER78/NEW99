import React from 'react';

function PostList() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <p className="text-gray-600">Manage your blog posts</p>
      </div>

      {/* Placeholder for post list table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    </div>
  );
}

export default PostList;