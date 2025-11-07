"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User, Calendar, Trash2 } from "lucide-react";
import { useMessages } from "../../../../hooks/useMessages";

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { messages, updateMessage, deleteMessage, mutate } = useMessages();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMessage = async () => {
      if (messages && messages.length > 0) {
        // Find the message from the list
        const foundMessage = messages.find(msg => msg.id === params.id);
        if (foundMessage) {
          setMessage(foundMessage);
          
          // Automatically mark as read if not already read
          if (!foundMessage.is_read) {
            try {
              await updateMessage(params.id, { is_read: true });
              // Update local state
              setMessage(prev => prev ? { ...prev, is_read: true } : null);
            } catch (error) {
              console.error("Failed to mark message as read:", error);
            }
          }
        }
        setLoading(false);
      } else if (messages) {
        // Messages loaded but not found
        setMessage(null);
        setLoading(false);
      }
    };

    fetchMessage();
  }, [params.id, messages, updateMessage]);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this message? This action cannot be undone.",
      )
    ) {
      try {
        // Use the hook to delete the message
        await deleteMessage(params.id);
        
        // Refresh the messages list
        mutate();
        
        // Success - redirect to messages list
        router.push("/admin/messages");
      } catch (error) {
        console.error("Error deleting message:", error.message);
        setErrors({ submit: error.message });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Message not found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The message you're looking for doesn't exist.
        </p>
        <Link
          href="/admin/messages"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Messages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Details</h1>
          <p className="text-gray-600">
            View and manage contact form submission
          </p>
        </div>
        <Link
          href="/admin/messages"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Messages
        </Link>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Message Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Message Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {message.subject}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">From:</span>
              <span className="ml-2 font-medium">{message.name}</span>
            </div>

            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Email:</span>
              <a
                href={`mailto:${message.email}`}
                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline"
              >
                {message.email}
              </a>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Date:</span>
              <span className="ml-2">{formatDate(message.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="px-6 py-6">
          <div className="prose prose-gray max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {message.message}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Message ID: {message.id}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() =>
                  window.open(
                    `mailto:${message.email}?subject=Re: ${message.subject}`,
                    "_blank",
                  )
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply
              </button>

              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              window.open(
                `mailto:${message.email}?subject=Re: ${message.subject}`,
                "_blank",
              )
            }
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email Reply
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(message.email)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Copy Email Address
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(message.message)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Copy Message Content
          </button>
        </div>
      </div>
    </div>
  );
}
