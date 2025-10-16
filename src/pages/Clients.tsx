import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCrm } from "@/contexts/CrmContext";
import { 
  Users, 
  Search, 
  Mail,
  Phone,
  DollarSign,
  Calendar,
  CreditCard,
  MapPin,
  Briefcase,
  TrendingUp,
  Eye
} from "lucide-react";

export default function Clients() {
  const { clients, invoices } = useCrm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientInvoices = (clientId: number) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted text-muted-foreground border-muted";
  };

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
              <p className="text-sm text-muted-foreground">Manage your active clients and their profiles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{clients.length}</p>
              <p className="text-xs text-muted-foreground">Total Clients</p>
            </div>
            <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
              <Users className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-primary text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Clients</p>
                  <p className="text-3xl font-bold">{clients.filter(c => c.status === 'Active').length}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-success text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${clients.reduce((sum, client) => sum + client.revenue, 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-invoice-orange text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold">${clients.reduce((sum, client) => sum + client.totalPaid, 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-client-purple text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Pending Payments</p>
                  <p className="text-3xl font-bold">${invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</p>
                </div>
                <CreditCard className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clients by name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const clientInvoices = getClientInvoices(client.id);
            const pendingAmount = clientInvoices
              .filter(inv => inv.status === 'Pending')
              .reduce((sum, inv) => sum + inv.amount, 0);

            return (
              <Card key={client.id} className="bg-white shadow-md hover:shadow-lg transition-smooth">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{client.service}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Since {client.joinDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="text-center">
                      <p className="text-lg font-bold text-revenue-green">${client.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">${client.totalPaid.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                    </div>
                  </div>

                  {pendingAmount > 0 && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-sm font-medium text-warning">
                        Pending Payment: ${pendingAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Next payment: {client.nextPaymentDate}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                          onClick={() => setSelectedClient(client)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {client.name} - Client Profile
                          </DialogTitle>
                        </DialogHeader>
                        {selectedClient && (
                          <div className="space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold mb-2">Contact Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-muted-foreground" />
                                      <span>{selectedClient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-muted-foreground" />
                                      <span>{selectedClient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                                      <span>{selectedClient.service}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold mb-2">Financial Overview</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Monthly Revenue:</span>
                                      <span className="font-medium text-revenue-green">${selectedClient.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Total Paid:</span>
                                      <span className="font-medium">${selectedClient.totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Next Payment:</span>
                                      <span className="font-medium">{selectedClient.nextPaymentDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Invoice History */}
                            <div>
                              <h4 className="font-semibold mb-3">Invoice History</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {getClientInvoices(selectedClient.id).map((invoice) => (
                                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50">
                                    <div>
                                      <p className="font-medium">Invoice #{invoice.id}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {invoice.issueDate} - Due: {invoice.dueDate}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">${invoice.amount.toLocaleString()}</p>
                                      <Badge className={
                                        invoice.status === 'Paid' ? 'bg-success/10 text-success border-success/20' :
                                        invoice.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                                        'bg-destructive/10 text-destructive border-destructive/20'
                                      }>
                                        {invoice.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                                {getClientInvoices(selectedClient.id).length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center py-4">No invoices found</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" className="hover:bg-primary/5">
                      Create Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <Card className="bg-white shadow-md">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No clients found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No clients available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}