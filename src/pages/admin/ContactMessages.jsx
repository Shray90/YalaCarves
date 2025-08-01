// Admin contact messages management
import { useState, useEffect } from "react";
import { 
  Mail, Eye, Reply, Check, Clock, Search, Filter, 
  MoreHorizontal, ChevronLeft, ChevronRight 
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import apiService from "../../services/api";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [filters]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await apiService.request(`/contact/admin/messages?${params}`);
      setMessages(response.messages);
      setPagination(response.pagination);
    } catch (error) {
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.request('/contact/admin/stats');
      setStats(response.stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleViewMessage = async (messageId) => {
    try {
      const response = await apiService.request(`/contact/admin/messages/${messageId}`);
      setSelectedMessage(response.message);
      
      // Refresh message list to update read status
      loadMessages();
      loadStats();
    } catch (error) {
      setError("Failed to load message details");
    }
  };

  const handleReplyToMessage = async () => {
    if (!replyText.trim()) {
      setError("Please enter a reply message");
      return;
    }

    try {
      setIsReplying(true);
      await apiService.request(`/contact/admin/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply: replyText })
      });

      setSuccess("Reply sent successfully");
      setReplyText("");
      setSelectedMessage(null);
      loadMessages();
      loadStats();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (messageId, status) => {
    try {
      await apiService.request(`/contact/admin/messages/${messageId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      loadMessages();
      loadStats();
      setSuccess("Status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage customer inquiries and support requests</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold">{stats.totalMessages || 0}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unreadCount || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.readCount || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Replied</p>
                  <p className="text-2xl font-bold text-green-600">{stats.repliedCount || 0}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">{stats.thisWeek || 0}</p>
                </div>
                <Reply className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{message.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          {message.subject && (
                            <span className="text-sm text-gray-500">• {message.subject}</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{message.email}</p>
                        <p className="text-gray-700 line-clamp-2">{message.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </span>
                          {message.replied_at && (
                            <span className="text-xs text-green-600">
                              Replied by {message.replied_by_name} on {formatDate(message.replied_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleViewMessage(message.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Message Details</DialogTitle>
                            </DialogHeader>
                            
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">From</label>
                                    <p className="font-semibold">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p>{selectedMessage.email}</p>
                                  </div>
                                  {selectedMessage.phone && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Phone</label>
                                      <p>{selectedMessage.phone}</p>
                                    </div>
                                  )}
                                  {selectedMessage.subject && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Subject</label>
                                      <p>{selectedMessage.subject}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Message</label>
                                  <div className="p-3 bg-gray-50 rounded-lg mt-1">
                                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                                  </div>
                                </div>

                                {selectedMessage.admin_reply && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Your Reply</label>
                                    <div className="p-3 bg-green-50 rounded-lg mt-1">
                                      <p className="whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Replied by {selectedMessage.replied_by_name} on {formatDate(selectedMessage.replied_at)}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {selectedMessage.status !== 'replied' && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Reply to Customer</label>
                                    <Textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Type your reply here..."
                                      rows={4}
                                      className="mt-1"
                                    />
                                    <div className="flex justify-end mt-2">
                                      <Button
                                        onClick={handleReplyToMessage}
                                        disabled={isReplying || !replyText.trim()}
                                      >
                                        <Reply className="w-4 h-4 mr-2" />
                                        {isReplying ? "Sending..." : "Send Reply"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Select
                          value={message.status}
                          onValueChange={(value) => handleStatusChange(message.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalMessages)} of{' '}
                  {pagination.totalMessages} messages
                </p>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={!pagination.hasPrevPage}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="px-3 py-1 text-sm">
                    {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={!pagination.hasNextPage}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContactMessages;
