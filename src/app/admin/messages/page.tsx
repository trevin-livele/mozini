'use client';

import { useState, useEffect } from 'react';
import { getAdminMessages, markMessageRead, deleteMessage } from '@/lib/actions/admin';
import type { ContactMessage } from '@/lib/supabase/types';

const PAGE_SIZE = 10;

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const loadMessages = async (p = page) => {
    setLoading(true);
    try {
      const data = await getAdminMessages({ page: p, limit: PAGE_SIZE });
      setMessages(data.messages);
      setTotal(data.total);
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadMessages(page); }, [page]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const result = await markMessageRead(id, !currentRead);
    if (result.error) alert(result.error);
    else loadMessages(page);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const result = await deleteMessage(id);
    if (result.error) alert(result.error);
    else loadMessages(page);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total · {unreadCount} unread on this page</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4 opacity-50">📭</div>
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${msg.is_read ? 'border-gray-200' : 'border-[var(--copper)]'}`}
              >
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setExpanded(expanded === msg.id ? null : msg.id);
                    if (!msg.is_read) handleToggleRead(msg.id, false);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.is_read && <span className="w-2 h-2 bg-[var(--copper)] rounded-full flex-shrink-0"></span>}
                        <span className="font-medium text-sm text-[var(--dark)]">{msg.name}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{msg.email}</span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium truncate">{msg.subject || '(No subject)'}</p>
                      {expanded !== msg.id && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expanded === msg.id && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-2">
                      {msg.phone && <p className="text-sm text-gray-600">📞 {msg.phone}</p>}
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      <a
                        href={`https://wa.me/${msg.phone?.replace(/\D/g, '') || '254115757568'}?text=${encodeURIComponent(`Hi ${msg.name}, thanks for reaching out to Mozini! Regarding your message: "${msg.subject || msg.message.slice(0, 50)}..."`)}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-medium hover:bg-[#1da851] transition-colors"
                      >
                        💬 Reply on WhatsApp
                      </a>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message to Mozini'}`}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        ✉️ Reply by Email
                      </a>
                      <button
                        onClick={() => handleToggleRead(msg.id, msg.is_read)}
                        className="px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        {msg.is_read ? '📩 Mark Unread' : '✅ Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="px-3 py-1.5 text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-50 transition-colors ml-auto"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded text-sm font-medium ${p === page ? 'bg-[var(--copper)] text-white' : 'border hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
