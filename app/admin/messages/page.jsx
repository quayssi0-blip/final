"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Search, Mail } from "lucide-react";
import { useMessages } from "../../../hooks/useMessages";

export default function MessagesPage() {
  const { messages, isLoading, isError, deleteMessage } = useMessages();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages?.filter(
    (message) => {
      const fullName = `${message.first_name || ''} ${message.last_name || ''}`.trim();
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  ) || [];

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(id);
    }
  };

  const markAsRead = async (id) => {
    // Mark as read functionality would be handled by updateMessage if needed
    // For now, keeping the UI functionality
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading messages. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Manage contact form submissions and inquiries
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-6 hover:bg-gray-50 ${message.status === "unread" ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <Mail
                      className={`h-5 w-5 ${message.status === "unread" ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${message.status === "unread" ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {message.message?.substring(0, 100)}{message.message?.length > 100 ? '...' : ''}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        From: {`${message.first_name || ''} ${message.last_name || ''}`.trim()} ({message.email})
                      </p>
                      <p className="text-xs text-gray-500">
                        Type: {message.type} | Status: {message.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {message.status === "unread" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                  <Link
                    href={`/admin/messages/${message.id}`}
                    onClick={() => markAsRead(message.id)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No messages
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by receiving your first message.
            </p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            1
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
