import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCrm } from "@/contexts/CrmContext";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Calendar,
  FileText,
  ArrowRight,
  Activity,
  Eye,
  Mail,
  Phone
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { clients, leads, invoices } = useCrm();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);

  // Calculate dashboard metrics
  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const newLeads = leads.length;
  const weeklyRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);

  const recentActivity = [
    { type: "invoice", message: `Invoice sent to ${clients[0]?.name || 'Client'}`, time: "2 hours ago" },
    { type: "lead", message: `New lead added: ${leads[0]?.name || 'Lead'}`, time: "3 hours ago" },
    { type: "payment", message: `Payment received from ${clients[1]?.name || 'Client'}`, time: "5 hours ago" },
    { type: "meeting", message: `Meeting scheduled with ${clients[2]?.name || 'Client'}`, time: "1 day ago" }
  ];
  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back! Here's your business overview.</p>
            </div>
          </div>
          <Button 
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
            onClick={() => navigate('/leads')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5% from last month"
            changeType="positive"
            icon={DollarSign}
            gradient="bg-gradient-success"
            description="Overall business revenue"
          />
          <MetricCard
            title="Active Clients"
            value={activeClients}
            change="+8 new this month"
            changeType="positive"
            icon={Users}
            gradient="bg-gradient-primary"
            description="Currently active clients"
          />
          <MetricCard
            title="New Leads"
            value={newLeads}
            change="+15% from last week"
            changeType="positive"
            icon={UserPlus}
            gradient="bg-lead-blue"
            description="Leads this month"
          />
          <MetricCard
            title="Weekly Revenue"
            value={`$${weeklyRevenue.toLocaleString()}`}
            change="+23% from last week"
            changeType="positive"
            icon={TrendingUp}
            gradient="bg-invoice-orange"
            description="This week's earnings"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Active Clients */}
          <Card className="xl:col-span-2 bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Active Clients</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-revenue-green">${client.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success/10 text-success border-success/20">
                          {client.status}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="hover:bg-primary/5"
                              onClick={() => setSelectedClient(client)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                {client.name}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedClient && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span>{selectedClient.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{selectedClient.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span>{selectedClient.service}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-card rounded-lg">
                                  <div className="text-center">
                                    <p className="text-lg font-bold text-revenue-green">${selectedClient.revenue.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-bold text-primary">${selectedClient.totalPaid.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total Paid</p>
                                  </div>
                                </div>
                                <Button 
                                  className="w-full bg-gradient-primary hover:bg-primary-hover"
                                  onClick={() => navigate('/clients')}
                                >
                                  View Full Profile
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'invoice' ? 'bg-invoice-orange' :
                      activity.type === 'lead' ? 'bg-lead-blue' :
                      activity.type === 'payment' ? 'bg-revenue-green' :
                      'bg-client-purple'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary transition-smooth"
                onClick={() => navigate('/leads')}
              >
                <UserPlus className="w-6 h-6 text-primary" />
                <span className="font-medium">Add Lead</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-success/5 hover:border-success transition-smooth"
                onClick={() => navigate('/invoices')}
              >
                <FileText className="w-6 h-6 text-success" />
                <span className="font-medium">Create Invoice</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-client-purple/5 hover:border-client-purple transition-smooth"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="w-6 h-6 text-client-purple" />
                <span className="font-medium">Schedule Meeting</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-invoice-orange/5 hover:border-invoice-orange transition-smooth"
                onClick={() => navigate('/analytics')}
              >
                <TrendingUp className="w-6 h-6 text-invoice-orange" />
                <span className="font-medium">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}