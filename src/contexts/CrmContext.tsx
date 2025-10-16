import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  notes: string;
  startDate?: string;
  endDate?: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: 'Active' | 'Inactive';
  revenue: number;
  joinDate: string;
  department?: string;
  location?: string;
  role?: string;
  totalPaid: number;
  nextPaymentDate?: string;
}

export interface Invoice {
  id: number;
  clientId: number;
  clientName: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface Meeting {
  id: number;
  clientId: number;
  clientName: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'Initial Consultation' | 'Follow-up' | 'Project Review' | 'Support';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface CrmContextType {
  leads: Lead[];
  clients: Client[];
  invoices: Invoice[];
  meetings: Meeting[];
  addLead: (lead: Omit<Lead, 'id'>) => void;
  convertLeadToClient: (leadId: number) => void;
  updateLeadStatus: (leadId: number, status: Lead['status']) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeetingStatus: (meetingId: number, status: Meeting['status']) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

// Mock data
const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 0123",
    service: "Digital Marketing",
    budget: 2800,
    status: "New",
    priority: "High",
    createdAt: "2024-01-15",
    notes: "Interested in comprehensive digital marketing package"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 0124",
    service: "HR Services",
    budget: 3500,
    status: "Contacted",
    priority: "Medium",
    createdAt: "2024-01-14",
    notes: "Looking for employee training programs"
  }
];

const initialClients: Client[] = [
  { id: 1, name: "John Smith", service: "Digital Marketing", status: "Active", revenue: 2500, email: "john.smith@email.com", phone: "+1 (555) 0100", joinDate: "2024-01-01", totalPaid: 7500, nextPaymentDate: "2024-02-15" },
  { id: 2, name: "Sarah Johnson", service: "Technical Support", status: "Active", revenue: 1800, email: "sarah.j@email.com", phone: "+1 (555) 0101", joinDate: "2024-01-05", totalPaid: 5400, nextPaymentDate: "2024-02-10" },
  { id: 3, name: "Mike Wilson", service: "HR Services", status: "Active", revenue: 3200, email: "mike.wilson@email.com", phone: "+1 (555) 0102", joinDate: "2024-01-10", totalPaid: 9600, nextPaymentDate: "2024-02-20" },
  { id: 4, name: "Emily Davis", service: "Bakery Services", status: "Active", revenue: 1500, email: "emily.davis@email.com", phone: "+1 (555) 0103", joinDate: "2024-01-12", totalPaid: 4500, nextPaymentDate: "2024-02-18" },
  { id: 5, name: "Chris Brown", service: "Courses", status: "Active", revenue: 950, email: "chris.brown@email.com", phone: "+1 (555) 0104", joinDate: "2024-01-18", totalPaid: 2850, nextPaymentDate: "2024-02-25" }
];

const initialInvoices: Invoice[] = [
  { id: 1001, clientId: 1, clientName: "John Smith", service: "Digital Marketing", amount: 2500, status: "Paid", issueDate: "2024-01-01", dueDate: "2024-01-31", paidDate: "2024-01-28" },
  { id: 1002, clientId: 2, clientName: "Sarah Johnson", service: "Technical Support", amount: 1800, status: "Pending", issueDate: "2024-01-15", dueDate: "2024-02-15" },
  { id: 1003, clientId: 3, clientName: "Mike Wilson", service: "HR Services", amount: 3200, status: "Paid", issueDate: "2024-01-10", dueDate: "2024-02-10", paidDate: "2024-02-08" },
  { id: 1004, clientId: 4, clientName: "Emily Davis", service: "Bakery Services", amount: 1500, status: "Overdue", issueDate: "2024-01-05", dueDate: "2024-01-20" }
];

const initialMeetings: Meeting[] = [
  { id: 1, clientId: 1, clientName: "John Smith", title: "Project Kickoff", date: "2024-02-15", time: "10:00", duration: 60, type: "Initial Consultation", status: "Scheduled" },
  { id: 2, clientId: 2, clientName: "Sarah Johnson", title: "Monthly Review", date: "2024-02-16", time: "14:00", duration: 30, type: "Follow-up", status: "Scheduled" },
  { id: 3, clientId: 3, clientName: "Mike Wilson", title: "Training Session", date: "2024-02-18", time: "11:00", duration: 90, type: "Project Review", status: "Scheduled" }
];

export function CrmProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead = { ...lead, id: Math.max(...leads.map(l => l.id), 0) + 1 };
    setLeads([newLead, ...leads]);
  };

  const convertLeadToClient = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const newClient: Client = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        status: 'Active',
        revenue: lead.budget,
        joinDate: new Date().toISOString().split('T')[0],
        totalPaid: 0,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setClients([newClient, ...clients]);
      setLeads(leads.filter(l => l.id !== leadId));
    }
  };

  const updateLeadStatus = (leadId: number, status: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Math.max(...clients.map(c => c.id), 0) + 1 };
    setClients([newClient, ...clients]);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...invoice, id: Math.max(...invoices.map(i => i.id), 1000) + 1 };
    setInvoices([newInvoice, ...invoices]);
  };

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting = { ...meeting, id: Math.max(...meetings.map(m => m.id), 0) + 1 };
    setMeetings([newMeeting, ...meetings]);
  };

  const updateMeetingStatus = (meetingId: number, status: Meeting['status']) => {
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId ? { ...meeting, status } : meeting
    ));
  };

  return (
    <CrmContext.Provider value={{
      leads,
      clients,
      invoices,
      meetings,
      addLead,
      convertLeadToClient,
      updateLeadStatus,
      addClient,
      addInvoice,
      addMeeting,
      updateMeetingStatus
    }}>
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}