import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCrm } from "@/contexts/CrmContext";
import { 
  TrendingUp, 
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download
} from "lucide-react";

const services = [
  { id: "all", name: "All Services" },
  { id: "digital", name: "Digital Marketing" },
  { id: "technical", name: "Technical Support" },
  { id: "bakery", name: "Bakery Services" },
  { id: "hr", name: "HR Services" },
  { id: "courses", name: "Courses & Training" }
];

export default function Analytics() {
  const { clients, invoices, leads } = useCrm();
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [serviceFilter, setServiceFilter] = useState("all");

  // Calculate metrics
  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const monthlyRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const totalClients = clients.length;
  const totalLeads = leads.length;
  const conversionRate = totalClients > 0 ? ((totalClients / (totalClients + totalLeads)) * 100).toFixed(1) : 0;

  // Service-wise revenue
  const serviceRevenue = services.slice(1).map(service => {
    const serviceClients = clients.filter(c => c.service === service.name);
    const revenue = serviceClients.reduce((sum, c) => sum + c.totalPaid, 0);
    const activeClients = serviceClients.length;
    return {
      service: service.name,
      revenue,
      activeClients,
      monthlyRevenue: serviceClients.reduce((sum, c) => sum + c.revenue, 0)
    };
  });

  // Monthly data simulation
  const monthlyData = [
    { month: "Jan", revenue: 45000, clients: 25, expenses: 12000 },
    { month: "Feb", revenue: 52000, clients: 28, expenses: 13500 },
    { month: "Mar", revenue: 48000, clients: 27, expenses: 14000 },
    { month: "Apr", revenue: 58000, clients: 32, expenses: 15200 },
    { month: "May", revenue: 62000, clients: 35, expenses: 16800 },
    { month: "Jun", revenue: 68000, clients: 38, expenses: 18000 }
  ];

  const totalExpenses = monthlyData.reduce((sum, data) => sum + data.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-sm text-muted-foreground">Comprehensive business insights and performance metrics.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <Card className="bg-gradient-success text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm opacity-75">+12.5% from last month</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-primary text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm opacity-75">+8.2% from last month</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-invoice-orange text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Net Profit</p>
                  <p className="text-3xl font-bold">${netProfit.toLocaleString()}</p>
                  <p className="text-sm opacity-75">Profit margin: 68%</p>
                </div>
                <BarChart3 className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-client-purple text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Clients</p>
                  <p className="text-3xl font-bold">{totalClients}</p>
                  <p className="text-sm opacity-75">+15 new this month</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-lead-blue text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold">{conversionRate}%</p>
                  <p className="text-sm opacity-75">Leads to clients</p>
                </div>
                <PieChart className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Filters */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Service Performance Analysis</h3>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Service-wise Revenue */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceRevenue
                .filter(service => serviceFilter === 'all' || service.service === services.find(s => s.id === serviceFilter)?.name)
                .sort((a, b) => b.revenue - a.revenue)
                .map((service, index) => {
                  const percentage = totalRevenue > 0 ? ((service.revenue / totalRevenue) * 100).toFixed(1) : 0;
                  return (
                    <div key={service.service} className="p-4 bg-gradient-card rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{service.service}</h4>
                          <p className="text-sm text-muted-foreground">{service.activeClients} active clients</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-revenue-green">${service.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{percentage}% of total</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-primary">${service.monthlyRevenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-invoice-orange">{service.activeClients}</p>
                          <p className="text-xs text-muted-foreground">Active Clients</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-client-purple">${(service.revenue / service.activeClients || 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Avg per Client</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="space-y-4">
                <h4 className="font-semibold">Revenue & Expenses</h4>
                <div className="space-y-3">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-revenue-green">${data.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-destructive">${data.expenses.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Expenses</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Growth */}
              <div className="space-y-4">
                <h4 className="font-semibold">Client Growth</h4>
                <div className="space-y-3">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border border-border/50">
                      <span className="font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">{data.clients}</p>
                          <p className="text-xs text-muted-foreground">Total Clients</p>
                        </div>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all"
                            style={{ width: `${(data.clients / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-revenue-green mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Top Performing Service</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {serviceRevenue.sort((a, b) => b.revenue - a.revenue)[0]?.service}
              </p>
              <p className="text-2xl font-bold text-revenue-green">
                ${serviceRevenue.sort((a, b) => b.revenue - a.revenue)[0]?.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Average Client Value</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Total revenue per client
              </p>
              <p className="text-2xl font-bold text-primary">
                ${totalClients > 0 ? Math.round(totalRevenue / totalClients).toLocaleString() : 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-invoice-orange mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Growth Rate</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Month-over-month growth
              </p>
              <p className="text-2xl font-bold text-invoice-orange">+12.5%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}