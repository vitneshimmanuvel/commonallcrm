import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCrm } from "@/contexts/CrmContext";
import { 
  UserPlus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

const services = [
  { id: "digital", name: "Digital Marketing", basePrice: 2500 },
  { id: "technical", name: "Technical Support", basePrice: 1800 },
  { id: "bakery", name: "Bakery Services", basePrice: 1500 },
  { id: "hr", name: "HR Services", basePrice: 3200 },
  { id: "courses", name: "Courses & Training", basePrice: 950 }
];

export default function Leads() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const { leads, addLead, convertLeadToClient } = useCrm();
  const { toast } = useToast();

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    startDate: "",
    endDate: "",
    notes: "",
    priority: "Medium"
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lead = {
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      service: newLead.service,
      budget: parseInt(newLead.budget) || 0,
      status: "New" as const,
      priority: newLead.priority as "High" | "Medium" | "Low",
      createdAt: new Date().toISOString().split('T')[0],
      notes: newLead.notes,
      startDate: newLead.startDate,
      endDate: newLead.endDate
    };

    addLead(lead);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      service: "",
      budget: "",
      startDate: "",
      endDate: "",
      notes: "",
      priority: "Medium"
    });
    setShowAddForm(false);
    
    toast({
      title: "Lead Added Successfully",
      description: `${lead.name} has been added to your leads pipeline.`,
    });
  };

  const handleConvertToClient = (leadId: number) => {
    convertLeadToClient(leadId);
    toast({
      title: "Lead Converted",
      description: "Lead has been successfully converted to a client.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-lead-blue/10 text-lead-blue border-lead-blue/20";
      case "Contacted": return "bg-warning/10 text-warning border-warning/20";
      case "Qualified": return "bg-success/10 text-success border-success/20";
      case "Converted": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Low": return "bg-muted text-muted-foreground border-muted";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !selectedService || selectedService === "all-services" || lead.service === selectedService;
    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
              <p className="text-sm text-muted-foreground">Manage your sales pipeline and convert leads to clients.</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Add Lead Form */}
        {showAddForm && (
          <Card className="bg-white shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Lead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLead} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newLead.name}
                      onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                      required
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Required *</Label>
                    <Select value={newLead.service} onValueChange={(value) => setNewLead({...newLead, service: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} - ${service.basePrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newLead.budget}
                      onChange={(e) => setNewLead({...newLead, budget: e.target.value})}
                      placeholder="Enter budget amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={newLead.priority} onValueChange={(value) => setNewLead({...newLead, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="Low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Preferred Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newLead.startDate}
                      onChange={(e) => setNewLead({...newLead, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Expected End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newLead.endDate}
                      onChange={(e) => setNewLead({...newLead, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes & Requirements</Label>
                  <Textarea
                    id="notes"
                    value={newLead.notes}
                    onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                    placeholder="Additional notes about the lead..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
                    Add Lead
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search leads by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-services">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="bg-white shadow-md hover:shadow-lg transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{lead.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <Badge className={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-revenue-green">${lead.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Added {lead.createdAt}</span>
                  </div>
                </div>

                <div className="bg-gradient-card p-3 rounded-lg border border-border/50">
                  <p className="text-sm font-medium text-primary mb-1">Service: {lead.service}</p>
                  {lead.notes && (
                    <p className="text-xs text-muted-foreground">{lead.notes}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                    onClick={() => handleConvertToClient(lead.id)}
                  >
                    Convert to Client
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-primary/5">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <Card className="bg-white shadow-md">
            <CardContent className="p-12 text-center">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No leads found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedService 
                  ? "Try adjusting your search criteria" 
                  : "Start by adding your first lead to build your sales pipeline"}
              </p>
              {!searchTerm && !selectedService && (
                <Button onClick={() => setShowAddForm(true)} className="bg-gradient-primary hover:bg-primary-hover">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First Lead
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}