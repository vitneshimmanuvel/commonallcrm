import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCrm } from "@/contexts/CrmContext";
import { 
  FileText, 
  Search, 
  Filter,
  DollarSign,
  Calendar,
  Send,
  Download,
  Eye,
  Plus
} from "lucide-react";

export default function Invoices() {
  const { invoices, clients } = useCrm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-success/10 text-success border-success/20";
      case "Pending": return "bg-warning/10 text-warning border-warning/20";
      case "Overdue": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const totalPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Invoice Management</h1>
              <p className="text-sm text-muted-foreground">Track and manage all client invoices.</p>
            </div>
          </div>
          <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-success text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Paid Invoices</p>
                  <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-primary text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Pending Payment</p>
                  <p className="text-3xl font-bold">${totalPending.toLocaleString()}</p>
                </div>
                <Calendar className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-invoice-orange text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Overdue</p>
                  <p className="text-3xl font-bold">${totalOverdue.toLocaleString()}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-client-purple text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold">{invoices.length}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search invoices by client, service, or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50 hover:shadow-md transition-smooth">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">Invoice #{invoice.id}</h4>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-revenue-green">${invoice.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {invoice.dueDate}
                      </p>
                      {invoice.paidDate && (
                        <p className="text-xs text-success">
                          Paid: {invoice.paidDate}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="hover:bg-primary/5">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-success/5">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {invoice.status === 'Pending' && (
                        <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No invoices found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter ? "Try adjusting your search criteria" : "No invoices available"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-md hover:shadow-lg transition-smooth cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Create New Invoice</h3>
              <p className="text-sm text-muted-foreground">Generate invoice for existing clients</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-smooth cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Send Reminders</h3>
              <p className="text-sm text-muted-foreground">Send payment reminders to clients</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-smooth cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-invoice-orange rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Schedule Auto-Invoice</h3>
              <p className="text-sm text-muted-foreground">Set up recurring invoices</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}