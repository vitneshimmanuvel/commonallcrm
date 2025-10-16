import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCrm } from "@/contexts/CrmContext";
import { 
  Calendar as CalendarIcon, 
  Plus,
  Clock,
  Users,
  Video,
  MapPin,
  Phone
} from "lucide-react";

export default function Calendar() {
  const { meetings, clients, addMeeting } = useCrm();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    clientId: "",
    title: "",
    date: "",
    time: "",
    duration: "60",
    type: "Initial Consultation" as const
  });

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client = clients.find(c => c.id === parseInt(newMeeting.clientId));
    if (!client) return;

    const meeting = {
      clientId: parseInt(newMeeting.clientId),
      clientName: client.name,
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: parseInt(newMeeting.duration),
      type: newMeeting.type,
      status: "Scheduled" as const
    };

    addMeeting(meeting);
    setNewMeeting({
      clientId: "",
      title: "",
      date: "",
      time: "",
      duration: "60",
      type: "Initial Consultation"
    });
    setShowAddForm(false);
    
    toast({
      title: "Meeting Scheduled",
      description: `Meeting with ${client.name} has been scheduled for ${newMeeting.date} at ${newMeeting.time}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-primary/10 text-primary border-primary/20";
      case "Completed": return "bg-success/10 text-success border-success/20";
      case "Cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Initial Consultation": return <Users className="w-4 h-4" />;
      case "Follow-up": return <Phone className="w-4 h-4" />;
      case "Project Review": return <CalendarIcon className="w-4 h-4" />;
      case "Support": return <Video className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled').slice(0, 5);
  const todayMeetings = meetings.filter(m => m.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-dashboard">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendar & Meetings</h1>
              <p className="text-sm text-muted-foreground">Schedule and manage client meetings.</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-primary text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Today's Meetings</p>
                  <p className="text-3xl font-bold">{todayMeetings.length}</p>
                </div>
                <CalendarIcon className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-success text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">This Week</p>
                  <p className="text-3xl font-bold">{meetings.filter(m => m.status === 'Scheduled').length}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-invoice-orange text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{meetings.filter(m => m.status === 'Completed').length}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-client-purple text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Hours</p>
                  <p className="text-3xl font-bold">{Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / 60)}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Meeting Form */}
        {showAddForm && (
          <Card className="bg-white shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Schedule New Meeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMeeting} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Select Client *</Label>
                    <Select value={newMeeting.clientId} onValueChange={(value) => setNewMeeting({...newMeeting, clientId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name} - {client.service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title *</Label>
                    <Input
                      id="title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      required
                      placeholder="e.g., Project Kickoff Meeting"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select value={newMeeting.duration} onValueChange={(value) => setNewMeeting({...newMeeting, duration: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Meeting Type</Label>
                    <Select value={newMeeting.type} onValueChange={(value: any) => setNewMeeting({...newMeeting, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Project Review">Project Review</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
                    Schedule Meeting
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="xl:col-span-2 bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayMeetings.length > 0 ? (
                  todayMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          {getTypeIcon(meeting.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{meeting.title}</h4>
                          <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{meeting.time} • {meeting.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No meetings today</h3>
                    <p className="text-muted-foreground">Your schedule is clear for today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-gradient-card rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{meeting.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {meeting.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{meeting.date} at {meeting.time}</span>
                    </div>
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming meetings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Meetings */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              All Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50 hover:shadow-md transition-smooth">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      {getTypeIcon(meeting.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{meeting.title}</h4>
                      <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{meeting.time} • {meeting.duration} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="hover:bg-primary/5">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}