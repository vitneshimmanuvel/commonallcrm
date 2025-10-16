import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  Plus,
  Edit,
  DollarSign,
  Users,
  Clock,
  Monitor,
  Wrench,
  ChefHat,
  UserCheck,
  GraduationCap,
  Star
} from "lucide-react";

const serviceIcons = {
  digital: Monitor,
  technical: Wrench,
  bakery: ChefHat,
  hr: UserCheck,
  courses: GraduationCap
};

const initialServices = [
  {
    id: "digital",
    name: "Digital Marketing",
    description: "Comprehensive digital marketing solutions including SEO, social media management, content marketing, and online advertising campaigns.",
    basePrice: 2500,
    duration: "3-6 months",
    activeClients: 23,
    totalEarnings: 57500,
    features: ["SEO Optimization", "Social Media Management", "Content Creation", "PPC Campaigns", "Analytics & Reporting"],
    status: "Active"
  },
  {
    id: "technical",
    name: "Technical Support",
    description: "24/7 technical support services for businesses including IT infrastructure management, software support, and system maintenance.",
    basePrice: 1800,
    duration: "Ongoing",
    activeClients: 18,
    totalEarnings: 32400,
    features: ["24/7 Support", "System Monitoring", "Software Updates", "Security Management", "Backup Solutions"],
    status: "Active"
  },
  {
    id: "bakery",
    name: "Bakery Services",
    description: "Professional bakery and catering services for events, corporate meetings, and special occasions with custom menu options.",
    basePrice: 1500,
    duration: "Per Event",
    activeClients: 12,
    totalEarnings: 18000,
    features: ["Custom Cakes", "Event Catering", "Corporate Orders", "Specialty Items", "Delivery Service"],
    status: "Active"
  },
  {
    id: "hr",
    name: "HR Services",
    description: "Complete human resources solutions including recruitment, employee training, performance management, and HR compliance.",
    basePrice: 3200,
    duration: "6-12 months",
    activeClients: 15,
    totalEarnings: 48000,
    features: ["Recruitment", "Training Programs", "Performance Reviews", "Compliance Management", "Employee Relations"],
    status: "Active"
  },
  {
    id: "courses",
    name: "Courses & Training",
    description: "Professional development courses and training programs for individuals and corporate teams in various business and technical skills.",
    basePrice: 950,
    duration: "1-3 months",
    activeClients: 31,
    totalEarnings: 29450,
    features: ["Online Courses", "Live Training", "Certification", "Corporate Workshops", "Learning Materials"],
    status: "Active"
  }
];

export default function Services() {
  const [services, setServices] = useState(initialServices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const { toast } = useToast();

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    basePrice: "",
    duration: "",
    features: [""],
    status: "Active"
  });

  const handleAddFeature = () => {
    setNewService({
      ...newService,
      features: [...newService.features, ""]
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newService.features];
    updatedFeatures[index] = value;
    setNewService({
      ...newService,
      features: updatedFeatures
    });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = newService.features.filter((_, i) => i !== index);
    setNewService({
      ...newService,
      features: updatedFeatures
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = {
      id: `service-${Date.now()}`,
      ...newService,
      basePrice: parseInt(newService.basePrice),
      activeClients: 0,
      totalEarnings: 0,
      features: newService.features.filter(f => f.trim() !== "")
    };

    setServices([service, ...services]);
    setNewService({
      name: "",
      description: "",
      basePrice: "",
      duration: "",
      features: [""],
      status: "Active"
    });
    setShowAddForm(false);
    
    toast({
      title: "Service Added Successfully",
      description: `${service.name} has been added to your service offerings.`,
    });
  };

  const totalRevenue = services.reduce((sum, service) => sum + service.totalEarnings, 0);
  const totalClients = services.reduce((sum, service) => sum + service.activeClients, 0);

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Services Management</h1>
              <p className="text-sm text-muted-foreground">Manage your service offerings and track performance.</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-success text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-primary text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Clients</p>
                  <p className="text-3xl font-bold">{totalClients}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-client-purple text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Services</p>
                  <p className="text-3xl font-bold">{services.length}</p>
                </div>
                <Briefcase className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Service Form */}
        {showAddForm && (
          <Card className="bg-white shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceName">Service Name *</Label>
                    <Input
                      id="serviceName"
                      value={newService.name}
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                      required
                      placeholder="e.g., Web Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price ($) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      value={newService.basePrice}
                      onChange={(e) => setNewService({...newService, basePrice: e.target.value})}
                      required
                      placeholder="2500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: e.target.value})}
                    placeholder="e.g., 3-6 months, Per Project, Ongoing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    required
                    placeholder="Detailed description of your service..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Service Features</Label>
                  {newService.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1"
                      />
                      {newService.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddFeature}
                    className="w-full"
                  >
                    Add Feature
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
                    Add Service
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComponent = serviceIcons[service.id as keyof typeof serviceIcons] || Briefcase;
            
            return (
              <Card key={service.id} className="bg-white shadow-md hover:shadow-lg transition-smooth">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                    </div>
                    <Badge className={service.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}>
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-card rounded-lg border border-border/50">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-revenue-green">${service.basePrice.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Base Price</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{service.activeClients}</p>
                      <p className="text-xs text-muted-foreground">Active Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-invoice-orange">${service.totalEarnings.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Earned</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Key Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 3 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{service.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-primary/5">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Service
                    </Button>
                    <Button size="sm" className="bg-gradient-primary hover:bg-primary-hover">
                      View Clients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}